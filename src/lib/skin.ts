const SKIN_KEY = "happy-learn-skin";

/** Unique interface Happy Learn (ancien front retiré). */
export type Skin = "newfront";

export function loadSkin(): Skin {
  return "newfront";
}

export function applySkin(): void {
  const root = document.documentElement;
  if (root.getAttribute("data-skin") !== "newfront") {
    root.setAttribute("data-skin", "newfront");
  }
}

/** Force NewFront et efface l’ancienne préférence Classic. */
export function initSkin(): Skin {
  try {
    localStorage.removeItem(SKIN_KEY);
  } catch {
    /* ignore */
  }
  applySkin();
  return "newfront";
}
