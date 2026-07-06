"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import { Legend } from "@/components/Legend";
import { MAP_DEFAULTS, trustBadgeLabel } from "@/lib/taxonomy";
import {
  getCategoryColor,
  getCategoryChipColors,
  categoryOverlayGradient,
} from "@/lib/reuse-categories";
import { getCategoryDefinition } from "@/lib/tooltips";
import { solutionImageSrc, formatDate } from "@/lib/utils";
import {
  solutionDetailLinkMarkup,
  visitProviderButtonMarkup,
} from "@/lib/visit-provider-markup";
import { ensureCategoryPinImages } from "@/lib/map-pin-images";
import { mapCameraDuration } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { solutionDetailPath } from "@/lib/solution-paths";
import { escapeHtml as esc } from "@/lib/html";
import {
  contributePrefillFromFilters,
  contributeUrl,
  emptyStateHeadline,
} from "@/lib/contribute-link";
import type { Filters, ReuseSolution } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const SOURCE_ID = "solutions";
const CLUSTER_LAYER = "solutions-clusters";
const CLUSTER_COUNT_LAYER = "solutions-cluster-count";
const UNCLUSTERED_LAYER = "solutions-unclustered";

function popupHTML(s: ReuseSolution): string {
  const color = getCategoryColor(s.primaryCategory);
  const img = solutionImageSrc({
    imageUrl: s.imageUrl,
    serviceProviderName: s.serviceProviderName,
    categorySlug: s.primaryCategorySlug,
  });
  const location = [s.city, s.country].filter(Boolean).join(", ");
  const chip =
    s.verificationStatus === "unverified"
      ? "background:#FEF6E0;color:#B45309;"
      : s.verificationStatus === "staff_verified"
        ? "background:#F3E8FF;color:#6B21A8;"
        : "background:#E8F5E9;color:#2E7D32;";
  const trustLabel = esc(
    trustBadgeLabel(
      s.verificationStatus,
      s.verificationSource,
      formatDate(s.lastUpdated)
    )
  );
  const categoryChip = getCategoryChipColors(s.primaryCategory);
  const subCategoriesHtml = s.subCategories
    .map((sub) => `<span>${esc(sub)}</span>`)
    .join(", ");
  return `
    <div style="width:264px;max-height:440px;display:flex;flex-direction:column;font-family:var(--font-body),system-ui,sans-serif;color:#1A1A1A;">
      <div style="position:relative;height:120px;flex:none;background:${color};overflow:hidden;">
        <img src="${esc(img)}" alt="${esc(s.name)}"
          style="width:100%;height:100%;object-fit:cover;display:block;"
          onerror="this.style.display='none'"/>
        <div style="position:absolute;inset:0;pointer-events:none;background-image:${categoryOverlayGradient(
          s.primaryCategory
        )};"></div>
      </div>
      <div style="padding:16px;overflow-y:auto;flex:1 1 auto;">
        <h3 style="margin:0;font-family:var(--font-heading),system-ui,sans-serif;font-weight:600;font-size:15px;line-height:1.35;color:#1A1A1A;">
          ${esc(s.name)}
        </h3>
        ${
          location
            ? `<div style="margin-top:8px;font-size:12px;line-height:1.5;color:#6B7280;">${esc(
                location
              )}</div>`
            : ""
        }
        ${
          subCategoriesHtml
            ? `<div style="margin-top:4px;font-size:12px;line-height:1.5;color:#6B7280;">${subCategoriesHtml}</div>`
            : ""
        }
        ${
          s.serviceProviderName
            ? `<div style="margin-top:10px;font-size:13px;color:#1A1A1A;"><span style="color:#6B7280;">by </span><span style="font-weight:600;">${esc(
                s.serviceProviderName
              )}</span></div>`
            : ""
        }
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid #EFE7D3;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            ${
              s.primaryCategory
                ? `<span title="${esc(
                    getCategoryDefinition(s.primaryCategory)
                  )}" style="background:${categoryChip.backgroundColor};color:${categoryChip.color};font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;cursor:help;">${esc(
                    s.primaryCategory
                  )}</span>`
                : ""
            }
            <span style="${chip}font-size:11px;font-weight:500;padding:3px 10px;border-radius:999px;">${trustLabel}</span>
          </div>
          ${solutionDetailLinkMarkup(s.slug)}
          ${visitProviderButtonMarkup(s.serviceProviderName)}
        </div>
      </div>
    </div>`;
}

function solutionsToGeoJSON(items: ReuseSolution[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: items
      .filter((s) => s.latitude != null && s.longitude != null)
      .map((s) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [s.longitude as number, s.latitude as number],
        },
        properties: {
          id: s.id,
          catSlug: s.primaryCategorySlug || "unknown",
        },
      })),
  };
}

export function MapView({
  items,
  filters,
  hasActiveFilters,
  selectedCategories,
  onToggleCategory,
  onShowAllCategories,
}: {
  items: ReuseSolution[];
  filters: Filters;
  hasActiveFilters?: boolean;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onShowAllCategories: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const itemsByIdRef = useRef<Map<string, ReuseSolution>>(new Map());
  const [layersReady, setLayersReady] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(true);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const mappable = items.filter(
    (s) => s.latitude != null && s.longitude != null
  );
  const showEmpty = mappable.length === 0;
  const contributeHref = contributeUrl(contributePrefillFromFilters(filters));

  useEffect(() => {
    itemsByIdRef.current = new Map(items.map((s) => [s.id, s]));
  }, [items]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "64px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!TOKEN || !inView || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: MAP_DEFAULTS.center,
      zoom: MAP_DEFAULTS.zoom,
      // Flat projection: the globe's curvature at low zoom skews screen<->lnglat
      // mapping, which made cluster-expansion camera targets land off-center.
      projection: "mercator",
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      void ensureCategoryPinImages(map).then(() => {
        if (map.getSource(SOURCE_ID)) return;

        map.addSource(SOURCE_ID, {
          type: "geojson",
          data: solutionsToGeoJSON([]),
          cluster: true,
          clusterRadius: 45,
          // Beyond this zoom points render individually, so a cluster click can
          // always resolve to visible pins rather than another cluster.
          clusterMaxZoom: 14,
        });

        map.addLayer({
          id: CLUSTER_LAYER,
          type: "circle",
          source: SOURCE_ID,
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#243647",
            "circle-radius": [
              "step",
              ["get", "point_count"],
              18,
              10,
              22,
              25,
              26,
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        map.addLayer({
          id: CLUSTER_COUNT_LAYER,
          type: "symbol",
          source: SOURCE_ID,
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: { "text-color": "#ffffff" },
        });

        map.addLayer({
          id: UNCLUSTERED_LAYER,
          type: "symbol",
          source: SOURCE_ID,
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": ["get", "catSlug"],
            "icon-size": 1,
            "icon-anchor": "bottom",
            "icon-allow-overlap": true,
          },
        });

        map.on("click", CLUSTER_LAYER, (e) => {
          // Use the clicked cluster feature directly (layer-scoped event).
          const feature = e.features?.[0];
          if (!feature) return;
          const clusterId = feature.properties?.cluster_id;
          if (clusterId == null) return;
          const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;

          // Frame the cluster's actual member points instead of trusting the
          // expansion zoom, which can over-zoom past the pins for tightly
          // grouped locations.
          source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
            if (err || !leaves || leaves.length === 0) return;
            const leafCoords = leaves
              .map((l) =>
                l.geometry?.type === "Point"
                  ? (l.geometry.coordinates as [number, number])
                  : null
              )
              .filter((c): c is [number, number] => c !== null);
            if (leafCoords.length === 0) return;

            const duration = mapCameraDuration();
            const bounds = leafCoords.reduce(
              (b, c) => b.extend(c),
              new mapboxgl.LngLatBounds(leafCoords[0], leafCoords[0])
            );
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            const isSinglePoint = ne.lng === sw.lng && ne.lat === sw.lat;

            if (isSinglePoint) {
              // All members share one location: zoom past clusterMaxZoom so they
              // resolve into (overlapping) individual pins at that spot.
              map.easeTo({
                center: leafCoords[0],
                zoom: 15,
                duration,
                essential: !reducedMotion,
              });
            } else {
              map.fitBounds(bounds, {
                padding: 80,
                maxZoom: 16,
                duration,
                essential: !reducedMotion,
              });
            }
          });
        });

        map.on("click", UNCLUSTERED_LAYER, (e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          const id = feature.properties?.id as string | undefined;
          if (!id) return;
          const solution = itemsByIdRef.current.get(id);
          if (!solution) return;

          popupRef.current?.remove();
          const coords = (feature.geometry as GeoJSON.Point).coordinates.slice() as [
            number,
            number,
          ];
          popupRef.current = new mapboxgl.Popup({
            offset: 24,
            closeButton: true,
            maxWidth: "290px",
          })
            .setLngLat(coords)
            .setHTML(popupHTML(solution))
            .addTo(map);
        });

        map.on("mouseenter", CLUSTER_LAYER, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", CLUSTER_LAYER, () => {
          map.getCanvas().style.cursor = "";
        });
        map.on("mouseenter", UNCLUSTERED_LAYER, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", UNCLUSTERED_LAYER, () => {
          map.getCanvas().style.cursor = "";
        });

        setLayersReady(true);
        const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
        source.setData(solutionsToGeoJSON(items));
      });
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setLayersReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init when visible
  }, [inView]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !layersReady) return;

    const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    const geojson = solutionsToGeoJSON(items);
    source.setData(geojson);

    const coords = geojson.features.map(
      (f) => (f.geometry as GeoJSON.Point).coordinates as [number, number]
    );

    if (coords.length === 0) {
      return;
    }
    const duration = mapCameraDuration();
    if (coords.length === 1) {
      map.flyTo({
        center: coords[0],
        zoom: 9,
        duration,
        essential: !reducedMotion,
      });
    } else {
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new mapboxgl.LngLatBounds(coords[0], coords[0])
      );
      map.fitBounds(bounds, {
        padding: 60,
        maxZoom: 10,
        duration,
        essential: !reducedMotion,
      });
    }
  }, [items, layersReady, reducedMotion]);

  if (!TOKEN) {
    return (
      <div className="flex h-[520px] flex-col items-center justify-center rounded-card border border-dashed border-border bg-white p-8 text-center">
        <p className="font-heading text-lg font-semibold text-ink">
          Map needs a Mapbox token
        </p>
        <p className="mt-1 max-w-md text-sm text-muted">
          Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local to render the map. The
          Gallery and Table views work without it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="sr-only" aria-label="Solutions shown on the map">
        {mappable.map((s) => (
          <li key={s.id}>
            <Link href={solutionDetailPath(s.slug)}>
              {s.serviceProviderName ?? s.name}
              {s.city || s.country
                ? ` — ${[s.city, s.country].filter(Boolean).join(", ")}`
                : ""}
            </Link>
          </li>
        ))}
      </ul>
      <div className="relative h-[520px] overflow-hidden rounded-card border border-border shadow-card">
        <div
          ref={containerRef}
          className="h-full w-full"
          role="application"
          aria-label="Interactive map of reuse solutions. Use the list above or switch to gallery or table view for keyboard browsing."
          tabIndex={0}
        />
        {!inView && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-cream/80 text-sm text-muted"
            aria-hidden
          >
            Map loads when visible…
          </div>
        )}
        {showEmpty && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/75 p-6">
            <div className="pointer-events-auto max-w-md rounded-card border border-border bg-white p-6 text-center shadow-card">
              <p className="font-heading text-lg font-semibold text-ink">
                {emptyStateHeadline(filters)}
              </p>
              <p className="mt-2 text-sm text-muted">
                Know one?{" "}
                <Link
                  href={contributeHref}
                  className="font-semibold text-navy underline underline-offset-2 hover:text-navy-hover"
                >
                  Contribute it →
                </Link>
              </p>
              {hasActiveFilters && (
                <p className="mt-2 text-xs text-muted">
                  Adjust filters above or share a missing solution.
                </p>
              )}
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-3 z-10 w-[min(100%,13rem)] md:hidden">
          <Legend
            selectedCategories={selectedCategories}
            onToggleCategory={onToggleCategory}
            onShowAll={onShowAllCategories}
            collapsed={legendCollapsed}
            onCollapsedChange={setLegendCollapsed}
          />
        </div>
      </div>
      <div className="hidden md:block">
        <Legend
          selectedCategories={selectedCategories}
          onToggleCategory={onToggleCategory}
          onShowAll={onShowAllCategories}
        />
      </div>
    </div>
  );
}
