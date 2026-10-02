import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tile, type Tone } from "@/components/Tile";
import { useNexus, type InputMode } from "@/lib/store";
import { speak } from "@/lib/speech";

const activities: { id: Tone; label: string; symbol: string }[] = [
  { id: "talk", label: "Talk", symbol: "💬" },
  { id: "eat", label: "Eat", symbol: "🍎" },
  { id: "play", label: "Play", symbol: "🎈" },
  { id: "learn", label: "Learn", symbol: "🔤" },
  { id: "rest", label: "Rest", symbol: "🌙" },
  { id: "therapy", label: "Therapy", symbol: "🤸" },
];

const modeHint: Record<InputMode, string> = {
  touch: "Tap a tile",
  scan: "Press Space or tap anywhere",
  dwell: "Look at a tile to choose",
};

const modeName: Record<InputMode, string> = { touch: "Touch", scan: "Switch scanning", dwell: "Eye gaze / dwell" };

export default function Home() {
  const { settings, log } = useNexus();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <main className="screen">
      <header className="home-head">
        <div>
          <h1 className="home-greet">
            {part}, {settings.childName}
          </h1>
          <p className="home-time">
            {now.toLocaleDateString("en-US", { weekday: "long" })} · {now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        <span className="mode-pill">
          <b>{modeName[settings.inputMode]}</b>
          <span aria-hidden>·</span>
          {modeHint[settings.inputMode]}
        </span>
      </header>

      <div className="grid-tiles cols-3">
        {activities.map((a) => (
          <Tile
            key={a.id}
            label={a.label}
            symbol={a.symbol}
            tone={a.id}
            size="xl"
            onSelect={() => {
              speak(a.label);
              log("home", a.label);
              navigate(`/${a.id}`);
            }}
          />
        ))}
      </div>

      <Link to="/caregiver" className="caregiver-link" data-allow-click>
        Caregiver
      </Link>
    </main>
  );
}

export function Intro() {
  const { settings, update } = useNexus();
  if (settings.introSeen) return null;

  const choose = (inputMode: InputMode) => update({ inputMode, introSeen: true });

  return (
    <div className="sheet-backdrop" data-allow-click>
      <div className="sheet" role="dialog" aria-labelledby="intro-title">
        <h2 id="intro-title" className="text-3xl font-bold tracking-tight">NEXUS</h2>
        <p className="mt-2 text-[1.05rem] leading-relaxed" style={{ color: "var(--muted)" }}>
          One activity-based interface for children with cerebral palsy: talking, eating, playing, learning, resting and
          therapy in one place, usable by touch, a single switch, or eye gaze.
        </p>
        <p className="mt-6 mb-3 font-semibold">How should {settings.childName} choose?</p>
        <div className="grid gap-3">
          <button className="choice" onClick={() => choose("touch")}>
            <span className="icon">👆</span>
            <div>
              <b>Touch</b>
              <span>Tap tiles directly.</span>
            </div>
          </button>
          <button className="choice" onClick={() => choose("scan")}>
            <span className="icon">🔘</span>
            <div>
              <b>Switch scanning</b>
              <span>Tiles light up one at a time. Press Space, Enter, or tap anywhere to pick the lit one.</span>
            </div>
          </button>
          <button className="choice" onClick={() => choose("dwell")}>
            <span className="icon">👁️</span>
            <div>
              <b>Eye gaze / dwell</b>
              <span>Rest the pointer on a tile for about a second to pick it. Works with eye trackers and head pointers.</span>
            </div>
          </button>
        </div>
        <p className="mt-6 text-sm" style={{ color: "var(--muted)" }}>
          Caregivers can change this anytime under <b>Caregiver</b> (bottom right, demo PIN 1234).{" "}
          <a className="underline" href="https://github.com/pawar17/Nexus#readme" target="_blank" rel="noreferrer">
            Read the case study
          </a>
        </p>
      </div>
    </div>
  );
}
