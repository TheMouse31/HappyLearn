insert into univers (slug, nom, recompense) values
  ('football', 'Football', 'Coupe du match'),
  ('rugby', 'Rugby', 'Coupe de l’essai'),
  ('equitation', 'Équitation', 'Fer d’or'),
  ('espace', 'Espace', 'Insigne orbital')
on conflict (slug) do update set nom = excluded.nom, recompense = excluded.recompense;

-- Le contenu pédagogique vit dans `missions` (jsonb steps), synchronisé depuis
-- le catalogue TypeScript via `syncBuiltinMissionsToSupabase` (espace admin)
-- ou `scripts/sync-missions-to-supabase.mjs`.
