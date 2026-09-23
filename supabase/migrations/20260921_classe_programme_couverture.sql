-- Couverture du programme par classe (thèmes traités hors appli).

create table if not exists classe_programme_couverture (
  class_id uuid not null references classes (id) on delete cascade,
  theme_id text not null,
  covered_in_class boolean not null default false,
  covered_at timestamptz,
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (class_id, theme_id)
);

create index if not exists classe_programme_couverture_class_idx
  on classe_programme_couverture (class_id);

alter table classe_programme_couverture enable row level security;

drop policy if exists "enseignants lisent couverture de leurs classes" on classe_programme_couverture;
create policy "enseignants lisent couverture de leurs classes"
  on classe_programme_couverture for select
  using (
    exists (
      select 1 from classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  );

drop policy if exists "enseignants ecrivent couverture de leurs classes" on classe_programme_couverture;
create policy "enseignants ecrivent couverture de leurs classes"
  on classe_programme_couverture for insert
  with check (
    exists (
      select 1 from classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  );

drop policy if exists "enseignants modifient couverture de leurs classes" on classe_programme_couverture;
create policy "enseignants modifient couverture de leurs classes"
  on classe_programme_couverture for update
  using (
    exists (
      select 1 from classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  );

drop policy if exists "enseignants suppriment couverture de leurs classes" on classe_programme_couverture;
create policy "enseignants suppriment couverture de leurs classes"
  on classe_programme_couverture for delete
  using (
    exists (
      select 1 from classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  );
