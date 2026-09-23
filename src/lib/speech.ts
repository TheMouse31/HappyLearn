let speaking = false;
type SpeechListener = (active: boolean) => void;
const listeners = new Set<SpeechListener>();

function notify(): void {
  for (const listener of listeners) listener(speaking);
}

export function subscribeSpeech(listener: SpeechListener): () => void {
  listeners.add(listener);
  listener(speaking);
  return () => {
    listeners.delete(listener);
  };
}

function contentRoot(): Element {
  return (
    document.querySelector(".window") ??
    document.querySelector("main") ??
    document.querySelector(".app-shell") ??
    document.body
  );
}

function visibleText(): string {
  const root = contentRoot();
  const nodes = root.querySelectorAll("h1, h2, [data-listen], .lead, .kicker, .field-help");
  const pieces: string[] = [];
  nodes.forEach((node) => {
    if (node.closest("button, .suivi-modal, .listen")) return;
    const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    if (text.length < 2) return;
    if (pieces.some((existing) => existing.includes(text) || text.includes(existing))) return;
    pieces.push(text);
  });
  return pieces.join(". ");
}

export function canSpeak(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

export function stopSpeech(): void {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  speaking = false;
  notify();
}

export function isSpeaking(): boolean {
  return speaking;
}

/** Prefers French voices; Chrome often loads them asynchronously. */
function pickFrenchVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  return (
    voices.find(
      (voice) =>
        voice.lang.toLowerCase() === "fr-fr" &&
        /premium|enhanced|thomas|audrey|amélie|aurelie|google français|google french/i.test(voice.name),
    ) ??
    voices.find((voice) => voice.lang.toLowerCase() === "fr-fr") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("fr")) ??
    null
  );
}

export function toggleSpeech(): boolean {
  if (!canSpeak()) return false;
  if (speaking) {
    stopSpeech();
    return false;
  }
  const text = visibleText();
  if (!text) return false;
  return speakText(text);
}

/** Lit un texte précis (étapes « Écoute », indices ciblés). */
export function speakText(text: string): boolean {
  if (!canSpeak()) return false;
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = "fr-FR";
  utterance.rate = 0.92;
  utterance.pitch = 1.12;
  utterance.voice = pickFrenchVoice();

  speaking = true;
  notify();

  utterance.onend = () => {
    speaking = false;
    notify();
  };
  utterance.onerror = () => {
    speaking = false;
    notify();
  };

  const startSpeaking = () => {
    utterance.voice = pickFrenchVoice();
    window.speechSynthesis.speak(utterance);
  };

  const voicesReady = window.speechSynthesis.getVoices().length > 0;
  if (!voicesReady) {
    const onVoices = () => {
      startSpeaking();
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    window.setTimeout(() => {
      if (speaking && !window.speechSynthesis.speaking) startSpeaking();
    }, 250);
  } else {
    startSpeaking();
  }
  return true;
}
