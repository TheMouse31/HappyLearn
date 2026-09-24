import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Shell } from "../components/Shell";
import { StatusBadge } from "../components/StatusBadge";
import { useSession } from "../lib/session";
import { abonnementLabel, isAbonnementActive } from "../lib/subscription";
import { createCheckoutSession, createPortalSession, upsertAbonnement } from "../lib/familyStore";

function hubForRole(role: string | null): string {
  if (role === "parent") return "/espace-parent";
  if (role === "admin") return "/espace-admin";
  return "/espace-professeur";
}

/** Page abonnement : activation ou gestion Premium. */
export function PaywallScreen() {
  const { role, teacher, foyer, abonnement, premiumActive, refreshAbonnement } = useSession();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refreshAbonnement();
  }, [refreshAbonnement]);

  if (role !== "parent" && role !== "enseignant" && role !== "admin") {
    return <Navigate to="/connexion" replace />;
  }

  const hub = hubForRole(role);
  const subjectType = role === "parent" ? "foyer" : "enseignant";
  const subjectId = role === "parent" ? foyer?.id : teacher?.id;
  const active = premiumActive || isAbonnementActive(abonnement);

  return (
    <Shell brand="Happy Learn" stepLabel="Abonnement" homeTo={hub} backTo={hub}>
      <section className="dedicated-page abonnement-page">
        <header className="dedicated-page-header">
          <span className="kicker">Premium Happy Learn</span>
          <h1>{active ? "Ton abonnement" : "Active ton abonnement"}</h1>
          <p className="lead" data-listen>
            {active
              ? "Consulte le statut Premium et gère ton paiement si besoin."
              : role === "parent"
                ? "L’espace famille nécessite un abonnement Premium."
                : "Piloter une classe et les sessions live nécessite un abonnement Premium."}
          </p>
          <div className="abonnement-status-row">
            <StatusBadge tone={active ? "premium" : "free"} icon={active ? "✦" : undefined}>
              {active ? "Premium" : "Sans abo"}
            </StatusBadge>
            <span className="field-help" style={{ margin: 0 }}>
              {abonnementLabel(abonnement)}
            </span>
          </div>
        </header>

        <p className="error" aria-live="polite">
          {error}
        </p>

        <div className="actions">
          {!active ? (
            <Button
              variant="primary"
              disabled={busy || !subjectId || !teacher}
              onClick={() => {
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
              }}
            >
              Payer avec Stripe
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

          {!active && teacher?.backend === "local" ? (
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
              Activer Premium (mode local)
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
