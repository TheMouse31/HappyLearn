import type { UniverseSlug } from "../data/types";
import { UNIVERSES, UNIVERSE_ORDER } from "../data/universes";

type Props = {
  earned: UniverseSlug[];
  highlight?: UniverseSlug | null;
};

export function Reward({ earned, highlight }: Props) {
  return (
    <div className="collection" aria-label="Collection de missions">
      {UNIVERSE_ORDER.map((slug) => {
        const def = UNIVERSES[slug];
        const on = earned.includes(slug);
        return (
          <div key={slug} className="collectible-wrap">
            <div
              className={`star ${on ? "is-earned" : ""} ${highlight === slug ? "receiving" : ""}`}
              aria-label={on ? `${def.label} : ${def.rewardShort}` : `${def.label} : pas encore obtenue`}
            >
              <span aria-hidden="true">{def.icon}</span>
            </div>
            <small>{def.label}</small>
          </div>
        );
      })}
    </div>
  );
}
