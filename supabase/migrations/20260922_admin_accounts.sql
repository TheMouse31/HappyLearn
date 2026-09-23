-- Administrateurs : flag sur le profil enseignant
alter table profils_enseignants
  add column if not exists is_admin boolean not null default false;

-- Seed : si le compte test@test.fr existe, le marquer admin
update profils_enseignants p
set is_admin = true
from auth.users u
where p.user_id = u.id
  and lower(u.email) = 'test@test.fr';
