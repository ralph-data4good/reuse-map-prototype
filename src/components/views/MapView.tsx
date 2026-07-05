"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Legend } from "@/components/Legend";
import { MAP_DEFAULTS, verificationLabel } from "@/lib/taxonomy";
import { getCategoryColor, categoryOverlayGradient } from "@/lib/reuse-categories";
import { categoryIconMarkup } from "@/components/CategoryIcon";
import { getCategoryDefinition, getSubCategoryDefinition } from "@/lib/tooltips";
import { solutionImageSrc } from "@/lib/utils";
import type { ReuseSolution } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

// Teardrop marker with a white disc + category-colored icon for legibility at
// map scale (outline icons read poorly when tiny and white-on-gold).
function markerElement(color: string, category?: string | null): HTMLElement {
  const el = document.createElement("div");
  el.style.cursor = "pointer";
  const icon = categoryIconMarkup(category, color, 15, { strokeScale: 1.5 });
  el.innerHTML = `
    <div style="position:relative;width:34px;height:44px;">
      <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.18));">
        <path d="M17 0C7.6 0 0 7.6 0 17c0 11.9 17 27 17 27s17-15.1 17-27C34 7.6 26.4 0 17 0z"
          fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
      <div style="position:absolute;left:50%;top:5px;transform:translateX(-50%);pointer-events:none;display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#ffffff;box-shadow:0 1px 2px rgba(0,0,0,0.12);">
        ${icon}
      </div>
    </div>`;
  return el;
}

// Popup card HTML echoing the ZWA card (image top, bold name, chips, pill).
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
  // Sub-categories as inline terms carrying a native title tooltip. The map
  // popup is raw HTML (outside React), so title= is the accessible-enough
  // fallback here; the Gallery and Table use the full hover/focus/tap tooltip.
  const subCategoriesHtml = s.subCategories
    .map(
      (sub) =>
        `<span title="${esc(getSubCategoryDefinition(sub))}" style="text-decoration:underline dotted;text-underline-offset:2px;cursor:help;">${esc(
          sub
        )}</span>`
    )
    .join(", ");
  // Fixed max height so a tall card never overflows the map; the image stays
  // pinned at the top and the text section scrolls when content is long.
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
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid #EFE7D3;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          ${
            s.primaryCategory
              ? `<span title="${esc(
                  getCategoryDefinition(s.primaryCategory)
                )}" style="background:${color};color:#fff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;cursor:help;">${esc(
                  s.primaryCategory
                )}</span>`
              : ""
          }
          <span style="${chip}font-size:11px;font-weight:500;padding:3px 10px;border-radius:999px;">${esc(
            verificationLabel(s.verificationStatus, s.verificationSource)
          )}</span>
        </div>
      </div>
    </div>`;
}

export function MapView({ items }: { items: ReuseSolution[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: MAP_DEFAULTS.center,
      zoom: MAP_DEFAULTS.zoom,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const coords: [number, number][] = [];
    items.forEach((s) => {
      if (s.latitude == null || s.longitude == null) return;
      const color = getCategoryColor(s.primaryCategory);
      const popup = new mapboxgl.Popup({
        offset: 24,
        closeButton: true,
        maxWidth: "290px",
      }).setHTML(popupHTML(s));
      const marker = new mapboxgl.Marker({
        element: markerElement(color, s.primaryCategory),
        anchor: "bottom",
      })
        .setLngLat([s.longitude, s.latitude])
        .setPopup(popup)
        .addTo(map);
      markersRef.current.push(marker);
      coords.push([s.longitude, s.latitude]);
    });

    // Zoom to fit the currently filtered pins. Padding leaves room for the
    // navigation control and the legend overlay (bottom-left).
    // `essential: true` ensures the camera moves even when the OS has
    // "reduce motion" enabled, so every filter change (country, category,
    // nature, or affiliation) visibly re-frames the pins.
    if (coords.length === 0) {
      map.easeTo({
        center: MAP_DEFAULTS.center,
        zoom: MAP_DEFAULTS.zoom,
        duration: 600,
        essential: true,
      });
    } else if (coords.length === 1) {
      map.easeTo({ center: coords[0], zoom: 10, duration: 800, essential: true });
    } else {
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new mapboxgl.LngLatBounds(coords[0], coords[0])
      );
      map.fitBounds(bounds, {
        padding: { top: 48, right: 40, bottom: 56, left: 56 },
        maxZoom: 12,
        duration: 800,
        essential: true,
      });
    }
  }, [items]);

  if (!TOKEN) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center rounded-card border border-dashed border-border bg-white p-8 text-center">
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
    <div className="relative h-[600px] overflow-hidden rounded-card border border-border shadow-card">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-4 left-4 z-10 w-48">
        <Legend />
      </div>
    </div>
  );
}
