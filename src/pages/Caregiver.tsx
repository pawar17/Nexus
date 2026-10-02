import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNexus, type InputMode } from "@/lib/store";
import { speak } from "@/lib/speech";

function PinGate({ pin, onUnlock }: { pin: string; onUnlock: () => void }) {
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);

  const press = (k: string) => {
    if (k === "⌫") return setEntry((e) => e.slice(0, -1));
    const next = (entry + k).slice(0, 4);
    setEntry(next);
    setError(false);
    if (next.length === 4) {
      if (next === pin) onUnlock();
      else {
        setError(true);
        setTimeout(() => setEntry(""), 400);
      }
    }
  };

  return (
    <main className="screen grid place-items-center" style={{ minHeight: "100vh" }}>
      <div className="panel text-center" style={{ width: 340 }}>
        <h1 className="text-2xl font-bold">Caregiver</h1>
        <p className="mt-1 text-sm" style={{ color: error ? "#b42318" : "var(--muted)" }}>
          {error ? "Wrong PIN, try again" : "Enter PIN (demo: 1234)"}
        </p>
        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className={i < entry.length ? "on" : ""} />
          ))}
        </div>
        <div className="keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) =>
            k ? (
              <button key={i} onClick={() => press(k)} aria-label={k === "⌫" ? "Delete" : k}>
                {k}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
        <Link to="/" className="mt-5 inline-block text-sm underline" style={{ color: "var(--muted)" }}>
          Back to {"child view"}
        </Link>
      </div>
    </main>
  );
}

const modes: { id: InputMode; label: string }[] = [
  { id: "touch", label: "Touch" },
  { id: "scan", label: "Switch scan" },
  { id: "dwell", label: "Eye gaze / dwell" },
];

export default function Caregiver() {
  const { settings, update, events, clearLog, resetAll } = useNexus();
  const [unlocked, setUnlocked] = useState(false);
  const [newPhrase, setNewPhrase] = useState("");
  const [newPin, setNewPin] = useState("");

  const stats = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const todays = events.filter((e) => e.t >= start.getTime());
    const counts = new Map<string, number>();
    events.filter((e) => e.activity === "talk" || e.activity === "eat").forEach((e) => counts.set(e.label, (counts.get(e.label) ?? 0) + 1));
    const byActivity = new Map<string, number>();
    todays.forEach((e) => e.activity !== "home" && byActivity.set(e.activity, (byActivity.get(e.activity) ?? 0) + 1));
    return {
      today: todays.filter((e) => e.activity !== "home").length,
      messages: todays.filter((e) => e.activity === "talk" || e.activity === "eat").length,
      top: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
      byActivity: [...byActivity.entries()].sort((a, b) => b[1] - a[1]),
      recent: [...events].reverse().filter((e) => e.activity !== "home").slice(0, 8),
    };
  }, [events]);

  if (!unlocked) return <PinGate pin={settings.pin} onUnlock={() => setUnlocked(true)} />;

  const addPhrase = () => {
    const p = newPhrase.trim();
    if (!p || settings.quickPhrases.includes(p)) return;
    update({ quickPhrases: [...settings.quickPhrases, p] });
    setNewPhrase("");
  };

  return (
    <main className="screen" data-allow-click>
      <header className="screen-head justify-between">
        <h1 className="screen-title">Caregiver</h1>
        <Link to="/" className="btn">
          Back to {settings.childName}'s view
        </Link>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="panel">
          <h2>Today</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="stat">
              <b>{stats.today}</b>
              <span>choices made</span>
            </div>
            <div className="stat">
              <b>{stats.messages}</b>
              <span>messages spoken</span>
            </div>
          </div>
          {stats.byActivity.length > 0 && (
            <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
              {stats.byActivity.map(([a, n]) => `${a[0].toUpperCase() + a.slice(1)} ${n}`).join(" · ")}
            </p>
          )}
          <h2 className="mt-6">Most-used messages</h2>
          {stats.top.length ? (
            <ol className="grid gap-2">
              {stats.top.map(([label, n]) => (
                <li key={label} className="flex justify-between">
                  <span>{label}</span>
                  <span style={{ color: "var(--muted)" }}>{n}×</span>
                </li>
              ))}
            </ol>
          ) : (
            <p style={{ color: "var(--muted)" }}>Nothing yet. Messages from Talk and Eat show up here.</p>
          )}
          <h2 className="mt-6">Recent</h2>
          <ul className="grid gap-1 text-sm">
            {stats.recent.map((e, i) => (
              <li key={i} className="flex justify-between gap-4">
                <span>{e.label}</span>
                <span style={{ color: "var(--muted)" }}>
                  {e.activity} · {new Date(e.t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>How {settings.childName} chooses</h2>
          <div className="seg" role="group" aria-label="Input method">
            {modes.map((m) => (
              <button key={m.id} aria-pressed={settings.inputMode === m.id} onClick={() => update({ inputMode: m.id })}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="mt-3">
            {settings.inputMode === "scan" && (
              <div className="row">
                <label>
                  Scan speed
                  <small>{(settings.scanMs / 1000).toFixed(1)} s per tile. Slower is easier.</small>
                </label>
                <input type="range" min={600} max={3000} step={100} value={settings.scanMs} onChange={(e) => update({ scanMs: +e.target.value })} />
              </div>
            )}
            {settings.inputMode === "dwell" && (
              <div className="row">
                <label>
                  Dwell time
                  <small>{(settings.dwellMs / 1000).toFixed(1)} s to select. Longer prevents accidents.</small>
                </label>
                <input type="range" min={500} max={2500} step={100} value={settings.dwellMs} onChange={(e) => update({ dwellMs: +e.target.value })} />
              </div>
            )}
            <div className="row">
              <label>
                Voice speed
                <small>{settings.voiceRate.toFixed(1)}×</small>
              </label>
              <input type="range" min={0.6} max={1.3} step={0.1} value={settings.voiceRate} onChange={(e) => update({ voiceRate: +e.target.value })} onMouseUp={() => speak("This is how I sound")} />
            </div>
            <div className="row">
              <label>
                Volume
                <small>{Math.round(settings.volume * 100)}%</small>
              </label>
              <input type="range" min={0.1} max={1} step={0.1} value={settings.volume} onChange={(e) => update({ volume: +e.target.value })} />
            </div>
            <div className="row">
              <label>High contrast</label>
              <input type="checkbox" checked={settings.highContrast} onChange={(e) => update({ highContrast: e.target.checked })} />
            </div>
            <div className="row">
              <label>Larger text</label>
              <input type="checkbox" checked={settings.largeText} onChange={(e) => update({ largeText: e.target.checked })} />
            </div>
            <div className="row">
              <label>
                Vibration
                <small>On supported tablets</small>
              </label>
              <input type="checkbox" checked={settings.haptics} onChange={(e) => update({ haptics: e.target.checked })} />
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Quick phrases</h2>
          <p className="mb-3 text-sm" style={{ color: "var(--muted)" }}>
            These appear first in Talk and are spoken with one selection.
          </p>
          <ul className="grid gap-2">
            {settings.quickPhrases.map((p) => (
              <li key={p} className="flex items-center justify-between gap-3">
                <span>{p}</span>
                <button className="btn ghost" onClick={() => update({ quickPhrases: settings.quickPhrases.filter((q) => q !== p) })}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <input
              className="field flex-1"
              placeholder="Add a phrase, e.g. I want my blanket"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPhrase()}
            />
            <button className="btn" onClick={addPhrase}>
              Add
            </button>
          </div>
        </section>

        <section className="panel">
          <h2>Profile & security</h2>
          <div className="row">
            <label>Child's name</label>
            <input className="field" style={{ width: 180 }} value={settings.childName} onChange={(e) => update({ childName: e.target.value || "Friend" })} />
          </div>
          <div className="row">
            <label>
              Change PIN
              <small>4 digits</small>
            </label>
            <div className="flex gap-2">
              <input
                className="field"
                style={{ width: 100 }}
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              />
              <button
                className="btn ghost"
                disabled={newPin.length !== 4}
                onClick={() => {
                  update({ pin: newPin });
                  setNewPin("");
                }}
              >
                Save
              </button>
            </div>
          </div>
          <div className="row">
            <label>Activity log</label>
            <button className="btn ghost" onClick={clearLog}>
              Clear log
            </button>
          </div>
          <div className="row">
            <label>
              Reset everything
              <small>Restores demo defaults</small>
            </label>
            <button className="btn danger" onClick={resetAll}>
              Reset
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
