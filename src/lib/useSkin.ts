import { useEffect, useState } from "react";
import { loadSkin, type Skin } from "./skin";

/** React hook that stays in sync with html[data-skin]. */
export function useSkin(): Skin {
  const [skin, setSkinState] = useState<Skin>(() => loadSkin());

  useEffect(() => {
    const sync = () => setSkinState(loadSkin());
    window.addEventListener("storage", sync);
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });
    // Ensure attribute matches storage once on mount (no-op if already set).
    sync();
    return () => {
      window.removeEventListener("storage", sync);
      obs.disconnect();
    };
  }, []);

  return skin;
}
