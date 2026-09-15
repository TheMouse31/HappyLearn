-- Comptes enseignants (Supabase Auth) + codes classe pour les élèves.
-- Les élèves n'ont toujours pas d'e-mail : prénom / surnom + code optionnel.

create table if not exists profils_enseignants (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users (id) on delete cascade,
  nom text not null,
  code text not null unique,
  created_at timestamptz not null default now()
);

alter table sessions_enfant
  add column if not exists code_classe text;

create index if not exists sessions_enfant_code_idx on sessions_enfant (code_classe);
create index if not exists classes_teacher_idx on classes (teacher_id);

alter table profils_enseignants enable row level security;
alter table classes enable row level security;

create policy "enseignants lisent leur profil"
  on profils_enseignants for select using (auth.uid() = user_id);
create policy "enseignants ecrivent leur profil"
  on profils_enseignants for insert with check (auth.uid() = user_id);
create policy "enseignants maj leur profil"
  on profils_enseignants for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Le code classe est destiné au tableau : lecture possible pour valider l'entrée élève.
create policy "lecture codes classe" on classes for select using (true);
create policy "enseignants creent leurs classes"
  on classes for insert with check (auth.uid() = teacher_id);
create policy "enseignants modifient leurs classes"
  on classes for update using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);
create policy "enseignants suppriment leurs classes"
  on classes for delete using (auth.uid() = teacher_id);
