/**
 * Dwell selection shared by pointer dwell (mouse, eye tracker, head pointer)
 * and camera tracking. Hover a target and a bar fills; when it's full the
 * target is clicked. The same target can't fire again until it's left.
 */
export function createDwell(getMs: () => number) {
  let el: HTMLElement | null = null;
  let fired = false;
  let timer = 0;

  const clear = () => {
    window.clearTimeout(timer);
    el?.removeAttribute("data-dwell");
    el = null;
    fired = false;
  };

  const hover = (target: HTMLElement | null) => {
    if (target === el) return;
    clear();
    if (!target || target.hasAttribute("disabled")) return;
    el = target;
    const ms = getMs();
    target.style.setProperty("--dwell", `${ms}ms`);
    target.setAttribute("data-dwell", "");
    timer = window.setTimeout(() => {
      if (!el || fired) return;
      fired = true;
      el.removeAttribute("data-dwell");
      el.click();
    }, ms);
  };

  return { hover, clear };
}

export const targetAt = (x: number, y: number) =>
  (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>("[data-target]") ?? null;
