// Copy dist/index.html to dist/404.html so GitHub Pages serves the SPA shell
// for any deep-link path (e.g. /flag-quiz/game/easy). React Router then handles
// the route on the client.
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const src = resolve('dist/index.html');
const dest = resolve('dist/404.html');

if (!existsSync(src)) {
  console.error('[spa-404] dist/index.html missing — skipping');
  process.exit(0);
}

copyFileSync(src, dest);
console.log('[spa-404] dist/404.html created from dist/index.html');
