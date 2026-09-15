# MINE TWIN: AI/ML & Space Tech for Manganese Reserves & Shortfall Mitigation

**Smart India Hackathon 2026 | MOIL Limited (Ministry of Steel)**  
**Problem Statement ID:** SIH26009  
**Theme:** Space Technology / Smart Mining Automation  
**Team Name:** Mine Twin  

[![Presentation](https://img.shields.io/badge/SIH%20Presentation-sih__submission.ppt-orange?style=for-the-badge&logo=microsoftpowerpoint)](./sih_submission.ppt)

---

## 📑 Official Presentation Deck
- **Presentation File**: [**`sih_submission.ppt`**](./sih_submission.ppt)

---

## 🌟 Executive Summary & Overview

**Mine Twin** is a closed-loop digital twin and decision support system designed specifically for **MOIL Limited** (Central Indian Manganese Belts: *Balaghat, Dongri Buzurg, Mansar, and Gumgaon*).

It bridges macro-level orbital remote sensing with micro-level pit hauler dispatch and crusher feed control across **3 Operational Modes**:

```
+-------------------------------------------------------------------------------+
|                             EARTH OBSERVATION                                 |
|  Copernicus Sentinel-2 (L2A) + USGS ASTER SWIR/VNIR + Copernicus 30m DEM      |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
                    +---------------------------------------+
                    |  MODE 1: UPSTREAM PROSPECTING (MPM)   |
                    |  - Spectral Band Ratios (B4/B2, etc)  |
                    |  - Random Forest 0.0 - 1.0 MPI Grid   |
                    |  - Pinpointed Borehole Vectoring      |
                    |  - Eliminates Speculative Drilling    |
                    +-------------------+-------------------+
                                        |
                                        v
+---------------------------------------+---------------------------------------+
|  METEOROLOGICAL & PIT SCADA           |  MODE 2: MIDSTREAM FORECASTER         |
|  - IMD Pune 72h Gridded Rain          |  - XGBoost Multivariate Regressor     |
|  - USDA SCS Curve Number Runoff       |  - 3-to-7 Day Shortfall Forecast (ΔT) |
|  - Haul-Road Mud Slippage Index       |  - TreeSHAP Transparent Attribution   |
+---------------------------------------+-------------------+-------------------+
                                                            |
                                                            v
                                        +---------------------------------------+
                                        |  MODE 3: PRESCRIPTIVE DISPATCH (MILP) |
                                        |  - Dynamic Cutoff: Rain > 35mm/24h    |
                                        |  - Grade Blending Lock: 38% ± 1.5% Mn |
                                        |  - Real-time Reroute to Dry Buffer    |
                                        |  - 100% Crusher Starvation Prevention |
                                        +---------------------------------------+
```

---

## 🚀 Key Value & Triple-Bottom-Line ROI

1. **Exploration Capital Efficiency**:
   - Eliminates blind grid drilling by 30%–40%, saving **₹30L – ₹50L** in diamond-core drilling expenses per exploration phase.
2. **Operational Continuity & Crusher Starvation Elimination**:
   - Preventing just 3 days of weather-induced primary crusher starvation recovers **₹60 Lakhs – ₹1.2 Crore** per mine pit annually.
3. **Strict Contract Grade Lock**:
   - Enforces mathematical crusher feed balance: $\frac{\sum(Q_i \cdot G_i)}{\sum Q_i} = 38\% \pm 1.5\% \text{ Mn}$ under fluctuating pit bench moisture.
4. **Dispatcher Trust via TreeSHAP**:
   - Eliminates "black-box" resistance by detailing the exact physical root causes behind every dispatch directive.

---

## 🛠 Tech Stack

- **Runtime**: Python 3.10+ / Python 3.12
- **Web API**: FastAPI, Uvicorn, Pydantic
- **Machine Learning**: Scikit-Learn (Random Forest MPM), XGBoost (Shortfall Regressor)
- **Model Explainability**: TreeSHAP (XAI Feature Attribution)
- **Operations Research & Optimization**: PuLP / Google OR-Tools (Mixed-Integer Linear Programming)
- **Hydrological Ground Risk**: USDA Soil Conservation Service (SCS) Curve Number Method
- **Testing**: Pytest & HTTPX TestClient

---

## 📂 Project Structure

```
├── frontend/                       # MnSight Enterprise WebGIS & Control Room Dashboard
│   ├── src/
│   │   ├── components/             # PitSpatialWorkspace, DockedConsole, GlobalHeaderBar
│   │   ├── data/                   # Concession profiles, DEWP forecasts, ADS directives
│   │   └── App.tsx                 # Full-Screen mining control room application
│   └── package.json                # React 19 + TypeScript + Vite + Tailwind CSS
├── backend/
│   ├── main.py                     # FastAPI application entry point with CORS
│   ├── data/
│   │   ├── pit_config.py           # Mine profiles: Balaghat, Dongri Buzurg, Mansar, Gumgaon
│   │   └── weather_scada.py        # IMD 72h weather forecasts & SCS runoff/traction telemetry
│   ├── models/
│   │   ├── upstream_mpm.py         # Mode 1: Band ratios, Random Forest, 0-1 MPI, Boreholes
│   │   ├── midstream_forecaster.py # Mode 2: XGBoost 3-7 day shortfall, TreeSHAP explainer
│   │   └── prescriptive_optimizer.py # Mode 3: MILP Google OR-Tools/PuLP dynamic haul reroute
│   └── api/
│       ├── routes_upstream.py      # Endpoints for Upstream Exploration & Prospectivity
│       ├── routes_midstream.py     # Endpoints for Weather Forecaster & TreeSHAP
│       ├── routes_prescriptive.py  # Endpoints for Prescriptive MILP Dispatch Solver
│       └── routes_telemetry.py     # Endpoints for Pit Digital Twin, Benches & Executive KPIs
├── tests/
│   └── test_all_modes.py           # Automated test suite (12 passed tests)
├── sih_submission.ppt              # Official SIH Grand Finale Presentation Deck (4.56 MB)
├── requirements.txt                # Pinned backend Python dependencies
├── run_server.py                   # One-click FastAPI server launcher
└── README.md                       # Complete technical documentation
```

---

## ⚡ How to Run the Backend

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Automated Verification Tests
```bash
python -m pytest tests/test_all_modes.py -v
```

### 3. Launch the API Server
```bash
python run_server.py
```
The server will start at: **`http://127.0.0.1:8000`**

- **Interactive Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc UI**: `http://127.0.0.1:8000/redoc`

---

## 📡 Frontend Integration API Guide

All endpoints return clean JSON and have full CORS enabled (`allow_origins=["*"]`) so any frontend (React, Vite, Next.js, Vue, or Vanilla JS) can query them directly.

### Mode 1: Upstream Ore Prospecting
- **`GET /api/upstream/prospectivity?mine_id=balaghat&grid_resolution=25`**
  - Returns the 0.0–1.0 MPI spatial raster grid, classified zones, identified borehole target coordinates, and drilling capital savings.
- **`GET /api/upstream/borehole-targets?mine_id=balaghat`**
  - Returns prioritized drill coordinates with predicted depths and grades.

### Mode 2: Midstream Shortfall Forecaster
- **`GET /api/midstream/forecast?mine_id=balaghat&scenario=heavy_cloudburst&scheduled_target_tons=3200`**
  - Returns:
    - `immediate_24h_forecast`: predicted daily shortfall tons and cutoff indicators.
    - `seven_day_projections`: 7-day shortfall projection curve.
    - `treeshap_explainability`: percentage risk attribution for each factor and dispatcher rationale text.
- **`GET /api/midstream/scenarios`**
  - Returns available weather simulation scenarios (`clear_dry`, `moderate_monsoon`, `heavy_cloudburst`, `live`).
- **`GET /api/midstream/weather-scada?mine_id=balaghat&scenario=heavy_cloudburst`**
  - Returns 72-hour precipitation timeline, soil saturation, and bench runoff/traction status.

### Mode 3: Prescriptive Dynamic Dispatch (MILP)
- **`POST /api/prescriptive/optimize`**
  - Request Body:
    ```json
    {
      "mine_id": "balaghat",
      "weather_scenario": "heavy_cloudburst",
      "hourly_crusher_demand_tons": 450.0
    }
    ```
  - Response:
    - Optimal tonnage allocated to each bench & dry stockpile.
    - Automated dumper reroute directives from waterlogged benches to dry buffer sheds.
    - Strict confirmation of contractual grade lock ($38\% \pm 1.5\% \text{ Mn}$).
    - Confirmation of Zero Crusher Starvation.
- **`GET /api/prescriptive/quick-solve?mine_id=balaghat&scenario=heavy_cloudburst&demand_tph=450`**
  - GET convenience endpoint for instant dashboard reactivity.

### Telemetry & Digital Twin
- **`GET /api/telemetry/mines`**
  - Lists all 4 MOIL mines (Balaghat, Dongri Buzurg, Mansar, Gumgaon) with coordinates and metadata.
- **`GET /api/telemetry/pit-status?mine_id=balaghat&scenario=heavy_cloudburst`**
  - Returns live digital twin state including bench geometry, stockpiles, dumpers, and primary crusher hopper metrics.
- **`GET /api/telemetry/executive-kpis?mine_id=balaghat`**
  - Returns Triple-Bottom-Line ROI metrics and legacy vs. Mine Twin competitive benchmark table.
