import { useEffect, useState } from "react";
import type { UniverseSlug } from "../data/types";
import { resolveAsset, resolveUniverses, type NeoAssetKey } from "../lib/illustrations";

export type NeoPose = "guide" | "universe" | "pouce" | "applaudit" | "a06";

type Props = {
  pose?: NeoPose;
  universe?: UniverseSlug | null;
  alt?: string;
  className?: string;
};

function useIllustrationTick() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const sync = () => setTick((n) => n + 1);
    window.addEventListener("happy-learn-illustrations", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("happy-learn-illustrations", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
}

export function Neo({ pose = "guide", universe = null, alt, className }: Props) {
  useIllustrationTick();
  const universes = resolveUniverses();

  if (pose === "a06" && universe) {
    const def = universes[universe];
    return (
      <div className={`neo-a06 ${className ?? ""}`} role="img" aria-label={alt ?? `Néo en ${def.label}`}>
        <img src={def.body} alt="" />
        <img className="neo-arm" src={def.arm} alt="" />
      </div>
    );
  }

  const src =
    pose === "applaudit"
      ? resolveAsset("applaudit" satisfies NeoAssetKey)
      : pose === "pouce" && universe
        ? universes[universe].pouce
        : pose === "pouce"
          ? resolveAsset("pouce")
          : pose === "universe" && universe
            ? universes[universe].mascot
            : resolveAsset("guide");

  return (
    <img
      className={`neo ${pose === "applaudit" ? "neo-clap" : ""} ${className ?? ""}`}
      src={src}
      alt={alt ?? "Néo, la mascotte lynx"}
    />
  );
}
