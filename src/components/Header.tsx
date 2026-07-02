import { assetPath } from "@/lib/utils";

const ZWA_URL = "https://zerowaste.asia/";

// Minimal header: just the Zero Waste Asia logo, linking back to the main site.
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream/95 backdrop-blur">
      <div className="container flex h-20 items-center">
        <a
          href={ZWA_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Zero Waste Asia home"
          className="flex items-center rounded-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/zwa-logo.png")}
            alt="Zero Waste Asia"
            className="h-14 w-auto"
          />
        </a>
      </div>
    </header>
  );
}
