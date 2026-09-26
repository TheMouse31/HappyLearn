/** Consentement cookies / stockage local (RGPD). */

export const COOKIE_CONSENT_KEY = "happy-learn-cookie-consent";

export type CookieConsent = {
  /** Toujours true : session, thème, fonctionnement du service. */
  necessary: true;
  /** Mesure d’audience / cookies non essentiels (aucun tracker actif pour l’instant). */
  analytics: boolean;
  updatedAt: string;
};

export function readCookieConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (typeof parsed.analytics !== "boolean") return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeCookieConsent(analytics: boolean): CookieConsent {
  const next: CookieConsent = {
    necessary: true,
    analytics,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new CustomEvent("happy-learn-cookie-consent", { detail: next }));
  return next;
}

export function hasCookieConsentChoice(): boolean {
  return readCookieConsent() !== null;
}

export function isAnalyticsAllowed(): boolean {
  return readCookieConsent()?.analytics === true;
}
