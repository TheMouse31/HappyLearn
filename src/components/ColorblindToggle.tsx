import { useEffect, useState } from "react";
import { initColorblind, setColorblind } from "../lib/colorblind";

/** Toggle accessible colors for color vision deficiency (deuteranopia-friendly). */
export function ColorblindToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(initColorblind());
  }, []);

  return (
    <button
      type="button"
      className={`nav-icon-btn colorblind-toggle ${on ? "is-on" : ""}`}
      aria-pressed={on}
      aria-label={on ? "Désactiver le mode daltonien" : "Activer le mode daltonien"}
      title={on ? "Mode daltonien activé" : "Mode daltonien"}
      onClick={() => {
        const next = !on;
        setColorblind(next);
        setOn(next);
      }}
    >
      <span aria-hidden="true">◐</span>
      <span className="colorblind-toggle-label">{on ? "Daltonien" : "Couleurs"}</span>
    </button>
  );
}
