import { useEffect } from "react";
import { useNexus } from "@/lib/store";
import { createDwell } from "./dwell";

/**
 * Makes every element marked `data-target` usable without touch.
 *
 * Switch scanning: targets are highlighted one after another. Any switch
 * press selects the highlighted one: Space, Enter, or a tap anywhere on the
 * screen (so a big-button switch or an adapted mouse both work).
 *
 * Dwell select: resting the pointer on a target fills a progress bar and
 * selects it. Eye trackers and head pointers drive the pointer, so this is
 * how gaze users select.
 *
 * Elements marked `data-allow-click` (caregiver controls) keep normal clicks.
 */
export function AccessLayer({ paused }: { paused: boolean }) {
  const { settings } = useNexus();
  const { inputMode, scanMs, dwellMs } = settings;

  // Switch scanning
  useEffect(() => {
    if (inputMode !== "scan" || paused) return;

    let index = -1;
    let current: HTMLElement | null = null;

    const targets = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-target]")).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );

    const mark = (el: HTMLElement | null) => {
      current?.removeAttribute("data-scan");
      current = el;
      if (el) {
        el.setAttribute("data-scan", "");
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    };

    const step = () => {
      const list = targets();
      if (!list.length) return mark(null);
      index = (index + 1) % list.length;
      mark(list[index]);
    };

    let timer = window.setInterval(step, scanMs);
    step();

    const select = () => {
      if (!current) return;
      const el = current;
      mark(null);
      index = -1;
      window.clearInterval(timer);
      el.click();
      // Give the child a beat to see the result before scanning restarts
      timer = window.setInterval(step, scanMs);
    };

    const onKey = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        e.preventDefault();
        select();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-allow-click]")) return;
      e.preventDefault();
      select();
    };
    // Real taps act as the switch, so stop them from also clicking what they land on
    const onClick = (e: MouseEvent) => {
      if (!e.isTrusted || (e.target as HTMLElement).closest("[data-allow-click]")) return;
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearInterval(timer);
      mark(null);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [inputMode, scanMs, paused]);

  // Dwell select (mouse, eye tracker or head pointer driving the cursor)
  useEffect(() => {
    if (inputMode !== "dwell" || paused) return;
    const dwell = createDwell(() => dwellMs);
    const onOver = (e: PointerEvent) => dwell.hover((e.target as HTMLElement).closest<HTMLElement>("[data-target]"));
    const onLeave = () => dwell.clear();
    const onClick = (e: MouseEvent) => {
      if (e.isTrusted) dwell.clear();
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("click", onClick, true);
    return () => {
      dwell.clear();
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("click", onClick, true);
    };
  }, [inputMode, dwellMs, paused]);

  return null;
}
