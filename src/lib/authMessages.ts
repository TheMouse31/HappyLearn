export function teacherAuthMessage(raw: string): string {
  const text = raw.toLowerCase();
  if (text.includes("invalid login")) return "E-mail ou mot de passe incorrect.";
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "Un compte existe déjà avec cet e-mail. Connecte-toi.";
  }
  if (text.includes("email not confirmed")) {
    return "Confirme d’abord l’e-mail envoyé par Happy Learn.";
  }
  if (text.includes("password")) return "Le mot de passe doit contenir au moins 8 caractères.";
  if (text.includes("rate limit") || text.includes("too many")) {
    return "Trop d’essais. Attends un moment, puis réessaie.";
  }
  return "La connexion n’a pas abouti. Vérifie l’e-mail, puis réessaie.";
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
