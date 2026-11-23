// All motion that needs JavaScript. The page is complete and readable without this file:
// it is loaded after first paint, and visitors who prefer reduced motion get a still page
// with the line fully drawn.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { loop, place, profileLeft, profileRight, route, wave, type Pt } from './geometry';

gsap.registerPlugin(ScrollTrigger);

const NS = 'http://www.w3.org/2000/svg';
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const toward = (p: Pt, q: Pt, d: number): Pt => {
  const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
  return [p[0] + ((q[0] - p[0]) / l) * d, p[1] + ((q[1] - p[1]) / l) * d];
};

/* ======================================================================== the line */
// One line runs from the full stop of the headline to the end of the last business.
// Each section holds its own piece, drawn from where its neighbour stopped, and each
// piece is built from the measured position of the thing it wraps: the photograph,
// the aluminium section, the sea cage, the people.

interface Track {
  section: HTMLElement;
  steps: SVGPathElement[][];              // paths in one step are drawn together
  table: Array<[number, number]>;         // [depth reached in px, progress in steps]
  marks: Array<{ el: Element; at: number }>;
  cur: number;
}

function tabulate(steps: SVGPathElement[][]): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  let deepest = -Infinity;
  steps.forEach((paths, i) => {
    const p = paths[0];
    const len = p.getTotalLength();
    const n = clamp(Math.round(len / 10), 16, 200);
    for (let k = 0; k <= n; k++) {
      deepest = Math.max(deepest, p.getPointAtLength((len * k) / n).y);
      out.push([deepest, i + k / n]);
    }
  });
  return out;
}

/** How far the line should be drawn when its head has reached depth `y` in the section. */
function lookup(table: Array<[number, number]>, y: number): number {
  if (!table.length || y <= table[0][0]) return 0;
  let lo = 0, hi = table.length - 1;
  if (y >= table[hi][0]) return table[hi][1];
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (table[mid][0] <= y) lo = mid; else hi = mid; }
  const [y0, v0] = table[lo], [y1, v1] = table[hi];
  return y1 > y0 ? v0 + ((y - y0) / (y1 - y0)) * (v1 - v0) : v1;
}

function paint(t: Track) {
  t.steps.forEach((paths, i) => {
    const f = clamp(t.cur - i, 0, 1);
    for (const p of paths) {
      p.style.strokeDashoffset = String(1 - f);
      p.style.visibility = f > 0.002 ? 'visible' : 'hidden';
    }
  });
  for (const m of t.marks) m.el.classList.toggle('on', t.cur >= m.at - 0.002);
}

function buildLines(late: boolean): Track[] {
  const tracks: Track[] = [];
  const mobile = window.innerWidth <= 860;
  let x = 0; // where the line left the previous section

  $$<SVGSVGElement>('svg[data-line]').forEach((svg) => {
    const section = svg.parentElement as HTMLElement;
    const sr = section.getBoundingClientRect();
    const W = sr.width, H = sr.height;
    const kind = svg.dataset.line!;
    svg.replaceChildren();
    if (late) svg.classList.add('drawn');

    const box = (name: string) => {
      const el = $(`[data-anchor="${name}"]`, section);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { el, l: r.left - sr.left, t: r.top - sr.top, r: r.right - sr.left, b: r.bottom - sr.top, w: r.width, h: r.height, cx: r.left - sr.left + r.width / 2, cy: r.top - sr.top + r.height / 2 };
    };
    const add = (d: string, cls = '', stroke = '') => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('pathLength', '1');
      if (cls) p.setAttribute('class', cls);
      if (stroke) p.style.stroke = stroke;
      svg.appendChild(p);
      return p;
    };
    // The colour of the previous business hands over to this one along the lead-in.
    const blend = (y1: number, y2: number) => {
      const g = document.createElementNS(NS, 'linearGradient');
      g.id = `ln-${kind}`;
      g.setAttribute('gradientUnits', 'userSpaceOnUse');
      g.setAttribute('x1', '0'); g.setAttribute('x2', '0');
      g.setAttribute('y1', String(y1)); g.setAttribute('y2', String(Math.max(y1 + 1, y2)));
      [['0', 'var(--prev)'], ['1', 'var(--c)']].forEach(([o, c]) => {
        const s = document.createElementNS(NS, 'stop');
        s.setAttribute('offset', o);
        s.style.stopColor = c;
        g.appendChild(s);
      });
      svg.appendChild(g);
      return `url(#${g.id})`;
    };

    const steps: SVGPathElement[][] = [];
    const marks: Track['marks'] = [];
    const gutter = W - 10; // on small screens the line keeps to the right-hand margin

    if (kind === 'hero') {
      const dot = box('dot'), ap = box('aperture');
      if (!dot || !ap) return;
      const pts: Pt[] = mobile ? [[dot.cx, dot.cy], [gutter, dot.cy], [gutter, H]] : [[dot.cx, dot.cy], [ap.cx, dot.cy], [ap.cx, H]];
      add(route(pts, mobile ? 10 : 28)).style.strokeDasharray = '1 2';
      x = mobile ? gutter : ap.cx;
      return; // the hero piece is drawn by the opening sequence in CSS
    }

    if (kind === 'intro') {
      steps.push([add(route([[x, 0], [x, H]]), '', blend(0, H))]);
    }

    if (kind === 'qa') {
      const f = box('frame');
      if (!f) return;
      let pipe: Pt[];
      let lead: Pt[], out: Pt[];
      if (mobile) {
        const a = f.t - 16, b = f.b + 16;
        lead = [[x, 0], [x, a]]; pipe = [[x, a], [x, b]]; out = [[x, b], [x, H]];
      } else {
        const g = 34, a = f.t - g, left = f.l - g, bottom = f.b + g;
        const exit = f.l + f.w * 0.36, y0 = Math.max(30, a - 96), y1 = Math.min(H - 20, bottom + 96);
        lead = [[x, 0], [x, y0]];
        pipe = [[x, y0], [x, a], [left, a], [left, bottom], [exit, bottom], [exit, y1]];
        out = [[exit, y1], [exit, H]];
      }
      const r = mobile ? 0 : 24;
      const d = route(pipe, r);
      steps.push([add(route(lead))], [add(d, 'pipe'), add(d, 'sheen')], [add(route(out))]);
      // Grey fittings sit on every joint, as they do on the real system, and appear as the line passes.
      const seg = pipe.slice(1).map((p, i) => Math.hypot(p[0] - pipe[i][0], p[1] - pipe[i][1]));
      const total = seg.reduce((s, v) => s + v, 0) || 1;
      let run = 0;
      pipe.forEach((p, i) => {
        const prev = pipe[i - 1], next = pipe[i + 1];
        const leg = mobile ? 10 : 30;
        const d2 = !prev ? route([toward(p, next, -8), toward(p, next, 14)])
          : !next ? route([toward(p, prev, 14), toward(p, prev, -8)])
          : route([toward(p, prev, leg), p, toward(p, next, leg)], r);
        marks.push({ el: add(d2, 'fit'), at: 1 + run / total });
        run += seg[i] ?? 0;
      });
      if (!mobile) x = pipe[pipe.length - 1][0];
    }

    if (kind === 'al') {
      const p = box('profile');
      if (!p) return;
      const s = p.w;
      const top: Pt = [p.cx, p.t + 0.18 * s], bottom: Pt = [p.cx, p.t + 0.82 * s];
      const turn = p.t - (mobile ? 30 : 76);
      steps.push([add(route([[x, 0], [x, turn], [p.cx, turn], top], mobile ? 12 : 22, 'chamfer'), '', blend(0, p.t))]);
      steps.push([add(route(place(profileRight, p.l, p.t, s), 0.02 * s)), add(route(place(profileLeft, p.l, p.t, s), 0.02 * s))]);
      steps.push([add(route(mobile ? [bottom, [p.cx, p.b + 30], [x, p.b + 30], [x, H]] : [bottom, [p.cx, H]], 12, 'chamfer'))]);
      marks.push({ el: p.el, at: 2 });
      if (!mobile) x = p.cx;
    }

    if (kind === 'aq') {
      const c = box('rings');
      if (!c) return;
      const R = c.w / 2;
      const lead: Pt[] = mobile
        ? [[x, 0], ...wave([x, c.t - 90], [c.cx, c.t], 9, 1.5)]
        : wave([x, 0], [c.cx, c.t], 18, 2.5, 72);
      steps.push([add(route(lead), '', blend(0, c.t))]);
      steps.push([
        add(`M${c.cx} ${c.t}A${R} ${R} 0 0 1 ${c.cx} ${c.b}`),
        add(`M${c.cx} ${c.t}A${R} ${R} 0 0 0 ${c.cx} ${c.b}`),
      ]);
      const out: Pt[] = mobile
        ? [...wave([c.cx, c.b], [x, c.b + 100], 9, 1.5), [x, H]]
        : wave([c.cx, c.b], [c.cx, H], 16, 2, 60);
      steps.push([add(route(out))]);
      marks.push({ el: c.el, at: 1.2 });
      if (!mobile) x = c.cx;
    }

    if (kind === 'fn') {
      const m = box('photo');
      if (!m) return;
      // Drawn anticlockwise, because the line arrives from the right.
      const pts = loop(m.cx, m.cy, m.w * 0.6, m.h * 0.6).map(([px, py]): Pt => [2 * m.cx - px, py]);
      const [sx, sy] = pts[0];
      const [ex, ey] = pts[pts.length - 1];
      const drop = mobile ? Math.max(0, sy - 120) : 0;
      steps.push([add(`M${x} 0L${x} ${drop}C${x} ${drop + (sy - drop) * 0.75} ${sx + m.w * 0.55} ${sy} ${sx} ${sy}`, '', blend(0, sy))]);
      const end: Pt = [ex + m.w * 0.34, ey + m.h * 0.26];
      steps.push([add(`${route(pts)}C${ex + m.w * 0.16} ${ey + 4} ${end[0]} ${ey + m.h * 0.08} ${end[0]} ${end[1]}`)]);
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'end');
      dot.setAttribute('cx', String(end[0])); dot.setAttribute('cy', String(end[1])); dot.setAttribute('r', '7');
      svg.appendChild(dot);
      marks.push({ el: dot, at: 2 });
    }

    if (steps.length) tracks.push({ section, steps, table: tabulate(steps), marks, cur: 0 });
  });
  return tracks;
}

/* ======================================================================== the fish */
/** A school circling the sea cage. Fish near the pointer dart ahead. */
function school(canvas: HTMLCanvasElement, still: boolean): () => void {
  const ctx = canvas.getContext('2d');
  const host = canvas.parentElement;
  if (!ctx || !host) return () => {};
  const fish = Array.from({ length: 30 }, () => ({
    a: Math.random() * Math.PI * 2, r: 0.57 + Math.random() * 0.39, v: 0.09 + Math.random() * 0.11,
    s: 0.75 + Math.random() * 0.6, ph: Math.random() * 6.28, boost: 0,
  }));
  let w = 0, raf = 0, last = 0, on = false;
  let mouse: Pt | null = null;

  const size = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    canvas.width = canvas.height = Math.round(w * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const draw = (now: number) => {
    const t = now / 1000;
    const dt = Math.min(0.05, last ? t - last : 0);
    last = t;
    const R = w / 2, k = w / 560;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = '#bff3ee';
    for (const f of fish) {
      const rr = (f.r + Math.sin(t * 0.6 + f.ph) * 0.02) * R;
      const px = R + Math.cos(f.a) * rr, py = R + Math.sin(f.a) * rr;
      if (mouse) {
        const d = Math.hypot(mouse[0] - px, mouse[1] - py);
        if (d < 110) f.boost = Math.max(f.boost, 1.5 * (1 - d / 110));
      }
      f.boost *= 0.965;
      f.a += (f.v + f.boost) * dt;
      const wag = Math.sin(t * 7 * (1 + f.boost) + f.ph) * 2.4;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(f.a + Math.PI / 2);
      ctx.scale(f.s * k, f.s * k);
      ctx.globalAlpha = 0.3 + 0.5 * ((f.r - 0.57) / 0.39);
      ctx.beginPath(); ctx.ellipse(0, 0, 12, 3.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-19, -5 + wag); ctx.lineTo(-19, 5 + wag); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    if (on) raf = requestAnimationFrame(draw);
  };
  const move = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse = [e.clientX - r.left, e.clientY - r.top]; };
  const leave = () => { mouse = null; };
  const ro = new ResizeObserver(() => { size(); if (!on) draw(performance.now()); });
  ro.observe(canvas);
  size();
  draw(performance.now());

  let st: ScrollTrigger | undefined;
  if (!still) {
    host.addEventListener('mousemove', move);
    host.addEventListener('mouseleave', leave);
    st = ScrollTrigger.create({
      trigger: host, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { on = self.isActive; cancelAnimationFrame(raf); last = 0; if (on) raf = requestAnimationFrame(draw); },
    });
  }
  return () => { on = false; cancelAnimationFrame(raf); ro.disconnect(); st?.kill(); host.removeEventListener('mousemove', move); host.removeEventListener('mouseleave', leave); };
}

/* ======================================================================== init */
export function initMotion(): () => void {
  const undo: Array<() => void> = [];
  const html = document.documentElement;
  const reduce = !html.classList.contains('motion'); // set in index.html from the device's motion preference
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wide = () => window.innerWidth > 860;
  const born = performance.now();
  const listen = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Document, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    el.addEventListener(type, fn as EventListener);
    undo.push(() => el.removeEventListener(type, fn as EventListener));
  };

  /* ---- Navigation state: floating bar, active link, section indicators ---- */
  const header = $('[data-header]');
  if (header) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => header.classList.toggle('is-scrolled', self.scroll() > 60) });
  $$<HTMLAnchorElement>('[data-nav]').forEach((link) => {
    const target = document.getElementById(link.dataset.nav ?? '');
    if (target) ScrollTrigger.create({ trigger: target, start: 'top 50%', end: 'bottom 50%', toggleClass: { targets: link, className: 'is-active' } });
  });
  $$<HTMLAnchorElement>('[data-dots] a').forEach((link) => {
    const target = document.getElementById(link.dataset.for ?? '');
    if (target) ScrollTrigger.create({ trigger: target, start: 'top 55%', end: 'bottom 55%', toggleClass: { targets: link, className: 'is-active' } });
  });

  /* ---- The line ---- */
  let tracks: Track[] = [];
  const layout = () => {
    const keep = tracks.map((t) => t.cur);
    tracks = buildLines(performance.now() - born > 3200);
    tracks.forEach((t, i) => { t.cur = reduce ? t.steps.length : keep[i] ?? 0; paint(t); });
  };
  layout();
  ScrollTrigger.addEventListener('refresh', layout);
  undo.push(() => ScrollTrigger.removeEventListener('refresh', layout));

  $$<HTMLCanvasElement>('canvas[data-fish]').forEach((c) => undo.push(school(c, reduce)));

  /* ---- Story: the year turns over as each milestone takes the centre ---- */
  const items = $$('[data-step-item]');
  const reel = $('[data-reel]'), stepNo = $('[data-step]'), stepBar = $('[data-step-bar]');
  const show = (i: number) => {
    const d = reduce ? 0 : 1;
    items.forEach((el, k) => el.classList.toggle('is-active', k === i));
    if (reel) gsap.to(reel, { yPercent: (-100 / items.length) * i, duration: d, ease: 'expo.out', overwrite: true });
    if (stepNo) stepNo.textContent = String(i + 1).padStart(2, '0');
    if (stepBar) gsap.to(stepBar, { scaleX: (i + 1) / items.length, duration: d * 0.8, ease: 'expo.out', overwrite: true });
  };
  if (items.length) {
    show(0);
    items.forEach((el, i) => ScrollTrigger.create({ trigger: el, start: 'top 58%', end: 'bottom 58%', onToggle: (self) => { if (self.isActive) show(i); } }));
  }

  if (!reduce) {
    html.classList.add('has-motion');
    undo.push(() => html.classList.remove('has-motion'));

    // The head of the line stays low on the screen, so whatever is in view is already drawn, and eases after the scroll.
    const follow = () => {
      const vh = window.innerHeight;
      for (const t of tracks) {
        const top = t.section.getBoundingClientRect().top;
        if (top > vh && t.cur === 0) continue;
        const goal = lookup(t.table, vh * 0.82 - top);
        const gap = goal - t.cur;
        if (Math.abs(gap) < 0.0004) continue;
        t.cur = Math.abs(gap) < 0.002 ? goal : t.cur + gap * 0.13;
        paint(t);
      }
    };
    gsap.ticker.add(follow);
    undo.push(() => gsap.ticker.remove(follow));

    /* ---- Reveals ---- */
    const reveals = $$('[data-reveal]');
    gsap.set(reveals, { opacity: 0, y: 34 }); // opacity only, so links stay reachable by keyboard
    ScrollTrigger.batch(reveals, {
      start: 'top 88%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
    });

    // Titles rise out of their own baseline, one character after another.
    $$('[data-title], [data-word]').forEach((el) => {
      const chars = $$('.ch', el);
      gsap.set(chars, { yPercent: 120 });
      ScrollTrigger.create({
        trigger: el, start: 'top 86%', once: true,
        onEnter: () => gsap.to(chars, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: el.hasAttribute('data-word') ? 0.06 : 0.028 }),
      });
    });

    // The introduction darkens word by word, a little ahead of the eye.
    const words = $$('[data-words] .word');
    if (words.length) {
      gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: '[data-words]', start: 'top 82%', end: 'bottom 52%', scrub: true } });
    }

    // Photographs are uncovered while they settle from a closer crop.
    $$('[data-wipe]').forEach((el) => {
      const from = el.dataset.wipe === 'up' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)';
      const img = $('img', el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el.parentElement, start: 'top 82%', once: true } });
      tl.fromTo(el, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
      if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.9, ease: 'expo.out', clearProps: 'transform' }, 0.15);
    });

    // Depth: large numerals and the smaller photographs travel at their own pace.
    $$('[data-parallax]').forEach((el) => {
      const v = Number(el.dataset.parallax) || 0;
      gsap.fromTo(el, { yPercent: -v }, { yPercent: v, ease: 'none', scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.to('.hero-stage', { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-glow', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Alloys and finishes slide past as the aluminium chapter scrolls.
    const marquee = $('[data-marquee]');
    if (marquee) gsap.fromTo(marquee, { xPercent: -2 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: marquee.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });

    /* ---- Pointer interactions (mouse only; nothing depends on them) ---- */
    if (fine) {
      // Hero layers shift by depth and the aperture leans toward the pointer.
      const hero = $('.hero');
      const layers = $$('[data-depth]').map((el) => ({
        d: Number(el.dataset.depth) || 0,
        x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
      }));
      const ap = $('.aperture');
      const rx = ap && gsap.quickTo(ap, 'rotationX', { duration: 1, ease: 'power3.out' });
      const ry = ap && gsap.quickTo(ap, 'rotationY', { duration: 1, ease: 'power3.out' });
      if (hero) {
        listen(hero, 'mousemove', (e) => {
          const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => { l.x(nx * l.d * 2); l.y(ny * l.d * 2); });
          rx?.(-ny * 7); ry?.(nx * 9);
        });
        listen(hero, 'mouseleave', () => { layers.forEach((l) => { l.x(0); l.y(0); }); rx?.(0); ry?.(0); });
      }

      // Photographs lean toward the pointer.
      $$('[data-tilt]').forEach((el) => {
        const tx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' });
        const ty = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' });
        listen(el, 'mousemove', (e) => {
          const r = el.getBoundingClientRect();
          tx(-((e.clientY - r.top) / r.height - 0.5) * 6);
          ty(((e.clientX - r.left) / r.width - 0.5) * 8);
        });
        listen(el, 'mouseleave', () => { tx(0); ty(0); });
      });

      // The light on the aluminium section follows the pointer.
      $$('[data-sheen]').forEach((el) => {
        const grads = $$<SVGLinearGradientElement>('linearGradient', el);
        const state = { a: 0 };
        const to = gsap.quickTo(state, 'a', { duration: 0.7, ease: 'power2.out', onUpdate: () => grads.forEach((g) => g.setAttribute('gradientTransform', `rotate(${state.a.toFixed(1)} .5 .5)`)) });
        listen(el, 'mousemove', (e) => { const r = el.getBoundingClientRect(); to(((e.clientX - r.left) / r.width - 0.5) * 110); });
        listen(el, 'mouseleave', () => to(0));
      });

      // Buttons lean slightly toward the pointer.
      $$('[data-magnetic]').forEach((el) => {
        listen(el, 'mousemove', (e) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.2, y: (e.clientY - (r.top + r.height / 2)) * 0.32, duration: 0.5, ease: 'power3.out' });
        });
        listen(el, 'mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }));
      });

      // A label follows the pointer over anything that leads to a business site.
      const cursor = $('[data-cursor-el]');
      const label = cursor && $('span', cursor);
      if (cursor && label) {
        const cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
        const cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });
        listen(document, 'mousemove', (e) => {
          cx(e.clientX); cy(e.clientY);
          const hit = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
          if (hit) label.textContent = `${hit.dataset.cursor} ↗`;
          cursor.classList.toggle('on', !!hit);
        });
        listen(document, 'mouseleave', () => cursor.classList.remove('on'));
      }
    }

    /* ---- Light scroll smoothing with a mouse; touch devices keep native scrolling ---- */
    let lenis: Lenis | undefined;
    if (fine && wide()) {
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
      const l = lenis;
      const raf = (t: number) => l.raf(t * 1000);
      l.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      const watch = new MutationObserver(() => (html.classList.contains('menu-open') ? l.stop() : l.start()));
      watch.observe(html, { attributes: true, attributeFilter: ['class'] });
      undo.push(() => { watch.disconnect(); gsap.ticker.remove(raf); l.destroy(); });
    }

    /* ---- In-page links glide to their section ---- */
    listen(document, 'click', (e) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!link || !target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  }

  /* ---- Recalculate when fonts or images change the layout ---- */
  let timer = 0;
  const refresh = () => { window.clearTimeout(timer); timer = window.setTimeout(() => ScrollTrigger.refresh(), 200); };
  const sizes = new ResizeObserver(refresh);
  const main = $('main');
  if (main) sizes.observe(main);
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh);
  undo.push(() => { sizes.disconnect(); window.removeEventListener('load', refresh); window.clearTimeout(timer); });

  return () => {
    undo.forEach((f) => f());
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
