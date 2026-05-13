// ═══════════════════════════════════════════════════════════════════
// HORIZON · SPORT & FITNESS APPAREL — SCAN FRAMEWORK
// Target portfolio: Puma (sport/street/performance-fashion) + Columbia
// (outdoor/technical/weather-driven), plus sub-brands.
// ═══════════════════════════════════════════════════════════════════
//
// METHODOLOGY (signals → drivers → scenarios, never the reverse):
//
//   1. Scan the field. Populate this file with ~130–180 signals from a
//      deliberately diverse source mix. Do NOT pre-decide drivers.
//   2. Tag and cluster. Inspect this file in driver.js once 100+ signals
//      are populated; let the clusters emerge.
//   3. Name drivers (forces, not trends). Populate drivers.js.
//   4. Identify critical uncertainties — high impact AND high uncertainty.
//   5. Build scenarios in scenarios.js from driver combinations.
//   6. Stress-test the brand portfolio (matrix.js) against the scenarios.
//
// SIGNAL SCHEMA (mirror of Mars instance; do not change without parity):
//   id   — int, monotonic, unique
//   t    — short title (5–10 words)
//   c    — category: Social | Technology | Economic | Environmental | Policy
//   ty   — type: Positive | Negative | Counter-Signal | Absence
//          (positive = tailwind, negative = headwind, counter = contradicts
//           a dominant signal, absence = expected-but-missing)
//   su   — surprise rating 1–3 (3 = contradicts received wisdom)
//   co   — confidence: Verified | Probable | Contested
//   g    — geography label (free text e.g. "US", "EU", "Global", "Vietnam")
//   la   — latitude (for globe placement)
//   lo   — longitude (for globe placement)
//   d    — array of driver ids this signal contributes to (set after clustering)
//   sw   — "so what?" strategic question — the question the signal forces
//   de   — description with source attribution and date if possible
//
// SOURCE TAXONOMY — aim for breadth across all bands:
//   • Academic: textile science, sport science, climate journals,
//     materials engineering, behavioural economics
//   • Trade press: WWD, Sourcing Journal, SGB Media, Sportswear International,
//     Outdoor Retailer, Just Style, Apparel Resources
//   • Regulatory: EU CSRD/EPR filings, California DTSC, FTC green-claim
//     enforcement, US tariff dockets, REACH updates, microfiber legislation
//   • Financial: Puma/Columbia/Adidas/Nike/Lululemon/VF Corp earnings,
//     analyst notes, Hoka/On/Vuori filings, sneaker resale market data
//   • Cultural: TikTok subcultures, sneaker forums (NikeTalk, Sole Collector),
//     outdoor communities (Backpacking Light, r/CampingGear), athlete platforms
//   • Manufacturing: Vietnam/Bangladesh/Indonesia/Cambodia labour and climate
//     reports, factory consolidation news, nearshoring announcements
//   • Sport calendar: Olympic cycle (Milan-Cortina 2026, LA 2028, Brisbane 2032),
//     World Cup 2026, F1, NWSL/WNBA expansion, women's sport prize parity
//   • Fringe: barefoot/minimalist community, gorpcore forums, technical
//     "uniform" subcultures (Arc'teryx fanboys, Salomon trail running)
//
// GEOGRAPHIC WEIGHTING — weight signals across four node types:
//   • Manufacturing: Vietnam, Bangladesh, Indonesia, Cambodia, Turkey,
//     Pakistan, China (still), Mexico (nearshoring)
//   • Consumer growth: India, ASEAN, Gulf states, Mexico, Brazil
//   • Regulatory: Brussels, California, Berlin, London, Tokyo
//   • Cultural origin: LA, Tokyo, Seoul, Lagos, Mexico City, Berlin, Portland
//
// TIME-HORIZON DISTRIBUTION — target mix:
//   • Near (0–2y): ~40% — observable now, decisions imminent
//   • Medium (3–7y): ~40% — emerging, requires positioning
//   • Far (8–12y): ~20% — weak/structural, requires optionality
//
// DIVERSITY CRITERIA — deliberately seek:
//   • Weak signals (early, low-confidence anomalies) — highest-value finds
//   • Surprises (contradicts received wisdom; high su score)
//   • Convergences (same phenomenon in unrelated domains)
//   • Geographic asymmetries (something in Lagos that hasn't reached LA)
//   • Absences (expected signal that is missing)
//
// SCORING NOTES:
//   • su=1: confirms existing direction; useful for evidence weight but rarely
//     reframes thinking
//   • su=2: meaningfully unexpected; worth circulating
//   • su=3: contradicts the prevailing narrative; flag for cluster review
//
// ═══════════════════════════════════════════════════════════════════

export const S = [];
