// All scroll-driven motion. The page is complete and readable without this file:
// it is loaded after first paint, and it does nothing when the visitor prefers reduced motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

export function initMotion(): () => void {
  const undo: Array<() => void> = [];
  const html = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Header state, section tone and the progress marker (no animation involved) ---- */
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        header.classList.toggle('is-scrolled', y > 80);
        header.classList.toggle('is-hidden', self.direction === 1 && y > window.innerHeight * 0.6);
      },
    });
    $$('[data-tone]').filter((el) => el !== header).forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 44px',
        end: 'bottom 44px',
        onToggle: (self) => { if (self.isActive) header.dataset.tone = el.dataset.tone; },
      });
    });
  }
  $$<HTMLAnchorElement>('[data-progress] a').forEach((link) => {
    const target = document.getElementById(link.dataset.for ?? '');
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: 'top 55%',
      end: 'bottom 55%',
      toggleClass: { targets: link, className: 'is-active' },
    });
  });

  if (!reduce) {
    const mm = gsap.matchMedia();
    undo.push(() => mm.revert());

    mm.add(
      { desktop: '(min-width: 861px)', mobile: '(max-width: 860px)', fine: '(hover: hover) and (pointer: fine)' },
      (ctx) => {
        const { desktop, fine } = ctx.conditions as { desktop: boolean; fine: boolean };

        /* The line: each section's piece grows as the section scrolls past. */
        $$('[data-rail]').forEach((rail) => {
          const section = rail.parentElement!;
          gsap.fromTo(rail, { scaleY: 0 }, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top 78%', end: () => `+=${rail.offsetHeight}`, scrub: true, invalidateOnRefresh: true },
          });
        });

        /* Reveals finish before their text reaches the middle of the screen. */
        const reveals = $$('[data-reveal]');
        gsap.set(reveals, { opacity: 0, y: 26 }); // opacity only, so links and buttons stay reachable by keyboard
        ScrollTrigger.batch(reveals, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.07, overwrite: true }),
        });

        /* Group statement: words brighten in reading order, ahead of the eye. */
        const words = $$('[data-words] .word');
        if (words.length) {
          gsap.fromTo(words, { opacity: 0.18 }, {
            opacity: 1,
            ease: 'none',
            stagger: 0.05,
            scrollTrigger: { trigger: '[data-words]', start: 'top 84%', end: 'bottom 58%', scrub: true },
          });
        }

        /* Figures that Canares has published count up once. */
        $$('[data-count]').forEach((el) => {
          const end = Number(el.dataset.count);
          const state = { v: 0 };
          el.textContent = '0';
          gsap.to(state, {
            v: end,
            duration: 1.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onUpdate: () => { el.textContent = String(Math.round(state.v)); },
          });
        });

        /* Quickair: the photograph is uncovered as the pipe line runs across. */
        const q = { trigger: '.q', start: 'top 62%', once: true };
        if (desktop) {
          gsap.fromTo('.q [data-wipe]', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', scrollTrigger: q });
          gsap.fromTo('.q [data-run]', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power3.inOut', scrollTrigger: q });
          gsap.fromTo('.q [data-drop]', { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.out', stagger: 0.15, delay: 0.75, scrollTrigger: q });
        } else {
          gsap.fromTo('.q [data-wipe]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: { ...q, start: 'top 80%' } });
        }

        /* Aluminium: the section draws, then dimensions and finishes appear. */
        const a = { trigger: '.a [data-profile]', start: 'top 78%', once: true };
        if (desktop) {
          const tl = gsap.timeline({ scrollTrigger: a });
          tl.fromTo('.a .profile-outline', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
            .fromTo('.a .profile-body', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.25')
            .fromTo('.a .profile-dims', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, '-=0.1')
            .fromTo('.a [data-finish]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.2');
        } else {
          gsap.fromTo('.a [data-profile]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: a });
        }

        /* Aquaculture: the photograph opens from a point to a circle. */
        const w = { trigger: '.w .cage', start: 'top 78%', once: true };
        gsap.fromTo('.w [data-circle]', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(50.5% at 50% 50%)', duration: desktop ? 1.2 : 0.8, ease: 'power3.inOut', scrollTrigger: w });
        gsap.fromTo('.w [data-marker]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: desktop ? 0.08 : 0.04, delay: 0.5, scrollTrigger: w });
        if (desktop) gsap.fromTo('.w [data-run]', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: w });

        /* Foundation: photographs settle into place one after another. */
        gsap.fromTo('.collage img', { autoAlpha: 0, y: 44 }, {
          autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.16,
          scrollTrigger: { trigger: '.collage', start: 'top 80%', once: true },
        });

        if (desktop) {
          /* The only parallax on the page: hero panels shift a few percent on the way out. */
          gsap.to('[data-slat-media]', { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
        }

        /* Primary buttons lean slightly toward the cursor. */
        if (fine) {
          const off: Array<() => void> = [];
          $$('[data-magnetic]').forEach((el) => {
            const move = (e: MouseEvent) => {
              const r = el.getBoundingClientRect();
              gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.18, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.4, ease: 'power3.out' });
            };
            const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
            el.addEventListener('mousemove', move);
            el.addEventListener('mouseleave', leave);
            off.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); gsap.set(el, { clearProps: 'transform' }); });
          });
          return () => off.forEach((f) => f());
        }
      },
    );

    /* Light scroll smoothing with a mouse; touch devices keep native scrolling. */
    const smooth = window.matchMedia('(min-width: 861px) and (hover: hover) and (pointer: fine)').matches;
    let lenis: Lenis | undefined;
    if (smooth) {
      lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1 });
      const l = lenis;
      const raf = (t: number) => l.raf(t * 1000);
      l.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      const watch = new MutationObserver(() => (html.classList.contains('menu-open') ? l.stop() : l.start()));
      watch.observe(html, { attributes: true, attributeFilter: ['class'] });
      undo.push(() => { watch.disconnect(); gsap.ticker.remove(raf); l.destroy(); });
    }

    /* In-page links glide to their section. */
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!link || !target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.1 });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);
    undo.push(() => document.removeEventListener('click', onClick));
  }

  /* Recalculate positions when fonts or images change the layout, or a capability row opens. */
  let timer = 0;
  const refresh = () => { window.clearTimeout(timer); timer = window.setTimeout(() => ScrollTrigger.refresh(), 180); };
  const sizes = new ResizeObserver(refresh);
  const main = document.querySelector('main');
  if (main) sizes.observe(main);
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh);
  undo.push(() => { sizes.disconnect(); window.removeEventListener('load', refresh); window.clearTimeout(timer); });

  return () => {
    undo.forEach((f) => f());
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
