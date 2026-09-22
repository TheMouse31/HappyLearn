/**
 * Bulle d’indice élève : le texte peut contenir du HTML riche (même pipeline que les consignes).
 */
import { RichText } from "./RichText";
import { Neo } from "./Neo";
import type { UniverseSlug } from "../data/types";

type Props = {
  text: string;
  universe: UniverseSlug;
};

export function HintOverlay({ text, universe }: Props) {
  if (!text) return null;
  return (
    <aside className="hint-overlay" role="status" aria-live="polite">
      <RichText className="hint-text" html={text} />
      <Neo pose="universe" universe={universe} alt="Néo accompagne l’indice" />
    </aside>
  );
}
