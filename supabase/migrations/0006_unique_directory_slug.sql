-- Unique permalink slugs for published directory entries.
create unique index if not exists idx_directories_slug_unique
  on directories (slug)
  where slug is not null and deleted_at is null;
