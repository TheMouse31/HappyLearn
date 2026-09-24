-- Multi-rôles : un même compte auth peut être parent + enseignant (+ admin).
-- `role` = rôle actif (dernier portail utilisé) ; `roles` = capacités.

alter table profils_utilisateurs
  add column if not exists roles text[] not null default '{}';

update profils_utilisateurs
set roles = array[role]::text[]
where coalesce(cardinality(roles), 0) = 0;

alter table profils_utilisateurs
  drop constraint if exists profils_utilisateurs_role_check;

alter table profils_utilisateurs
  add constraint profils_utilisateurs_role_check
  check (role in ('parent', 'enseignant', 'admin'));

alter table profils_utilisateurs
  drop constraint if exists profils_utilisateurs_roles_check;

alter table profils_utilisateurs
  add constraint profils_utilisateurs_roles_check
  check (roles <@ array['parent', 'enseignant', 'admin']::text[]);

create index if not exists profils_utilisateurs_roles_gin
  on profils_utilisateurs using gin (roles);
