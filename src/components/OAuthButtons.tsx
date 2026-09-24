type Props = {
  busy?: boolean;
  onGoogle: () => void;
  onApple: () => void;
};

function GoogleGlyph() {
  return (
    <svg className="oauth-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg className="oauth-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.64c-.03-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.72-1.35-.14-2.64.8-3.32.8-.69 0-1.74-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.54 2.67-.39 6.62 1.1 8.78.73 1.06 1.6 2.25 2.74 2.2 1.11-.04 1.53-.71 2.87-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.36-3.53zM14.3 6.1c.6-.73 1.01-1.75.9-2.76-.87.03-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.66 1 .08 2.01-.5 2.56-1.21z"
      />
    </svg>
  );
}

/** Boutons OAuth Google + Apple pour les écrans parent / enseignant. */
export function OAuthButtons({ busy = false, onGoogle, onApple }: Props) {
  return (
    <div className="oauth-buttons" role="group" aria-label="Connexion sociale">
      <button type="button" className="oauth-btn oauth-google" disabled={busy} onClick={onGoogle}>
        <GoogleGlyph />
        <span>Se connecter avec Google</span>
      </button>
      <button type="button" className="oauth-btn oauth-apple" disabled={busy} onClick={onApple}>
        <AppleGlyph />
        <span>Se connecter avec Apple</span>
      </button>
    </div>
  );
}
