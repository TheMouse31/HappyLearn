-- Liste nominative des élèves par classe (saisie par l'enseignant).
-- Les élèves avec un code classe choisissent leur prénom dans cette liste.

create table if not exists eleves_classe (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes (id) on delete cascade,
  prenom text not null,
  created_at timestamptz not null default now(),
  constraint eleves_classe_prenom_len check (char_length(trim(prenom)) between 1 and 20)
);

create index if not exists eleves_classe_class_idx on eleves_classe (class_id);

create unique index if not exists eleves_classe_unique_prenom
  on eleves_classe (class_id, lower(trim(prenom)));

alter table eleves_classe enable row level security;

-- Lecture publique : un élève avec le code doit pouvoir voir les prénoms pour se connecter.
create policy "lecture eleves classe"
  on eleves_classe for select using (true);

create policy "enseignants ajoutent eleves de leurs classes"
  on eleves_classe for insert
  with check (
    exists (
      select 1 from classes
      where classes.id = eleves_classe.class_id
        and classes.teacher_id = auth.uid()
    )
  );

create policy "enseignants modifient eleves de leurs classes"
  on eleves_classe for update
  using (
    exists (
      select 1 from classes
      where classes.id = eleves_classe.class_id
        and classes.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from classes
      where classes.id = eleves_classe.class_id
        and classes.teacher_id = auth.uid()
    )
  );

create policy "enseignants suppriment eleves de leurs classes"
  on eleves_classe for delete
  using (
    exists (
      select 1 from classes
      where classes.id = eleves_classe.class_id
        and classes.teacher_id = auth.uid()
    )
  );
