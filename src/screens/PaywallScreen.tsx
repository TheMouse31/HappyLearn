import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";
import { abonnementLabel } from "../lib/subscription";
import { createCheckoutSession, createPortalSession, upsertAbonnement } from "../lib/familyStore";

export function PaywallScreen() {
  const { role, teacher, foyer, abonnement, premiumActive, refreshAbonnement, logout } = useSession();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refreshAbonnement();
  }, [refreshAbonnement]);

  if (role !== "parent" && role !== "enseignant" && role !== "admin") {
    return <Navigate to="/connexion" replace />;
  }
  if (role === "admin" || premiumActive) {
    return (
      <Navigate to={role === "parent" ? "/espace-parent" : "/espace-professeur"} replace />
    );
  }

  const subjectType = role === "parent" ? "foyer" : "enseignant";
  const subjectId = role === "parent" ? foyer?.id : teacher?.id;

  return (
    <Shell
      brand="Happy Learn"
      stepLabel="Abonnement"
      homeTo="/"
      backTo={role === "parent" ? "/connexion/parent" : "/connexion/enseignant"}
    >
      <section className="login-page">
        <span className="kicker">Premium Happy Learn</span>
        <h1>Active ton abonnement</h1>
        <p className="lead" data-listen>
          {role === "parent"
            ? "L’espace famille (missions à la maison, stats, codes enfants) nécessite un abonnement Premium."
            : "Piloter une classe et lancer des sessions live nécessite un abonnement Premium enseignant."}
        </p>
        <p className="field-help">Statut actuel : {abonnementLabel(abonnement)}</p>
        <p className="error" aria-live="polite">
          {error}
        </p>
        <div className="actions">
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
                successUrl: `${window.location.origin}${role === "parent" ? "/espace-parent" : "/espace-professeur"}?checkout=1`,
                cancelUrl: `${window.location.origin}/abonnement`,
              }).then((result) => {
                setBusy(false);
                if ("url" in result) {
                  window.location.href = result.url;
                } else {
                  setError(result.error);
                }
              });
            }}
          >
            Payer avec Stripe
          </Button>
          <Button
            type="button"
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
            Gérer mon paiement
          </Button>
          {teacher?.backend === "local" ? (
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
                }).then(() => refreshAbonnement()).then(() => setBusy(false));
              }}
            >
              Activer Premium (mode local)
            </Button>
          ) : null}
          <p className="field-help">
            Tu as reçu un accès offert ? Contacte Happy Learn ou un admin pour un grant Premium.
          </p>
          <Button type="button" onClick={() => void logout()}>
            Se déconnecter
          </Button>
          <Link className="text-link" to="/">
            Accueil
          </Link>
        </div>
      </section>
    </Shell>
  );
}
