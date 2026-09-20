-- Catalogue de missions multi-matières (document JSON par mission).
-- Remplace l'usage runtime de la table legacy `etapes` (ids globaux).

create table if not exists missions (
  id text primary key,
  grade text not null,
  subject text not null,
  title text not null,
  blurb text not null default '',
  available boolean not null default false,
  steps jsonb not null default '[]'::jsonb,
  version integer not null default 1,
  source text not null default 'teacher'
    check (source in ('builtin', 'teacher')),
  teacher_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint missions_id_format check (
    id ~ '^(cp|ce1|ce2|cm1|cm2)-[a-z0-9-]+-[a-z0-9]+(-[a-z0-9]+)*-[0-9]{2}$'
  )
);

create index if not exists missions_grade_subject_idx
  on missions (grade, subject, available);

create index if not exists missions_teacher_idx
  on missions (teacher_id);

alter table missions enable row level security;

drop policy if exists "lecture missions disponibles" on missions;
create policy "lecture missions disponibles"
  on missions for select
  using (
    available = true
    or source = 'builtin'
    or teacher_id = auth.uid()
  );

drop policy if exists "enseignants creent leurs missions" on missions;
create policy "enseignants creent leurs missions"
  on missions for insert
  with check (
    source = 'teacher'
    and teacher_id = auth.uid()
  );

drop policy if exists "enseignants modifient leurs missions" on missions;
create policy "enseignants modifient leurs missions"
  on missions for update
  using (source = 'teacher' and teacher_id = auth.uid())
  with check (source = 'teacher' and teacher_id = auth.uid());

drop policy if exists "enseignants suppriment leurs missions" on missions;
create policy "enseignants suppriment leurs missions"
  on missions for delete
  using (source = 'teacher' and teacher_id = auth.uid());
