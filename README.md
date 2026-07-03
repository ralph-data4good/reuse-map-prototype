# Zero Waste Asia — Reuse Solutions Map (Prototype)

A map-first microsite for exploring reuse, refill, and second-hand solutions
across Asia-Pacific. Built on ZWA's directory schema so the data model stays
portable, and styled to match ZWA's design language.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components, restyled to ZWA tokens
- Supabase (Postgres) via `@supabase/supabase-js` — public read only
- Mapbox GL JS for the map

## 1. Environment

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Map view | Map does not render without it; Gallery/Table still work |
| `NEXT_PUBLIC_SUPABASE_URL` | Data | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Data | Supabase anon/public key |
| `NEXT_PUBLIC_NOTEFORMS_EMBED_URL` | Contribute CTA | Leave blank for a graceful placeholder |

## 2. Supabase setup

In a fresh Supabase project, open the SQL editor and run, in order:

1. `supabase/migrations/0001_schema.sql` — tables, enum, indexes
2. `supabase/migrations/0002_rls.sql` — RLS (public SELECT only)
3. `supabase/seed/reuse_solutions_seed.sql` — 10 real seeded entries

Entries are created and edited by hand in the Supabase Table Editor. The schema
is intentionally Table-Editor-friendly. Public write is disabled by RLS; writes
happen with the service role via the dashboard.

## 3. Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/reuse`.

## 4. Where to edit copy and taxonomy

Everything editable in one place: `src/lib/taxonomy.ts`
(categories + pin colors, sub-categories, natures of service, affiliations,
countries, helper tooltip descriptions, and page copy). Helper descriptions are
scaffolded as empty strings with `// TODO` — fill them and the filter tooltips
update automatically.

## 5. Category images

Drop 5 real images into `public/defaults/` named by category slug
(`packaging-reuse`, `refill`, `product-reuse`, `reusable-product-alternatives`,
`transfer-based-reuse`). Colored SVG placeholders are shipped until then. A per-row
image can also be set via `directories.details.image_url`.

## Design tokens

Defined as CSS variables in `src/app/globals.css` and mapped in
`tailwind.config.ts` (navy / gold / green / cream, verification chips, radii).
