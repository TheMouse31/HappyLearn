const COLORBLIND_KEY = "happy-learn-colorblind";

export function loadColorblind(): boolean {
  try {
    return localStorage.getItem(COLORBLIND_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveColorblind(enabled: boolean): void {
  try {
    if (enabled) localStorage.setItem(COLORBLIND_KEY, "1");
    else localStorage.removeItem(COLORBLIND_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

/** Applies the preference on <html> so CSS can react immediately. */
export function applyColorblind(enabled: boolean): void {
  const root = document.documentElement;
  if (enabled) root.setAttribute("data-colorblind", "1");
  else root.removeAttribute("data-colorblind");
}

export function initColorblind(): boolean {
  const enabled = loadColorblind();
  applyColorblind(enabled);
  return enabled;
}

export function setColorblind(enabled: boolean): void {
  saveColorblind(enabled);
  applyColorblind(enabled);
}
