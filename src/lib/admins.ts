/** Comptes administrateurs Happy Learn. */

const ADMIN_STORAGE_KEY = "happy-learn-admin-emails";

/** Seed figé : toujours admin. */
export const SEED_ADMIN_EMAILS = ["test@test.fr"] as const;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function readAdminEmails(): string[] {
  const seeded = new Set<string>(SEED_ADMIN_EMAILS.map(normalizeEmail));
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === "string" && item.includes("@")) {
            seeded.add(normalizeEmail(item));
          }
        }
      }
    }
  } catch {
    /* ignore */
  }
  return [...seeded].sort((a, b) => a.localeCompare(b, "fr"));
}

export function writeAdminEmails(emails: string[]): void {
  const seed = SEED_ADMIN_EMAILS.map((item) => item.toLowerCase());
  const next = [
    ...new Set(
      emails
        .map(normalizeEmail)
        .filter((item) => item.includes("@") && !seed.includes(item)),
    ),
  ];
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify([...seed, ...next]));
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return readAdminEmails().includes(normalizeEmail(email));
}

export function addAdminEmail(email: string): { ok: true } | { ok: false; error: string } {
  const normalized = normalizeEmail(email);
  if (!normalized.includes("@") || !normalized.includes(".")) {
    return { ok: false, error: "E-mail invalide." };
  }
  const current = readAdminEmails();
  if (current.includes(normalized)) return { ok: true };
  writeAdminEmails([...current, normalized]);
  return { ok: true };
}

export function removeAdminEmail(email: string): { ok: true } | { ok: false; error: string } {
  const normalized = normalizeEmail(email);
  if (SEED_ADMIN_EMAILS.map(normalizeEmail).includes(normalized)) {
    return { ok: false, error: "Impossible de retirer le compte administrateur de référence." };
  }
  writeAdminEmails(readAdminEmails().filter((item) => item !== normalized));
  return { ok: true };
}
