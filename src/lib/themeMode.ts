/** Light / dark appearance — persisted separately from accent color. */

export type ThemeMode = "light" | "dark";

const THEME_MODE_KEY = "happy-learn-theme-mode";

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function loadThemeMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_MODE_KEY);
    if (isThemeMode(stored)) return stored;
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function saveThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_MODE_KEY, mode);
  } catch {
    /* ignore */
  }
}

export function applyThemeMode(mode: ThemeMode): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", mode);
  root.style.colorScheme = mode;
}

export function initThemeMode(): ThemeMode {
  const mode = loadThemeMode();
  applyThemeMode(mode);
  return mode;
}

export function setThemeMode(mode: ThemeMode): void {
  saveThemeMode(mode);
  applyThemeMode(mode);
}

export function toggleThemeMode(): ThemeMode {
  const next: ThemeMode = loadThemeMode() === "dark" ? "light" : "dark";
  setThemeMode(next);
  return next;
}
