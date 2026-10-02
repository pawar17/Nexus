import type { CSSProperties, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Tile, type Tone } from "./Tile";
import { stopSpeaking } from "@/lib/speech";

interface ScreenProps {
  title: string;
  tone: Tone;
  children: ReactNode;
  /** Go back within the activity instead of to Home */
  onBack?: () => void;
  backLabel?: string;
}

export function Screen({ title, tone, children, onBack, backLabel = "Home" }: ScreenProps) {
  const navigate = useNavigate();
  return (
    <main className="screen" style={{ "--accent": `var(--tone-${tone})` } as CSSProperties}>
      <header className="screen-head">
        <Tile
          label={backLabel}
          symbol="←"
          size="sm"
          tone="neutral"
          className="back"
          onSelect={() => {
            stopSpeaking();
            onBack ? onBack() : navigate("/");
          }}
        />
        <h1 className="screen-title">
          <span className="dot" aria-hidden />
          {title}
        </h1>
      </header>
      {children}
    </main>
  );
}

export function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="section">
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </section>
  );
}

export function Grid({ cols = 3, children }: { cols?: 2 | 3 | 4 | 5; children: ReactNode }) {
  return <div className={`grid-tiles cols-${cols}`}>{children}</div>;
}
