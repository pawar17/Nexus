import { useState } from "react";
import { Screen, Section, Grid } from "@/components/Screen";
import { Tile } from "@/components/Tile";
import { StoryReader, type Story } from "@/components/StoryReader";
import { useNexus } from "@/lib/store";
import { speak } from "@/lib/speech";
import { tone, chime } from "@/lib/sound";

const pops = [
  { label: "Fireworks", symbol: "🎆", sound: [523, 784, 1047] },
  { label: "Bubbles", symbol: "🫧", sound: [880, 988, 1175] },
  { label: "Drum", symbol: "🥁", sound: [110, 98] },
  { label: "Rocket", symbol: "🚀", sound: [262, 392, 523, 784] },
  { label: "Party", symbol: "🎉", sound: [659, 784, 988] },
  { label: "Animals", symbol: "🐶", sound: [440, 330] },
];

const notes = [
  { label: "Do", f: 262, symbol: "🔴" },
  { label: "Re", f: 294, symbol: "🟠" },
  { label: "Mi", f: 330, symbol: "🟡" },
  { label: "Fa", f: 349, symbol: "🟢" },
  { label: "Sol", f: 392, symbol: "🔵" },
  { label: "La", f: 440, symbol: "🟣" },
  { label: "Ti", f: 494, symbol: "🟤" },
  { label: "Do!", f: 523, symbol: "⚪" },
];

export const stories: Story[] = [
  {
    title: "Pip the Little Robot",
    symbol: "🤖",
    pages: [
      { symbol: "🤖", text: "Pip was a little robot who loved to help." },
      { symbol: "🌧️", text: "One rainy day, Pip saw a flower bending in the wind." },
      { symbol: "☂️", text: "Pip held up a tiny umbrella. The flower stayed dry." },
      { symbol: "🌻", text: "When the sun came out, the flower bloomed bright and tall. Pip smiled." },
    ],
  },
  {
    title: "The Kite Who Wanted to Fly",
    symbol: "🪁",
    pages: [
      { symbol: "🪁", text: "Kiki the kite sat in the closet, dreaming of the sky." },
      { symbol: "🧒", text: "A girl named Mia took Kiki to the park." },
      { symbol: "💨", text: "Whoosh! The wind lifted Kiki higher and higher." },
      { symbol: "☁️", text: "Kiki danced with the clouds. It was the best day ever." },
    ],
  },
  {
    title: "Bear's Big Hug",
    symbol: "🐻",
    pages: [
      { symbol: "🐻", text: "Bear had the biggest hug in the whole forest." },
      { symbol: "🦊", text: "Fox was sad, so Bear gave Fox a big hug." },
      { symbol: "🐰", text: "Rabbit was scared, so Bear gave Rabbit a big hug." },
      { symbol: "💛", text: "Then all the animals hugged Bear back. Everyone felt warm." },
    ],
  },
];

type Mode = "menu" | "pop" | "music" | "stories";

export default function Play() {
  const { log } = useNexus();
  const [mode, setMode] = useState<Mode>("menu");
  const [burst, setBurst] = useState<{ key: number; symbol: string } | null>(null);
  const [story, setStory] = useState<Story | null>(null);

  const back = () => {
    if (story) return setStory(null);
    setMode("menu");
  };

  if (mode === "pop")
    return (
      <Screen title="Make it happen" tone="play" backLabel="Play" onBack={back}>
        <p className="mb-5 text-lg" style={{ color: "var(--muted)" }}>
          Choose one and watch what happens.
        </p>
        <Grid cols={3}>
          {pops.map((p) => (
            <Tile
              key={p.label}
              label={p.label}
              symbol={p.symbol}
              tone="play"
              size="lg"
              onSelect={() => {
                setBurst({ key: Date.now(), symbol: p.symbol });
                p.sound.forEach((f, i) => setTimeout(() => tone(f, 260, "triangle"), i * 110));
                log("play", p.label);
              }}
            />
          ))}
        </Grid>
        {burst && (
          <div key={burst.key} className="burst" aria-hidden>
            {burst.symbol}
          </div>
        )}
      </Screen>
    );

  if (mode === "music")
    return (
      <Screen title="Music" tone="play" backLabel="Play" onBack={back}>
        <Grid cols={4}>
          {notes.map((n) => (
            <Tile key={n.label} label={n.label} symbol={n.symbol} tone="play" size="lg" onSelect={() => tone(n.f, 700, "triangle")} />
          ))}
        </Grid>
        <Section>
          <Tile
            label="Play a song"
            symbol="🎵"
            tone="social"
            onSelect={() => {
              [262, 262, 392, 392, 440, 440, 392].forEach((f, i) => setTimeout(() => tone(f, 380, "triangle"), i * 420));
              log("play", "Song");
            }}
          />
        </Section>
      </Screen>
    );

  if (mode === "stories")
    return (
      <Screen title={story ? story.title : "Stories"} tone="play" backLabel={story ? "Stories" : "Play"} onBack={back}>
        {story ? (
          <StoryReader
            story={story}
            onDone={() => {
              chime();
              speak("The end!");
              setStory(null);
            }}
          />
        ) : (
          <Grid cols={3}>
            {stories.map((s) => (
              <Tile
                key={s.title}
                label={s.title}
                symbol={s.symbol}
                tone="play"
                size="lg"
                onSelect={() => {
                  setStory(s);
                  log("play", s.title);
                }}
              />
            ))}
          </Grid>
        )}
      </Screen>
    );

  return (
    <Screen title="Play" tone="play">
      <Grid cols={3}>
        <Tile label="Make it happen" symbol="✨" tone="play" size="lg" onSelect={() => setMode("pop")} />
        <Tile label="Music" symbol="🎹" tone="play" size="lg" onSelect={() => setMode("music")} />
        <Tile label="Stories" symbol="📚" tone="play" size="lg" onSelect={() => setMode("stories")} />
      </Grid>
    </Screen>
  );
}
