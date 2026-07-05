import {
  CATEGORY_SLUG_BY_NAME,
  DEFAULT_CATEGORY_COLOR,
  REUSE_CATEGORY_NAMES,
  getCategoryColor,
  type ReuseCategory,
} from "@/lib/reuse-categories";
import { CATEGORY_ICON_SVGS } from "@/lib/category-icon-svgs.generated";
import type { Map as MapboxMap } from "mapbox-gl";

/** Display size in CSS px — matches the pre-cluster HTML markers. */
const PIN_W = 34;
const PIN_H = 44;
const PIXEL_RATIO = 2;

const PIN_PATH =
  "M17 0C7.6 0 0 7.6 0 17c0 11.9 17 27 17 27s17-15.1 17-27C34 7.6 26.4 0 17 0z";

function pinSvgMarkup(categoryName: ReuseCategory): string {
  const color = getCategoryColor(categoryName);
  const iconData = CATEGORY_ICON_SVGS[categoryName];
  const strokeWidth = iconData
    ? (parseFloat(iconData.strokeWidth) * 1.1).toFixed(2)
    : "2.2";
  const iconInner = iconData?.inner ?? "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W}" height="${PIN_H}" viewBox="0 0 34 44">
  <path d="${PIN_PATH}" fill="${color}" stroke="#ffffff" stroke-width="2"/>
  <svg x="6.5" y="6" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${iconInner}</svg>
</svg>`;
}

function loadSvgAsImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
    );
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to rasterize pin SVG"));
    };
    img.src = url;
  });
}

function rasterizePin(img: HTMLImageElement): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = PIN_W * PIXEL_RATIO;
  canvas.height = PIN_H * PIXEL_RATIO;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D unavailable");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function addPinImage(map: MapboxMap, id: string, bitmap: ImageData): void {
  if (map.hasImage(id)) {
    map.removeImage(id);
  }
  map.addImage(id, bitmap, { pixelRatio: PIXEL_RATIO });
}

/** Register category pin images on a Mapbox map (id = directory_type slug). */
export async function ensureCategoryPinImages(
  map: MapboxMap
): Promise<void> {
  await Promise.all(
    REUSE_CATEGORY_NAMES.map(async (name) => {
      const slug = CATEGORY_SLUG_BY_NAME[name];
      try {
        const img = await loadSvgAsImage(pinSvgMarkup(name));
        addPinImage(map, slug, rasterizePin(img));
      } catch {
        // Skip categories that fail to rasterize.
      }
    })
  );

  if (!map.hasImage("unknown")) {
    const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W}" height="${PIN_H}" viewBox="0 0 34 44">
      <path d="${PIN_PATH}" fill="${DEFAULT_CATEGORY_COLOR}" stroke="#ffffff" stroke-width="2"/>
    </svg>`;
    try {
      const img = await loadSvgAsImage(fallback);
      addPinImage(map, "unknown", rasterizePin(img));
    } catch {
      // No fallback image available.
    }
  }
}
