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

## Phase 3: Frontend Integration & Mission Control UI [COMPLETED]
- [x] Implemented "MnSight AI" dark-mode GIS exploration dashboard
- [x] Integrated `front end mg.png` high-contrast orthomosaic viewport
- [x] Top Navigation Bar with live satellite sync & latency HUD
- [x] Floating 4-card Quick-Metric Panel (Reserves, Grade Area, Confidence, Dominant Signature)
- [x] 4 Multi-layer toggles (True Color, Alteration Halos, DEM Topo-Mesh, Anomaly Polygons)
- [x] Interactive Hotspot Anomaly tooltips with target depth, grade, and SWIR ratio
- [x] Collapsible right-hand drawer with mineral legend, AI confidence gradient & Recharts spectral curve
- [x] Multi-format Geospatial export modal (GeoTIFF, Shapefile, CSV schedule)
- [x] Zero TypeScript errors, 100% clean production build verified

## Phase 4: Tactical Web GIS & AI Predictive Dispatch Dashboard (SIH Grand Finale) [COMPLETED]
- [x] Strict Global 'Bebas Neue' typography across all headings, metrics, tables, and tooltips
- [x] Top Command Bar: Sector 4B Pit Odisha Belt (21°54'12"N, 85°20'45"E), 28ms telemetry latency, Sentinel-2/Landsat-9 SWIR sync, Ralph Loop status badge
- [x] Predictive "Best Time to Mine" Engine: 5-to-6 days advance multi-factor model (Weather, Slope Stability, Ore Accessibility, Trafficability) with 7-day visual timeline highlighting Days 5 & 6 and dynamic AI Recommendation Banners
- [x] Interactive GIS Canvas & Coordination Marking System: Orthomosaic pit canvas with false-color alteration halos, cursor coordinate HUD (Decimal + DMS + Elevation), "Add Tactical Pin" tool with categories ([EXTRACTION], [ASSAY SAMPLE], [SLOPE RISK], [HAUL ROUTE]), interactive editable pin inspector drawer, date range filters, and Ralph Loop undo/rollback
- [x] Daily Operations & Activity Log Table: Collapsible bottom ledger, real-time status transitions (PENDING -> IN PROGRESS -> VERIFIED), and one-click GeoJSON & CSV dispatch target export
- [x] Ralph Loop Audit Ledger Modal: Persistent verification tracking mimicking tasks.json / progress.txt with sequential diffs and instant state rollback

