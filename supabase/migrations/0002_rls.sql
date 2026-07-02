-- ============================================================================
-- Row Level Security: public READ ONLY. No public insert/update/delete.
-- Writes happen via the Supabase dashboard using the service role, which
-- bypasses RLS. Reference tables are readable so the UI can resolve joins.
-- ============================================================================

alter table countries enable row level security;
alter table directory_groups enable row level security;
alter table directory_types enable row level security;
alter table directory_locations enable row level security;
alter table directories enable row level security;
alter table directory_reuse_details enable row level security;

-- Reference/lookup tables: readable by anyone (no status/deleted columns).
drop policy if exists "public read countries" on countries;
create policy "public read countries" on countries for select using (true);

drop policy if exists "public read directory_groups" on directory_groups;
create policy "public read directory_groups" on directory_groups for select using (true);

drop policy if exists "public read directory_types" on directory_types;
create policy "public read directory_types" on directory_types for select using (true);

drop policy if exists "public read directory_locations" on directory_locations;
create policy "public read directory_locations" on directory_locations for select using (true);

-- Directories: only published, non-deleted rows are publicly visible.
drop policy if exists "public read published directories" on directories;
create policy "public read published directories" on directories
  for select using (status = 'published' and deleted_at is null);

-- Reuse details: readable (the parent directory visibility gates the join,
-- and these rows carry no sensitive data).
drop policy if exists "public read reuse details" on directory_reuse_details;
create policy "public read reuse details" on directory_reuse_details
  for select using (true);

-- NOTE: intentionally NO insert/update/delete policies for the anon/public role.
