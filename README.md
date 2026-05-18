# Flag Quiz for Kids

A kid-friendly cross-platform flag quiz PWA for ages 5+. Built with React + Vite + TypeScript + Tailwind. Three progressively unlocked levels, English/Chinese toggle, single-device local progress, fully offline-capable once installed.

> **Working on this codebase?** Start with [AGENTS.md](AGENTS.md) — it's the developer / AI-agent hand-off guide covering architecture, conventions, gotchas, and common tasks.

## Features

- **3 difficulty levels**, unlocked progressively:
  - **Easy** — tap the correct country name from 4 choices
  - **Medium** — pick scrambled letters / characters to spell the name
  - **Hard** — type the name with a kid-sized on-screen keyboard
- **English and Chinese** country names (toggle in Settings or via the pill on Home)
- **No backend.** Progress is stored in `localStorage`
- **PWA**: install to Home Screen on iPad / Android, runs offline
- **Mascot Globie** + confetti, no timer, no pressure
- **Passport** view collects a star on every country you've mastered
- **Curated 50 famous flags** by default; toggle "Include all countries" in Settings to add ~60 more

## Run locally

```bash
npm install
npm run dev
```

Open the printed URL. To test the PWA / Add-to-Home-Screen flow on an iPad or phone on the same Wi-Fi:

```bash
npm run build
npm run preview -- --host
```

Then visit the LAN URL the preview prints (e.g. `http://192.168.x.x:4173/flag-quiz/`).

## Deploy (GitHub Pages)

This repo includes a deploy workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

One-time setup:

1. Push the repo to GitHub (name it `flag-quiz`, or update `base` in [vite.config.ts](vite.config.ts) and the repo name in the URL accordingly).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow builds and publishes in ~1 minute.

The site will be at `https://<user>.github.io/flag-quiz/`.

### Custom domain

Drop a `CNAME` file in `public/` containing your domain, change `base: '/flag-quiz/'` to `base: '/'` in [vite.config.ts](vite.config.ts) (and the manifest `start_url`/`scope`), and configure DNS per GitHub's docs.

## Project layout

```
src/
  data/countries.ts            curated + extra country list (EN + ZH)
  store/gameStore.ts           Zustand store with localStorage persistence
  i18n/{en,zh,index}.ts        translation dicts + useT() hook
  lib/{audio,quiz,shuffle}.ts  WebAudio + quiz selection helpers
  components/                  Globie, FlagCard, Keyboard, etc.
  pages/                       Home, Game, Passport, Settings
  rounds/                      EasyRound, MediumRound, HardRound
```

## Adding more countries

Edit [src/data/countries.ts](src/data/countries.ts) — add an entry with an ISO-3166 alpha-2 `code`, both `en` and `zh` names, and the pools you want it to appear in. Flag SVGs come from [flag-icons](https://github.com/lipis/flag-icons) automatically.

## Regenerating PWA icons

If you change [public/favicon.svg](public/favicon.svg):

```bash
npm run generate-pwa-assets
```

## Reset progress

In-app: **Settings → Reset progress**. Or clear `localStorage` for the site.

## Tech

- [Vite](https://vitejs.dev) + [React](https://react.dev) 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs) (state)
- [framer-motion](https://www.framer.com/motion/) + [canvas-confetti](https://github.com/catdad/canvas-confetti) (delight)
- [flag-icons](https://github.com/lipis/flag-icons) (SVG flags)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) (manifest + service worker)
- [@fontsource/fredoka](https://fontsource.org/fonts/fredoka) (offline-bundled friendly font)

MIT licensed.
