"use client"

import "leaflet/dist/leaflet.css"
import Link from "next/link"
import { useEffect } from "react"
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet"
import type { LatLngBoundsExpression } from "leaflet"
import type { IndexEntry } from "@/lib/types"
import type { Place } from "@/lib/search"

// SVG attributes can't read CSS variables, so the marker ramp is spelled out.
export function starColour(stars: number | null) {
  if (stars == null) return "#8a9294"
  if (stars >= 4.5) return "#16645f"
  if (stars >= 3.5) return "#3d958a"
  if (stars >= 2.5) return "#c39a1c"
  if (stars >= 1.5) return "#d6782c"
  return "#b23f2a"
}

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 15 })
  }, [map, bounds])
  return null
}

export default function ResultsMap({ center, practices }: { center: Place | null; practices: IndexEntry[] }) {
  const points: [number, number][] = practices.map((p) => [p.la, p.lo])
  if (center) points.push([center.lat, center.lng])
  const bounds: LatLngBoundsExpression = points.length ? points : [[49.9, -6.4], [55.8, 1.8]]

  return (
    <MapContainer
      bounds={bounds}
      scrollWheelZoom={false}
      className="h-[28rem] w-full rounded-xl border border-border sm:h-[34rem]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds bounds={bounds} />
      {center && (
        <CircleMarker
          center={[center.lat, center.lng]}
          radius={7}
          pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#1d3b4a", fillOpacity: 1 }}
        >
          <Popup>{center.label}</Popup>
        </CircleMarker>
      )}
      {practices.map((p) => (
        <CircleMarker
          key={p.c}
          center={[p.la, p.lo]}
          radius={10}
          pathOptions={{ color: "#ffffff", weight: 2, fillColor: starColour(p.s), fillOpacity: 0.95 }}
        >
          <Popup>
            <Link href={`/practice/${p.c}`} className="font-semibold">
              {p.n}
            </Link>
            <br />
            {p.s != null ? `${p.s} stars overall` : "No overall rating"}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
