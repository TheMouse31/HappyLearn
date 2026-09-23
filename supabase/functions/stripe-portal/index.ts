/**
 * Stripe Customer Portal for Happy Learn Premium.
 *
 * Secrets: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Body JSON: { subjectType, subjectId, returnUrl }
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
  if (!stripeKey) return json({ error: "Stripe non configuré." }, 500);

  let body: { subjectType?: string; subjectId?: string; returnUrl?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON invalide." }, 400);
  }

  const { subjectType, subjectId, returnUrl } = body;
  if (
    (subjectType !== "enseignant" && subjectType !== "foyer") ||
    !subjectId ||
    !returnUrl
  ) {
    return json({ error: "Paramètres manquants." }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const { data: row } = await supabase
    .from("abonnements")
    .select("stripe_customer_id")
    .eq("subject_type", subjectType)
    .eq("subject_id", subjectId)
    .maybeSingle();

  const customerId = row?.stripe_customer_id as string | null;
  if (!customerId) {
    return json({ error: "Aucun client Stripe pour cet abonnement." }, 404);
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return json({ url: portal.url });
});

function json(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
