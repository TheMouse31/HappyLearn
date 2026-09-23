/**
 * Stripe webhooks → table abonnements.
 *
 * Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Handles: checkout.session.completed, customer.subscription.updated|deleted,
 * invoice.payment_failed
 */
import Stripe from "https://esm.sh/stripe@14.25.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    return new Response("Stripe webhook non configuré", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "signature invalide";
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subjectType = session.metadata?.subject_type;
        const subjectId = session.metadata?.subject_id;
        if (
          (subjectType === "enseignant" || subjectType === "foyer") &&
          subjectId &&
          session.subscription
        ) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertFromSubscription(supabase, subjectType, subjectId, sub, session.customer);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const subjectType = sub.metadata?.subject_type;
        const subjectId = sub.metadata?.subject_id;
        if ((subjectType === "enseignant" || subjectType === "foyer") && subjectId) {
          await upsertFromSubscription(supabase, subjectType, subjectId, sub, sub.customer);
        } else {
          await upsertByStripeSubscription(supabase, sub);
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subRef = invoice.subscription;
        if (subRef) {
          const subId = typeof subRef === "string" ? subRef : subRef.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          const subjectType = sub.metadata?.subject_type;
          const subjectId = sub.metadata?.subject_id;
          if ((subjectType === "enseignant" || subjectType === "foyer") && subjectId) {
            await upsertFromSubscription(supabase, subjectType, subjectId, sub, sub.customer);
          } else {
            await upsertByStripeSubscription(supabase, sub);
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "erreur webhook";
    console.error(message);
    return new Response(message, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});

type Sb = ReturnType<typeof createClient>;

function mapStatus(sub: Stripe.Subscription): "active" | "past_due" | "canceled" | "expired" {
  if (sub.status === "active" || sub.status === "trialing") return "active";
  if (sub.status === "past_due") return "past_due";
  if (sub.status === "canceled") return "canceled";
  return "expired";
}

async function upsertFromSubscription(
  supabase: Sb,
  subjectType: string,
  subjectId: string,
  sub: Stripe.Subscription,
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
) {
  const customerId =
    typeof customer === "string" ? customer : customer && "id" in customer ? customer.id : null;
  await supabase.from("abonnements").upsert(
    {
      subject_type: subjectType,
      subject_id: subjectId,
      plan: "premium",
      status: mapStatus(sub),
      source: "stripe",
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "subject_type,subject_id" },
  );
}

async function upsertByStripeSubscription(supabase: Sb, sub: Stripe.Subscription) {
  const { data } = await supabase
    .from("abonnements")
    .select("subject_type, subject_id")
    .eq("stripe_subscription_id", sub.id)
    .maybeSingle();
  if (!data) return;
  await upsertFromSubscription(
    supabase,
    data.subject_type as string,
    data.subject_id as string,
    sub,
    sub.customer,
  );
}
