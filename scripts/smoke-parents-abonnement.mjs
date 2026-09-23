function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL", msg);
    process.exit(1);
  }
}
const ACTIVE = ["active", "trialing"];
function isActive(sub) {
  if (!sub) return false;
  if (!ACTIVE.includes(sub.status)) return false;
  if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd).getTime() < Date.now()) return false;
  return true;
}
assert(isActive({ status: "active", currentPeriodEnd: null }), "active null end");
assert(!isActive({ status: "active", currentPeriodEnd: new Date(Date.now() - 1000).toISOString() }), "expired");
assert(isActive({ status: "trialing", currentPeriodEnd: null }), "trialing");
assert(!isActive({ status: "canceled", currentPeriodEnd: null }), "canceled");
console.log("OK smoke-parents-abonnement");
