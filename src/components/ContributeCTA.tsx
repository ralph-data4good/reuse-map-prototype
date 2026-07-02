"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContributeForm } from "@/components/ContributeForm";
import { COPY } from "@/lib/taxonomy";

// NoteForms embed URL (see .env.local). When set, the real NoteForms form is
// embedded; otherwise the built-in scaffolded form (from the field spec) shows.
const EMBED_URL = process.env.NEXT_PUBLIC_NOTEFORMS_EMBED_URL;

export function ContributeCTA() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-12 bg-navy">
      <div className="container flex flex-col items-center gap-4 py-12 text-center">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          {COPY.ctaHeading}
        </h2>
        <p className="max-w-2xl text-sm text-white/80 sm:text-base">
          {COPY.ctaBody}
        </p>

        {!open ? (
          <Button variant="gold" size="lg" onClick={() => setOpen(true)}>
            {COPY.ctaButton}
          </Button>
        ) : (
          <div className="mt-4 w-full max-w-3xl">
            {EMBED_URL ? (
              <>
                <div className="overflow-hidden rounded-card border border-white/20 bg-white shadow-pop">
                  <iframe
                    src={EMBED_URL}
                    title="Contribute a reuse solution"
                    className="h-[720px] w-full"
                  />
                </div>
                <p className="mt-3 text-xs text-white/60">
                  Form not loading?{" "}
                  <a
                    href={EMBED_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white underline underline-offset-2"
                  >
                    Open it in a new tab
                  </a>
                  .
                </p>
              </>
            ) : (
              <>
                <ContributeForm />
                <p className="mt-3 text-xs text-white/60">
                  Preview form. Connect NEXT_PUBLIC_NOTEFORMS_EMBED_URL in
                  .env.local to embed the live NoteForms form here.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
