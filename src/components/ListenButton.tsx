import { canSpeak, stopSpeech, subscribeSpeech, toggleSpeech } from "../lib/speech";
import { useEffect, useState } from "react";

export function ListenButton() {
  const [on, setOn] = useState(false);
  const [supported, setSupported] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    setSupported(canSpeak());
    const unsubscribe = subscribeSpeech(setOn);
    const onHide = () => stopSpeech();
    window.addEventListener("pagehide", onHide);
    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", onHide);
      stopSpeech();
    };
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      className={`listen ${on ? "is-on" : ""}`}
      aria-pressed={on}
      aria-label="Lire à voix haute les textes de cette page"
      title={hint || undefined}
      onClick={() => {
        const started = toggleSpeech();
        if (!started && !on) {
          setHint("Rien à lire sur cette page pour le moment.");
          window.setTimeout(() => setHint(""), 2500);
        } else {
          setHint("");
        }
      }}
    >
      {on ? "Arrêter la lecture" : hint || "Écouter cette page"}
    </button>
  );
}
