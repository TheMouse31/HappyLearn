import { isSpeaking, toggleSpeech, stopSpeech, canSpeak } from "../lib/speech";
import { useEffect, useState } from "react";

export function ListenButton() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const stop = () => setOn(false);
    window.addEventListener("pagehide", stop);
    return () => {
      window.removeEventListener("pagehide", stop);
      stopSpeech();
    };
  }, []);

  if (!canSpeak()) return null;

  return (
    <button
      type="button"
      className="listen"
      aria-pressed={on}
      aria-label="Lire à voix haute les textes de cette page"
      onClick={() => {
        toggleSpeech();
        setOn(isSpeaking());
      }}
    >
      {on ? "Arrêter la lecture" : "Écouter cette page"}
    </button>
  );
}
