// Converts original photographs into the web-sized WebP files used by the site.
// Usage: node scripts/optimize-images.mjs <folder-with-originals>
// The originals are not stored in this repository; IMAGE-SOURCES.md lists where each one came from.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const src = process.argv[2];
if (!src) { console.error('Pass the folder that holds the original images.'); process.exit(1); }
const out = path.resolve('public/img');
await mkdir(out, { recursive: true });

// name: [source file, crop {left,top,width,height} as fractions or null, output widths, quality]
const jobs = {
  'hero-quickair':    ['ca_canares-compressed-air-piping-pump-system.webp', { l: 0.33, t: 0, w: 0.3375, h: 1 }, [675, 420], 70],
  'hero-aquaculture': ['aq_graded-stock.jpg', null, [332], 74],
  'hero-foundation':  ['fn_3-1.png', { l: 0.125, t: 0, w: 0.75, h: 1 }, [412], 72],
  'quickair-install': ['ca_canares-aluminium-piping-pump-station.webp', null, [1100, 640], 70],
  'aquaculture-tank': ['aq_juveniles-tank.jpg', { l: 0, t: 0.24, w: 1, h: 0.5246 }, [331], 78],
  'aquaculture-harvest': ['aq_harvest.jpg', null, [700, 420], 72],
  'foundation-school':  ['fn_3-1.png', null, [550, 360], 72],
  'foundation-camp':    ['fn_10-1.png', null, [550, 360], 72],
  'foundation-lamp':    ['fn_1-1.png', null, [550, 360], 72],
  'foundation-class':   ['fn_9.png', null, [550, 360], 72],
  'cap-design':        ['ca_canares-vacuum-piping-pump-facility.webp', { l: 0.2, t: 0, w: 0.6, h: 1 }, [1200, 900, 520], 72],
  'cap-manufacturing': ['ca_canares-factory-cnc-machine.webp', { l: 0.125, t: 0, w: 0.75, h: 1 }, [900, 520], 70],
  'cap-automation':    ['qa_large-bore-line-with-flanged-valves.jpg', { l: 0, t: 0.2, w: 1, h: 0.5625 }, [825, 520], 70],
  'cap-biology':       ['aq_tank-top.jpg', null, [362], 78],
  'cap-delivery':      ['ca_canares-dealers-meet-2024-conference.webp', { l: 0.125, t: 0, w: 0.75, h: 1 }, [900, 520], 70],
  'iso-certificate':   ['ca_iso.webp', null, [480], 74],
  'logo-quickair':     ['logo_quickair.png', null, [408], 90],
  'logo-foundation':   ['logo_foundation.png', 'trim', [320], 90],
  'logo-canares-c':    ['logo_canares_c.png', null, [144], 92],
};

for (const [name, [file, crop, widths, quality]] of Object.entries(jobs)) {
  const input = path.join(src, file);
  const meta = await sharp(input).metadata();
  for (const w of widths) {
    let img = sharp(input);
    if (crop === 'trim') img = img.trim();
    else if (crop) img = img.extract({ left: Math.round(crop.l * meta.width), top: Math.round(crop.t * meta.height), width: Math.round(crop.w * meta.width), height: Math.round(crop.h * meta.height) });
    const target = path.join(out, `${name}-${w}.webp`);
    const info = await img.resize({ width: w, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(target);
    console.log(`${name}-${w}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
