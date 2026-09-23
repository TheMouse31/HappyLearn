-- Stats plateforme (lecture agrégée pour l’espace admin)
create or replace function public.platform_usage_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'teachers', (select count(*)::int from profils_enseignants),
    'classes', (select count(*)::int from classes),
    'students', (select count(*)::int from eleves_classe),
    'childSessions', (select count(*)::int from sessions_enfant),
    'missionsCompleted', (select count(*)::int from sessions_enfant where recompense_obtenue = true),
    'liveSessionsOpen', (select count(*)::int from classe_sessions where statut = 'ouverte')
  ) into result;
  return result;
end;
$$;

revoke all on function public.platform_usage_stats() from public;
grant execute on function public.platform_usage_stats() to authenticated;
grant execute on function public.platform_usage_stats() to anon;
