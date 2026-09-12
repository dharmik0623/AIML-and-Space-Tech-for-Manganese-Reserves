"""
API Router for Mode 2: Midstream Operations & Weather Shortfall Forecaster.
"""

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from backend.models.midstream_forecaster import midstream_forecaster
from backend.data.weather_scada import WEATHER_SCENARIOS, fetch_imd_weather_forecast, get_current_bench_scada

router = APIRouter(prefix="/api/midstream", tags=["Mode 2: Midstream Shortfall Forecaster"])


class WeatherSimulationRequest(BaseModel):
    mine_id: str = Field("balaghat", description="Mine identifier")
    custom_rainfall_mm: float = Field(..., ge=0.0, le=250.0, description="Simulated 24h rainfall in mm")
    custom_soil_moisture_pct: float = Field(40.0, ge=5.0, le=95.0, description="Volumetric soil moisture percentage")
    scheduled_daily_target_tons: float = Field(3200.0, ge=500.0, le=10000.0)


@router.get("/forecast")
def get_production_shortfall_forecast(
    mine_id: str = Query("balaghat", description="MOIL mine ID"),
    scenario: str = Query("heavy_cloudburst", description="Weather scenario key (clear_dry, moderate_monsoon, heavy_cloudburst, live)"),
    scheduled_target_tons: float = Query(3200.0, description="Planned daily production tonnage")
):
    """
    Predict 3-7 day production shortfalls using XGBoost and calculate TreeSHAP
    physical root cause percentages for transparent dispatch decisions.
    """
    try:
        return midstream_forecaster.predict_shortfall_and_explain(
            mine_id=mine_id,
            weather_scenario=scenario,
            scheduled_target_tons=scheduled_target_tons
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecaster error: {str(e)}")


@router.get("/scenarios")
def list_weather_scenarios():
    """
    List predefined meteorological stress scenarios.
    """
    return {
        "scenarios": [
            {
                "key": k,
                "name": v["name"],
                "rainfall_mm": v["rain_mm_24h"],
                "soil_moisture_pct": v["soil_moisture_vol_pct"],
                "triggers_cutoff": v["rain_mm_24h"] > 35.0
            }
            for k, v in WEATHER_SCENARIOS.items()
        ]
    }


@router.get("/weather-scada")
def get_weather_and_pit_scada(
    mine_id: str = Query("balaghat"),
    scenario: str = Query("heavy_cloudburst")
):
    """
    Return 72-hour IMD weather timeline and real-time pit bench traction telemetry.
    """
    try:
        weather = fetch_imd_weather_forecast(mine_id, scenario)
        bench_scada = get_current_bench_scada(mine_id, weather)
        return {
            "mine_id": mine_id,
            "weather": weather,
            "benches": bench_scada
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
