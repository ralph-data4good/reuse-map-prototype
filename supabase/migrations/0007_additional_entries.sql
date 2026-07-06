-- ============================================================================
-- Zero Waste Asia — Reuse Solutions: additional entries (batch 2, +9 entries)
-- Source: Updated_Data_Reuse_Microsite_260706.xlsx (2026-07-06).
-- Idempotent: explicit UUIDs + ON CONFLICT DO NOTHING, safe to re-run.
--
-- Also backfills the `description` column for entries whose descriptions were
-- added to the source sheet (existing rows Alner / Shenzhen / Recube / Bangkok
-- plus the new rows). Descriptions cleaned: smart quotes normalized, hard line
-- wraps from the sheet collapsed into single spaces.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. New country in scope
-- ---------------------------------------------------------------------------
insert into countries (id, name, iso2) values
  ('c1000000-0000-4000-8000-000000000009', 'Singapore', 'SG')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Locations for the new entries (one pin each)
-- ---------------------------------------------------------------------------
insert into directory_locations
  (id, directory_id, city, province, country_id, latitude, longitude) values
  ('ba000000-0000-4000-8000-000000000011','da000000-0000-4000-8000-000000000011',
     'Mumbai', 'Maharashtra', 'c1000000-0000-4000-8000-000000000007', 19.0760, 72.8777),
  ('ba000000-0000-4000-8000-000000000012','da000000-0000-4000-8000-000000000012',
     'Bangalore', null, 'c1000000-0000-4000-8000-000000000007', 12.9716, 77.5946),
  ('ba000000-0000-4000-8000-000000000013','da000000-0000-4000-8000-000000000013',
     'Gurugram', null, 'c1000000-0000-4000-8000-000000000007', 28.4595, 77.0266),
  ('ba000000-0000-4000-8000-000000000014','da000000-0000-4000-8000-000000000014',
     'Quezon City', null, 'c1000000-0000-4000-8000-000000000006', 14.6760, 121.0437),
  ('ba000000-0000-4000-8000-000000000015','da000000-0000-4000-8000-000000000015',
     'Central', null, 'c1000000-0000-4000-8000-000000000003', 22.2820, 114.1588),
  ('ba000000-0000-4000-8000-000000000016','da000000-0000-4000-8000-000000000016',
     'Metro Manila', null, 'c1000000-0000-4000-8000-000000000006', 14.5995, 120.9842),
  ('ba000000-0000-4000-8000-000000000017','da000000-0000-4000-8000-000000000017',
     'Singapore', null, 'c1000000-0000-4000-8000-000000000009', 1.3521, 103.8198),
  ('ba000000-0000-4000-8000-000000000018','da000000-0000-4000-8000-000000000018',
     'Bangalore', null, 'c1000000-0000-4000-8000-000000000007', 12.9716, 77.5946),
  ('ba000000-0000-4000-8000-000000000019','da000000-0000-4000-8000-000000000019',
     'Maharashtra', null, 'c1000000-0000-4000-8000-000000000007', 19.7515, 75.7139)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Directories (name = cleaned Solution; directory_type_id = primary category)
-- ---------------------------------------------------------------------------
insert into directories
  (id, name, description, directory_type_id, directory_location_id, slug,
   status, published_at, verification_status, verification_status_source,
   has_physical_location, created_at, updated_at) values

  ('da000000-0000-4000-8000-000000000011',
   'Reusable Cups for Events in India',
   'In this system, event attendees are encouraged to use and refill their cups, with strategically placed collection points across the venue to facilitate easy returns and close the loop. The required number of cups is calculated based on event size and expected losses. Washing is managed at a centralized facility to maintain strict hygiene standards. Clear communication is undertaken to ensure that attendees are aware of the reuse and return process, encouraging them to drop cups at designated points for efficient collection and reuse. Attendees receive a discount on alcoholic drinks each time they refill their cups, encouraging reuse throughout the event. On average, each cup is refilled over four times during single-day events, significantly reducing the need for disposable alternatives.',
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000011',
   'cupable', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000012',
   'End to End Reuse System for food containers for institutions and offices in India',
   'This model provides clients with a fresh supply of cleaned and sanitized service ware each morning, which is collected and replaced daily. With an end-to-end approach, Infinity Box collects reusable dishes, plates, and containers from clients, thoroughly washes and sterilizes them at centralized facilities, and redistributes them, ready for reuse. To enhance efficiency and minimize emissions, orders are grouped together, and deliveries are scheduled a day in advance to account for any logistical delays.',
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000012',
   'infinity-box', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000013',
   'Free Cutlery Renting Service for events in India',
   'The Crockery Bank for Everyone initiative follows a simple "Take-Use-Wash Dry-Return" model, providing easy access for all with no rental charges. The only requirement is that users return the crockery and cutlery in clean and dry condition. For large public gatherings, Crockery Bank encourages the practice of onsite washing to minimize stockkeeping of large quantities of tablewares. If any items are lost, users are responsible for covering the cost of replacements',
   'd1000000-0000-4000-8000-000000000003', 'ba000000-0000-4000-8000-000000000013',
   'crockery-bank', 'published', now(), 'partner_verified', 'GAIA AP', true, now(), now()),

  ('da000000-0000-4000-8000-000000000014',
   'Kuha Sa Tingi: Refill provision at Sari-sari stores (neighbourhood stores) in Manila',
   'The Kuha sa Tingi initiative aims to reduce plastic pollution by reviving the Filipino practice of buying small, quantities. By installing refilling stations in sari-sari stores (neighborhood shops) across various barangays in the Philippines, the project allows residents to purchase everyday items like dish soap, detergent, and fabric softener by refilling their own containers. While stores continue offering pre-packaged sachets to maintain income, the refillable option provides a more sustainable choice for consumers, cutting down single-use plastic waste.',
   'd1000000-0000-4000-8000-000000000002', 'ba000000-0000-4000-8000-000000000014',
   'kuha-sa-tingi', 'published', now(), 'partner_verified', 'GAIA AP', true, now(), now()),

  ('da000000-0000-4000-8000-000000000015',
   'Tableware Rental Service in Hong Kong', null,
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000015',
   'weuse', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000016',
   'Reusable packaging for takeaway', null,
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000016',
   'juana-zero-express', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000017',
   'Reusable Cups for Events in Singapore', null,
   'd1000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000017',
   'muuse', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000018',
   'Collection of high quality but non-usable clothing item for resale by wastepickers in Bangalore',
   null,
   'd1000000-0000-4000-8000-000000000005', 'ba000000-0000-4000-8000-000000000018',
   'wastepickers-bangalore', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now()),

  ('da000000-0000-4000-8000-000000000019',
   'Enabling access to reusable menstrual cups to women through government accredited Social Health Activist in urban and rural parts of Maharashtra (Sakhi)',
   'Field Health care workers are trained on using menstrual cups as an alternative to disposable sanitary pads. Women upon training are offered menstrual cup at a subsidised rate and once they become a user; they go door to door in their community to educate and provide easy access to women on using menstrual cups. This not only ensures that women are educated on its benefits and its usage but they also have easy option for access of menstrual cups, which are typically sold online.',
   'd1000000-0000-4000-8000-000000000004', 'ba000000-0000-4000-8000-000000000019',
   'rnisarg-sakhi', 'published', now(), 'partner_verified', 'GAIA AP', false, now(), now())
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 4. Reuse-specific details (1:1 with directory)
-- ---------------------------------------------------------------------------
insert into directory_reuse_details
  (directory_id, service_provider_name, reuse_framework_categories, sub_categories,
   natures_of_service, affiliations, operating_countries, last_updated) values

  ('da000000-0000-4000-8000-000000000011', 'Cupable',
   array['Packaging Reuse'],
   array['Onsite Reuse Systems'],
   array['Packaging Reuse System Operator'],
   array['Social Enterprise'],
   array['India'], now()),

  ('da000000-0000-4000-8000-000000000012', 'Infinity Box',
   array['Packaging Reuse'],
   array['Onsite Reuse Systems'],
   array['Packaging Reuse System Operator'],
   array['Social Enterprise'],
   array['India'], now()),

  ('da000000-0000-4000-8000-000000000013', 'Crockery bank for Everyone',
   array['Product Reuse'],
   array['Reusable Serveware Lending System'],
   array['Reusable Containers Provider'],
   array['Community led initiative'],
   array['India'], now()),

  ('da000000-0000-4000-8000-000000000014', 'Greenpeace Philippines, Innovation Catalyst & Local governments',
   array['Refill'],
   array['Onsite Refill System'],
   array['Supporting retailers to set up refill service'],
   array[]::text[],
   array['Philippines'], now()),

  ('da000000-0000-4000-8000-000000000015', 'WeUse',
   array['Packaging Reuse'],
   array['Takeaway & Delivery Reuse Systems'],
   array['Packaging Reuse System Operator'],
   array[]::text[],
   array['Hong Kong (China)'], now()),

  ('da000000-0000-4000-8000-000000000016', 'Juana Zero Express',
   array['Packaging Reuse'],
   array['Takeaway & Delivery Reuse Systems'],
   array['Reusable Containers Provider'],
   array['Social Enterprise'],
   array['Philippines'], now()),

  ('da000000-0000-4000-8000-000000000017', 'Muuse',
   array['Packaging Reuse'],
   array['Takeaway & Delivery Reuse Systems'],
   array['Packaging Reuse System Operator'],
   array['Social Enterprise'],
   array['Singapore'], now()),

  ('da000000-0000-4000-8000-000000000018', 'Wastepickers of Bangalore',
   array['Transfer-based Reuse'],
   array['Transfer-based Reuse Systems'],
   array['Collection Service to enable product reuse'],
   array['Waste Picker or wastepicker union led initiative'],
   array['India'], now()),

  ('da000000-0000-4000-8000-000000000019', 'RNisarg Foundation',
   array['Use of Reusable Product Alternatives'],
   array['User-Maintained Reusable Product Alternative'],
   array['Access to Reusable Product Alternatives'],
   array['Civil Society Organisation'],
   array['India'], now())
on conflict (directory_id) do nothing;

-- ---------------------------------------------------------------------------
-- 5. Backfill descriptions for existing entries now populated in the source.
--    Idempotent: only overwrites when the new value differs.
-- ---------------------------------------------------------------------------
update directories set description =
  'Alner''s returnable container system allows customers to buy products through their user-friendly online platforms (website, mobile app, messaging service, like Whatsapp) or from their extensive reseller network, including mom-and-pop stores and individual resellers. Post use, customers can either return the empty containers to the delivery staff during their next purchase or drop them off at their reseller locations. The empty containers are cleaned, sanitized, and refilled with fresh products at the reuse hub operated by Alner or sent back to their brand partners for replenishment.'
where id = 'da000000-0000-4000-8000-000000000001';

update directories set description =
  'ShuangTi, the smart dining brand of Shenzhen KuaiPin Information Technology Co., focuses on providing smart and intelligent solutions for dining and take-out scenarios across universities in China, allowing consumers to order food from restaurants through their application and food is delivered to the self-pickup cabinet designated by consumers in the order.'
where id = 'da000000-0000-4000-8000-000000000002';

update directories set description =
  'ReCube, which stands for Reuse x Reward x Reduce, is a social enterprise started in 2023, that provides reusable tableware rental services in partner restaurants, thus eliminating the need for disposable containers'
where id = 'da000000-0000-4000-8000-000000000003';

update directories set description =
  'In 2023, Environmental Justice Foundation launched the Bottle-Free Seas (BFS) project in collaboration with the Bangkok Metropolitan Administration (BMA) to decrease people''s dependence on single-use plastic bottles. The project installed water refilling stations in high-traffic areas across the country''s capital including parks, malls, and art centers. The stakeholders hosting water refilling stations in their facilities are trained to conduct regular maintenance and water testing to ensure that the equipment are working and the water is safe for drinking'
where id = 'da000000-0000-4000-8000-000000000004';

commit;
