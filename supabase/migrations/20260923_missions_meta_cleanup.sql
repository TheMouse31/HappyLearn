-- Studio missions : métadonnées (officiel, difficulté, thème programme)
-- + nettoyage de la table legacy `etapes` (remplacée par missions.steps jsonb).

-- ——— Colonnes catalogue ———
alter table missions
  add column if not exists official boolean not null default false;

alter table missions
  add column if not exists difficulty text not null default 'moyen';

alter table missions
  add column if not exists theme_id text;

-- Normalise les lignes existantes : non officielles, non publiées, difficulté moyenne.
update missions
set
  official = false,
  available = false,
  difficulty = coalesce(nullif(difficulty, ''), 'moyen')
where true;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'missions_difficulty_check'
  ) then
    alter table missions
      add constraint missions_difficulty_check
      check (difficulty in ('facile', 'moyen', 'difficile'));
  end if;
end $$;

create index if not exists missions_theme_idx on missions (theme_id);
create index if not exists missions_official_idx on missions (official, available);

-- ——— RLS admin (profils_enseignants.is_admin) ———
drop policy if exists "admins gerent toutes les missions" on missions;
create policy "admins gerent toutes les missions"
  on missions for all
  using (
    exists (
      select 1
      from profils_enseignants p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from profils_enseignants p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

-- Lecture : missions publiées, builtins, propres, ou admin.
drop policy if exists "lecture missions disponibles" on missions;
create policy "lecture missions disponibles"
  on missions for select
  using (
    available = true
    or source = 'builtin'
    or teacher_id = auth.uid()
    or exists (
      select 1
      from profils_enseignants p
      where p.user_id = auth.uid()
        and p.is_admin = true
    )
  );

-- ——— Nettoyage legacy ———
-- `etapes` n’est plus lue par l’app (contenu dans missions.steps).
-- `reponses.etape_id` reste un texte libre (pas de FK vers etapes).
drop policy if exists "lecture publique etapes" on etapes;
drop table if exists etapes cascade;
