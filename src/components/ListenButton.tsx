import { canSpeak, stopSpeech, subscribeSpeech, toggleSpeech } from "../lib/speech";
import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  variant?: "float" | "nav";
};

export function ListenButton({ variant = "nav" }: Props) {
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

  const label = on ? "Arrêter" : hint || "Écouter";
  const fullLabel = on ? "Arrêter la lecture" : hint || "Écouter cette page";

  return (
    <button
      type="button"
      className={
        variant === "nav"
          ? `nav-icon-btn nav-icon-square listen-nav ${on ? "is-on" : ""}`
          : `listen ${on ? "is-on" : ""}`
      }
      aria-pressed={on}
      aria-label={fullLabel}
      title={hint || fullLabel}
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
      {on ? (
        <VolumeX size={variant === "nav" ? 17 : 18} strokeWidth={2.25} aria-hidden />
      ) : (
        <Volume2 size={variant === "nav" ? 17 : 18} strokeWidth={2.25} aria-hidden />
      )}
      {variant === "float" ? <span>{label}</span> : null}
    </button>
  );
}
