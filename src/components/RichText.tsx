/**
 * Affichage lecture seule d’un texte de mission (brut ou HTML déjà sanitisé).
 * Utilisé dans MissionScreen, HintOverlay, etc.
 */
import { looksLikeRichHtml, sanitizeRichHtml } from "../lib/richText";

type Props = {
  html: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  "data-listen"?: boolean;
};

/** Rendu avec formatage riche sûr ; texte sans balises → enfants React classiques. */
export function RichText({ html, className, as = "p", ...rest }: Props) {
  const Tag = as;
  const value = html ?? "";
  if (!looksLikeRichHtml(value)) {
    return (
      <Tag className={className} {...(rest["data-listen"] ? { "data-listen": true } : {})}>
        {value}
      </Tag>
    );
  }
  const safe = sanitizeRichHtml(value);
  return (
    <Tag
      className={`rich-text ${className ?? ""}`.trim()}
      {...(rest["data-listen"] ? { "data-listen": true } : {})}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
