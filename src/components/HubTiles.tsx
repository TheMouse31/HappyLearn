import { Link, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import type { MouseEvent } from "react";

export type HubTile = {
  to: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  /** Action avant navigation (ex. bascule de rôle). */
  onNavigate?: () => void | Promise<void>;
};

type Props = {
  title?: string;
  lead?: string;
  tiles: HubTile[];
};

/** Grille de raccourcis type RetroVault — chaque tuile mène à une page dédiée. */
export function HubTiles({ title = "Tableau de bord", lead, tiles }: Props) {
  const navigate = useNavigate();

  async function handleClick(event: MouseEvent, tile: HubTile) {
    if (!tile.onNavigate) return;
    event.preventDefault();
    await tile.onNavigate();
    navigate(tile.to);
  }

  return (
    <section className="hub-section" aria-label={title}>
      <div className="hub-section-head">
        <h2 className="hub-section-title">{title}</h2>
        {lead ? <p className="hub-section-lead">{lead}</p> : null}
      </div>
      <div className="hub-tiles">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.to + tile.label}
              to={tile.to}
              className="hub-tile"
              onClick={(event) => {
                void handleClick(event, tile);
              }}
            >
              <span className="hub-tile-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={2.25} />
              </span>
              <span className="hub-tile-copy">
                <span className="hub-tile-label">{tile.label}</span>
                {tile.description ? <span className="hub-tile-desc">{tile.description}</span> : null}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
