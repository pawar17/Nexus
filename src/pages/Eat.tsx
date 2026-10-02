import { useState } from "react";
import { Screen, Section, Grid } from "@/components/Screen";
import { Tile } from "@/components/Tile";
import { useNexus } from "@/lib/store";
import { speak } from "@/lib/speech";
import { chime } from "@/lib/sound";

const needs = [
  { text: "I'm hungry", symbol: "😋" },
  { text: "I'm thirsty", symbol: "💧" },
  { text: "More please", symbol: "➕" },
  { text: "All done", symbol: "🏁" },
  { text: "Too hot", symbol: "🥵" },
  { text: "Smaller bite", symbol: "🥄" },
];

const menus: Record<string, { label: string; symbol: string; items: { text: string; symbol: string }[] }> = {
  breakfast: {
    label: "Breakfast",
    symbol: "🥞",
    items: [
      { text: "pancakes", symbol: "🥞" },
      { text: "cereal", symbol: "🥣" },
      { text: "toast", symbol: "🍞" },
      { text: "eggs", symbol: "🍳" },
      { text: "banana", symbol: "🍌" },
      { text: "yogurt", symbol: "🥛" },
    ],
  },
  lunch: {
    label: "Lunch",
    symbol: "🥪",
    items: [
      { text: "sandwich", symbol: "🥪" },
      { text: "soup", symbol: "🍲" },
      { text: "pasta", symbol: "🍝" },
      { text: "rice", symbol: "🍚" },
      { text: "pizza", symbol: "🍕" },
      { text: "salad", symbol: "🥗" },
    ],
  },
  snack: {
    label: "Snack",
    symbol: "🍪",
    items: [
      { text: "apple", symbol: "🍎" },
      { text: "crackers", symbol: "🍘" },
      { text: "cookie", symbol: "🍪" },
      { text: "grapes", symbol: "🍇" },
      { text: "cheese", symbol: "🧀" },
      { text: "popcorn", symbol: "🍿" },
    ],
  },
  drink: {
    label: "Drinks",
    symbol: "🧃",
    items: [
      { text: "water", symbol: "💧" },
      { text: "milk", symbol: "🥛" },
      { text: "juice", symbol: "🧃" },
      { text: "smoothie", symbol: "🥤" },
    ],
  },
};

export default function Eat() {
  const { log } = useNexus();
  const [menu, setMenu] = useState<string | null>(null);
  const [picked, setPicked] = useState<{ text: string; symbol: string } | null>(null);

  const say = (text: string) => {
    speak(text);
    log("eat", text);
  };

  if (menu) {
    const m = menus[menu];
    return (
      <Screen title={m.label} tone="eat" backLabel="Meals" onBack={() => { setMenu(null); setPicked(null); }}>
        {picked && (
          <div className="stage mb-6" style={{ minHeight: 0 }}>
            <div className="stage-symbol">{picked.symbol}</div>
            <p className="stage-text">I want {picked.text}, please</p>
          </div>
        )}
        <Grid cols={3}>
          {m.items.map((it) => (
            <Tile
              key={it.text}
              label={it.text}
              symbol={it.symbol}
              tone="thing"
              size="lg"
              active={picked?.text === it.text}
              onSelect={() => {
                setPicked(it);
                chime();
                say(`I want ${it.text}, please`);
              }}
            />
          ))}
        </Grid>
      </Screen>
    );
  }

  return (
    <Screen title="Eat" tone="eat">
      <Section title="At the table">
        <Grid cols={3}>
          {needs.map((n) => (
            <Tile key={n.text} label={n.text} symbol={n.symbol} tone="social" onSelect={() => say(n.text)} />
          ))}
        </Grid>
      </Section>
      <Section title="Choose food">
        <Grid cols={4}>
          {Object.entries(menus).map(([id, m]) => (
            <Tile key={id} label={m.label} symbol={m.symbol} tone="eat" size="lg" onSelect={() => setMenu(id)} />
          ))}
        </Grid>
      </Section>
    </Screen>
  );
}
