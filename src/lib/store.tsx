import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type InputMode = "touch" | "scan" | "dwell";

export interface Settings {
  childName: string;
  inputMode: InputMode;
  /** Time each target stays highlighted in switch scanning */
  scanMs: number;
  /** How long the pointer or gaze must rest on a target to select it */
  dwellMs: number;
  voiceRate: number;
  volume: number;
  highContrast: boolean;
  largeText: boolean;
  haptics: boolean;
  pin: string;
  quickPhrases: string[];
  introSeen: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  childName: "Emma",
  inputMode: "touch",
  scanMs: 1400,
  dwellMs: 1200,
  voiceRate: 0.9,
  volume: 0.9,
  highContrast: false,
  largeText: false,
  haptics: true,
  pin: "1234",
  quickPhrases: ["I need help", "Yes", "No", "I'm all done", "More please", "I love you"],
  introSeen: false,
};

export interface LogEvent {
  t: number;
  activity: string;
  label: string;
}

const SETTINGS_KEY = "nexus.settings";
const LOG_KEY = "nexus.log";
const LOG_CAP = 500;

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

const readLog = (): LogEvent[] => {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch {
    return [];
  }
};

/** Non-hook access for utilities like speech that run outside React. */
export const getSettings = (): Settings => read(SETTINGS_KEY, DEFAULT_SETTINGS);

interface NexusContext {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  events: LogEvent[];
  log: (activity: string, label: string) => void;
  clearLog: () => void;
  resetAll: () => void;
}

const Ctx = createContext<NexusContext | null>(null);

export function NexusProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => getSettings());
  const [events, setEvents] = useState<LogEvent[]>(() => readLog());

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable: settings still work for this session */
    }
    const root = document.documentElement;
    root.toggleAttribute("data-contrast", settings.highContrast);
    root.toggleAttribute("data-large", settings.largeText);
    root.dataset.mode = settings.inputMode;
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(events));
    } catch {
      /* ignore */
    }
  }, [events]);

  const update = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const log = useCallback(
    (activity: string, label: string) =>
      setEvents((e) => [...e, { t: Date.now(), activity, label }].slice(-LOG_CAP)),
    [],
  );
  const clearLog = useCallback(() => setEvents([]), []);
  const resetAll = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS, introSeen: true });
    setEvents([]);
  }, []);

  return <Ctx.Provider value={{ settings, update, events, log, clearLog, resetAll }}>{children}</Ctx.Provider>;
}

export const useNexus = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNexus must be used inside NexusProvider");
  return ctx;
};
