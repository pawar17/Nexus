import { useEffect, useState } from "react";
import { Screen, Section, Grid } from "@/components/Screen";
import { Tile } from "@/components/Tile";
import { useNexus } from "@/lib/store";
import { speak } from "@/lib/speech";
import { chime } from "@/lib/sound";

type Exercise = { id: string; name: string; symbol: string; seconds: number; steps: string[] };

/** A short daily routine a therapist would set; caregivers guide, NEXUS paces and counts. */
const routine: Exercise[] = [
  { id: "reach", name: "Reach up", symbol: "🙌", seconds: 20, steps: ["Reach your arms up high", "Hold it", "Slowly bring them down"] },
  { id: "hands", name: "Open and close hands", symbol: "✊", seconds: 20, steps: ["Squeeze your hands tight", "Now open them wide", "Squeeze again"] },
  { id: "head", name: "Head turns", symbol: "↔️", seconds: 20, steps: ["Look to the left", "Look to the middle", "Look to the right"] },
  { id: "shoulders", name: "Shoulder rolls", symbol: "🔄", seconds: 20, steps: ["Lift your shoulders up", "Roll them back", "Let them drop"] },
  { id: "breaths", name: "Big breaths", symbol: "🫁", seconds: 20, steps: ["Breathe in through your nose", "Hold it", "Blow out slowly"] },
];

const KEY = "nexus.therapy";
const today = () => new Date().toISOString().slice(0, 10);
type History = Record<string, string[]>;
const readHistory = (): History => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

function Session({ ex, onDone }: { ex: Exercise; onDone: () => void }) {
  const [left, setLeft] = useState(ex.seconds);
  const [running, setRunning] = useState(true);
  const step = ex.steps[Math.min(ex.steps.length - 1, Math.floor(((ex.seconds - left) / ex.seconds) * ex.steps.length))];

  useEffect(() => {
    if (!running || left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, running]);

  useEffect(() => {
    if (running) speak(step);
  }, [step, running]);

  useEffect(() => {
    if (left === 0) {
      chime();
      speak("Great job!");
    }
  }, [left]);

  return (
    <>
      <div className="stage">
        <div className="stage-symbol">{ex.symbol}</div>
        <p className="stage-text">{left === 0 ? "Great job!" : step}</p>
        <p className="stage-sub">{left > 0 ? `${left} seconds` : "Done"}</p>
        <div className="progress w-full max-w-md">
          <div style={{ width: `${((ex.seconds - left) / ex.seconds) * 100}%` }} />
        </div>
      </div>
      <div className="mt-5">
        <Grid cols={2}>
          {left > 0 ? (
            <Tile label={running ? "Pause" : "Keep going"} symbol={running ? "⏸" : "▶"} onSelect={() => setRunning(!running)} />
          ) : (
            <Tile label="Again" symbol="🔁" onSelect={() => { setLeft(ex.seconds); setRunning(true); }} />
          )}
          <Tile label="Finished" symbol="✅" tone="action" onSelect={onDone} />
        </Grid>
      </div>
    </>
  );
}

export default function Therapy() {
  const { log } = useNexus();
  const [history, setHistory] = useState<History>(readHistory);
  const [active, setActive] = useState<Exercise | null>(null);
  const done = history[today()] ?? [];

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(history));
    } catch {
      /* ignore */
    }
  }, [history]);

  const finish = (ex: Exercise) => {
    setHistory((h) => ({ ...h, [today()]: Array.from(new Set([...(h[today()] ?? []), ex.id])) }));
    log("therapy", ex.name);
    setActive(null);
  };

  // Last 7 days, oldest first
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { label: d.toLocaleDateString("en-US", { weekday: "narrow" }), n: history[key]?.length ?? 0 };
  });

  if (active)
    return (
      <Screen title={active.name} tone="therapy" backLabel="Routine" onBack={() => setActive(null)}>
        <Session ex={active} onDone={() => finish(active)} />
      </Screen>
    );

  return (
    <Screen title="Therapy" tone="therapy">
      <div className="stage" style={{ minHeight: 0, placeItems: "stretch", textAlign: "left" }}>
        <div className="flex items-baseline justify-between">
          <p className="text-xl font-semibold">Today's routine</p>
          <p style={{ color: "var(--muted)" }}>
            {done.length} of {routine.length} done
          </p>
        </div>
        <div className="progress">
          <div style={{ width: `${(done.length / routine.length) * 100}%` }} />
        </div>
        <div className="flex gap-2 justify-between mt-1" aria-label="This week">
          {week.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className="mx-auto mb-1 rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  background: d.n ? "var(--accent)" : "color-mix(in srgb, var(--accent) 14%, var(--surface))",
                  opacity: d.n ? 0.35 + 0.65 * (d.n / routine.length) : 1,
                }}
              />
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Section title="Choose an exercise">
        <Grid cols={3}>
          {routine.map((ex) => (
            <Tile
              key={ex.id}
              label={done.includes(ex.id) ? `${ex.name} ✓` : ex.name}
              symbol={ex.symbol}
              tone="therapy"
              size="lg"
              active={done.includes(ex.id)}
              onSelect={() => setActive(ex)}
            />
          ))}
        </Grid>
      </Section>
    </Screen>
  );
}
