# Canares Group website

The corporate homepage for Canares: one page that introduces the group and its four businesses
(Quickair, Canares Aluminium, Canares Aquaculture and Canares Foundation).

It is a static site. React and Vite are used to build it, and the result is plain HTML, CSS,
JavaScript and images that any web host can serve.

## Commands

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

- `dev` starts a local server with live reload.
- `build` writes the finished site to `dist/`. The page is pre-rendered, so `dist/index.html`
  already contains all the text for search engines and for visitors whose scripts do not load.
- `preview` serves `dist/` locally so you can check the real build.

## Where things are

| Path | What it holds |
| --- | --- |
| `src/content.ts` | All wording, facts, contact details and links. Edit text here. |
| `src/components/` | One file per section: `Hero`, `Statement` (introduction), `Businesses` (the four chapters), `Milestones` (story), `Footer` (contact), `Header` (navigation and menu). `Identity`, `Capabilities` and `Enquiry` are kept from the earlier design but are not on the page. |
| `src/styles/` | `index.css` (colours, type, buttons, navigation) and `sections.css` (each section). |
| `src/motion.ts` | The scroll-drawn line, reveals, pointer interactions and light scroll smoothing on desktop (GSAP, ScrollTrigger, Lenis). |
| `src/geometry.ts` | Shapes shared by the drawings and the line: the T-slot section, waves and the hand-drawn loop. |
| `public/img/` | Optimised photographs and logos. |
| `scripts/optimize-images.mjs` | Recreates `public/img/` from original photographs. |
| `scripts/prerender.mjs` | Writes the rendered page into `dist/index.html` during `build`. |
| `IMAGE-SOURCES.md` | Where each photograph and logo came from. |

## Content rules

Every fact on the page comes from the five Canares websites as they stood in November 2026.
Nothing was invented. The following are deliberately left out until Canares confirms them:

- Ownership structure and leadership beyond what is published.
- Client logos (permission not confirmed).
- The counters shown on the Aluminium and Foundation sites.
- Figures that conflict between pages, such as energy savings and countries served.

Only published figures count up on screen: 4 businesses, 40 bar, a 10-year guarantee,
52 standard sections and 9 stages.

## Enquiry form

The form has no server behind it by default. When a visitor presses the button, their email app
opens with the message filled in and addressed to the group, or to the chosen business.

To send messages without an email app, set an address that accepts a form post before building:

```bash
VITE_ENQUIRY_ENDPOINT="https://example.com/your-form-handler" npm run build
```

The form then posts these fields: `type`, `business`, `name`, `organisation`, `email`, `phone`,
`country`, `message`, `subject` and `recipient`. The current WordPress site has Contact Form 7
installed, which can receive them once a form is created in WordPress admin; its field names
would need to match.

## Putting it online

Nothing in this repository changes the live site. canares.com currently runs WordPress on
Hostinger, and this repository is not connected to it.

1. Run `npm run build`.
2. Upload the contents of `dist/` to a staging address first, for example a sub-domain created
   in the Hostinger control panel.
3. Check the staging address on a desktop and a phone.
4. When approved, make it the homepage. The existing WordPress pages can stay where they are
   until a decision is made about redirecting them to quickair.in.

All asset paths are relative, so the same build works at the domain root or in a sub-folder.

## Images

Photographs come from the Canares sites and are listed in `IMAGE-SOURCES.md`. Canares Aluminium
has no photographs confirmed as its own, so its sections use drawings of its profile range.
Replace them when plant photographs are available.

To regenerate the optimised images, place the originals in a folder using the file names in
`scripts/optimize-images.mjs` and run:

```bash
npm run images -- path/to/originals
```

## Accessibility and motion

- Works with keyboard only; the menu traps focus and closes with Escape.
- Visitors who ask their device for reduced motion get a static page with everything visible.
  On Windows this is Settings › Accessibility › Visual effects › Animation effects. To preview the
  animated page on such a device add `?motion=on` to the address; `?motion=off` shows the still page.
- Phones and tablets use native scrolling. Scroll smoothing applies only with a mouse on desktop.
