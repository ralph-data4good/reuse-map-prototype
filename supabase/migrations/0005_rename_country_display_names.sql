-- Canonical public display names for a few territories:
--   China     -> Mainland China
--   Hong Kong -> Hong Kong (China)
--   Taiwan    -> Taiwan (China)
-- Updates the countries table and the denormalized operating_countries arrays.
-- Idempotent: safe to run more than once. The app also normalizes these names
-- at the data layer, so this migration only keeps the stored data consistent.

update public.countries set name = 'Mainland China'     where name = 'China';
update public.countries set name = 'Hong Kong (China)'  where name = 'Hong Kong';
update public.countries set name = 'Taiwan (China)'     where name = 'Taiwan';

update public.directory_reuse_details
set operating_countries = array_replace(operating_countries, 'China', 'Mainland China')
where 'China' = any(operating_countries);

update public.directory_reuse_details
set operating_countries = array_replace(operating_countries, 'Hong Kong', 'Hong Kong (China)')
where 'Hong Kong' = any(operating_countries);

update public.directory_reuse_details
set operating_countries = array_replace(operating_countries, 'Taiwan', 'Taiwan (China)')
where 'Taiwan' = any(operating_countries);
