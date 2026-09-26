import { Link } from "react-router-dom";
import { CookiePrefsButton } from "../components/CookieBanner";
import { PublicLayout } from "../components/PublicLayout";
import { writeCookieConsent, readCookieConsent } from "../lib/cookieConsent";
import { Button } from "../components/Button";
import { useState } from "react";

/** Politique de confidentialité & cookies. */
export function PrivacyScreen() {
  const [consent, setConsent] = useState(() => readCookieConsent());

  return (
    <PublicLayout fullBleed={false}>
      <article className="legal-page dedicated-page">
        <header className="dedicated-page-header">
          <div>
            <span className="kicker">Happy Learn</span>
            <h1>Confidentialité & cookies</h1>
            <p className="lead">
              Comment nous utilisons les données et le stockage sur ton appareil.
            </p>
          </div>
        </header>

        <section className="legal-section">
          <h2>Qui est responsable ?</h2>
          <p>
            Happy Learn est édité pour accompagner les apprentissages du primaire (élèves, parents,
            enseignants). Pour toute question relative aux données : contacte l’équipe Happy Learn
            via ton établissement ou l’administrateur de la plateforme.
          </p>
        </section>

        <section className="legal-section">
          <h2>Données traitées</h2>
          <ul>
            <li>
              <strong>Comptes adultes</strong> (parent, enseignant, admin) : e-mail, mot de passe
              (hashés via le prestataire d’auth), rôles, abonnement.
            </li>
            <li>
              <strong>Élèves</strong> : prénom / code classe ou foyer, progression pédagogique —
              sans compte e-mail élève.
            </li>
            <li>
              <strong>Technique</strong> : préférences d’affichage (thème), identifiant local
              appareil pour le mode hors-ligne / démo.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Cookies et stockage local</h2>
          <p>
            Happy Learn n’utilise pas de cookies publicitaires. Le navigateur peut stocker des
            informations en <em>localStorage</em> / session (connexion Supabase, thème, progression).
          </p>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Finalité</th>
                <th>Base</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nécessaires</td>
                <td>Connexion, sécurité, thème, fonctionnement du service</td>
                <td>Intérêt légitime / exécution du service</td>
              </tr>
              <tr>
                <td>Mesure d’audience (optionnelle)</td>
                <td>Statistiques d’usage anonymisées — non activée actuellement</td>
                <td>Consentement</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>Tes choix</h2>
          <p>
            Tu peux accepter ou refuser les cookies optionnels. Les cookies nécessaires restent
            actifs pour que le site fonctionne.
          </p>
          <div className="actions legal-consent-actions">
            <Button
              type="button"
              onClick={() => {
                const next = writeCookieConsent(false);
                setConsent(next);
              }}
            >
              Refuser l’optionnel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                const next = writeCookieConsent(true);
                setConsent(next);
              }}
            >
              Tout accepter
            </Button>
            <CookiePrefsButton />
          </div>
          {consent ? (
            <p className="field-help">
              Choix actuel : nécessaires
              {consent.analytics ? " + audience" : " uniquement"} (enregistré le{" "}
              {new Date(consent.updatedAt).toLocaleDateString("fr-FR")}).
            </p>
          ) : (
            <p className="field-help">Aucun choix enregistré pour le moment.</p>
          )}
        </section>

        <section className="legal-section">
          <h2>Tes droits</h2>
          <p>
            Conformément au RGPD, tu peux demander l’accès, la rectification ou l’effacement des
            données te concernant (notamment via ton compte parent / enseignant ou un
            administrateur).
          </p>
        </section>

        <p>
          <Link className="text-link" to="/">
            ← Retour à l’accueil
          </Link>
        </p>
      </article>
    </PublicLayout>
  );
}
