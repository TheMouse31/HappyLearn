/**
 * Smoke test logique stats QCM / indices (copie minimale, sans imports TS).
 */
function normalizeRaw(value) {
  return value.trim().toLocaleLowerCase("fr-FR");
}

function detectQcmExhaustedSteps(answers, sessions = []) {
  const sessionById = new Map(sessions.map((s) => [s.id, s]));
  const byStep = new Map();
  for (const answer of answers) {
    const key = `${answer.sessionId}::${answer.stepId}`;
    const list = byStep.get(key) ?? [];
    list.push(answer);
    byStep.set(key, list);
  }
  const exhausted = [];
  for (const [, list] of byStep) {
    const first = list[0];
    const session = sessionById.get(first.sessionId);
    let optionCount =
      list.find((item) => item.qcmOptionCount != null && item.qcmOptionCount >= 2)
        ?.qcmOptionCount ?? null;
    if (optionCount == null && session?.mode === "qcm") optionCount = 3;
    if (optionCount == null || optionCount < 2) continue;
    const distinct = new Set(list.map((item) => normalizeRaw(item.raw)).filter(Boolean));
    if (distinct.size < optionCount) continue;
    exhausted.push({
      sessionId: first.sessionId,
      stepId: first.stepId,
      optionsTried: distinct.size,
      optionCount,
    });
  }
  return exhausted;
}

const sessions = [{ id: "sess-1", mode: "qcm", missionId: "m1" }];
const answers = [
  { sessionId: "sess-1", stepId: "q1", raw: "A", correct: false, qcmOptionCount: 3 },
  { sessionId: "sess-1", stepId: "q1", raw: "B", correct: false, qcmOptionCount: 3 },
  { sessionId: "sess-1", stepId: "q1", raw: "C", correct: true, qcmOptionCount: 3 },
  { sessionId: "sess-1", stepId: "q2", raw: "A", correct: false, qcmOptionCount: 3 },
  { sessionId: "sess-1", stepId: "q2", raw: "C", correct: true, qcmOptionCount: 3 },
];

const exhausted = detectQcmExhaustedSteps(answers, sessions);
console.log(JSON.stringify(exhausted, null, 2));
if (exhausted.length !== 1 || exhausted[0].stepId !== "q1") {
  console.error("FAIL");
  process.exit(1);
}
console.log("OK smoke-student-stats");
