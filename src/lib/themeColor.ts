const THEME_KEY = "happy-learn-theme-color";

/** Default Happy Learn teal. */
export const DEFAULT_THEME_COLOR = "#0f8f78";

const PRESET_COLORS = [
  "#0f8f78", // teal (défaut)
  "#1d4ed8", // blue
  "#7c3aed", // violet
  "#c2410c", // amber-orange
  "#be185d", // rose
  "#0f766e", // deep teal
  "#0369a1", // sky
  "#15803d", // green
] as const;

export const THEME_PRESETS = PRESET_COLORS;

function clamp(n: number, min = 0, max = 255): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}

function mix(hex: string, withHex: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(withHex);
  if (!a || !b) return hex;
  return rgbToHex(
    a.r + (b.r - a.r) * amount,
    a.g + (b.g - a.g) * amount,
    a.b + (b.b - a.b) * amount,
  );
}

export function isValidThemeColor(hex: string): boolean {
  return Boolean(hexToRgb(hex));
}

export function loadThemeColor(): string {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v && isValidThemeColor(v)) return v.startsWith("#") ? v : `#${v}`;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME_COLOR;
}

export function saveThemeColor(hex: string): void {
  try {
    if (!hex || hex.toLowerCase() === DEFAULT_THEME_COLOR.toLowerCase()) {
      localStorage.removeItem(THEME_KEY);
    } else {
      localStorage.setItem(THEME_KEY, hex);
    }
  } catch {
    /* ignore */
  }
}

/** Paints accent tokens on <html> from a brand hex. */
export function applyThemeColor(hex: string): void {
  const root = document.documentElement;
  const color = isValidThemeColor(hex) ? (hex.startsWith("#") ? hex : `#${hex}`) : DEFAULT_THEME_COLOR;
  const light = mix(color, "#ffffff", 0.28);
  const soft = mix(color, "#ffffff", 0.88);
  const line = mix(color, "#ffffff", 0.55);
  const inkOnAction = "#ffffff";

  root.style.setProperty("--action", color);
  root.style.setProperty("--action-2", light);
  root.style.setProperty("--soft-action", soft);
  root.style.setProperty("--line", line);
  root.style.setProperty("--action-ink", inkOnAction);
  root.style.setProperty("--theme-accent", color);
  root.setAttribute("data-theme-color", color);
}

export function clearThemeColorStyles(): void {
  const root = document.documentElement;
  ["--action", "--action-2", "--soft-action", "--line", "--action-ink", "--theme-accent"].forEach((k) => {
    root.style.removeProperty(k);
  });
  root.removeAttribute("data-theme-color");
}

export function initThemeColor(): string {
  const color = loadThemeColor();
  if (color.toLowerCase() === DEFAULT_THEME_COLOR.toLowerCase()) {
    // Keep stylesheet defaults unless user customized.
    clearThemeColorStyles();
  } else {
    applyThemeColor(color);
  }
  return color;
}

export function setThemeColor(hex: string): void {
  const color = isValidThemeColor(hex) ? (hex.startsWith("#") ? hex : `#${hex}`) : DEFAULT_THEME_COLOR;
  saveThemeColor(color);
  if (color.toLowerCase() === DEFAULT_THEME_COLOR.toLowerCase()) {
    clearThemeColorStyles();
  } else {
    applyThemeColor(color);
  }
}
