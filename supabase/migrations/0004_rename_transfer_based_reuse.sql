-- Rename the reuse category "Second-hand Reuse" to "Transfer-based Reuse"
-- (matching the canonical GAIA taxonomy in the tooltip CSV). Updates the
-- directory type (display name + slug) and the denormalized arrays on
-- directory_reuse_details. Idempotent: safe to run more than once.

update public.directory_types
set name = 'Transfer-based Reuse',
    slug = 'transfer-based-reuse'
where name = 'Second-hand Reuse';

update public.directory_reuse_details
set reuse_framework_categories =
      array_replace(reuse_framework_categories, 'Second-hand Reuse', 'Transfer-based Reuse')
where 'Second-hand Reuse' = any(reuse_framework_categories);

update public.directory_reuse_details
set sub_categories =
      array_replace(sub_categories, 'Second-hand Reuse Systems', 'Transfer-based Reuse Systems')
where 'Second-hand Reuse Systems' = any(sub_categories);
