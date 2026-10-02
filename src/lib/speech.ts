import { getSettings } from "./store";

/** Speak text aloud with the child's saved voice speed and volume. */
export const speak = (text: string) => {
  if (!("speechSynthesis" in window)) return;
  const { voiceRate, volume } = getSettings();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = voiceRate;
  u.volume = volume;
  u.pitch = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
};

export const stopSpeaking = () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
};

export const buzz = () => {
  if (getSettings().haptics && "vibrate" in navigator) navigator.vibrate(12);
};
