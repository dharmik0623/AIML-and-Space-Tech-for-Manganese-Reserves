"""
Mode 2: Midstream Shortfall Forecaster
Uses XGBoost Multivariate Regressor + TreeSHAP Explainable AI (XAI)
to forecast 3-7 day open-cast manganese production shortfalls (Delta T_t)
and provide transparent physical attribution for dispatchers.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple
import xgboost as xgb
import shap
from backend.data.pit_config import get_mine_config
from backend.data.weather_scada import fetch_imd_weather_forecast, get_current_bench_scada


FEATURE_NAMES = [
    "rainfall_mm_24h",
    "soil_moisture_pct",
    "avg_haul_slippage",
    "max_slope_hazard",
    "halted_benches_count",
    "fleet_active_count",
    "scheduled_daily_target_tons"
]


class MidstreamForecasterEngine:
    """
    XGBoost Regression Forecaster with TreeSHAP Explainer.
    Predicts production shortfall in metric tons across 3 to 7 days.
    """

    def __init__(self, random_state: int = 42):
        self.model = xgb.XGBRegressor(
            n_estimators=120,
            max_depth=5,
            learning_rate=0.08,
            subsample=0.85,
            random_state=random_state
        )
        self.explainer = None
        self.is_trained = False
        self._train_baseline_model()

    def _generate_synthetic_historical_telemetry(self, n_samples: int = 2000) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generate synthetic historical pit dispatch records calibrated to Central Indian monsoon seasons.
        Simulates relationship between precipitation, haul slip, slope hazards and daily shortfall.
        """
        np.random.seed(42)

        # Features
        rainfall = np.random.exponential(scale=12.0, size=n_samples)
        moisture = np.clip(15.0 + rainfall * 0.85 + np.random.normal(0, 4, n_samples), 10.0, 75.0)
        slippage = np.clip((moisture / 70.0) ** 1.5 + (rainfall / 50.0) * 0.4 + np.random.normal(0, 0.05, n_samples), 0.0, 1.0)
        max_hazard = np.clip(0.20 + (rainfall / 60.0) * 0.65 + np.random.normal(0, 0.08, n_samples), 0.1, 1.0)
        halted_benches = np.zeros(n_samples)
        halted_benches[rainfall > 35.0] = np.random.choice([1, 2, 3], size=np.sum(rainfall > 35.0), p=[0.3, 0.5, 0.2])

        fleet_active = np.random.choice([5, 6, 7, 8], size=n_samples, p=[0.1, 0.2, 0.4, 0.3])
        target_tons = np.random.normal(loc=3200, scale=200, size=n_samples)

        # Ground truth production shortfall calculation:
        # Base shortfall from slippage slowing cycle times + bench halts shutting off high-grade sources
        cycle_delay_loss = target_tons * (slippage * 0.35)
        bench_halt_loss = halted_benches * 650.0
        fleet_shortage_loss = (8 - fleet_active) * 220.0
        noise = np.random.normal(0, 40, size=n_samples)

        shortfall = np.clip(cycle_delay_loss + bench_halt_loss + fleet_shortage_loss + noise, 0.0, target_tons * 0.95)

        X = np.column_stack([rainfall, moisture, slippage, max_hazard, halted_benches, fleet_active, target_tons])
        return X, shortfall

    def _train_baseline_model(self):
        """Train XGBoost model and initialize TreeSHAP explainer."""
        X, y = self._generate_synthetic_historical_telemetry()
        self.model.fit(X, y)
        self.explainer = shap.TreeExplainer(self.model)
        self.is_trained = True

    def predict_shortfall_and_explain(
        self,
        mine_id: str = "balaghat",
        weather_scenario: str = "heavy_cloudburst",
        scheduled_target_tons: float = 3200.0
    ) -> Dict[str, Any]:
        """
        Execute 3-to-7 day production shortfall forecast with TreeSHAP physical attribution.
        """
        mine = get_mine_config(mine_id)
        weather = fetch_imd_weather_forecast(mine_id, weather_scenario)
        bench_telemetry = get_current_bench_scada(mine_id, weather)

        # Extract operational summary metrics
        rain_24h = weather["current_24h_rainfall_mm"]
        soil_moisture = weather["forecast_7_days"][0]["soil_moisture_vol_pct"]
        avg_slippage = float(np.mean([b["traction_slippage_index"] for b in bench_telemetry]))
        max_hazard = float(np.max([b["slope_hazard_score"] for b in bench_telemetry]))
        halted_count = sum(1 for b in bench_telemetry if b["dynamic_safety_cutoff_triggered"])
        fleet_active_count = sum(1 for d in mine["dumpers"] if d["status"] == "active")

        current_features = np.array([[
            rain_24h,
            soil_moisture,
            avg_slippage,
            max_hazard,
            halted_count,
            fleet_active_count,
            scheduled_target_tons
        ]])

        # Immediate 24h prediction
        day1_shortfall = float(self.model.predict(current_features)[0])
        day1_shortfall = max(0.0, min(scheduled_target_tons, day1_shortfall))

        # Compute SHAP values for current operational input
        shap_values = self.explainer.shap_values(current_features)
        if isinstance(shap_values, list):
            sample_shap = shap_values[0][0]
        else:
            sample_shap = shap_values[0]

        # Aggregate SHAP into percentage physical attribution
        pos_shap = np.maximum(0.0, sample_shap)
        total_pos = np.sum(pos_shap) + 1e-6
        shap_percentages = [round(float((v / total_pos) * 100), 1) for v in pos_shap]

        shap_breakdown = []
        friendly_names = [
            "IMD 24h Precipitation Volume",
            "Soil Moisture Saturation",
            "Haul Road Mud Slippage & Traction",
            "Pit Slope Hydro-Pore Hazard",
            "Dynamic Bench Safety Halts",
            "Active Hauler Availability",
            "Baseline Scheduled Target"
        ]
        for name, feat_val, raw_val, pct in zip(friendly_names, current_features[0], sample_shap, shap_percentages):
            shap_breakdown.append({
                "feature": name,
                "current_value": round(float(feat_val), 2),
                "shap_impact_tons": round(float(raw_val), 1),
                "risk_contribution_pct": pct
            })

        # Sort SHAP breakdown by risk contribution
        shap_breakdown_sorted = sorted(shap_breakdown, key=lambda x: x["risk_contribution_pct"], reverse=True)

        # Generate 7-day shortfall projection based on forecasted weather progression
        day_projections = []
        total_shortfall_7d = 0.0

        for day in weather["forecast_7_days"]:
            d_rain = day["precipitation_mm"]
            d_moisture = day["soil_moisture_vol_pct"]
            d_slip = float(np.clip((d_moisture / 70.0) ** 1.5 + (d_rain / 50.0) * 0.4, 0.0, 1.0))
            d_hazard = float(np.clip(0.20 + (d_rain / 60.0) * 0.65, 0.1, 1.0))
            d_halted = 2 if d_rain > 35 else (1 if d_rain > 20 else 0)

            f_vec = np.array([[d_rain, d_moisture, d_slip, d_hazard, d_halted, fleet_active_count, scheduled_target_tons]])
            d_pred = float(np.clip(self.model.predict(f_vec)[0], 0.0, scheduled_target_tons))
            total_shortfall_7d += d_pred

            day_projections.append({
                "day": day["day"],
                "date": day["date"],
                "precipitation_mm": d_rain,
                "projected_production_target_tons": scheduled_target_tons,
                "projected_shortfall_tons": round(d_pred, 1),
                "projected_delivered_tons": round(scheduled_target_tons - d_pred, 1),
                "shortfall_percentage": round((d_pred / scheduled_target_tons) * 100, 1),
                "risk_status": "HIGH ALERT" if d_pred > 800 else ("MODERATE" if d_pred > 300 else "NORMAL")
            })

        # Human-readable physical dispatcher rationale (addresses Slide 4 User Challenge 1)
        top_risk = shap_breakdown_sorted[0]
        second_risk = shap_breakdown_sorted[1]
        
        if halted_count > 0:
            dispatcher_explanation = (
                f"Alert: {halted_count} benches halted by Safety Cutoff (>35mm rain or >0.75 slope hazard). "
                f"Primary root causes: {top_risk['feature']} ({top_risk['risk_contribution_pct']}%) and "
                f"{second_risk['feature']} ({second_risk['risk_contribution_pct']}%). "
                f"Estimated 24h production shortfall is {round(day1_shortfall, 0)} MT without prescriptive intervention."
            )
        else:
            dispatcher_explanation = (
                f"Normal/Stable conditions. Main variance driver: {top_risk['feature']} ({top_risk['risk_contribution_pct']}%). "
                f"Expected daily shortfall is nominal at {round(day1_shortfall, 0)} MT."
            )

        return {
            "mode": "Mode 2: Midstream Operations Forecaster",
            "mine_id": mine_id,
            "weather_scenario": weather_scenario,
            "immediate_24h_forecast": {
                "scheduled_target_tons": scheduled_target_tons,
                "predicted_shortfall_tons": round(day1_shortfall, 1),
                "shortfall_pct_of_target": round((day1_shortfall / scheduled_target_tons) * 100, 1),
                "halted_benches": halted_count,
                "average_slippage": round(avg_slippage, 3),
                "max_slope_hazard": round(max_hazard, 3)
            },
            "seven_day_projections": day_projections,
            "total_7day_shortfall_tons": round(total_shortfall_7d, 1),
            "treeshap_explainability": {
                "top_drivers": shap_breakdown_sorted,
                "dispatcher_physical_rationale": dispatcher_explanation
            },
            "bench_telemetry": bench_telemetry
        }


# Singleton instance
midstream_forecaster = MidstreamForecasterEngine()
