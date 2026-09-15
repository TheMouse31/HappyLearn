-- Mission Maths — schéma MVP
-- Lecture publique du contenu pédagogique.
-- Écriture sessions / réponses / collection ouverte à la clé anon (documenté).
-- Aucune donnée sensible : prénom ou surnom uniquement.

create table if not exists univers (
  slug text primary key,
  nom text not null,
  recompense text not null
);

create table if not exists etapes (
  id text primary key,
  ordre integer not null,
  type text not null,
  savoir text,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists sessions_enfant (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  prenom text not null,
  univers text not null references univers (slug),
  mode text not null check (mode in ('cahier', 'qcm')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  recompense_obtenue boolean not null default false
);

create table if not exists reponses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions_enfant (id) on delete cascade,
  etape_id text not null,
  brut text not null,
  correct boolean not null,
  attempts integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists collection (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  session_id uuid references sessions_enfant (id) on delete set null,
  univers text not null references univers (slug),
  recompense text not null,
  obtained_at timestamptz not null default now(),
  unique (device_id, univers)
);

create index if not exists sessions_enfant_device_idx on sessions_enfant (device_id);
create index if not exists reponses_session_idx on reponses (session_id);
create index if not exists collection_device_idx on collection (device_id);

alter table univers enable row level security;
alter table etapes enable row level security;
alter table sessions_enfant enable row level security;
alter table reponses enable row level security;
alter table collection enable row level security;

create policy "lecture publique univers" on univers for select using (true);
create policy "lecture publique etapes" on etapes for select using (true);

-- MVP : l'enfant n'a pas de compte. La clé anon peut écrire les traces de séance.
-- À resserrer plus tard (code classe, enseignant).
create policy "insert sessions mvp" on sessions_enfant for insert with check (true);
create policy "update sessions mvp" on sessions_enfant for update using (true) with check (true);
create policy "select sessions mvp" on sessions_enfant for select using (true);

create policy "insert reponses mvp" on reponses for insert with check (true);
create policy "select reponses mvp" on reponses for select using (true);

create policy "insert collection mvp" on collection for insert with check (true);
create policy "update collection mvp" on collection for update using (true) with check (true);
create policy "select collection mvp" on collection for select using (true);
