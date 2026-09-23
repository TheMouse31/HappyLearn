# Stripe Edge Functions (Happy Learn)

Deploy:

```bash
supabase functions deploy stripe-checkout
supabase functions deploy stripe-portal
supabase functions deploy stripe-webhook --no-verify-jwt
```

Secrets:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID` (Checkout)
- `STRIPE_WEBHOOK_SECRET` (Webhook)
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (usually auto)

Front env:

```
VITE_HL_STRIPE_CHECKOUT_URL=https://<project>.supabase.co/functions/v1/stripe-checkout
VITE_HL_STRIPE_PORTAL_URL=https://<project>.supabase.co/functions/v1/stripe-portal
```

Admin grants and local « Activer Premium » work without Stripe.
