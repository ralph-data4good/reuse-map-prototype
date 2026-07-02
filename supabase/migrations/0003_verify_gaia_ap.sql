-- ============================================================================
-- Mark all Reuse Solutions entries as partner-verified by GAIA AP.
-- The UI chip renders verification_status='partner_verified' + source as
-- "Verified by GAIA AP" (green chip), echoing ZWA's "Verified by YPBB".
-- Idempotent: safe to re-run.
-- ============================================================================

update directories d
set verification_status = 'partner_verified',
    verification_status_source = 'GAIA AP',
    verification_status_updated_at = now()
from directory_types dt
join directory_groups dg on dg.id = dt.group_id
where d.directory_type_id = dt.id
  and dg.slug = 'reuse-solutions';
