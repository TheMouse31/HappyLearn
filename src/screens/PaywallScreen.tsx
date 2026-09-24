import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Shell } from "../components/Shell";
import { StatusBadge } from "../components/StatusBadge";
import {
  recommendedPlanForRole,
  SUBSCRIPTION_FEATURES,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId,
} from "../data/subscriptionPlans";
import { useSession } from "../lib/session";
import { abonnementLabel, isAbonnementActive } from "../lib/subscription";
import { createCheckoutSession, createPortalSession, upsertAbonnement } from "../lib/familyStore";

function hubForRole(role: string | null): string {
  if (role === "parent") return "/espace-parent";
  if (role === "admin") return "/espace-admin";
  return "/espace-professeur";
}

function featureCell(value: boolean | string) {
  if (value === true) return <span className="abo-yes">Oui</span>;
  if (value === false) return <span className="abo-no">—</span>;
  return <span className="abo-detail">{value}</span>;
}

/** Page abonnement : tableau des offres + activation / gestion Premium. */
export function PaywallScreen() {
  const { role, teacher, foyer, abonnement, premiumActive, refreshAbonnement } = useSession();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<SubscriptionPlanId | null>(null);

  useEffect(() => {
    void refreshAbonnement();
  }, [refreshAbonnement]);

  useEffect(() => {
    setSelected(recommendedPlanForRole(role));
  }, [role]);

  if (role !== "parent" && role !== "enseignant" && role !== "admin") {
    return <Navigate to="/connexion" replace />;
  }

  const hub = hubForRole(role);
  const subjectType = role === "parent" ? "foyer" : "enseignant";
  const subjectId = role === "parent" ? foyer?.id : teacher?.id;
  const active = premiumActive || isAbonnementActive(abonnement);
  const recommended = recommendedPlanForRole(role);
  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === (selected ?? recommended));

  function startCheckout() {
    if (!subjectId || !teacher) return;
    setBusy(true);
    setError("");
    void createCheckoutSession({
      subjectType,
      subjectId,
      email: teacher.email,
      successUrl: `${window.location.origin}${hub}?checkout=1`,
      cancelUrl: `${window.location.origin}/abonnement`,
    }).then((result) => {
      setBusy(false);
      if ("url" in result) window.location.href = result.url;
      else setError(result.error);
    });
  }

  return (
    <Shell brand="Happy Learn" stepLabel="Abonnement" homeTo={hub} backTo={hub}>
      <section className="dedicated-page abonnement-page">
        <header className="dedicated-page-header">
          <div>
            <span className="kicker">Premium Happy Learn</span>
            <h1>{active ? "Ton abonnement" : "Choisis ton abonnement"}</h1>
            <p className="lead" data-listen>
              {active
                ? "Consulte le statut Premium et gère ton paiement si besoin."
                : "Offres calquées sur les plateformes d’apprentissage : découverte, famille, classe ou établissement."}
            </p>
            <div className="abonnement-status-row">
              <StatusBadge tone={active ? "premium" : "free"} icon={active ? "✦" : undefined}>
                {active ? "Premium" : "Sans abo"}
              </StatusBadge>
              <span className="field-help" style={{ margin: 0 }}>
                {abonnementLabel(abonnement)}
              </span>
            </div>
          </div>
        </header>

        <div className="abo-table-wrap" role="region" aria-label="Comparatif des abonnements">
          <table className="abo-table">
            <caption className="visually-hidden">
              Comparaison des formules Découverte, Famille, Classe et Établissement
            </caption>
            <thead>
              <tr>
                <th scope="col">Fonctionnalité</th>
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={
                      plan.id === recommended ? "is-recommended" : undefined
                    }
                  >
                    <button
                      type="button"
                      className={`abo-plan-pick${selected === plan.id ? " is-selected" : ""}${
                        plan.id === recommended ? " is-recommended" : ""
                      }`}
                      onClick={() => setSelected(plan.id)}
                      aria-pressed={selected === plan.id}
                    >
                      <span className="abo-plan-name">{plan.name}</span>
                      {plan.id === recommended ? (
                        <span className="abo-plan-tag">Recommandé</span>
                      ) : null}
                      <span className="abo-plan-price">{plan.priceMonthly}</span>
                      <span className="abo-plan-yearly">{plan.priceYearly}</span>
                      <span className="abo-plan-blurb">{plan.blurb}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUBSCRIPTION_FEATURES.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {SUBSCRIPTION_PLANS.map((plan) => (
                    <td
                      key={plan.id}
                      className={plan.id === selected ? "is-selected-col" : undefined}
                    >
                      {featureCell(row.values[plan.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="error" aria-live="polite">
          {error}
        </p>

        <div className="actions abo-actions">
          {!active && selectedPlan?.checkout ? (
            <Button
              variant="primary"
              disabled={busy || !subjectId || !teacher}
              onClick={startCheckout}
            >
              {busy ? "Redirection…" : `${selectedPlan.cta} — Stripe`}
            </Button>
          ) : null}

          {!active && selectedPlan?.id === "decouverte" ? (
            <Link className="text-link" to={hub}>
              Continuer en découverte →
            </Link>
          ) : null}

          {!active && selectedPlan?.id === "etablissement" ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                window.location.href =
                  "mailto:hello@happylearn.app?subject=Licence%20%C3%89tablissement%20Happy%20Learn";
              }}
            >
              Nous contacter
            </Button>
          ) : null}

          <Button
            type="button"
            variant={active ? "primary" : undefined}
            disabled={busy || !subjectId}
            onClick={() => {
              if (!subjectId) return;
              setBusy(true);
              void createPortalSession({
                subjectType,
                subjectId,
                returnUrl: `${window.location.origin}/abonnement`,
              }).then((result) => {
                setBusy(false);
                if ("url" in result) window.location.href = result.url;
                else setError(result.error);
              });
            }}
          >
            {active ? "Gérer mon abonnement" : "Gérer mon paiement"}
          </Button>

          {!active && teacher?.backend === "local" && selectedPlan?.checkout ? (
            <Button
              type="button"
              disabled={busy || !subjectId}
              onClick={() => {
                if (!subjectId) return;
                setBusy(true);
                void upsertAbonnement({
                  subjectType,
                  subjectId,
                  source: "local",
                  status: "active",
                  currentPeriodEnd: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
                })
                  .then(() => refreshAbonnement())
                  .then(() => setBusy(false));
              }}
            >
              Activer {selectedPlan.name} (mode local)
            </Button>
          ) : null}

          {!active ? (
            <p className="field-help">
              Accès offert ? Contacte Happy Learn ou un admin pour un grant Premium.
            </p>
          ) : null}

          <Link className="text-link" to={hub}>
            Retour au tableau de bord
          </Link>
        </div>
      </section>
    </Shell>
  );
}
