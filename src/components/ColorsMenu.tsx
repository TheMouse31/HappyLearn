import { useEffect, useId, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { initColorblind, setColorblind } from "../lib/colorblind";
import { initThemeMode, setThemeMode, type ThemeMode } from "../lib/themeMode";

/** Panneau d’apparence : thème clair/sombre + mode daltonien. */
export function ColorsMenu() {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [daltonien, setDaltonien] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    setDaltonien(initColorblind());
    setThemeModeState(initThemeMode());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function applyMode(next: ThemeMode) {
    setThemeMode(next);
    setThemeModeState(next);
  }

  return (
    <div className={`colors-menu ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className={`nav-icon-btn nav-icon-square colors-menu-trigger${
          daltonien ? " is-daltonien" : ""
        }${themeMode === "dark" ? " is-dark-mode" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label="Apparence : thème et accessibilité"
        title="Apparence"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="colors-menu-glyph" aria-hidden="true">
          {themeMode === "dark" ? <Moon size={17} strokeWidth={2.25} /> : <Sun size={17} strokeWidth={2.25} />}
        </span>
      </button>

      {open ? (
        <div className="colors-panel" id={panelId} role="dialog" aria-label="Apparence">
          <p className="colors-panel-title">Apparence</p>

          <div className="theme-mode-toggle" role="group" aria-label="Thème clair ou sombre">
            <button
              type="button"
              className={`theme-mode-btn${themeMode === "light" ? " is-active" : ""}`}
              aria-pressed={themeMode === "light"}
              onClick={() => applyMode("light")}
            >
              Clair
            </button>
            <button
              type="button"
              className={`theme-mode-btn${themeMode === "dark" ? " is-active" : ""}`}
              aria-pressed={themeMode === "dark"}
              onClick={() => applyMode("dark")}
            >
              Sombre
            </button>
          </div>

          <div className="colors-divider" />

          <label className="colors-option">
            <input
              type="checkbox"
              checked={daltonien}
              onChange={(e) => {
                const next = e.target.checked;
                setColorblind(next);
                setDaltonien(next);
              }}
            />
            <span>
              <strong>Mode daltonien</strong>
              <small>Palette deutéranopie (bleu = succès, motifs sur les pastilles)</small>
            </span>
          </label>
        </div>
      ) : null}
    </div>
  );
}
