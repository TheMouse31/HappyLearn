-- Stats avancées : indices ouverts + métadonnées QCM sur les réponses.

alter table reponses
  add column if not exists hint_used boolean not null default false;

alter table reponses
  add column if not exists qcm_option_count integer;

comment on column reponses.hint_used is
  'True si l’élève a ouvert un indice avant cette tentative.';
comment on column reponses.qcm_option_count is
  'Nombre de propositions affichées (QCM) au moment de la tentative ; null hors QCM.';

create table if not exists session_hints (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions_enfant (id) on delete cascade,
  etape_id text not null,
  opened_at timestamptz not null default now()
);

create index if not exists session_hints_session_idx on session_hints (session_id);
create index if not exists session_hints_session_step_idx on session_hints (session_id, etape_id);

alter table session_hints enable row level security;

drop policy if exists "insert session_hints mvp" on session_hints;
create policy "insert session_hints mvp" on session_hints for insert with check (true);

drop policy if exists "select session_hints mvp" on session_hints;
create policy "select session_hints mvp" on session_hints for select using (true);
