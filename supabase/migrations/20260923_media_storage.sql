-- Médias Happy Learn : bucket Storage public + catalogue illustrations distant.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  52428800,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm'
  ]::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique des fichiers du bucket.
drop policy if exists "lecture publique media" on storage.objects;
create policy "lecture publique media"
  on storage.objects for select
  using (bucket_id = 'media');

-- Upload / update / delete réservés aux admins connectés.
drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and auth.uid() is not null
    and exists (
      select 1 from profils_enseignants p
      where p.user_id = auth.uid() and p.is_admin = true
    )
  );

drop policy if exists "admins update media" on storage.objects;
create policy "admins update media"
  on storage.objects for update
  using (
    bucket_id = 'media'
    and auth.uid() is not null
    and exists (
      select 1 from profils_enseignants p
      where p.user_id = auth.uid() and p.is_admin = true
    )
  );

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and auth.uid() is not null
    and exists (
      select 1 from profils_enseignants p
      where p.user_id = auth.uid() and p.is_admin = true
    )
  );

-- Métadonnées des illustrations (URL pointe vers Storage ou chemin site).
create table if not exists illustrations (
  id text primary key,
  label text not null,
  blurb text not null default '',
  image_url text not null,
  teacher_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists illustrations_updated_idx on illustrations (updated_at desc);

alter table illustrations enable row level security;

drop policy if exists "lecture illustrations" on illustrations;
create policy "lecture illustrations"
  on illustrations for select
  using (true);

drop policy if exists "admins gerent illustrations" on illustrations;
create policy "admins gerent illustrations"
  on illustrations for all
  using (
    exists (
      select 1 from profils_enseignants p
      where p.user_id = auth.uid() and p.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from profils_enseignants p
      where p.user_id = auth.uid() and p.is_admin = true
    )
  );
