// Scenario × Brand impact matrix. Rows = scenarios (order of SC),
// columns = brands (order of BR).
// Brands (order): Puma, Cobra Puma Golf, Stichd, Columbia, SOREL,
//                 prAna, Mountain Hardwear, Nike (ref), Lululemon (ref)
// Scenarios:     S1 Quiet Uniform, S2 Outpost Republics,
//                 S3 Compliance Cathedral, S4 Splinter Markets, S5 Movement Reset
// Cell: { r: "Threat" | "Opportunity" | "Monitor", i: 1–4 intensity }

export const MX=[
// S1 The Quiet Uniform — gorpcore default + compliance-as-moat
[{r:"Threat",i:3},{r:"Monitor",i:2},{r:"Threat",i:3},{r:"Opportunity",i:3},{r:"Opportunity",i:2},{r:"Opportunity",i:3},{r:"Monitor",i:2},{r:"Monitor",i:3},{r:"Opportunity",i:3}],
// S2 Outpost Republics — gorpcore default + regional manufacturing fragmentation
[{r:"Opportunity",i:3},{r:"Monitor",i:2},{r:"Opportunity",i:2},{r:"Monitor",i:3},{r:"Monitor",i:2},{r:"Threat",i:2},{r:"Threat",i:2},{r:"Opportunity",i:3},{r:"Monitor",i:3}],
// S3 The Compliance Cathedral — aesthetic fragments + compliance-as-moat
[{r:"Opportunity",i:4},{r:"Monitor",i:1},{r:"Opportunity",i:2},{r:"Monitor",i:3},{r:"Opportunity",i:2},{r:"Monitor",i:2},{r:"Threat",i:3},{r:"Monitor",i:3},{r:"Opportunity",i:3}],
// S4 Splinter Markets — aesthetic fragments + regulatory/trade fragmentation
[{r:"Threat",i:4},{r:"Threat",i:3},{r:"Threat",i:3},{r:"Monitor",i:2},{r:"Monitor",i:2},{r:"Threat",i:3},{r:"Threat",i:3},{r:"Threat",i:3},{r:"Monitor",i:3}],
// S5 The Movement Reset — GLP-1 returner cohort floods movement categories
[{r:"Threat",i:4},{r:"Monitor",i:2},{r:"Monitor",i:2},{r:"Opportunity",i:3},{r:"Opportunity",i:2},{r:"Opportunity",i:2},{r:"Monitor",i:1},{r:"Threat",i:4},{r:"Opportunity",i:4}],
];
