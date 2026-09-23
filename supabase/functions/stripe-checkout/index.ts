/**
 * Stripe Checkout Session (subscription) for Happy Learn Premium.
 *
 * Secrets: STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: SITE_URL (CORS / redirects)
 *
 * Body JSON: { subjectType, subjectId, email, successUrl, cancelUrl }
 */
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const priceId = Deno.env.get("STRIPE_PRICE_ID");
  if (!stripeKey || !priceId) {
    return json({ error: "Stripe non configuré (STRIPE_SECRET_KEY / STRIPE_PRICE_ID)." }, 500);
  }

  let body: {
    subjectType?: string;
    subjectId?: string;
    email?: string;
    successUrl?: string;
    cancelUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON invalide." }, 400);
  }

  const subjectType = body.subjectType;
  const subjectId = body.subjectId;
  const email = body.email?.trim().toLowerCase();
  const successUrl = body.successUrl;
  const cancelUrl = body.cancelUrl;
  if (
    (subjectType !== "enseignant" && subjectType !== "foyer") ||
    !subjectId ||
    !email ||
    !successUrl ||
    !cancelUrl
  ) {
    return json({ error: "Paramètres manquants (subjectType, subjectId, email, URLs)." }, 400);
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const { data: existing } = await supabase
    .from("abonnements")
    .select("stripe_customer_id")
    .eq("subject_type", subjectType)
    .eq("subject_id", subjectId)
    .maybeSingle();

  let customerId = (existing?.stripe_customer_id as string | null) ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { subject_type: subjectType, subject_id: subjectId },
    });
    customerId = customer.id;
    await supabase.from("abonnements").upsert(
      {
        subject_type: subjectType,
        subject_id: subjectId,
        plan: "premium",
        status: "expired",
        source: "stripe",
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "subject_type,subject_id" },
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { subject_type: subjectType, subject_id: subjectId },
    subscription_data: {
      metadata: { subject_type: subjectType, subject_id: subjectId },
    },
  });

  if (!session.url) return json({ error: "Checkout sans URL." }, 500);
  return json({ url: session.url });
});

function json(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
