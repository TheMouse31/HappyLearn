import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export type HubTile = {
  to: string;
  label: string;
  description?: string;
  icon: LucideIcon;
};

type Props = {
  title?: string;
  lead?: string;
  tiles: HubTile[];
};

/** Grille de raccourcis type RetroVault (tuiles icône + label). */
export function HubTiles({ title = "Tableau de bord", lead, tiles }: Props) {
  return (
    <section className="hub-section" aria-label={title}>
      <div className="hub-section-head">
        <h2 className="hub-section-title">{title}</h2>
        {lead ? <p className="hub-section-lead">{lead}</p> : null}
      </div>
      <div className="hub-tiles">
        {tiles.map(({ to, label, description, icon: Icon }) => (
          <Link key={to + label} to={to} className="hub-tile">
            <span className="hub-tile-icon" aria-hidden="true">
              <Icon size={20} strokeWidth={2.25} />
            </span>
            <span className="hub-tile-copy">
              <span className="hub-tile-label">{label}</span>
              {description ? <span className="hub-tile-desc">{description}</span> : null}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
