import type { CSSProperties, ReactNode } from "react";
import { buzz } from "@/lib/speech";

/**
 * Word-class colors follow the Modified Fitzgerald Key, the convention
 * speech-language pathologists use on AAC boards, so a child's NEXUS board
 * looks like the paper boards they already know.
 */
export type Tone =
  | "people" // yellow
  | "action" // green
  | "describe" // blue
  | "thing" // orange
  | "social" // pink
  | "question" // purple
  | "neutral"
  | "talk"
  | "play"
  | "learn"
  | "rest"
  | "eat"
  | "therapy";

interface TileProps {
  label: string;
  symbol?: ReactNode;
  tone?: Tone;
  size?: "sm" | "md" | "lg" | "xl";
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function Tile({ label, symbol, tone = "neutral", size = "md", active, disabled, onSelect, className = "", ariaLabel }: TileProps) {
  return (
    <button
      type="button"
      data-target
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      aria-pressed={active}
      className={`tile tile-${size} ${active ? "is-active" : ""} ${className}`}
      style={{ "--accent": `var(--tone-${tone})` } as CSSProperties}
      onClick={() => {
        buzz();
        onSelect?.();
      }}
    >
      {symbol !== undefined && (
        <span className="tile-symbol" aria-hidden>
          {symbol}
        </span>
      )}
      <span className="tile-label">{label}</span>
    </button>
  );
}
