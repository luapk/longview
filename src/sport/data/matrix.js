// Scenario × Brand impact matrix. Rows = scenarios (order of SC),
// columns = brands (order of BR).
// Brands (order): Puma, Cobra Puma Golf, Stichd, Columbia, SOREL,
//                 prAna, Mountain Hardwear, Nike (ref), Lululemon (ref)
// Scenarios:     S1 Quiet Uniform, S2 Outpost Republics,
//                 S3 Compliance Cathedral, S4 Splinter Markets, S5 Movement Reset
// Cell: { r: "Threat" | "Opportunity" | "Monitor", i: 1–4 intensity }

export const MX=[
// S1 The Quiet Uniform — gorpcore default + compliance-as-moat
// Adidas: EU-native, Futurecraft 3D knit + Mycoworks pilot, compliance strong (S49,S52) — Opp i:3
// UA: compliance cost hits mid-tier; no technical differentiation — Monitor i:2
[{r:"Threat",i:3},{r:"Monitor",i:2},{r:"Threat",i:3},{r:"Opportunity",i:3},{r:"Opportunity",i:2},{r:"Opportunity",i:3},{r:"Monitor",i:2},{r:"Monitor",i:3},{r:"Opportunity",i:3},{r:"Opportunity",i:3},{r:"Monitor",i:2}],
// S2 Outpost Republics — gorpcore default + regional manufacturing fragmentation
// Adidas: regional manufacturing capability + brand consistency globally (S52,S9) — Opp i:3
// UA: US-heavy distribution, limited regional flex (S31,S87) — Threat i:2
[{r:"Opportunity",i:3},{r:"Monitor",i:2},{r:"Opportunity",i:2},{r:"Monitor",i:3},{r:"Monitor",i:2},{r:"Threat",i:2},{r:"Threat",i:2},{r:"Opportunity",i:3},{r:"Monitor",i:3},{r:"Opportunity",i:3},{r:"Threat",i:2}],
// S3 The Compliance Cathedral — aesthetic fragments + compliance-as-moat
// Adidas: compliance moat real; Yeezy drop-format precedent; 3D knit cadence (S52,S65) — Opp i:3
// UA: slow on tribe-capsule; DTC unresolved; no standout compliance position — Threat i:2
[{r:"Opportunity",i:4},{r:"Monitor",i:1},{r:"Opportunity",i:2},{r:"Monitor",i:3},{r:"Opportunity",i:2},{r:"Monitor",i:2},{r:"Threat",i:3},{r:"Monitor",i:3},{r:"Opportunity",i:3},{r:"Opportunity",i:3},{r:"Threat",i:2}],
// S4 Splinter Markets — aesthetic fragments + regulatory/trade fragmentation
// Adidas: scale is partial liability but regional capacity stronger than Puma (S7,S52) — Monitor i:3
// UA: team-sport declining (S87), compliance thin, mid-tier most exposed — Threat i:3
[{r:"Threat",i:4},{r:"Threat",i:3},{r:"Threat",i:3},{r:"Monitor",i:2},{r:"Monitor",i:2},{r:"Threat",i:3},{r:"Threat",i:3},{r:"Threat",i:3},{r:"Monitor",i:3},{r:"Monitor",i:3},{r:"Threat",i:3}],
// S5 The Movement Reset — GLP-1 returner cohort floods movement categories
// Adidas: aspirational brand exposure; lifestyle DNA (Stan Smith, Gazelle) slightly mitigates (S9) — Threat i:3
// UA: "Move" positioning partially compatible; weak execution vs Lululemon — Monitor i:2
[{r:"Threat",i:4},{r:"Monitor",i:2},{r:"Monitor",i:2},{r:"Opportunity",i:3},{r:"Opportunity",i:2},{r:"Opportunity",i:2},{r:"Monitor",i:1},{r:"Threat",i:4},{r:"Opportunity",i:4},{r:"Threat",i:3},{r:"Monitor",i:2}],
];
