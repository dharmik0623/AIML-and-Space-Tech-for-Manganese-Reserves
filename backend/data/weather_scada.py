"""
Meteorological Ingestion and Pit Telemetry SCADA Module.
Simulates IMD (India Meteorological Department) Pune 72-hour forecasts,
USDA SCS Curve Number ground saturation, and pit haulage telemetry.
Supports live Open-Meteo query with robust offline fallbacks.
"""

import requests
import numpy as np
from typing import Dict, List, Any
from datetime import datetime, timedelta, timezone
from backend.data.pit_config import get_mine_config


WEATHER_SCENARIOS = {
    "clear_dry": {
        "name": "Dry Operational Shift (Clear Skies)",
        "rain_mm_24h": 0.0,
        "soil_moisture_vol_pct": 12.0,
        "humidity_pct": 38.0,
        "wind_kmh": 14.0,
        "cloud_cover_pct": 5.0
    },
    "moderate_monsoon": {
        "name": "Moderate Monsoon Rains (Normal Showers)",
        "rain_mm_24h": 18.5,
        "soil_moisture_vol_pct": 34.0,
        "humidity_pct": 82.0,
        "wind_kmh": 28.0,
        "cloud_cover_pct": 78.0
    },
    "heavy_cloudburst": {
        "name": "Severe Monsoon Cloudburst (Threshold Breach >35mm)",
        "rain_mm_24h": 48.2,
        "soil_moisture_vol_pct": 58.0,
        "humidity_pct": 98.0,
        "wind_kmh": 45.0,
        "cloud_cover_pct": 100.0
    }
}


def calculate_scs_runoff(rainfall_mm: float, curve_number_cn: float) -> float:
    """
    Calculate hydrological runoff using USDA Soil Conservation Service (SCS) Curve Number method.
    S = (25400 / CN) - 254 (Potential maximum soil retention in mm)
    Ia = 0.2 * S (Initial abstraction)
    Runoff Q = (P - Ia)^2 / (P - Ia + S) for P > Ia, else 0
    """
    if rainfall_mm <= 0.0:
        return 0.0
    cn = max(50.0, min(99.0, curve_number_cn))
    s = (25400.0 / cn) - 254.0
    ia = 0.2 * s
    if rainfall_mm <= ia:
        return 0.0
    runoff = ((rainfall_mm - ia) ** 2) / (rainfall_mm - ia + s)
    return float(np.round(runoff, 2))


def calculate_haul_slippage_index(rainfall_mm: float, soil_moisture_pct: float, bench_slope_deg: float) -> float:
    """
    Calculate dynamic haul-road traction & mud slippage index (0.0 to 1.0).
    0.0 = Dry firm road, optimal traction.
    1.0 = Completely waterlogged, high mud-slip hazard, trucks lose braking traction.
    """
    # Base traction degradation from moisture
    moisture_factor = (soil_moisture_pct / 60.0) ** 1.6
    # Rain impulse factor
    rain_factor = min(1.0, rainfall_mm / 40.0)
    # Slope steepness multiplier
    slope_factor = bench_slope_deg / 45.0

    slippage = (0.45 * moisture_factor + 0.35 * rain_factor + 0.20 * slope_factor)
    return float(np.clip(np.round(slippage, 3), 0.0, 1.0))


def fetch_imd_weather_forecast(mine_id: str, scenario_key: str = "heavy_cloudburst") -> Dict[str, Any]:
    """
    Fetch or simulate 72-hour and 7-day weather forecast for the mine coordinates.
    Attempts live Open-Meteo API; if unavailable or simulated scenario requested, returns calibrated profile.
    """
    mine = get_mine_config(mine_id)
    lat = mine["coordinates"]["lat"]
    lon = mine["coordinates"]["lon"]

    scenario = WEATHER_SCENARIOS.get(scenario_key, WEATHER_SCENARIOS["heavy_cloudburst"])
    base_rain = scenario["rain_mm_24h"]

    # Try live fetch if scenario is clear_dry and internet allowed, else use scenario
    live_fetched = False
    if scenario_key == "live":
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=precipitation_sum,precipitation_hours,windspeed_10m_max&timezone=auto"
            res = requests.get(url, timeout=3)
            if res.status_code == 200:
                data = res.json()
                live_rain = data.get("daily", {}).get("precipitation_sum", [0.0])[0]
                base_rain = float(live_rain)
                live_fetched = True
        except Exception:
            live_fetched = False

    # Generate 7-day forecast series
    today = datetime.now(timezone.utc)
    forecast_days = []
    
    # Rainfall pattern over 7 days around the event
    rain_multipliers = [1.0, 1.25, 0.75, 0.40, 0.15, 0.05, 0.0] if base_rain > 30 else [0.2, 0.8, 1.0, 0.6, 0.3, 0.1, 0.0]

    for day_idx in range(7):
        target_date = today + timedelta(days=day_idx)
        daily_rain = float(np.round(base_rain * rain_multipliers[day_idx], 1))
        daily_moisture = float(np.clip(scenario["soil_moisture_vol_pct"] * (0.8 + daily_rain / 50.0), 10.0, 70.0))
        
        forecast_days.append({
            "day": day_idx + 1,
            "date": target_date.strftime("%Y-%m-%d"),
            "precipitation_mm": daily_rain,
            "soil_moisture_vol_pct": round(daily_moisture, 1),
            "humidity_pct": min(100.0, round(scenario["humidity_pct"] + daily_rain * 0.3, 1)),
            "cloud_cover_pct": min(100.0, round(scenario["cloud_cover_pct"] + daily_rain * 0.4, 1)),
            "monsoon_risk_status": "CRITICAL (>35mm)" if daily_rain >= 35.0 else ("ELEVATED" if daily_rain >= 15.0 else "NORMAL")
        })

    return {
        "mine_id": mine_id,
        "scenario_applied": scenario["name"],
        "scenario_key": scenario_key,
        "is_live_satellite_feed": live_fetched,
        "current_24h_rainfall_mm": base_rain,
        "threshold_breached_35mm": base_rain >= 35.0,
        "forecast_7_days": forecast_days
    }


def get_current_bench_scada(mine_id: str, weather_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Compute real-time bench operational metrics under current rainfall & soil moisture.
    Calculates dynamic slope hazard, traction slippage, and safety cutoff flags.
    """
    mine = get_mine_config(mine_id)
    rain_24h = weather_data["current_24h_rainfall_mm"]
    moisture_pct = weather_data["forecast_7_days"][0]["soil_moisture_vol_pct"]

    bench_telemetry = []
    for bench in mine["benches"]:
        cn = bench["runoff_curve_number_cn"]
        runoff_mm = calculate_scs_runoff(rain_24h, cn)
        slippage_idx = calculate_haul_slippage_index(rain_24h, moisture_pct, bench["slope_angle_deg"])

        # Dynamic slope hazard score (0.0 to 1.0)
        # Base hazard + hydrological pore-pressure build-up
        pore_pressure_penalty = min(0.45, (runoff_mm / 45.0) * 0.45)
        dynamic_slope_hazard = min(1.0, round(bench["base_slope_hazard"] + pore_pressure_penalty, 3))

        # Dynamic safety cutoff rule from SIH Presentation Slide 3:
        # "Zero haulage dispatched to benches where precipitation >35mm/24h or slope hazard score >0.75"
        is_shut_down = (rain_24h > 35.0) or (dynamic_slope_hazard > 0.75)

        # Haul cycle time inflation due to wet road speed limits
        normal_cycle_min = round((bench["haul_distance_to_crusher_km"] * 2 / 20.0) * 60 + 4.5, 1)
        wet_cycle_min = round(normal_cycle_min * (1.0 + slippage_idx * 1.3), 1)

        bench_telemetry.append({
            "bench_id": bench["id"],
            "bench_name": bench["name"],
            "elevation_rl": bench["elevation_rl"],
            "grade_mn_pct": bench["grade_mn_pct"],
            "lithology": bench["lithology"],
            "slope_hazard_score": dynamic_slope_hazard,
            "traction_slippage_index": slippage_idx,
            "runoff_mm": runoff_mm,
            "normal_cycle_time_min": normal_cycle_min,
            "effective_cycle_time_min": wet_cycle_min,
            "dynamic_safety_cutoff_triggered": is_shut_down,
            "status": "HALTED (SAFETY CUTOFF)" if is_shut_down else ("DEGRADED (WET)" if rain_24h > 15 else "OPTIMAL")
        })

    return bench_telemetry
