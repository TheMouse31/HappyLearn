import { useEffect, useId, useRef, useState } from "react";
import { initColorblind, setColorblind } from "../lib/colorblind";
import {
  DEFAULT_THEME_COLOR,
  THEME_PRESETS,
  initThemeColor,
  setThemeColor,
} from "../lib/themeColor";

/** Opens a panel: daltonien mode and site accent color picker. */
export function ColorsMenu() {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [daltonien, setDaltonien] = useState(false);
  const [color, setColor] = useState(DEFAULT_THEME_COLOR);

  useEffect(() => {
    setDaltonien(initColorblind());
    setColor(initThemeColor());
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

  const label = daltonien ? "Daltonien" : "Couleurs";

  return (
    <div className={`colors-menu ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className={`nav-icon-btn colors-menu-trigger ${daltonien ? "is-daltonien" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label="Ouvrir les options de couleurs"
        title="Couleurs du site"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="colors-menu-swatch" style={{ background: color }} aria-hidden="true" />
        <span className="colors-menu-label">{label}</span>
      </button>

      {open ? (
        <div className="colors-panel" id={panelId} role="dialog" aria-label="Couleurs du site">
          <p className="colors-panel-title">Couleurs</p>

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

          <div className="colors-divider" />

          <p className="colors-panel-subtitle">Couleur du site</p>
          <p className="colors-panel-hint">Change les boutons, liens et accents de Happy Learn.</p>

          <div className="colors-presets" role="list" aria-label="Couleurs proposées">
            {THEME_PRESETS.map((preset) => {
              const active = color.toLowerCase() === preset.toLowerCase();
              return (
                <button
                  key={preset}
                  type="button"
                  role="listitem"
                  className={`colors-preset ${active ? "is-active" : ""}`}
                  style={{ background: preset }}
                  aria-label={`Choisir ${preset}`}
                  aria-pressed={active}
                  onClick={() => {
                    setThemeColor(preset);
                    setColor(preset);
                  }}
                />
              );
            })}
          </div>

          <label className="colors-picker-row">
            <span>Personnaliser</span>
            <input
              type="color"
              value={isLikelyHex(color) ? color : DEFAULT_THEME_COLOR}
              aria-label="Choisir une couleur personnalisée"
              onChange={(e) => {
                const next = e.target.value;
                setThemeColor(next);
                setColor(next);
              }}
            />
          </label>

          <button
            type="button"
            className="colors-reset"
            onClick={() => {
              setThemeColor(DEFAULT_THEME_COLOR);
              setColor(DEFAULT_THEME_COLOR);
            }}
          >
            Couleur par défaut
          </button>
        </div>
      ) : null}
    </div>
  );
}

function isLikelyHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}
