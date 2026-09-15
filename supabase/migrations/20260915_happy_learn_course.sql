-- Niveau et matière pour Happy Learn (catalogue CP–CM2, matières du primaire).
alter table public.sessions_enfant
  add column if not exists niveau text,
  add column if not exists matiere text;

alter table public.sessions_enfant
  drop constraint if exists sessions_enfant_niveau_check;
alter table public.sessions_enfant
  add constraint sessions_enfant_niveau_check
  check (niveau is null or niveau in ('cp', 'ce1', 'ce2', 'cm1', 'cm2'));

alter table public.sessions_enfant
  drop constraint if exists sessions_enfant_matiere_check;
alter table public.sessions_enfant
  add constraint sessions_enfant_matiere_check
  check (
    matiere is null
    or matiere in (
      'francais',
      'maths',
      'questionner-le-monde',
      'histoire-geo',
      'sciences',
      'emc',
      'anglais',
      'eps',
      'arts-plastiques',
      'education-musicale'
    )
  );
