import { Facebook, Youtube, Linkedin, Instagram } from "lucide-react";
import { assetPath } from "@/lib/utils";

const ZWA_URL = "https://zerowaste.asia/";

const LINKS = [
  { label: "About", href: ZWA_URL },
  { label: "Directory", href: ZWA_URL },
  { label: "Privacy", href: ZWA_URL },
  { label: "Terms", href: ZWA_URL },
  { label: "Contact", href: ZWA_URL },
];

const SOCIALS = [
  { label: "Facebook", href: ZWA_URL, Icon: Facebook },
  { label: "YouTube", href: ZWA_URL, Icon: Youtube },
  { label: "LinkedIn", href: ZWA_URL, Icon: Linkedin },
  { label: "Instagram", href: ZWA_URL, Icon: Instagram },
];

// Simplified ZWA footer: logo + short line, a few links, socials, copyright.
export function Footer() {
  return (
    <footer className="border-t border-border bg-panel">
      <div className="container flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={ZWA_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Zero Waste Asia home"
          className="flex items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath("/zwa-logo.png")} alt="Zero Waste Asia" className="h-9 w-auto" />
        </a>

        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-ink hover:text-navy hover:underline"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy-hover"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} GAIA Asia Pacific, supported by Asia Home of Solutions Collective.</p>
          <p>Reuse Solutions map, part of Zero Waste Asia.</p>
        </div>
      </div>
    </footer>
  );
}
