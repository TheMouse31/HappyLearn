/**
 * Smoke checks for standardized step kinds (blanks / audio / choice).
 * Run: node scripts/smoke-step-kinds.mjs
 */
import assert from "node:assert/strict";

// Lightweight mirror of engine helpers (DOM-free) for CI-less smoke.
function normalize(raw) {
  return raw.trim().replace(/\s+/g, "").replace(",", "/").toLowerCase();
}
function normalizeText(raw) {
  return raw.trim().replace(/\s+/g, " ").toLowerCase();
}
function countBlanks(statement) {
  const plain = statement.replace(/<[^>]*>/g, " ");
  return plain.match(/_{2,}/g)?.length ?? 0;
}
function validateBlanks(expected, raw) {
  const expectedParts = expected.split("|").map((p) => normalizeText(p)).filter(Boolean);
  if (expectedParts.length === 1) {
    return normalizeText(raw.replace(/\|/g, " ")) === expectedParts[0];
  }
  const gotParts = raw.split("|").map((p) => normalizeText(p));
  return (
    gotParts.length === expectedParts.length &&
    gotParts.every((part, i) => part === expectedParts[i])
  );
}

assert.equal(countBlanks("Le ___ court."), 1);
assert.equal(countBlanks("Le ___ et le ___."), 2);
assert.equal(countBlanks("<p>Le ___</p>"), 1);
assert.ok(validateBlanks("chat", "Chat"));
assert.ok(validateBlanks("chat | chien", "Chat|Chien"));
assert.ok(!validateBlanks("chat | chien", "chien|chat"));
assert.equal(normalize(" 12 "), "12");
assert.equal(normalizeText("  Bon  jour "), "bon jour");

console.log("smoke-step-kinds: ok");
