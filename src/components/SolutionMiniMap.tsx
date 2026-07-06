"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { ReuseSolution } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/** Small static map with a single pin for solution detail pages. */
export function SolutionMiniMap({ solution }: { solution: ReuseSolution }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !TOKEN ||
      !containerRef.current ||
      solution.latitude == null ||
      solution.longitude == null
    ) {
      return;
    }

    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [solution.longitude, solution.latitude],
      zoom: 11,
      interactive: false,
      attributionControl: false,
      projection: "mercator",
    });

    new mapboxgl.Marker({ color: "#1E3A4C" })
      .setLngLat([solution.longitude, solution.latitude])
      .addTo(map);

    return () => {
      map.remove();
    };
  }, [solution.id, solution.latitude, solution.longitude]);

  if (solution.latitude == null || solution.longitude == null) {
    return (
      <div className="flex h-48 items-center justify-center rounded-card border border-dashed border-border bg-cream text-sm text-muted">
        Location not mapped
      </div>
    );
  }

  if (!TOKEN) {
    return (
      <div className="flex h-48 items-center justify-center rounded-card border border-dashed border-border bg-cream text-sm text-muted">
        Map preview unavailable
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-48 overflow-hidden rounded-card border border-border"
      aria-label={`Map showing ${solution.name}`}
    />
  );
}
