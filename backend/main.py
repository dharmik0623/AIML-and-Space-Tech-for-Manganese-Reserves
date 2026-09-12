"""
Mine Twin API - Central FastAPI Application
AI/ML & Space Tech for Manganese Reserves & Shortfall Mitigation
Developed for MOIL Limited (Ministry of Steel) - Smart India Hackathon 2026
Team: Mine Twin | Problem Statement: SIH26009
"""

import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

# Ensure project root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.api.routes_upstream import router as upstream_router
from backend.api.routes_midstream import router as midstream_router
from backend.api.routes_prescriptive import router as prescriptive_router
from backend.api.routes_telemetry import router as telemetry_router

app = FastAPI(
    title="Mine Twin - MOIL Decision Support API",
    description="""
    Closed-Loop Satellite Remote Sensing & Prescriptive Pit Dispatch System for MOIL Limited.
    
    ### 3 Operational Modes:
    * **Mode 1: Upstream Ore Prospecting (MPM)** - Sentinel-2 & ASTER band ratios (B4/B2, B11/B8, B11/B12), DEM slope, Random Forest 0.0-1.0 MPI heatmaps, borehole vectoring.
    * **Mode 2: Midstream Shortfall Forecaster** - IMD 72h weather, SCS curve number runoff, XGBoost 3-7 day production shortfall forecaster, TreeSHAP explainability.
    * **Mode 3: Prescriptive Dynamic Dispatch** - Google OR-Tools/PuLP MILP solver enforcing safety cutoffs (>35mm rain) and 38% +/- 1.5% Mn grade blending.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(upstream_router)
app.include_router(midstream_router)
app.include_router(prescriptive_router)
app.include_router(telemetry_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "project": "Mine Twin - SIH 2026",
        "organization": "MOIL Limited (Ministry of Steel)",
        "problem_statement_id": "SIH26009",
        "title": "AI/ML & Space Tech for Manganese Reserves & Shortfall Mitigation",
        "status": "OPERATIONAL",
        "interactive_api_docs": "/docs",
        "alternative_docs": "/redoc",
        "modes_available": [
            "Mode 1: Upstream Mineral Prospectivity Mapping (/api/upstream)",
            "Mode 2: Midstream Weather & Operations Shortfall Forecaster (/api/midstream)",
            "Mode 3: Prescriptive Dynamic Haulage & Blending Optimizer (/api/prescriptive)",
            "Telemetry: Pit Digital Twin & Fleet Tracking (/api/telemetry)"
        ]
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "system": "Mine Twin Digital Co-Pilot",
        "modules": {
            "mode1_random_forest_mpm": "READY",
            "mode2_xgboost_shortfall_treeshap": "READY",
            "mode3_milp_or_tools_pulp": "READY",
            "imd_scada_weather_engine": "READY"
        }
    }


if __name__ == "__main__":
    import uvicorn
    print("Starting Mine Twin Server on http://127.0.0.1:8000 ...")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
