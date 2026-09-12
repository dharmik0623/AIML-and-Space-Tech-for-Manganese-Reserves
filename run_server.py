"""
Mine Twin Server Launcher
Runs the FastAPI Backend Server on http://127.0.0.1:8000
"""

import uvicorn
import sys
import os

if __name__ == "__main__":
    # Ensure root is in path
    root_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, root_dir)
    print("=" * 65)
    print("  MINE TWIN - MOIL LIMITED (MINISTRY OF STEEL) - SIH 2026")
    print("  AI/ML & Space Tech for Manganese Reserves & Shortfall Mitigation")
    print("=" * 65)
    print("  Mode 1: Upstream Mineral Prospectivity Mapping (Random Forest)")
    print("  Mode 2: Midstream Shortfall Forecaster (XGBoost + TreeSHAP)")
    print("  Mode 3: Prescriptive Dynamic Haulage Optimizer (MILP / OR-Tools)")
    print("-" * 65)
    print("  Server URL: http://127.0.0.1:8000")
    print("  API Documentation (Swagger UI): http://127.0.0.1:8000/docs")
    print("  Alternative Documentation (ReDoc): http://127.0.0.1:8000/redoc")
    print("=" * 65)
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
