import { useEffect, useState } from "react";
import { loadSkin, setSkin, type Skin } from "../lib/skin";

/** Switch between Classic UI and NewFront. */
export function SkinToggle() {
  const [skin, setLocal] = useState<Skin>(() => loadSkin());

  useEffect(() => {
    const sync = () => setLocal(loadSkin());
    window.addEventListener("storage", sync);
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });
    return () => {
      window.removeEventListener("storage", sync);
      obs.disconnect();
    };
  }, []);

  const isNew = skin === "newfront";

  return (
    <button
      type="button"
      className={`nav-icon-btn skin-toggle ${isNew ? "is-newfront" : "is-classic"}`}
      aria-pressed={isNew}
      aria-label={isNew ? "Passer à l’interface classique" : "Passer à la nouvelle interface"}
      title={isNew ? "Interface NewFront — cliquer pour Classic" : "Interface Classic — cliquer pour NewFront"}
      onClick={() => {
        const next: Skin = isNew ? "classic" : "newfront";
        setSkin(next);
        setLocal(next);
      }}
    >
      <span aria-hidden="true">{isNew ? "✦" : "◈"}</span>
      <span className="skin-toggle-label">{isNew ? "NewFront" : "Classic"}</span>
    </button>
  );
}
