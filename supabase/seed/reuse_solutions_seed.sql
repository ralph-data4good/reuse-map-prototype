-- ============================================================================
-- Zero Waste Asia — Reuse Solutions: cleaned seed data (10 entries)
-- Assumes the schema from cursor_prompt_reuse_microsite_map.md already exists:
--   countries, directory_groups, directory_types, directory_locations,
--   directories, directory_reuse_details, and the verification_status enum.
-- Idempotent: explicit UUIDs + ON CONFLICT DO NOTHING, safe to re-run.
--
-- CLEANING APPLIED (source -> canonical):
--   * Trimmed trailing whitespace ("Packaging Reuse " -> "Packaging Reuse")
--   * "Refill Systems"            -> category "Refill"
--   * "Secondary Circulation Systems" (category + sub) -> "Second-hand Reuse"
--        with sub-category "Second-hand Reuse Systems"
--   * "Neighbourhood Refill Station/ Store" (nature) -> "Running Refill Station/ Store"
--   * "Collection to enable product reuse" -> "Collection Service to enable product reuse"
--   * "initative" typo -> "initiative"
--   * "hygenic" typo -> "hygienic"; "tech enabled" -> "tech-enabled"
--   * Collapsed the newline inside "Shenzhen KuaiPin Information Technology Co"
--
-- FLAGGED INFERENCES (verify these — marked with  <<VERIFY  below):
--   * Entry 2 (Shenzhen KuaiPin): source city was blank; inferred "Shenzhen".
--   * Entry 3 (Recube): source city blank; used "Hong Kong" (city-territory).
--   * Entry 7 (irefill): source city "Various cities"; pin placed at Bengaluru
--        as a placeholder so it renders. Not a confirmed HQ.
--   * has_physical_location: set true for store/station types, false for pure
--        operators / tech providers (Alner, Shenzhen, Recube, irefill, Unilever,
--        Hepi, KKPKP). Adjust to taste.
--   * last_updated / created_at set to now(); source had no dates.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Countries used (8 of the 50)
-- ---------------------------------------------------------------------------
insert into countries (id, name, iso2) values
  ('c1000000-0000-4000-8000-000000000001', 'Indonesia',   'ID'),
  ('c1000000-0000-4000-8000-000000000002', 'China',       'CN'),
  ('c1000000-0000-4000-8000-000000000003', 'Hong Kong',   'HK'),
  ('c1000000-0000-4000-8000-000000000004', 'Thailand',    'TH'),
  ('c1000000-0000-4000-8000-000000000005', 'Vietnam',     'VN'),
  ('c1000000-0000-4000-8000-000000000006', 'Philippines', 'PH'),
  ('c1000000-0000-4000-8000-000000000007', 'India',       'IN'),
  ('c1000000-0000-4000-8000-000000000008', 'Bangladesh',  'BD')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Directory group: Reuse Solutions
-- ---------------------------------------------------------------------------
insert into directory_groups (id, name, description, slug) values
  ('90000000-0000-4000-8000-000000000001',
   'Reuse Solutions',
   'Directory of reuse, refill, and second-hand solutions across Asia-Pacific.',
   'reuse-solutions')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Directory types = the 5 Reuse Framework Categories (drive pin colors)
-- ---------------------------------------------------------------------------
insert into directory_types (id, group_id, name, description, slug) values
  ('d1000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000001',
   'Packaging Reuse', '', 'packaging-reuse'),
  ('d1000000-0000-4000-8000-000000000002', '90000000-0000-4000-8000-000000000001',
   'Refill', '', 'refill'),
  ('d1000000-0000-4000-8000-000000000003', '90000000-0000-4000-8000-000000000001',
   'Product Reuse', '', 'product-reuse'),
  ('d1000000-0000-4000-8000-000000000004', '90000000-0000-4000-8000-000000000001',
   'Use of Reusable Product Alternatives', '', 'reusable-product-alternatives'),
  ('d1000000-0000-4000-8000-000000000005', '90000000-0000-4000-8000-000000000001',
   'Second-hand Reuse', '', 'second-hand-reuse')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 4. Locations (one pin per entry). directory_locations.directory_id is a
--    back-reference; insert locations first, then directories point to them.
-- ---------------------------------------------------------------------------
insert into directory_locations
  (id, directory_id, city, province, country_id, latitude, longitude) values
  ('ba000000-0000-4000-8000-000000000001','da000000-0000-4000-8000-000000000001',
     'Greater Jakarta', null, 'c1000000-0000-4000-8000-000000000001', -6.2088, 106.8456),
  ('ba000000-0000-4000-8000-000000000002','da000000-0000-4000-8000-000000000002',
     'Shenzhen', null, 'c1000000-0000-4000-8000-000000000002', 22.5431, 114.0579),   -- <<VERIFY city inferred
  ('ba000000-0000-4000-8000-000000000003','da000000-0000-4000-8000-000000000003',
     'Hong Kong', null, 'c1000000-0000-4000-8000-000000000003', 22.3193, 114.1694),  -- <<VERIFY city inferred
  ('ba000000-0000-4000-8000-000000000004','da000000-0000-4000-8000-000000000004',
     'Bangkok', null, 'c1000000-0000-4000-8000-000000000004', 13.7563, 100.5018),
  ('ba000000-0000-4000-8000-000000000005','da000000-0000-4000-8000-000000000005',
     'Hoi An', null, 'c1000000-0000-4000-8000-000000000005', 15.8801, 108.3380),
  ('ba000000-0000-4000-8000-000000000006','da000000-0000-4000-8000-000000000006',
     'Manila', null, 'c1000000-0000-4000-8000-000000000006', 14.5995, 120.9842),
  ('ba000000-0000-4000-8000-000000000007','da000000-0000-4000-8000-000000000007',
     'Various cities', null, 'c1000000-0000-4000-8000-000000000007', 12.9716, 77.5946), -- <<VERIFY pin=Bengaluru placeholder
  ('ba000000-0000-4000-8000-000000000008','da000000-0000-4000-8000-000000000008',
     'Dhaka', null, 'c1000000-0000-4000-8000-000000000008', 23.8103, 90.4125),
  ('ba000000-0000-4000-8000-000000000009','da000000-0000-4000-8000-000000000009',
     'Jakarta', null, 'c1000000-0000-4000-8000-000000000001', -6.2088, 106.8456),
  ('ba000000-0000-4000-8000-000000000010','da000000-0000-4000-8000-000000000010',
     'Pune', null, 'c1000000-0000-4000-8000-000000000007', 18.5204, 73.8567)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 5. Directories. name = Solution (cleaned). directory_type_id = primary category.
-- ---------------------------------------------------------------------------
insert into directories
  (id, name, description, directory_type_id, directory_location_id, slug,
   status, published_at, verification_status, verification_status_source,
   has_physical_location, created_at, updated_at) values

  ('da000000-0000-4000-8000-000000000001',
   'Reuse and Refill System for consumer goods in Indonesia', null,
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000001',
   'alner', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000002',
   'Reusable Takeaway Container for university in China', null,
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000002',
   'shenzhen-kuaipin', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000003',
   'Takeaway Reuse System for restaurants in Hong Kong', null,
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000003',
   'recube', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000004',
   'Water Refilling Stations in Bangkok', null,
   'd1000000-0000-4000-8000-000000000002', 'ba000000-0000-4000-8000-000000000004',
   'bangkok-water-refill', 'published', now(), 'partner_verified', 'GAIA AP', true, now(), now()),

  ('da000000-0000-4000-8000-000000000005',
   'Providing hygienic refill for grocery staples through refill store', null,
   'd1000000-0000-4000-8000-000000000002', 'ba000000-0000-4000-8000-000000000005',
   'refillables-dong-day', 'published', now(), 'partner_verified', 'GAIA AP', true, now(), now()),

  ('da000000-0000-4000-8000-000000000006',
   'Providing hygienic refill for grocery staples through refill store', null,
   'd1000000-0000-4000-8000-000000000002', 'ba000000-0000-4000-8000-000000000006',
   'back2basics', 'published', now(), 'partner_verified', 'GAIA AP', true, now(), now()),

  ('da000000-0000-4000-8000-000000000007',
   'Providing hygienic refill for FMCG through tech-enabled refill dispensers for retailers and micro-retailers in India', null,
   'd1000000-0000-4000-8000-000000000002', 'ba000000-0000-4000-8000-000000000007',
   'irefill', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000008',
   'Providing hygienic refill for FMCG through tech-enabled refill dispensers for retailers and micro-retailers in Bangladesh', null,
   'd1000000-0000-4000-8000-000000000002', 'ba000000-0000-4000-8000-000000000008',
   'unilever-smartfill', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000009',
   'Reuse Packaging System for consumer goods in Indonesia', null,
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000009',
   'hepi-circle', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000010',
   'V-Collect: Collection of high quality but non-usable goods for resale by wastepickers in Pune', null,
   'd1000000-0000-4000-8000-000000000005', 'ba000000-0000-4000-8000-000000000010',
   'kkpkp-vcollect', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now())
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 6. Reuse-specific details (1:1 with directory). Multi-value fields as arrays.
--    reuse_framework_categories mirrors the category column (may hold >1 later).
-- ---------------------------------------------------------------------------
insert into directory_reuse_details
  (directory_id, service_provider_name, reuse_framework_categories, sub_categories,
   natures_of_service, affiliations, operating_countries, last_updated) values

  ('da000000-0000-4000-8000-000000000001', 'Alner',
   array['Packaging Reuse'],
   array['Pre-filled Reuse Systems','Onsite Refill System'],
   array['Packaging Reuse System Operator'],
   array['Social Enterprise'],
   array['Indonesia'], now()),

  ('da000000-0000-4000-8000-000000000002', 'Shenzhen KuaiPin Information Technology Co',
   array['Packaging Reuse'],
   array['Takeaway & Delivery Reuse Systems'],
   array['Packaging Reuse System Operator'],
   array['Social Enterprise'],
   array['China'], now()),

  ('da000000-0000-4000-8000-000000000003', 'Recube',
   array['Packaging Reuse'],
   array['Takeaway & Delivery Reuse Systems'],
   array['Packaging Reuse System Operator'],
   array['Social Enterprise'],
   array['Hong Kong'], now()),

  ('da000000-0000-4000-8000-000000000004', 'Bangkok Metropolitan Authority',
   array['Refill'],
   array['Onsite Refill System'],
   array['Running Refill Station/ Store'],
   array['Local government'],
   array['Thailand'], now()),

  ('da000000-0000-4000-8000-000000000005', 'Refillables Dong Day',
   array['Refill'],
   array['Onsite Refill System'],
   array['Running Refill Station/ Store'],       -- was "Neighbourhood Refill Station/ Store"
   array['Social Enterprise'],
   array['Vietnam'], now()),

  ('da000000-0000-4000-8000-000000000006', 'Back2Basics',
   array['Refill'],
   array['Onsite Refill System'],
   array['Running Refill Station/ Store'],       -- was "Neighbourhood Refill Station/ Store"
   array[]::text[],                              -- affiliation blank in source
   array['Philippines'], now()),

  ('da000000-0000-4000-8000-000000000007', 'irefill',
   array['Refill'],
   array['Onsite Refill System'],
   array['Technology Provider- Dispenser'],
   array[]::text[],
   array['India'], now()),

  ('da000000-0000-4000-8000-000000000008', 'Unilever & Smartfill',
   array['Refill'],
   array['Onsite Refill System'],
   array['Technology Provider- Dispenser'],
   array[]::text[],
   array['Bangladesh'], now()),

  ('da000000-0000-4000-8000-000000000009', 'Hepi Circle',
   array['Packaging Reuse'],
   array['Pre-filled Reuse Systems'],
   array['Packaging Reuse System Operator'],
   array['Social Enterprise'],
   array['Indonesia'], now()),

  ('da000000-0000-4000-8000-000000000010', 'KKPKP: Wastepicker collective of Pune',
   array['Second-hand Reuse'],                   -- was "Secondary Circulation Systems"
   array['Second-hand Reuse Systems'],           -- was "Secondary Circulation Systems"
   array['Collection Service to enable product reuse'], -- was "Collection to enable product reuse"
   array['Waste Picker or wastepicker union led initiative'], -- "initative" typo fixed
   array['India'], now())
on conflict (directory_id) do nothing;

-- ---------------------------------------------------------------------------
-- 7. Verification: all entries partner-verified by GAIA AP.
--    Runs on every load (idempotent) so it also fixes rows that already
--    existed when ON CONFLICT DO NOTHING skipped the inserts above.
-- ---------------------------------------------------------------------------
update directories d
set verification_status = 'partner_verified',
    verification_status_source = 'GAIA AP',
    verification_status_updated_at = now()
from directory_types dt
join directory_groups dg on dg.id = dt.group_id
where d.directory_type_id = dt.id
  and dg.slug = 'reuse-solutions';

commit;

-- ============================================================================
-- Quick verification query (optional):
--
-- select d.name, dt.name as category, drd.service_provider_name,
--        drd.sub_categories, drd.natures_of_service, l.city, c.name as country
-- from directories d
-- join directory_types dt on dt.id = d.directory_type_id
-- join directory_reuse_details drd on drd.directory_id = d.id
-- join directory_locations l on l.id = d.directory_location_id
-- join countries c on c.id = l.country_id
-- order by d.name;
-- ============================================================================
