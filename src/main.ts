import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
import { drawing } from "./drawing";
import "./style.css";
function seeded(seed: number) {
  let state = seed | 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

export function mount(context: CanvasAddonMountContext) {
  let values = context.layer.settings.get();
  const view = drawing(
    context,
    "Des flocons légers, à des profondeurs différentes. Une chute lente et silencieuse.",
    (g, w, h, t) => {
      const rng = seeded(2761),
        count = Number(values.density ?? 70),
        speed = Number(values.speed ?? 1),
        size = Number(values.size ?? 3);
      g.fillStyle = String(values.color ?? "#e0e7e6");
      for (let i = 0; i < count; i++) {
        const depth = 0.25 + rng() * 0.75,
          x = rng() * w,
          y = ((rng() * h + t * speed * (9 + depth * 28)) % (h + 40)) - 20,
          phase = rng() * 6.28;
        g.globalAlpha = 0.15 + depth * 0.65;
        g.beginPath();
        g.arc(
          x + Math.sin(t * 0.35 + phase) * (8 + depth * 15),
          y,
          size * depth,
          0,
          Math.PI * 2,
        );
        g.fill();
      }
    },
  );
  const update = (next: typeof values) => {
    values = next;
    view.invalidate(next.motion !== false);
  };
  update(values);
  const stop = context.layer.settings.subscribe(update);
  return () => {
    stop();
    view.dispose();
  };
}
