"""
API Router for Digital Twin Pit Telemetry, Fleet Tracking & Executive KPIs.
"""

from fastapi import APIRouter, Query, HTTPException
from backend.data.pit_config import MOIL_MINES, list_available_mines, get_mine_config
from backend.data.weather_scada import fetch_imd_weather_forecast, get_current_bench_scada

router = APIRouter(prefix="/api/telemetry", tags=["Pit Telemetry & Digital Twin"])


@router.get("/mines")
def get_all_mines():
    """
    List all configured MOIL manganese mines in Central India.
    """
    return {"mines": list_available_mines()}


@router.get("/pit-status")
def get_pit_digital_twin_status(
    mine_id: str = Query("balaghat"),
    scenario: str = Query("heavy_cloudburst")
):
    """
    Return comprehensive digital twin state:
    - Mine layout, coordinates, boundary polygon
    - Active benches with live slope hazards & SCS runoff
    - Stockpiles with grades and tonnage
    - Fleet dumper statuses & cycle times
    - Primary crusher metrics
    """
    try:
        mine = get_mine_config(mine_id)
        weather = fetch_imd_weather_forecast(mine_id, scenario)
        bench_scada = get_current_bench_scada(mine_id, weather)

        return {
            "mine_id": mine["id"],
            "mine_name": mine["name"],
            "state": mine["state"],
            "district": mine["district"],
            "coordinates": mine["coordinates"],
            "elevation_range_m": mine["elevation_range_m"],
            "boundary_polygon": mine["boundary_polygon"],
            "weather": weather,
            "benches": bench_scada,
            "stockpiles": mine["stockpiles"],
            "dumpers": mine["dumpers"],
            "primary_crusher": {
                "id": "CRUSHER-01",
                "name": "MOIL Primary Gyratory Crusher #1",
                "target_feed_grade_pct": 38.0,
                "tolerance_pct": 1.5,
                "nominal_capacity_tph": 450.0,
                "current_feed_status": "OPERATIONAL",
                "hopper_fill_pct": 74.0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/executive-kpis")
def get_executive_kpis(mine_id: str = Query("balaghat")):
    """
    Return Triple-Bottom-Line impacts and high-level ROI metrics
    corresponding to SIH Presentation Slide 5 & 4:
    - Production capacity recovery (8-15%)
    - Annual pit savings (₹60L - ₹1.2 Crore)
    - Eliminated speculative drilling (₹30L - ₹50L)
    - Environmental footprint reduction (forest clearing averted)
    - National mineral security (Atmanirbhar Bharat)
    """
    return {
        "mine_id": mine_id,
        "triple_bottom_line": {
            "economic": {
                "annual_production_recovery_pct": "8% – 15%",
                "crusher_starvation_loss_prevented_annual": "₹60 Lakhs – ₹1.2 Crore",
                "speculative_borehole_capex_eliminated": "₹30 Lakhs – ₹50 Lakhs per phase",
                "blind_core_drilling_cut_pct": "30% – 40%"
            },
            "environmental": {
                "unnecessary_forest_clearing_averted": "12.4 Hectares",
                "topsoil_disturbance_prevented_tons": "18,500 MT",
                "diesel_haulage_burn_reduction_pct": "9.2% via optimized routing"
            },
            "strategic_national": {
                "policy_alignment": "National Mineral Policy 2019 & Atmanirbhar Bharat",
                "ministry": "Ministry of Steel (MOIL Limited)",
                "strategic_end_use": "Domestic Green Steelmaking & EV Battery-grade MnSO4"
            }
        },
        "competitive_benchmarks": [
            {"feature": "Exploration Vectoring", "legacy_moil": "Manual grid drill", "mine_twin": "AI Band Ratios (0-1 MPI)"},
            {"feature": "Shortfall Warning", "legacy_moil": "Reactive (after rain)", "mine_twin": "3–7 Day XGBoost Forecast"},
            {"feature": "Crusher Starvation Fix", "legacy_moil": "Manual radio calls", "mine_twin": "Automated MILP Solver"},
            {"feature": "Feed Grade Control", "legacy_moil": "Post-crusher lab", "mine_twin": "Live Blending (38% Mn)"},
            {"feature": "Hardware Dependency", "legacy_moil": "Heavy drill rigs", "mine_twin": "Zero Hardware (Space Data)"},
            {"feature": "Decision Transparency", "legacy_moil": "Dispatcher intuition", "mine_twin": "TreeSHAP Explainable AI"}
        ]
    }
