// Renders the page to plain HTML and writes it into dist/index.html, so the full
// content is present for search engines and for visitors whose scripts fail to load.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const file = path.resolve('dist/index.html');
const template = await readFile(file, 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Placeholder <!--app-html--> not found in dist/index.html');
const html = render();
await writeFile(file, template.replace('<!--app-html-->', html));
await rm(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`Pre-rendered ${(html.length / 1024).toFixed(1)} KB of HTML into dist/index.html`);
