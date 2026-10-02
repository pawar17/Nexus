import { getSettings } from "./store";

let ctx: AudioContext | null = null;
const audio = () => {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

/** A soft sine note, used by Music and as feedback. */
export const tone = (freq: number, ms = 450, type: OscillatorType = "sine") => {
  const a = audio();
  const osc = a.createOscillator();
  const gain = a.createGain();
  const vol = getSettings().volume * 0.25;
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, a.currentTime);
  gain.gain.linearRampToValueAtTime(vol, a.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + ms / 1000);
  osc.connect(gain).connect(a.destination);
  osc.start();
  osc.stop(a.currentTime + ms / 1000 + 0.05);
};

export const chime = () => {
  tone(659, 220);
  setTimeout(() => tone(988, 380), 120);
};

/** Gentle brown noise for the Rest activity. Returns a stop function. */
export const startCalmNoise = () => {
  const a = audio();
  const size = 2 * a.sampleRate;
  const buffer = a.createBuffer(1, size, a.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < size; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const src = a.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const gain = a.createGain();
  gain.gain.value = getSettings().volume * 0.35;
  src.connect(gain).connect(a.destination);
  src.start();
  return () => src.stop();
};
