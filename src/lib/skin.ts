const SKIN_KEY = "happy-learn-skin";

export type Skin = "classic" | "newfront";

export function loadSkin(): Skin {
  try {
    const v = localStorage.getItem(SKIN_KEY);
    if (v === "newfront" || v === "classic") return v;
  } catch {
    /* ignore */
  }
  return "classic";
}

export function saveSkin(skin: Skin): void {
  try {
    localStorage.setItem(SKIN_KEY, skin);
  } catch {
    /* ignore */
  }
}

export function applySkin(skin: Skin): void {
  const root = document.documentElement;
  if (root.getAttribute("data-skin") === skin) return;
  root.setAttribute("data-skin", skin);
}

export function initSkin(): Skin {
  const skin = loadSkin();
  applySkin(skin);
  return skin;
}

export function setSkin(skin: Skin): void {
  saveSkin(skin);
  applySkin(skin);
}

export function toggleSkin(): Skin {
  const next: Skin = loadSkin() === "newfront" ? "classic" : "newfront";
  setSkin(next);
  return next;
}
