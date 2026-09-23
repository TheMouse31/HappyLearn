-- Empêche un client authentifié de s’auto-activer le Premium.
-- Écritures : admin (grants) ou service role (webhooks Stripe).

drop policy if exists "abonnements upsert own" on abonnements;
drop policy if exists "abonnements update own" on abonnements;
