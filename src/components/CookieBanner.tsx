import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import {
  hasCookieConsentChoice,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "../lib/cookieConsent";

/** Bandeau cookies RGPD — accepter tout / refuser le non essentiel. */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(() => readCookieConsent());

  useEffect(() => {
    setVisible(!hasCookieConsentChoice());
    function onConsent(event: Event) {
      const detail = (event as CustomEvent<CookieConsent>).detail;
      setConsent(detail);
      setVisible(false);
    }
    function onReopen() {
      setVisible(true);
    }
    window.addEventListener("happy-learn-cookie-consent", onConsent);
    window.addEventListener("happy-learn-cookie-reopen", onReopen);
    return () => {
      window.removeEventListener("happy-learn-cookie-consent", onConsent);
      window.removeEventListener("happy-learn-cookie-reopen", onReopen);
    };
  }, []);

  if (!visible && consent) {
    return null;
  }
  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title" aria-live="polite">
      <div className="cookie-banner-inner">
        <div className="cookie-banner-copy">
          <p id="cookie-banner-title" className="cookie-banner-title">
            Cookies & confidentialité
          </p>
          <p className="cookie-banner-text">
            Happy Learn utilise des cookies et le stockage local indispensables au fonctionnement
            (connexion, thème, progression). Aucun cookie publicitaire. Tu peux refuser les cookies
            optionnels (mesure d’audience — non activée pour l’instant).{" "}
            <Link to="/confidentialite" className="text-link">
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <Button
            type="button"
            onClick={() => {
              writeCookieConsent(false);
              setVisible(false);
            }}
          >
            Refuser
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              writeCookieConsent(true);
              setVisible(false);
            }}
          >
            Tout accepter
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Lien discret pour rouvrir les préférences (footer / page confidentialité). */
export function CookiePrefsButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`text-link cookie-prefs-btn${className ? ` ${className}` : ""}`}
      onClick={() => {
        try {
          localStorage.removeItem("happy-learn-cookie-consent");
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new Event("happy-learn-cookie-reopen"));
      }}
    >
      Gérer les cookies
    </button>
  );
}
