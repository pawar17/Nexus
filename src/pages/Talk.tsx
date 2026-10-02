import { useState, type CSSProperties } from "react";
import { Screen, Section, Grid } from "@/components/Screen";
import { Tile, type Tone } from "@/components/Tile";
import { useNexus } from "@/lib/store";
import { speak } from "@/lib/speech";

type Word = { text: string; symbol: string; tone: Tone };

const boards: { id: string; label: string; symbol: string; words: Word[] }[] = [
  {
    id: "core",
    label: "Core",
    symbol: "⭐",
    words: [
      { text: "I", symbol: "🙋", tone: "people" },
      { text: "you", symbol: "👉", tone: "people" },
      { text: "want", symbol: "🤲", tone: "action" },
      { text: "like", symbol: "👍", tone: "action" },
      { text: "go", symbol: "🚶", tone: "action" },
      { text: "stop", symbol: "✋", tone: "action" },
      { text: "help", symbol: "🆘", tone: "action" },
      { text: "more", symbol: "➕", tone: "describe" },
      { text: "not", symbol: "🚫", tone: "describe" },
      { text: "all done", symbol: "🏁", tone: "social" },
      { text: "what", symbol: "❓", tone: "question" },
      { text: "where", symbol: "📍", tone: "question" },
    ],
  },
  {
    id: "feel",
    label: "Feelings",
    symbol: "💛",
    words: [
      { text: "happy", symbol: "😄", tone: "describe" },
      { text: "sad", symbol: "😢", tone: "describe" },
      { text: "tired", symbol: "😴", tone: "describe" },
      { text: "angry", symbol: "😠", tone: "describe" },
      { text: "scared", symbol: "😨", tone: "describe" },
      { text: "excited", symbol: "🤩", tone: "describe" },
      { text: "uncomfortable", symbol: "😣", tone: "describe" },
      { text: "okay", symbol: "🙂", tone: "describe" },
    ],
  },
  {
    id: "body",
    label: "Body",
    symbol: "🩹",
    words: [
      { text: "hurts", symbol: "🤕", tone: "action" },
      { text: "head", symbol: "🧠", tone: "thing" },
      { text: "tummy", symbol: "🫃", tone: "thing" },
      { text: "arm", symbol: "💪", tone: "thing" },
      { text: "leg", symbol: "🦵", tone: "thing" },
      { text: "back", symbol: "🧍", tone: "thing" },
      { text: "too hot", symbol: "🥵", tone: "describe" },
      { text: "too cold", symbol: "🥶", tone: "describe" },
      { text: "move me", symbol: "🔄", tone: "action" },
      { text: "bathroom", symbol: "🚽", tone: "thing" },
    ],
  },
  {
    id: "people",
    label: "People",
    symbol: "👪",
    words: [
      { text: "Mom", symbol: "👩", tone: "people" },
      { text: "Dad", symbol: "👨", tone: "people" },
      { text: "teacher", symbol: "🧑‍🏫", tone: "people" },
      { text: "therapist", symbol: "🧑‍⚕️", tone: "people" },
      { text: "friend", symbol: "🧒", tone: "people" },
      { text: "nurse", symbol: "🩺", tone: "people" },
    ],
  },
];

export default function Talk() {
  const { settings, log } = useNexus();
  const [board, setBoard] = useState("quick");
  const [sentence, setSentence] = useState<Word[]>([]);

  const say = (text: string) => {
    speak(text);
    log("talk", text);
  };

  const add = (w: Word) => {
    speak(w.text);
    setSentence((s) => [...s, w]);
  };

  const current = boards.find((b) => b.id === board);
  const sentenceText = sentence.map((w) => w.text).join(" ");

  return (
    <Screen title="Talk" tone="talk">
      <div className="strip">
        <div className="strip-words" aria-live="polite">
          {sentence.length === 0 ? (
            <span className="placeholder">Build a sentence with the words below</span>
          ) : (
            sentence.map((w, i) => (
              <span key={i} className="strip-chip" style={{ "--chip": `var(--tone-${w.tone})` } as CSSProperties}>
                <span aria-hidden>{w.symbol}</span>
                {w.text}
              </span>
            ))
          )}
        </div>
        <Tile label="Speak" symbol="🔊" tone="talk" disabled={!sentence.length} onSelect={() => say(sentenceText)} />
        <Tile label="Undo" symbol="⌫" disabled={!sentence.length} onSelect={() => setSentence((s) => s.slice(0, -1))} />
        <Tile label="Clear" symbol="✕" disabled={!sentence.length} onSelect={() => setSentence([])} />
      </div>

      <Section>
        <Grid cols={5}>
          <Tile label="Quick" symbol="⚡" size="sm" active={board === "quick"} onSelect={() => setBoard("quick")} tone="talk" />
          {boards.map((b) => (
            <Tile key={b.id} label={b.label} symbol={b.symbol} size="sm" active={board === b.id} onSelect={() => setBoard(b.id)} tone="talk" />
          ))}
        </Grid>
      </Section>

      <Section title={board === "quick" ? "Says it right away" : "Adds to your sentence"}>
        {board === "quick" ? (
          <Grid cols={3}>
            {settings.quickPhrases.map((p) => (
              <Tile key={p} label={p} tone="social" size="lg" symbol={quickSymbol(p)} onSelect={() => say(p)} />
            ))}
          </Grid>
        ) : (
          <Grid cols={4}>
            {current?.words.map((w) => (
              <Tile key={w.text} label={w.text} symbol={w.symbol} tone={w.tone} onSelect={() => add(w)} />
            ))}
          </Grid>
        )}
      </Section>
    </Screen>
  );
}

const quickSymbol = (p: string) => {
  const s = p.toLowerCase();
  if (s.includes("help")) return "🙋";
  if (s === "yes") return "✅";
  if (s === "no") return "❌";
  if (s.includes("done")) return "🏁";
  if (s.includes("more")) return "➕";
  if (s.includes("love")) return "❤️";
  if (s.includes("hurt")) return "🤕";
  if (s.includes("water") || s.includes("drink")) return "💧";
  return "💬";
};
