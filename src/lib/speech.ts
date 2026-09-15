let speaking = false;

function visibleText(): string {
  const root = document.querySelector("main");
  if (!root) return "";
  const nodes = root.querySelectorAll("h1, h2, [data-listen], .lead");
  const pieces: string[] = [];
  nodes.forEach((node) => {
    const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    if (text && !pieces.some((existing) => existing.includes(text))) {
      pieces.push(text);
    }
  });
  return pieces.join(". ");
}

export function canSpeak(): boolean {
  return "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

export function stopSpeech(): void {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  speaking = false;
}

export function isSpeaking(): boolean {
  return speaking;
}

export function toggleSpeech(): boolean {
  if (!canSpeak()) return false;
  if (speaking) {
    stopSpeech();
    return false;
  }
  const text = visibleText();
  if (!text) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.92;
  utterance.pitch = 1.12;
  const voices = window.speechSynthesis.getVoices();
  utterance.voice =
    voices.find(
      (voice) =>
        voice.lang.toLowerCase() === "fr-fr" &&
        /premium|enhanced|thomas|audrey|amélie|aurelie/i.test(voice.name),
    ) ??
    voices.find((voice) => voice.lang.toLowerCase() === "fr-fr") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("fr")) ??
    null;
  speaking = true;
  utterance.onend = () => {
    speaking = false;
  };
  utterance.onerror = () => {
    speaking = false;
  };
  window.speechSynthesis.speak(utterance);
  return true;
}
