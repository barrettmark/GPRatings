"""Turn the GP Patient Survey CSV + practice locations into the app's data files.

Usage: python3 -I scripts/build_data.py <gpps.csv> data/raw/locations.json [gp-reg-pat-prac-all.csv]

The optional third file is NHS England's "Patients Registered at a GP Practice"
practice totals (digital.nhs.uk). It gives the official registered list size,
used for the practice size label.

The optional fourth file is OHID Fingertips indicator 94240, "Deprivation score
(IMD 2025)" for GP practices: deprivation of each practice's registered
population. Used to rank practices against others serving similar areas.

Writes:
  data/practices.json   full detail per practice (read by server pages)
  public/data/index.json compact list for client-side search (nearest/name)
  data/meta.json         question definitions + national medians

Method (same idea as the 2013 app, improved):
  - Each question has a survey-published "% positive" (pcteval) with a 95%
    confidence interval (lowileval/hiwileval). -97/-98 = suppressed.
  - Shrinkage: before ranking, each result is pulled towards the national
    average in proportion to its uncertainty (empirical Bayes, beta-binomial,
    effective sample size taken from the published 95% interval so survey
    weighting is respected). Results from few people need stronger evidence
    to reach the top or bottom. Displayed percentages stay as published.
  - Stars: national percentile rank of the shrunk value -> deciles -> 0.5 to 5.0.
  - Similar areas: practices split into fifths by IMD 2025 deprivation score;
    each is also ranked within its fifth.
  - Comparison: "better"/"worse" only when the whole confidence interval sits
    above/below the national median; otherwise "similar".
  - Low confidence: fewer than 30 people answered.
"""
import csv
import json
import math
import os
import re
import statistics
import sys
from bisect import bisect_left, bisect_right

SURVEY_YEAR = 2026
MIN_RESPONDENTS = 30

THEMES = [
    ("access", "Getting through", "How easy it is to contact the practice and get help."),
    ("appointments", "Appointments", "Choice, waiting time and seeing the clinician you prefer."),
    ("care", "Care", "How patients felt treated at their last appointment."),
]

# key, theme, short label, question summary
QUESTIONS = [
    ("overallexp", "overall", "Overall experience", "Patients describing their overall experience of the practice as good"),
    ("localgpservicesphone", "access", "Phoning the practice", "Patients finding it easy to contact the practice by phone"),
    ("localgpserviceswebsite", "access", "Using the website", "Patients finding it easy to contact the practice using its website"),
    ("localgpservicesapp", "access", "Using the NHS App", "Patients finding it easy to contact the practice using the NHS App"),
    ("localgpservicesreception", "access", "Reception team", "Patients finding the reception and admin team helpful"),
    ("gpcontactnextstep", "access", "Knowing what happens next", "Patients who knew what the next step would be after contacting the practice"),
    ("gpcontactoverall", "access", "Contacting the practice", "Patients describing their experience of contacting the practice as good"),
    ("lastgpapptchoice", "appointments", "Choice of time or day", "Patients offered a choice of time or day for their appointment"),
    ("lastgpapptwait", "appointments", "Waiting time", "Patients happy with how long they waited for their appointment"),
    ("localgpservicesprefhpsee", "appointments", "Seeing a preferred clinician", "Patients with a preferred clinician who see or speak to them always or a lot of the time"),
    ("lastgpapptlisten", "care", "Being listened to", "Patients saying the clinician was good at listening to them"),
    ("lastgpapptcare", "care", "Care and concern", "Patients saying the clinician treated them with care and concern"),
    ("lastgpapptmental", "care", "Mental wellbeing", "Patients rating the clinician good at considering their mental wellbeing"),
    ("lastgpapptconf", "care", "Confidence and trust", "Patients with confidence and trust in the clinician they saw"),
    ("lastgpapptdecision", "care", "Involved in decisions", "Patients who felt involved in decisions about their care and treatment"),
    ("lastgpapptneeds", "care", "Needs met", "Patients whose needs were met at their last appointment"),
    # Long-term conditions: shown in their own section; not part of any theme or the headline
    ("healthsupport", "conditions", "Support to manage it", "Patients with a long-term condition who had enough support from local services or organisations to manage it"),
    ("healthconversation", "conditions", "A conversation about it", "Patients with a long-term condition who talked with a clinician about managing it"),
    ("healthcareplan", "conditions", "An agreed plan", "Patients with a long-term condition who agreed a plan with a clinician to manage it"),
]

# Practice size from the NHS registered list (no official bands exist; round numbers chosen for clarity)
SIZE_BANDS = [  # (key, label, lower bound inclusive)
    ("small", "Small practice", 0),
    ("medium", "Medium practice", 5000),
    ("large", "Large practice", 10000),
    ("verylarge", "Very large practice", 20000),
]


def size_band(n):
    if n is None:
        return None
    band = [b for b in SIZE_BANDS if n >= b[2]][-1]
    return band[0]


def load_registered(path):
    """Practice code -> registered patients, plus the extract date."""
    if not path:
        return {}, None
    rows = list(csv.DictReader(open(path, encoding="utf-8-sig")))
    out = {r["CODE"]: int(r["NUMBER_OF_PATIENTS"]) for r in rows if r.get("SEX") == "ALL" and r.get("AGE") == "ALL"}
    return out, rows[0]["EXTRACT_DATE"] if rows else None


# Context figure (not rated): share of people who answered with a long-term condition
CONDITION_SHARE = "healthconditionre"

# Answer spreads ("what to expect"): key, survey question, title, [(category, option numbers)].
# Options not listed (e.g. "I can't remember", "I don't know") are left out and shares re-based.
DISTRIBUTIONS = [
    ("apptwhen", "lastgpapptlengthgap", "How soon the appointment happened",
     [("Same day", [1]), ("Next day", [2]), ("A few days later", [3]), ("1 to 2 weeks later", [4]), ("Over 2 weeks later", [5])]),
    ("appttype", "lastgpappttype", "How the appointment took place",
     [("Face to face", [2, 3, 4]), ("By phone", [1]), ("Video, text or online", [5, 6, 7])]),
    ("apptwho", "lastgpapptwho", "Who they saw",
     [("A GP", [1]), ("A nurse", [2]), ("Another clinician", [3, 4, 5])]),
    ("contacthow", "gpcontacthow", "How they contacted the practice",
     [("By phone", [1]), ("In person", [2]), ("Online", [3, 4, 5]), ("Another way", [6])]),
    ("age", "aboutyouagemerged", "Age of people who answered",
     [("16 to 34", [1, 2]), ("35 to 54", [3, 4]), ("55 to 74", [5, 6]), ("75 and over", [7, 8])]),
]

COUNTIES = {c.upper() for c in """Bedfordshire Berkshire Bristol Buckinghamshire Cambridgeshire Cheshire Cornwall Cumbria
Derbyshire Devon Dorset Durham County-Durham Essex Gloucestershire Hampshire Herefordshire Hertfordshire Kent
Lancashire Leicestershire Lincolnshire Merseyside Middlesex Norfolk Northamptonshire Northumberland Nottinghamshire
Oxfordshire Rutland Shropshire Somerset Staffordshire Suffolk Surrey Sussex Warwickshire Wiltshire Worcestershire
Yorkshire Cleveland Humberside Avon Tyne-And-Wear Isle-Of-Wight""".split()}
COUNTIES |= {c.replace("-", " ") for c in COUNTIES} | {"EAST SUSSEX", "WEST SUSSEX", "NORTH YORKSHIRE", "SOUTH YORKSHIRE",
    "WEST YORKSHIRE", "EAST YORKSHIRE", "WEST MIDLANDS", "GREATER MANCHESTER", "GREATER LONDON", "CO DURHAM",
    "NORTH HUMBERSIDE", "SOUTH HUMBERSIDE", "TYNE AND WEAR", "ISLE OF WIGHT", "NORTH LINCOLNSHIRE", "EAST RIDING OF YORKSHIRE"}


def town_of(address):
    parts = [a for a in address if a.upper() not in COUNTIES]
    return parts[-1] if parts else (address[-1] if address else None)


SMALL_WORDS = {"and", "of", "the", "at", "on", "in", "for", "to", "by", "with"}
UPPER_WORDS = {"NHS", "GP", "GPS", "PCN", "UK", "HC", "MC", "LLP", "CIC", "PMS", "APMS", "II", "III", "IV", "ICS", "ICB"}


def title_case(s):
    def part(w, first):
        core = re.sub(r"[^A-Za-z]", "", w).upper()
        if core in UPPER_WORDS:
            return w.upper()
        if not first and w.lower() in SMALL_WORDS:
            return w.lower()
        # ST. MARY'S -> St. Mary's
        return re.sub(r"[A-Za-z]+", lambda m: m.group(0).capitalize(), w.lower()).replace("'S", "'s").replace("’S", "’s")

    out = []
    for i, w in enumerate(s.strip().split()):
        out.append("-".join(part(x, i == 0 or j > 0) for j, x in enumerate(w.split("-"))))
    return " ".join(out).rstrip(" ,")


def num(v):
    try:
        x = float(v)
    except (TypeError, ValueError):
        return None
    return None if x < 0 else x


def percentile_ranks(values):
    """values: dict code -> float. Returns code -> mid-rank percentile in [0, 1]."""
    s = sorted(values.values())
    n = len(s)
    return {k: (bisect_left(s, v) + bisect_right(s, v)) / 2 / n for k, v in values.items()}


def shrink(results):
    """Empirical Bayes: results is code -> {p, lo, hi, n}. Returns code -> shrunk value, plus prior strength."""
    eff = {}
    for code, v in results.items():
        p, lo, hi = v["p"], v["lo"], v["hi"]
        # Published intervals are lopsided near 0% and 100%, so read their width on the log-odds scale
        if lo is not None and hi is not None and 0 < lo < p < hi < 1:
            logit = lambda x: math.log(x / (1 - x))
            se_logit = (logit(hi) - logit(lo)) / 3.92
            n_eff = 1 / (se_logit ** 2 * p * (1 - p))
        else:
            n_eff = max(v["n"], 1)  # no usable interval: fall back to people who answered
        eff[code] = (p, max(n_eff, 1.0))
    ps = [p for p, _ in eff.values()]
    m = statistics.fmean(ps)
    sampling = statistics.fmean(p * (1 - p) / n for p, n in eff.values())
    tau2 = max(statistics.pvariance(ps) - sampling, 1e-5)  # spread between practices beyond sampling noise
    k = max(m * (1 - m) / tau2 - 1, 1.0)  # prior worth k respondents
    return {c: (p * n + m * k) / (n + k) for c, (p, n) in eff.items()}, k


def load_deprivation(path):
    if not path:
        return {}
    out = {}
    for r in csv.DictReader(open(path, encoding="utf-8-sig")):
        if r.get("Area Type") == "GPs" and r.get("Value"):
            out[r["Area Code"]] = float(r["Value"])
    return out


QUINTILE_LABELS = ["least deprived", "less deprived", "average", "more deprived", "most deprived"]


def to_stars(pr):
    # deciles -> 0.5 .. 5.0 in half-star steps (as in the 2013 app)
    return min(10, int(pr * 10) + 1) / 2


def main(csv_path, loc_path, reg_path=None, dep_path=None):
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    locs = json.load(open(loc_path))
    registered, registered_date = load_registered(reg_path)
    rows = list(csv.DictReader(open(csv_path, encoding="utf-8-sig", errors="replace")))

    # Per-question raw values
    raw = {q[0]: {} for q in QUESTIONS}
    for r in rows:
        code = r["ad_practicecode"]
        for key, *_ in QUESTIONS:
            p = num(r.get(f"{key}.pcteval"))
            if p is None:
                continue
            raw[key][code] = {
                "p": p,
                "lo": num(r.get(f"{key}.lowileval")),
                "hi": num(r.get(f"{key}.hiwileval")),
                "n": int(num(r.get(f"{key}.baseevaluw")) or 0),
            }

    meta_q = []
    ranks = {}
    adjusted = {}
    raw_ranks = {}
    for key, theme, label, summary in QUESTIONS:
        vals = {c: v["p"] for c, v in raw[key].items()}
        med = statistics.median(vals.values())
        adjusted[key], k = shrink(raw[key])
        ranks[key] = percentile_ranks(adjusted[key])
        raw_ranks[key] = percentile_ranks(vals)
        if key == "overallexp":
            print(f"shrinkage: overall experience prior worth {k:.0f} respondents")
        meta_q.append({"key": key, "theme": theme, "label": label, "summary": summary, "median": round(med, 4)})
        for code, v in raw[key].items():
            v["pr"] = ranks[key][code]
            v["stars"] = to_stars(v["pr"])
            v["cmp"] = "better" if v["lo"] is not None and v["lo"] > med else "worse" if v["hi"] is not None and v["hi"] < med else "similar"
            v["low"] = v["n"] < MIN_RESPONDENTS

    # Theme scores: mean percentile of the theme's questions (needs at least half answered)
    theme_raw = {t[0]: {} for t in THEMES}
    for r in rows:
        code = r["ad_practicecode"]
        for tkey, *_ in THEMES:
            keys = [q[0] for q in QUESTIONS if q[1] == tkey]
            prs = [ranks[k][code] for k in keys if code in ranks[k]]
            if len(prs) * 2 >= len(keys):
                theme_raw[tkey][code] = sum(prs) / len(prs)
    theme_ranks = {t: percentile_ranks(v) for t, v in theme_raw.items()}

    # Before/after report for shrinkage (overall experience)
    old = {c: to_stars(pr) for c, pr in raw_ranks["overallexp"].items()}
    new = {c: to_stars(pr) for c, pr in ranks["overallexp"].items()}
    moved = [abs(new[c] - old[c]) for c in new]
    print(f"shrinkage changed overall stars for {sum(1 for x in moved if x)} of {len(moved)} practices "
          f"(by 0.5: {sum(1 for x in moved if x == 0.5)}, by 1+: {sum(1 for x in moved if x >= 1)})")
    small = [c for c, v in raw["overallexp"].items() if v["n"] < 50]
    ext = lambda d, cs: round(100 * sum(1 for c in cs if d[c] in (0.5, 5.0)) / max(len(cs), 1))
    print(f"practices with under 50 replies at 0.5 or 5 stars: before {ext(old, small)}%, after {ext(new, small)}%")

    # Similar areas: fifths by deprivation of the registered population, ranked within each fifth
    deprivation = load_deprivation(dep_path)
    scored = sorted(c for c in deprivation if c in raw["overallexp"] or c in theme_raw["care"])
    cuts = statistics.quantiles([deprivation[c] for c in scored], n=5) if scored else []
    quintile = {c: sum(1 for x in cuts if deprivation[c] > x) for c in deprivation}  # 0 least .. 4 most deprived
    peer = {}
    for qn in range(5):
        members = {c for c, v in quintile.items() if v == qn}
        overall_peer = percentile_ranks({c: adjusted["overallexp"][c] for c in members if c in adjusted["overallexp"]})
        theme_peer = {t: percentile_ranks({c: v for c, v in theme_raw[t].items() if c in members}) for t in theme_raw}
        for c in members:
            peer[c] = {
                "group": qn,
                "stars": to_stars(overall_peer[c]) if c in overall_peer else None,
                "themes": {t: to_stars(tp[c]) for t, tp in theme_peer.items() if c in tp},
            }
    if deprivation:
        medians = [statistics.median(raw["overallexp"][c]["p"] for c in raw["overallexp"] if quintile.get(c) == qn) for qn in range(5)]
        print("overall % good by deprivation fifth (least -> most):", [round(m * 100) for m in medians])

    dists = {}
    england = {d[0]: [0.0] * len(d[3]) for d in DISTRIBUTIONS}
    suppressed = 0
    for r in rows:
        code = r["ad_practicecode"]
        out = {}
        for key, q, _, cats in DISTRIBUTIONS:
            counts = [[num(r.get(f"{q}_{o}.count")) for o in opts] for _, opts in cats]
            if any(c is None for group in counts for c in group):
                suppressed += 1
                continue
            sums = [sum(group) for group in counts]
            total = sum(sums)
            if total <= 0:
                continue
            for i, v in enumerate(sums):
                england[key][i] += v
            n = int(num(r.get(f"{q}.basefulluw")) or 0)
            out[key] = {"s": [round(v / total, 3) for v in sums], "n": n, "low": n < MIN_RESPONDENTS}
        dists[code] = out
    england = {k: [round(v / sum(vs), 3) for v in vs] for k, vs in england.items() for vs in [england[k]]}
    print(f"{suppressed} practice/question spreads skipped for suppressed counts")

    cond_vals = {r["ad_practicecode"]: num(r.get(f"{CONDITION_SHARE}.pcteval")) for r in rows}
    cond_median = statistics.median(v for v in cond_vals.values() if v is not None)

    practices = {}
    index = []
    missing_loc = 0
    for r in rows:
        code = r["ad_practicecode"]
        loc = locs.get(code) or {}
        name = title_case(r["ad_practicename"])
        qs = {}
        for key, *_ in QUESTIONS:
            v = raw[key].get(code)
            if v:
                qs[key] = {
                    "p": round(v["p"], 4),
                    "lo": round(v["lo"], 4) if v["lo"] is not None else None,
                    "hi": round(v["hi"], 4) if v["hi"] is not None else None,
                    "n": v["n"], "stars": v["stars"], "pr": round(v["pr"], 3),
                    "cmp": v["cmp"], "low": v["low"],
                }
        themes = {t: to_stars(theme_ranks[t][code]) for t in theme_ranks if code in theme_ranks[t]}
        overall = qs.get("overallexp")
        p = {
            "code": code,
            "name": name,
            "address": [title_case(a) for a in loc.get("address", [])],
            "postcode": loc.get("postcode"),
            "phone": loc.get("phone"),
            "lat": loc.get("lat"),
            "lng": loc.get("lng"),
            "active": loc.get("status", "Active") == "Active",
            "pcn": title_case(r["ad_pcnname"]) if r.get("ad_pcnname") else None,
            "icb": title_case(r["ad_icsname"]) if r.get("ad_icsname") else None,
            # Official NHS registered list; None when the practice isn't in the NHS file (e.g. merged since)
            "patients": registered.get(code),
            "size": size_band(registered.get(code)),
            "surveysSent": int(num(r["distributed"]) or 0),
            "responses": int(num(r["received"]) or 0),
            "responseRate": round(num(r["resprate"]) or 0, 3),
            "stars": overall["stars"] if overall else None,
            "themes": themes,
            # rank among practices whose patients live in similarly deprived areas
            "similar": peer.get(code),
            "deprivation": round(deprivation[code], 1) if code in deprivation else None,
            "questions": qs,
            "dists": dists.get(code, {}),
            "conditionShare": round(cond_vals[code], 3) if cond_vals.get(code) is not None else None,
        }
        practices[code] = p
        if p["lat"] is None:
            missing_loc += 1
            continue
        index.append({
            "c": code, "n": name, "pc": p["postcode"],
            "tw": town_of(p["address"]),
            "la": round(p["lat"], 5), "lo": round(p["lng"], 5),
            "s": p["stars"], "t": [themes.get(t[0]) for t in THEMES],
            "op": round(overall["p"], 3) if overall else None,
            "r": p["responses"], "a": 1 if p["active"] else 0,
            "sz": p["size"], "np": p["patients"],
            # same-day and face-to-face shares for the results list
            "sd": p["dists"]["apptwhen"]["s"][0] if "apptwhen" in p["dists"] else None,
            "ff": p["dists"]["appttype"]["s"][0] if "appttype" in p["dists"] else None,
        })

    os.makedirs(os.path.join(root, "public", "data"), exist_ok=True)
    json.dump(practices, open(os.path.join(root, "data", "practices.json"), "w"), separators=(",", ":"))
    json.dump(index, open(os.path.join(root, "public", "data", "index.json"), "w"), separators=(",", ":"))
    json.dump({
        "year": SURVEY_YEAR,
        "minRespondents": MIN_RESPONDENTS,
        "practiceCount": len(rows),
        "responses": sum(p["responses"] for p in practices.values()),
        "themes": [{"key": k, "label": l, "summary": s} for k, l, s in THEMES],
        "questions": meta_q,
        "conditionShareMedian": round(cond_median, 4),
        "registeredAsOf": registered_date,
        "registeredMedian": int(statistics.median(registered.values())) if registered else None,
        "deprivationGroups": [{"label": QUINTILE_LABELS[i],
                               "from": round(cuts[i - 1], 1) if i > 0 else None,
                               "to": round(cuts[i], 1) if i < 4 else None,
                               "overallMedian": round(medians[i], 3)} for i in range(5)] if deprivation else [],
        "sizeBands": [{"key": k, "label": l, "from": lo, "to": (SIZE_BANDS[i + 1][2] - 1) if i + 1 < len(SIZE_BANDS) else None}
                      for i, (k, l, lo) in enumerate(SIZE_BANDS)],
        "dists": [{"key": k, "label": label, "categories": [c for c, _ in cats], "england": england[k]}
                  for k, _, label, cats in DISTRIBUTIONS],
    }, open(os.path.join(root, "data", "meta.json"), "w"), indent=1)
    print(f"{len(practices)} practices, {len(index)} in search index, {missing_loc} without location, "
          f"{sum(1 for p in practices.values() if p['patients'] is None)} without an NHS list size")


if __name__ == "__main__":
    main(*sys.argv[1:5])
