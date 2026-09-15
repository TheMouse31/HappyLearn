import type { UniverseSlug } from "../data/types";
import { UNIVERSES } from "../data/universes";

export type NeoPose = "guide" | "universe" | "pouce" | "applaudit" | "a06";

type Props = {
  pose?: NeoPose;
  universe?: UniverseSlug | null;
  alt?: string;
  className?: string;
};

export function Neo({ pose = "guide", universe = null, alt, className }: Props) {
  if (pose === "a06" && universe) {
    const def = UNIVERSES[universe];
    return (
      <div className={`neo-a06 ${className ?? ""}`} role="img" aria-label={alt ?? `Néo en ${def.label}`}>
        <img src={def.body} alt="" />
        <img className="neo-arm" src={def.arm} alt="" />
      </div>
    );
  }

  const src =
    pose === "applaudit"
      ? "/neo/neo-applaudit-sprite.webp"
      : pose === "pouce" && universe
        ? UNIVERSES[universe].pouce
        : pose === "pouce"
          ? "/neo/neo-pouce-leve.webp"
          : pose === "universe" && universe
            ? UNIVERSES[universe].mascot
            : "/neo/neo-guide.webp";

  return (
    <img
      className={`neo ${pose === "applaudit" ? "neo-clap" : ""} ${className ?? ""}`}
      src={src}
      alt={alt ?? "Néo, la mascotte lynx"}
    />
  );
}
