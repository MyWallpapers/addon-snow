import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
export function drawing(
  context: CanvasAddonMountContext,
  label: string,
  paint: (
    g: CanvasRenderingContext2D,
    width: number,
    height: number,
    seconds: number,
  ) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", label);
  context.layer.root.replaceChildren(canvas);
  const g = canvas.getContext("2d");
  if (!g) throw new Error("Canvas 2D indisponible");
  let width = 1,
    height = 1,
    seconds = context.runtime.mode === "thumbnail" ? 2 : 0,
    frame = 0,
    last = 0,
    visible = true,
    alive = true,
    motion = true;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const render = () => {
    g.clearRect(0, 0, width, height);
    g.save();
    paint(g, width, height, seconds);
    g.restore();
  };
  const allowed = () =>
    alive &&
    motion &&
    visible &&
    !document.hidden &&
    !reduced.matches &&
    context.runtime.mode !== "thumbnail";
  const tick = (stamp: number) => {
    frame = 0;
    if (!allowed()) return;
    if (!last || stamp - last >= 1000 / 30) {
      seconds += last ? Math.min((stamp - last) / 1000, 0.1) : 0;
      last = stamp;
      render();
    }
    frame = requestAnimationFrame(tick);
  };
  const schedule = () => {
    if (!allowed()) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    } else if (!frame) frame = requestAnimationFrame(tick);
  };
  const resize = () => {
    const bounds = context.layer.root.getBoundingClientRect();
    width = Math.max(1, bounds.width || context.runtime.instance.width);
    height = Math.max(1, bounds.height || context.runtime.instance.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
    schedule();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(context.layer.root);
  const visibility = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    schedule();
  });
  visibility.observe(canvas);
  const changed = () => {
    render();
    schedule();
  };
  document.addEventListener("visibilitychange", changed);
  reduced.addEventListener("change", changed);
  resize();
  return {
    invalidate(animate: boolean) {
      motion = animate;
      render();
      schedule();
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", changed);
      reduced.removeEventListener("change", changed);
      canvas.remove();
    },
  };
}
