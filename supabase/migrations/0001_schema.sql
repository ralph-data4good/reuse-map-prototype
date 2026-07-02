-- ============================================================================
-- Zero Waste Asia — Reuse Solutions: base directory schema + reuse extension.
-- Mirrors the ZWA directory data model so this microsite stays portable.
-- Run this first, then 0002_rls.sql, then ../seed/reuse_solutions_seed.sql.
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- 2.1 Enum -------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'verification_status') then
    create type verification_status as enum ('unverified', 'staff_verified', 'partner_verified');
  end if;
end $$;

-- 2.2 Base tables ------------------------------------------------------------
create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  iso2 text,
  created_at timestamptz default now()
);

create table if not exists directory_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists directory_types (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references directory_groups(id),
  name text not null,
  description text,
  slug text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- directory_locations.directory_id is a back-reference to directories.
-- directories.directory_location_id points the other way. To avoid a
-- circular-insert problem in seeds, the FK from locations -> directories is
-- created deferrable initially deferred, and directory_location_id is set
-- after both rows exist. Neither side is hard-required at insert time.
create table if not exists directory_locations (
  id uuid primary key default gen_random_uuid(),
  directory_id uuid,
  address_line_1 text,
  city text,
  province text,
  country_id uuid references countries(id),
  latitude float8,
  longitude float8,
  post_code text,
  barangay text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists directories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  directory_type_id uuid references directory_types(id),
  added_by_id uuid,
  status text default 'published',
  published_at timestamptz,
  details jsonb default '{}'::jsonb,
  slug text,
  directory_location_id uuid references directory_locations(id),
  updated_by_id uuid,
  deleted_at timestamptz,
  verification_status verification_status default 'unverified',
  verification_status_source text,
  verification_status_updated_at timestamptz,
  verification_org_id uuid,
  verification_metadata jsonb,
  has_physical_location bool default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Deferrable back-reference FK (added after directories exists).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'directory_locations_directory_id_fkey'
  ) then
    alter table directory_locations
      add constraint directory_locations_directory_id_fkey
      foreign key (directory_id) references directories(id)
      deferrable initially deferred;
  end if;
end $$;

-- 2.3 Reuse extension table (1:1 with a directory) ---------------------------
create table if not exists directory_reuse_details (
  directory_id uuid primary key references directories(id) on delete cascade,
  service_provider_name text,
  reuse_framework_categories text[] default '{}',
  sub_categories text[] default '{}',
  natures_of_service text[] default '{}',
  affiliations text[] default '{}',
  operating_countries text[] default '{}',
  last_updated timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- GIN indexes for the array columns used in filtering.
create index if not exists idx_reuse_categories
  on directory_reuse_details using gin (reuse_framework_categories);
create index if not exists idx_reuse_natures
  on directory_reuse_details using gin (natures_of_service);
create index if not exists idx_reuse_operating_countries
  on directory_reuse_details using gin (operating_countries);

-- Helpful lookup indexes.
create index if not exists idx_directories_type on directories (directory_type_id);
create index if not exists idx_directories_location on directories (directory_location_id);
create index if not exists idx_locations_country on directory_locations (country_id);
