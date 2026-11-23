// Shared path geometry. Used by the drawn graphics (React) and by the scroll line (motion.ts),
// so the line can trace exactly the same shapes the page shows.

export type Pt = [number, number];

/** A polyline as an SVG path, with each corner rounded or chamfered by `r`. */
export function route(pts: Pt[], r = 0, mode: 'round' | 'chamfer' = 'round'): string {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    const next = pts[i + 1];
    if (!next || !r) { d += `L${x.toFixed(1)} ${y.toFixed(1)}`; continue; }
    const [px, py] = pts[i - 1];
    const l1 = Math.hypot(x - px, y - py) || 1;
    const l2 = Math.hypot(next[0] - x, next[1] - y) || 1;
    const k = Math.min(r, l1 / 2, l2 / 2);
    const ax = x - ((x - px) / l1) * k, ay = y - ((y - py) / l1) * k;
    const bx = x + ((next[0] - x) / l2) * k, by = y + ((next[1] - y) / l2) * k;
    d += `L${ax.toFixed(1)} ${ay.toFixed(1)}`;
    d += mode === 'round' ? `Q${x.toFixed(1)} ${y.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}` : `L${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  return d;
}

/** Right half of a 40 × 40 mm T-slot section on a 200-unit square, from the top slot floor to the bottom slot ceiling. */
export const profileRight: Pt[] = [
  [100, 36], [128, 36], [128, 14], [112, 14], [112, 0], [200, 0], [200, 88], [184, 88], [184, 72], [164, 72],
  [164, 128], [184, 128], [184, 112], [200, 112], [200, 200], [112, 200], [112, 186], [128, 186], [128, 164], [100, 164],
];
export const profileLeft: Pt[] = profileRight.map(([x, y]) => [200 - x, y]);

/** Scale and move unit points into a box. */
export const place = (pts: Pt[], left: number, top: number, size: number): Pt[] =>
  pts.map(([x, y]) => [left + (x / 200) * size, top + (y / 200) * size]);

/** The closed outline of the section, for the filled drawing. */
export const profileOutline = `${route([...profileRight, ...[...profileLeft].reverse().slice(1)], 4)}Z`;

/** Points along a line from a to b that sway from side to side, settling at both ends. */
export function wave(a: Pt, b: Pt, amp: number, cycles: number, steps = 48): Pt[] {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const o = Math.sin(t * Math.PI * 2 * cycles) * Math.sin(t * Math.PI) * amp;
    out.push([a[0] + dx * t + nx * o, a[1] + dy * t + ny * o]);
  }
  return out;
}

/** A hand-drawn loop: an ellipse traced `turns` times while slowly widening, tilted a few degrees. */
export function loop(cx: number, cy: number, rx: number, ry: number, turns = 1.5, steps = 96): Pt[] {
  const tilt = (-7 * Math.PI) / 180;
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = -Math.PI / 2 + t * turns * Math.PI * 2;
    const grow = 1 + 0.07 * t;
    const x = Math.cos(a) * rx * grow, y = Math.sin(a) * ry * grow;
    out.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]);
  }
  return out;
}
