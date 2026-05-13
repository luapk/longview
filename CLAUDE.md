# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, http://localhost:5173)
npm run build     # Production build to dist/ (no sourcemaps)
npm run preview   # Preview production build locally
```

There are no lint, format, or test scripts configured.

## Repository = two parallel HORIZON instances

This repo hosts **two independent futures-intelligence tools** built on the same scaffold but with separate data, themes, entry points, and bundles. They are deliberately decoupled — share tooling, share nothing at runtime.

| Tool | URL | Entry | Code |
|---|---|---|---|
| **Mars Snacking** (HORIZON v3.0, complete) | `/` | `index.html` → `src/mars/main.jsx` | `src/mars/` |
| **Sport & Fitness Apparel** (Puma + Columbia, scan in progress) | `/sport/` | `sport/index.html` → `src/sport/main.jsx` | `src/sport/` |

Multi-page mode is configured in `vite.config.js` via `rollupOptions.input`. Each tool produces its own bundle (`dist/index.html` / `dist/sport/index.html`).

## Methodology — signals → drivers → scenarios

Both tools follow the same horizon-scanning sequence. Do **not** reverse the order:

1. **Scan** — populate `data/signals.js` with 130–180 diverse signals (academic, trade, regulatory, fringe, geographic asymmetries, surprises). Each signal carries STEEP category, surprise score (1–3), confidence (Verified/Probable/Contested), geography, and a "so what?" strategic question.
2. **Cluster** — once ~100 signals are populated, let driver clusters emerge from the signal field. Don't force a target count.
3. **Name drivers** — populate `data/drivers.js`. A driver is a *force*, not a trend (a trend is a signal of a driver).
4. **Identify critical uncertainties** — high impact AND high uncertainty become scenario axes.
5. **Build scenarios** — populate `data/scenarios.js`. Each scenario picks 2 driver IDs as critical uncertainties and writes a 2036 dispatch + shadow side + killer assumption + 4D metrics.
6. **Stress-test brands** — populate `data/matrix.js` (scenario × brand, Threat/Opportunity/Monitor with intensity 1–4).
7. **Derive actions** — populate `data/timeline.js` (NOW / MON / PREP), each action linked to a scenario id.

The Mars instance is the worked example (131 signals, 10 drivers, 9 scenarios, 9 brands, fully populated matrix and timeline). The Sport instance is the **scan-first scaffold** — empty data modules with the scan framework documented inline at the top of `src/sport/data/signals.js`. Reference that file's JSDoc for source taxonomy, scoring rubric, geographic weighting, and time-horizon distribution.

## Per-tool file layout

Each tool's `src/{tool}/` directory follows the same shape:

```
App.jsx              Single-file UI: Globe + UI primitives + 5 tabs + password gate
main.jsx             React 18 entry
theme.js             Colour palette (C), fonts (F), category/type/confidence colour maps
data/
  signals.js         The scan — array of signal objects (see schema in sport/data/signals.js)
  drivers.js         Clustered forces (imports C from ../theme.js for colour tags)
  scenarios.js       2036 narratives with dispatch text
  brands.js          Portfolio array (order maps to matrix columns)
  matrix.js          Scenario × brand impact matrix
  timeline.js        { NOW, MON, PREP } action arrays
```

The Sport `App.jsx` mirrors Mars's structure tab-by-tab but renders an `<Empty>` placeholder card on each tab when the relevant data array is empty — populating data is enough to "switch on" a tab.

## D3 globe

Both tools render an orthographic D3 globe inside `App.jsx`. Implementation specifics:
- TopoJSON world atlas fetched from `cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`
- Custom TopoJSON decoders (`decArc`, `topoMesh`, `topoFeat`) are inlined — there is no `topojson-client` npm dependency
- Mouse/touch drag rotation with 3-second idle auto-resume
- Signal markers coloured by STEEP category via `catCol`

## Theme conventions

`theme.js` exports `C` (colours), `F` (fonts), and three colour maps. By convention:
- `C.abyss` / `C.abyssLight` / `C.abyssMid` — three darkness levels for layered backgrounds
- `C.gold` is the accent (Mars uses warm gold #D4A853, Sport uses sunset orange #FF6B35)
- `catCol` / `typeCol` / `confCol` — three independent dimensions on each signal badge

Drivers import `C` from `../theme.js` for their per-driver colour swatch. Keep this dependency narrow — data modules should not pull in JSX or React.

## Passwords

- Mars: `mars2036`
- Sport: `scan2036`

Trivial client-side gates; not real auth. If a tool is shared externally, replace `PW` with a real auth boundary.

## Stack

React 18 + Vite 6 + D3 7. Google Fonts (JetBrains Mono / DM Sans / Instrument Serif) loaded via each `index.html`. No TypeScript, no tests, no linter.
