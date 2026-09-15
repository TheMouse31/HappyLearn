const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateClassCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export function normalizeClassCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

export function isValidClassCode(code: string): boolean {
  return /^[A-Z0-9]{4,8}$/.test(code);
}
