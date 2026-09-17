-- Sessions de classe live (pilotées par le professeur) + roster nom/prénom.
-- MVP permissif côté élève (lecture session ouverte / join participant) :
-- à resserrer plus tard (ex. rate-limit, device attestation).

-- 1) Roster : ajouter le nom de famille
alter table eleves_classe
  add column if not exists nom text;

update eleves_classe set nom = '' where nom is null;

alter table eleves_classe
  alter column nom set default '',
  alter column nom set not null;

alter table eleves_classe
  drop constraint if exists eleves_classe_nom_len;

alter table eleves_classe
  add constraint eleves_classe_nom_len check (char_length(trim(nom)) between 0 and 40);

drop index if exists eleves_classe_unique_prenom;

create unique index if not exists eleves_classe_unique_prenom_nom
  on eleves_classe (class_id, lower(trim(prenom)), lower(trim(nom)));

-- 2) Session de classe éphémère
create table if not exists classe_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes (id) on delete cascade,
  code text not null unique,
  statut text not null default 'ouverte'
    check (statut in ('ouverte', 'fermee')),
  niveau text,
  matiere text,
  mission_id text,
  univers text,
  mode text,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists classe_sessions_class_idx on classe_sessions (class_id);
create index if not exists classe_sessions_code_idx on classe_sessions (code);

-- Une seule session ouverte par classe
create unique index if not exists classe_sessions_one_open
  on classe_sessions (class_id)
  where statut = 'ouverte';

-- 3) Présence + verrou de nom
create table if not exists session_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references classe_sessions (id) on delete cascade,
  eleve_id uuid not null references eleves_classe (id) on delete cascade,
  prenom text not null,
  nom text not null default '',
  device_id text not null,
  statut text not null default 'connecte'
    check (statut in ('connecte', 'deconnecte')),
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create unique index if not exists session_participants_session_eleve
  on session_participants (session_id, eleve_id);

create index if not exists session_participants_session_idx
  on session_participants (session_id);

create index if not exists session_participants_device_idx
  on session_participants (device_id);

-- 4) Lien des séances de jeu vers classe / session live / mission
alter table sessions_enfant
  add column if not exists class_id uuid references classes (id) on delete set null;

alter table sessions_enfant
  add column if not exists classe_session_id uuid references classe_sessions (id) on delete set null;

alter table sessions_enfant
  add column if not exists eleve_id uuid references eleves_classe (id) on delete set null;

alter table sessions_enfant
  add column if not exists mission_id text;

create index if not exists sessions_enfant_class_idx on sessions_enfant (class_id);
create index if not exists sessions_enfant_classe_session_idx on sessions_enfant (classe_session_id);
create index if not exists sessions_enfant_eleve_idx on sessions_enfant (eleve_id);
create index if not exists sessions_enfant_mission_idx on sessions_enfant (mission_id);

-- 5) RLS
alter table classe_sessions enable row level security;
alter table session_participants enable row level security;

drop policy if exists "lecture sessions classe" on classe_sessions;
create policy "lecture sessions classe"
  on classe_sessions for select using (true);

drop policy if exists "enseignants creent sessions de leurs classes" on classe_sessions;
create policy "enseignants creent sessions de leurs classes"
  on classe_sessions for insert
  with check (
    exists (
      select 1 from classes
      where classes.id = classe_sessions.class_id
        and classes.teacher_id = auth.uid()
    )
  );

drop policy if exists "enseignants modifient sessions de leurs classes" on classe_sessions;
create policy "enseignants modifient sessions de leurs classes"
  on classe_sessions for update
  using (
    exists (
      select 1 from classes
      where classes.id = classe_sessions.class_id
        and classes.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from classes
      where classes.id = classe_sessions.class_id
        and classes.teacher_id = auth.uid()
    )
  );

drop policy if exists "enseignants suppriment sessions de leurs classes" on classe_sessions;
create policy "enseignants suppriment sessions de leurs classes"
  on classe_sessions for delete
  using (
    exists (
      select 1 from classes
      where classes.id = classe_sessions.class_id
        and classes.teacher_id = auth.uid()
    )
  );

drop policy if exists "lecture participants session" on session_participants;
create policy "lecture participants session"
  on session_participants for select using (true);

-- MVP : insert/update participant ouvert côté élève (verrou/reconnexion).
drop policy if exists "eleves rejoignent une session" on session_participants;
create policy "eleves rejoignent une session"
  on session_participants for insert
  with check (
    exists (
      select 1 from classe_sessions
      where classe_sessions.id = session_participants.session_id
        and classe_sessions.statut = 'ouverte'
    )
  );

drop policy if exists "eleves mettent a jour leur presence" on session_participants;
create policy "eleves mettent a jour leur presence"
  on session_participants for update
  using (true)
  with check (true);

drop policy if exists "enseignants excluent participants" on session_participants;
create policy "enseignants excluent participants"
  on session_participants for delete
  using (
    exists (
      select 1
      from classe_sessions
      join classes on classes.id = classe_sessions.class_id
      where classe_sessions.id = session_participants.session_id
        and classes.teacher_id = auth.uid()
    )
  );

-- 6) Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'classe_sessions'
  ) then
    alter publication supabase_realtime add table classe_sessions;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'session_participants'
  ) then
    alter publication supabase_realtime add table session_participants;
  end if;
end $$;
