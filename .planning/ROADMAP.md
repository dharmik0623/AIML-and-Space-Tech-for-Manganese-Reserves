# Project Roadmap: Mine Twin

## Phase 1: AI/ML Engines & Mathematical Solver [COMPLETED]
- [x] Pit profiles for Balaghat, Dongri Buzurg, Mansar, Gumgaon
- [x] Mode 1 Upstream MPM: Band ratios (B4/B2, B11/B8, B11/B12), DEM slope, Random Forest 0-1 MPI
- [x] Mode 2 Midstream Forecaster: SCS Curve Number runoff, XGBoost 3-7 day shortfall, TreeSHAP
- [x] Mode 3 Prescriptive Optimizer: MILP solver, dynamic cutoff (>35mm rain), 38% +/- 1.5% Mn grade lock
- [x] Comprehensive Automated Tests (12/12 passed)

## Phase 2: Autonomous Tooling & Developer Infrastructure [COMPLETED]
- [x] Git repository initialized
- [x] GSD (Get Shit Done) plugin & rules installed
- [x] Ralph Loop (autonomous self-correction) plugin & rules installed
- [x] CodeRabbit (automated code review) plugin & rules installed
- [x] Unified AGENTS.md workflow rule active

## Phase 3: Frontend Integration & Mission Control UI [AWAITING USER INPUT]
- [ ] Ingest user-provided frontend code, mockups, or background images
- [ ] Connect Leaflet/Mapbox GIS canvas to `/api/upstream/prospectivity`
- [ ] Connect 72h Weather timeline & TreeSHAP charts to `/api/midstream/forecast`
- [ ] Connect live truck rerouting & crusher gauge to `/api/prescriptive/optimize`
- [ ] Run Ralph Loop + CodeRabbit review on frontend build
