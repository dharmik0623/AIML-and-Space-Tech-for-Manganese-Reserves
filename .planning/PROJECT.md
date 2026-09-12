# Project: MINE TWIN - Manganese Reserves & Shortfall Mitigation

## Overview
- **Organization**: MOIL Limited (Ministry of Steel)
- **Hackathon**: Smart India Hackathon 2026
- **Problem Statement ID**: SIH26009
- **Team**: Mine Twin

## Core Architecture
- **Mode 1 (Upstream)**: Earth Observation (Sentinel-2, ASTER, DEM) + Random Forest 0-1 MPI prospectivity mapping.
- **Mode 2 (Midstream)**: IMD 72h precipitation + SCS Curve Number runoff + XGBoost 3-7 day shortfall regressor + TreeSHAP explainability.
- **Mode 3 (Prescriptive)**: MILP Solver (Google OR-Tools & PuLP) for real-time dumper reroutes and strict 38% +/- 1.5% Mn grade blending.
- **Frontend Layer**: Digital Twin 3D/GIS Mission Control Dashboard (ready for user UI/mockup integration).

## Tech Stack
Python 3.12, FastAPI, Scikit-Learn, XGBoost, SHAP, PuLP, Google OR-Tools, Leaflet/Mapbox GIS.
