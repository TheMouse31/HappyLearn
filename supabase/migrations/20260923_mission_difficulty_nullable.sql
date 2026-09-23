-- Difficulté optionnelle (vide / NULL autorisé).
-- Remet toutes les missions sans difficulté pour le moment.

alter table missions
  alter column difficulty drop not null;

alter table missions
  alter column difficulty set default null;

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'missions_difficulty_check'
  ) then
    alter table missions drop constraint missions_difficulty_check;
  end if;
end $$;

alter table missions
  add constraint missions_difficulty_check
  check (
    difficulty is null
    or difficulty in ('facile', 'moyen', 'difficile')
  );

update missions set difficulty = null where true;
