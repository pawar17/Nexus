import { useEffect, useState } from "react";
import { Screen, Grid } from "@/components/Screen";
import { Tile } from "@/components/Tile";
import { useNexus } from "@/lib/store";
import { speak } from "@/lib/speech";
import { chime, tone } from "@/lib/sound";

type Item = { name: string; symbol: string };

const sets: Record<string, { label: string; symbol: string; items: Item[] }> = {
  colors: {
    label: "Colors",
    symbol: "🎨",
    items: [
      { name: "red", symbol: "🟥" },
      { name: "blue", symbol: "🟦" },
      { name: "green", symbol: "🟩" },
      { name: "yellow", symbol: "🟨" },
      { name: "orange", symbol: "🟧" },
      { name: "purple", symbol: "🟪" },
    ],
  },
  shapes: {
    label: "Shapes",
    symbol: "🔷",
    items: [
      { name: "circle", symbol: "⚪" },
      { name: "square", symbol: "⬛" },
      { name: "triangle", symbol: "🔺" },
      { name: "star", symbol: "⭐" },
      { name: "heart", symbol: "❤️" },
      { name: "diamond", symbol: "🔷" },
    ],
  },
  numbers: {
    label: "Numbers",
    symbol: "🔢",
    items: [
      { name: "one", symbol: "1" },
      { name: "two", symbol: "2" },
      { name: "three", symbol: "3" },
      { name: "four", symbol: "4" },
      { name: "five", symbol: "5" },
      { name: "six", symbol: "6" },
    ],
  },
  animals: {
    label: "Animals",
    symbol: "🐾",
    items: [
      { name: "dog", symbol: "🐶" },
      { name: "cat", symbol: "🐱" },
      { name: "cow", symbol: "🐮" },
      { name: "duck", symbol: "🦆" },
      { name: "lion", symbol: "🦁" },
      { name: "fish", symbol: "🐟" },
    ],
  },
};

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function FindIt({ items, onScore }: { items: Item[]; onScore: () => void }) {
  const [round, setRound] = useState(() => makeRound(items));
  const [wrong, setWrong] = useState<string | null>(null);
  const [right, setRight] = useState(false);

  useEffect(() => {
    speak(`Find the ${round.answer.name}`);
  }, [round]);

  return (
    <>
      <div className="stage mb-5" style={{ minHeight: 0 }}>
        <p className="stage-text">{right ? `Yes! That's the ${round.answer.name}!` : `Find the ${round.answer.name}`}</p>
      </div>
      <Grid cols={3}>
        {round.choices.map((c) => (
          <Tile
            key={c.name}
            label={c.name}
            symbol={c.symbol}
            tone="learn"
            size="lg"
            active={right && c.name === round.answer.name}
            disabled={right || wrong === c.name}
            onSelect={() => {
              if (c.name === round.answer.name) {
                setRight(true);
                chime();
                speak(`Yes! ${c.name}!`);
                onScore();
                setTimeout(() => {
                  setRight(false);
                  setWrong(null);
                  setRound(makeRound(items));
                }, 1800);
              } else {
                setWrong(c.name);
                tone(220, 250);
                speak(`That's ${c.name}. Try again.`);
              }
            }}
          />
        ))}
      </Grid>
    </>
  );
}

function makeRound(items: Item[]) {
  const choices = shuffle(items).slice(0, 3);
  return { choices, answer: choices[Math.floor(Math.random() * choices.length)] };
}

export default function Learn() {
  const { log } = useNexus();
  const [setId, setSetId] = useState<string | null>(null);
  const [mode, setMode] = useState<"explore" | "find" | null>(null);
  const [score, setScore] = useState(0);

  if (setId && mode) {
    const s = sets[setId];
    return (
      <Screen title={`${s.label}${mode === "find" ? ` · ${score} found` : ""}`} tone="learn" backLabel={s.label} onBack={() => setMode(null)}>
        {mode === "explore" ? (
          <Grid cols={3}>
            {s.items.map((it) => (
              <Tile key={it.name} label={it.name} symbol={it.symbol} tone="learn" size="lg" onSelect={() => speak(it.name)} />
            ))}
          </Grid>
        ) : (
          <FindIt
            items={s.items}
            onScore={() => {
              setScore((n) => n + 1);
              log("learn", `Found ${s.label.toLowerCase()}`);
            }}
          />
        )}
      </Screen>
    );
  }

  if (setId) {
    const s = sets[setId];
    return (
      <Screen title={s.label} tone="learn" backLabel="Learn" onBack={() => setSetId(null)}>
        <Grid cols={2}>
          <Tile label="Explore" symbol="👀" tone="learn" size="lg" onSelect={() => setMode("explore")} />
          <Tile
            label="Find it game"
            symbol="🎯"
            tone="learn"
            size="lg"
            onSelect={() => {
              setScore(0);
              setMode("find");
            }}
          />
        </Grid>
      </Screen>
    );
  }

  return (
    <Screen title="Learn" tone="learn">
      <Grid cols={2}>
        {Object.entries(sets).map(([id, s]) => (
          <Tile key={id} label={s.label} symbol={s.symbol} tone="learn" size="lg" onSelect={() => setSetId(id)} />
        ))}
      </Grid>
    </Screen>
  );
}
