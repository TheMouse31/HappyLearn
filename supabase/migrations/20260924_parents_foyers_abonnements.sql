-- Comptes parents, foyers, enfants légers, abonnements.

create extension if not exists pgcrypto;

-- Profils unifiés (parent | enseignant | admin). Les enseignants historiques
-- restent aussi dans profils_enseignants (dual-write côté app).
create table if not exists profils_utilisateurs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('parent', 'enseignant', 'admin')),
  display_name text,
  created_at timestamptz not null default now()
);

create index if not exists profils_utilisateurs_role_idx on profils_utilisateurs (role);

insert into profils_utilisateurs (user_id, role, display_name, created_at)
select
  p.user_id,
  case when coalesce(p.is_admin, false) then 'admin' else 'enseignant' end,
  p.display_name,
  p.created_at
from profils_enseignants p
on conflict (user_id) do nothing;

alter table profils_utilisateurs enable row level security;

drop policy if exists "profils_utilisateurs select own" on profils_utilisateurs;
create policy "profils_utilisateurs select own"
  on profils_utilisateurs for select
  using (auth.uid() = user_id);

drop policy if exists "profils_utilisateurs insert own" on profils_utilisateurs;
create policy "profils_utilisateurs insert own"
  on profils_utilisateurs for insert
  with check (auth.uid() = user_id);

drop policy if exists "profils_utilisateurs update own" on profils_utilisateurs;
create policy "profils_utilisateurs update own"
  on profils_utilisateurs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Lecture admin de tous les profils (pour grants).
drop policy if exists "profils_utilisateurs select admin" on profils_utilisateurs;
create policy "profils_utilisateurs select admin"
  on profils_utilisateurs for select
  using (
    exists (
      select 1 from profils_enseignants pe
      where pe.user_id = auth.uid() and pe.is_admin = true
    )
  );

-- Foyers (maison).
create table if not exists foyers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  nom text not null default 'Ma famille',
  code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists foyers_owner_idx on foyers (owner_id);
create index if not exists foyers_code_idx on foyers (code);

alter table foyers enable row level security;

drop policy if exists "foyers select owner" on foyers;
create policy "foyers select owner"
  on foyers for select using (auth.uid() = owner_id);

drop policy if exists "foyers insert owner" on foyers;
create policy "foyers insert owner"
  on foyers for insert with check (auth.uid() = owner_id);

drop policy if exists "foyers update owner" on foyers;
create policy "foyers update owner"
  on foyers for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "foyers delete owner" on foyers;
create policy "foyers delete owner"
  on foyers for delete using (auth.uid() = owner_id);

-- Lecture publique du foyer par code (login enfant : liste prénoms sans PIN).
drop policy if exists "foyers select by code anon" on foyers;
create policy "foyers select by code anon"
  on foyers for select using (true);

-- Enfants du foyer (compte léger, PIN hashé).
create table if not exists eleves_foyer (
  id uuid primary key default gen_random_uuid(),
  foyer_id uuid not null references foyers (id) on delete cascade,
  prenom text not null,
  nom text not null default '',
  pin_hash text not null,
  niveau text,
  created_at timestamptz not null default now(),
  constraint eleves_foyer_prenom_len check (char_length(trim(prenom)) between 1 and 40)
);

create index if not exists eleves_foyer_foyer_idx on eleves_foyer (foyer_id);

alter table eleves_foyer enable row level security;

drop policy if exists "eleves_foyer select owner" on eleves_foyer;
create policy "eleves_foyer select owner"
  on eleves_foyer for select
  using (
    exists (select 1 from foyers f where f.id = foyer_id and f.owner_id = auth.uid())
  );

drop policy if exists "eleves_foyer write owner" on eleves_foyer;
create policy "eleves_foyer write owner"
  on eleves_foyer for all
  using (
    exists (select 1 from foyers f where f.id = foyer_id and f.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from foyers f where f.id = foyer_id and f.owner_id = auth.uid())
  );

-- Liste publique (sans pin_hash) via vue.
create or replace view eleves_foyer_public as
select id, foyer_id, prenom, nom, niveau, created_at
from eleves_foyer;

grant select on eleves_foyer_public to anon, authenticated;

-- Liste enfants par code foyer (sans pin).
create or replace function list_eleves_by_foyer_code(p_code text)
returns table (
  id uuid,
  foyer_id uuid,
  prenom text,
  nom text,
  niveau text
)
language sql
security definer
set search_path = public
stable
as $$
  select e.id, e.foyer_id, e.prenom, e.nom, e.niveau
  from eleves_foyer e
  join foyers f on f.id = e.foyer_id
  where upper(trim(f.code)) = upper(trim(p_code));
$$;

grant execute on function list_eleves_by_foyer_code(text) to anon, authenticated;

-- RPC : valider PIN enfant (retourne l’enfant si OK).
create or replace function verify_eleve_foyer_pin(p_eleve_id uuid, p_pin text)
returns table (
  id uuid,
  foyer_id uuid,
  prenom text,
  nom text,
  niveau text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  expected text;
begin
  select e.pin_hash into expected from eleves_foyer e where e.id = p_eleve_id;
  if expected is null then
    return;
  end if;
  if expected <> encode(digest(convert_to(trim(p_pin), 'UTF8') || '|' || p_eleve_id::text, 'sha256'), 'hex')
     and expected <> encode(digest(convert_to(trim(p_pin), 'UTF8'), 'sha256'), 'hex') then
    return;
  end if;
  return query
    select e.id, e.foyer_id, e.prenom, e.nom, e.niveau
    from eleves_foyer e
    where e.id = p_eleve_id;
end;
$$;

grant execute on function verify_eleve_foyer_pin(uuid, text) to anon, authenticated;

-- Abonnements (enseignant ou foyer).
create table if not exists abonnements (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('enseignant', 'foyer')),
  subject_id uuid not null,
  plan text not null default 'premium' check (plan in ('premium')),
  status text not null default 'active'
    check (status in ('active', 'past_due', 'canceled', 'expired', 'trialing')),
  source text not null check (source in ('stripe', 'admin_grant', 'local')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  granted_by uuid references auth.users (id) on delete set null,
  granted_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_type, subject_id)
);

create index if not exists abonnements_subject_idx on abonnements (subject_type, subject_id);
create index if not exists abonnements_status_idx on abonnements (status);

alter table abonnements enable row level security;

drop policy if exists "abonnements select own teacher" on abonnements;
create policy "abonnements select own teacher"
  on abonnements for select
  using (
    (subject_type = 'enseignant' and subject_id = auth.uid())
    or (
      subject_type = 'foyer'
      and exists (select 1 from foyers f where f.id = subject_id and f.owner_id = auth.uid())
    )
    or exists (
      select 1 from profils_enseignants pe
      where pe.user_id = auth.uid() and pe.is_admin = true
    )
  );

drop policy if exists "abonnements admin write" on abonnements;
create policy "abonnements admin write"
  on abonnements for all
  using (
    exists (
      select 1 from profils_enseignants pe
      where pe.user_id = auth.uid() and pe.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from profils_enseignants pe
      where pe.user_id = auth.uid() and pe.is_admin = true
    )
  );

-- L’utilisateur peut créer/mettre à jour son propre abonnement (webhook service role bypass).
drop policy if exists "abonnements upsert own" on abonnements;
create policy "abonnements upsert own"
  on abonnements for insert
  with check (
    (subject_type = 'enseignant' and subject_id = auth.uid())
    or (
      subject_type = 'foyer'
      and exists (select 1 from foyers f where f.id = subject_id and f.owner_id = auth.uid())
    )
  );

drop policy if exists "abonnements update own" on abonnements;
create policy "abonnements update own"
  on abonnements for update
  using (
    (subject_type = 'enseignant' and subject_id = auth.uid())
    or (
      subject_type = 'foyer'
      and exists (select 1 from foyers f where f.id = subject_id and f.owner_id = auth.uid())
    )
  );

-- Sessions enfant : lien foyer maison.
alter table sessions_enfant
  add column if not exists foyer_id uuid references foyers (id) on delete set null;

alter table sessions_enfant
  add column if not exists eleve_foyer_id uuid references eleves_foyer (id) on delete set null;

create index if not exists sessions_enfant_foyer_idx on sessions_enfant (foyer_id);
create index if not exists sessions_enfant_eleve_foyer_id_idx on sessions_enfant (eleve_foyer_id);
