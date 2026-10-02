import { useEffect, useRef, useState } from "react";
import { Screen, Section, Grid } from "@/components/Screen";
import { Tile } from "@/components/Tile";
import { StoryReader, type Story } from "@/components/StoryReader";
import { useNexus } from "@/lib/store";
import { speak } from "@/lib/speech";
import { startCalmNoise } from "@/lib/sound";

const bedtime: Story[] = [
  {
    title: "The Sleepy Moon",
    symbol: "🌙",
    pages: [
      { symbol: "🌙", text: "High in the sky, the moon gave a big, slow yawn." },
      { symbol: "⭐", text: "The stars twinkled softly, one by one." },
      { symbol: "🦉", text: "An owl whispered, goodnight, goodnight." },
      { symbol: "😴", text: "And everything below drifted off to sleep." },
    ],
  },
  {
    title: "The Quiet Ocean",
    symbol: "🌊",
    pages: [
      { symbol: "🌊", text: "The waves rolled in, and rolled out, nice and slow." },
      { symbol: "🐢", text: "A little turtle floated, calm and still." },
      { symbol: "🐚", text: "Shells rested in the warm sand." },
      { symbol: "💤", text: "The ocean hummed a gentle song until morning." },
    ],
  },
];

function Breathing() {
  const [running, setRunning] = useState(false);
  const [inhale, setInhale] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!running) return;
    let breathIn = true;
    const cycle = () => {
      setInhale(breathIn);
      speak(breathIn ? "Breathe in" : "Breathe out");
      if (!breathIn) setCount((c) => c + 1);
      breathIn = !breathIn;
    };
    cycle();
    const t = setInterval(cycle, 4000);
    return () => clearInterval(t);
  }, [running]);

  return (
    <div className="stage">
      <div className={`breath ${running && inhale ? "in" : ""}`} />
      <p className="stage-text">{running ? (inhale ? "Breathe in…" : "Breathe out…") : "Ready to breathe together?"}</p>
      {count > 0 && <p className="stage-sub">{count} calm breaths</p>}
      <div className="w-full max-w-sm">
        <Tile
          label={running ? "Stop" : "Start breathing"}
          symbol={running ? "⏸" : "🫁"}
          tone="rest"
          onSelect={() => {
            setRunning((r) => !r);
            setInhale(false);
          }}
        />
      </div>
    </div>
  );
}

export default function Rest() {
  const { log } = useNexus();
  const [view, setView] = useState<"menu" | "breathe" | "stories">("menu");
  const [story, setStory] = useState<Story | null>(null);
  const [calm, setCalm] = useState(false);
  const stopNoise = useRef<(() => void) | null>(null);

  useEffect(() => () => stopNoise.current?.(), []);

  const toggleCalm = () => {
    if (calm) {
      stopNoise.current?.();
      stopNoise.current = null;
    } else {
      stopNoise.current = startCalmNoise();
      log("rest", "Calm sound");
    }
    setCalm(!calm);
  };

  if (view === "breathe")
    return (
      <Screen title="Breathing" tone="rest" backLabel="Rest" onBack={() => setView("menu")}>
        <Breathing />
      </Screen>
    );

  if (view === "stories")
    return (
      <Screen
        title={story ? story.title : "Bedtime stories"}
        tone="rest"
        backLabel={story ? "Stories" : "Rest"}
        onBack={() => (story ? setStory(null) : setView("menu"))}
      >
        {story ? (
          <StoryReader story={story} onDone={() => setStory(null)} />
        ) : (
          <Grid cols={2}>
            {bedtime.map((s) => (
              <Tile key={s.title} label={s.title} symbol={s.symbol} tone="rest" size="lg" onSelect={() => setStory(s)} />
            ))}
          </Grid>
        )}
      </Screen>
    );

  return (
    <Screen title="Rest" tone="rest">
      <Grid cols={3}>
        <Tile label="Breathing" symbol="🫁" tone="rest" size="lg" onSelect={() => { setView("breathe"); log("rest", "Breathing"); }} />
        <Tile label={calm ? "Stop calm sound" : "Calm sound"} symbol={calm ? "🔇" : "🌊"} tone="rest" size="lg" active={calm} onSelect={toggleCalm} />
        <Tile label="Bedtime stories" symbol="📖" tone="rest" size="lg" onSelect={() => setView("stories")} />
      </Grid>
      <Section title="Tell someone">
        <Grid cols={3}>
          {["I need a break", "I want to lie down", "Too loud"].map((t) => (
            <Tile key={t} label={t} tone="social" symbol={t.includes("break") ? "✋" : t.includes("lie") ? "🛏️" : "🙉"} onSelect={() => { speak(t); log("rest", t); }} />
          ))}
        </Grid>
      </Section>
    </Screen>
  );
}
