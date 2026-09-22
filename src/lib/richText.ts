const ALLOWED_TAGS = new Set(["B", "STRONG", "I", "EM", "U", "BR", "P", "SPAN", "DIV"]);

const COLOR_RE =
  /^(#([0-9a-f]{3}|[0-9a-f]{6})|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\))$/i;

export const RICH_TEXT_COLORS = [
  { label: "Texte", value: "#1f2a24" },
  { label: "Vert", value: "#0f6b45" },
  { label: "Bleu", value: "#1a5f9e" },
  { label: "Orange", value: "#c45c12" },
  { label: "Rouge", value: "#b42318" },
  { label: "Violet", value: "#6b3fa0" },
] as const;

function cleanStyle(style: string | null): string | null {
  if (!style) return null;
  const colorMatch = /(?:^|;)\s*color\s*:\s*([^;]+)/i.exec(style);
  if (!colorMatch) return null;
  const color = colorMatch[1].trim();
  if (!COLOR_RE.test(color)) return null;
  return `color: ${color}`;
}

function walk(node: Node, out: string[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    out.push(node.textContent ?? "");
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as HTMLElement;
  const tag = el.tagName.toUpperCase();

  if (tag === "BR") {
    out.push("<br>");
    return;
  }

  if (!ALLOWED_TAGS.has(tag)) {
    for (const child of Array.from(el.childNodes)) walk(child, out);
    return;
  }

  if (tag === "SPAN") {
    const style = cleanStyle(el.getAttribute("style"));
    if (style) out.push(`<span style="${style}">`);
    else {
      for (const child of Array.from(el.childNodes)) walk(child, out);
      return;
    }
  } else if (tag === "P" || tag === "DIV") {
    // Normalize block wrappers to line breaks around content.
    if (out.length && !out[out.length - 1].endsWith("<br>") && out[out.length - 1] !== "") {
      out.push("<br>");
    }
    for (const child of Array.from(el.childNodes)) walk(child, out);
    out.push("<br>");
    return;
  } else {
    const open = tag.toLowerCase();
    out.push(`<${open}>`);
  }

  for (const child of Array.from(el.childNodes)) walk(child, out);

  if (tag === "SPAN") out.push("</span>");
  else if (tag !== "BR" && tag !== "P" && tag !== "DIV") out.push(`</${tag.toLowerCase()}>`);
}

/** Keep only safe formatting tags for mission copy. */
export function sanitizeRichHtml(input: string): string {
  const raw = input.trim();
  if (!raw) return "";
  if (typeof document === "undefined") {
    return raw.replace(/<[^>]*>/g, "");
  }
  const template = document.createElement("template");
  template.innerHTML = raw;
  const parts: string[] = [];
  for (const child of Array.from(template.content.childNodes)) walk(child, parts);
  return parts
    .join("")
    .replace(/(?:<br>\s*)+$/g, "")
    .replace(/^(?:<br>\s*)+/g, "")
    .trim();
}

export function stripRichHtml(input: string): string {
  if (!input) return "";
  if (typeof document === "undefined") {
    return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }
  const template = document.createElement("template");
  template.innerHTML = input;
  return (template.content.textContent ?? "").replace(/\s+/g, " ").trim();
}

export function looksLikeRichHtml(input: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(input);
}
