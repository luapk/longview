# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, typically port 5173)
npm run build     # Production build to dist/ (no sourcemaps)
npm run preview   # Preview production build locally
```

There are no lint, format, or test scripts configured.

## Architecture

This is **HORIZON v3.0** — a single-page React/Vite futures intelligence dashboard for Mars Snacking's 2036 scenario planning. The entire application lives in **`src/App.jsx`** (one file), with a trivial entry in `src/main.jsx`.

### Data Layer (top of App.jsx)

All data is hardcoded as module-level constants:

| Constant | Contents |
|----------|----------|
| `C` | Color palette (dark/gold theme, category colors) |
| `F` | Font families (JetBrains Mono, DM Sans, Instrument Serif) |
| `S` | 131 signals — each has ID, title, category, type, surprise/confidence scores, geography, lat/lon, drivers array, description, strategic question |
| `DR` | 10 strategic drivers (abstract forces, emoji icons, signal count) |
| `SC` | 9 future scenarios (2036 dispatches, shadow sides, killer assumptions, 4D metrics) |
| `BR` | 9 brands (Snickers, M&M's, Twix, Skittles, Extra, KIND, Pringles, Cheez-It, Kellogg's) |
| `MX` | Scenario × brand impact matrix (Threat/Opportunity/Monitor, intensity 1–4) |
| `TL` | Timeline actions grouped NOW / MON / PREP |

### UI Components (also in App.jsx)

Small inline functional components: `Gr` (grain texture overlay), `Cd` (glassmorphic card), `Bg` (badge), `DB` (data bar), `IC` (impact cell), `PW` (password gate — password is `mars2036`).

### Tab Views

The app is a five-tab dashboard; each tab is a large JSX block inside the main `App` component's render:

- **SignalsTab** — filterable grid of 131 signals + interactive D3 orthographic globe with signal markers
- **DriversTab** — 10 strategic drivers with description and signal count
- **ScenariosTab** — 9 scenario narratives (Probable / Deep / Cassandra), expandable with dispatch text, shadow side, assumptions, 4D metrics
- **MatrixTab** — 9×9 scenario × brand impact matrix (Kellanova hedge thesis)
- **TimelineTab** — NOW / MON / PREP actions with deadlines and scenario links

### D3 Globe

Rendered via a `useEffect` into a `<svg>` ref inside SignalsTab. Uses TopoJSON world atlas (`countries-110m`), orthographic projection, mouse/touch drag rotation, auto-rotate after 3 s idle, and colored signal markers. Custom minimal TopoJSON decoders (`decArc`, `topoMesh`, `topoFeat`) are inlined—there is no `topojson-client` npm dependency.

### Stack

- React 18 + Vite 6
- D3 7 (selection, geo, drag, zoom)
- Google Fonts (JetBrains Mono, DM Sans, Instrument Serif) loaded via `index.html`
- No TypeScript, no test framework, no linter
