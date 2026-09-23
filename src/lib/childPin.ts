/** Hash PIN enfant (SHA-256 hex). Inclut l’id pour saler. */
export async function hashChildPin(pin: string, eleveId: string): Promise<string> {
  const raw = `${pin.trim()}|${eleveId}`;
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isValidChildPin(pin: string): boolean {
  return /^\d{4}$/.test(pin.trim());
}
