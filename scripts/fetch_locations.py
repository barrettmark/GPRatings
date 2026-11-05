"""Fetch address, phone and coordinates for every practice in the GPPS file.

Sources (both public, no key needed):
  - NHS ODS ORD API: address + phone per practice code
  - postcodes.io: postcode -> latitude/longitude (bulk, 100 per request)

Usage: python3 -I scripts/fetch_locations.py <gpps.csv> <out.json>
Re-runnable: already-fetched practices in <out.json> are skipped.
"""
import csv
import json
import os
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ODS_URL = "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/{}"
POSTCODES_URL = "https://api.postcodes.io/postcodes"
UA = "gpratings-data-build/1.0"


def get_json(url, data=None, tries=4):
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers={"User-Agent": UA, "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:  # retry on network errors / 429s
            if attempt == tries - 1:
                print(f"FAILED {url}: {e}", file=sys.stderr)
                return None
            time.sleep(2 ** attempt)


def fetch_practice(code):
    d = get_json(ODS_URL.format(code))
    if not d:
        return code, None
    org = d["Organisation"]
    loc = org.get("GeoLoc", {}).get("Location", {})
    phones = [c["value"] for c in org.get("Contacts", {}).get("Contact", []) if c.get("type") == "tel"]
    return code, {
        "odsName": org.get("Name"),
        "status": org.get("Status"),
        "address": [loc.get(k) for k in ("AddrLn1", "AddrLn2", "AddrLn3", "Town", "County") if loc.get(k)],
        "postcode": loc.get("PostCode"),
        "phone": phones[0] if phones else None,
    }


def main(csv_path, out_path):
    with open(csv_path, encoding="utf-8-sig", errors="replace") as f:
        codes = [row["ad_practicecode"] for row in csv.DictReader(f)]

    out = json.load(open(out_path)) if os.path.exists(out_path) else {}
    todo = [c for c in codes if not out.get(c)]
    print(f"{len(codes)} practices, {len(todo)} to fetch")

    with ThreadPoolExecutor(max_workers=4) as pool:
        for i, (code, info) in enumerate(pool.map(fetch_practice, todo), 1):
            if info:
                out[code] = info
            if i % 250 == 0:
                print(f"  {i}/{len(todo)}")
                json.dump(out, open(out_path, "w"))
    json.dump(out, open(out_path, "w"))

    # Geocode postcodes in bulk
    need = sorted({v["postcode"] for v in out.values() if v.get("postcode") and "lat" not in v})
    print(f"geocoding {len(need)} postcodes")
    coords = {}
    for i in range(0, len(need), 100):
        body = json.dumps({"postcodes": need[i:i + 100]}).encode()
        res = get_json(POSTCODES_URL, data=body)
        for item in (res or {}).get("result", []):
            r = item.get("result")
            if r:
                coords[item["query"]] = (r["latitude"], r["longitude"])
    for v in out.values():
        c = coords.get(v.get("postcode"))
        if c:
            v["lat"], v["lng"] = c
    json.dump(out, open(out_path, "w"))

    missing = [c for c in codes if not out.get(c, {}).get("lat")]
    print(f"done. {len(codes) - len(missing)} located, {len(missing)} missing: {missing[:20]}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
