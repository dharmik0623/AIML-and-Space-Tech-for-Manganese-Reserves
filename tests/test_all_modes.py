"""
Comprehensive Test Suite for Mine Twin Backend.
Tests all 3 Operational Modes, ML models, MILP solver, and FastAPI endpoints.
"""

import sys
import os
import pytest
import numpy as np
from fastapi.testclient import TestClient

# Ensure root directory is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.models.upstream_mpm import upstream_engine
from backend.models.midstream_forecaster import midstream_forecaster
from backend.models.prescriptive_optimizer import prescriptive_optimizer
from backend.data.weather_scada import (
    calculate_scs_runoff,
    calculate_haul_slippage_index,
    fetch_imd_weather_forecast,
    get_current_bench_scada
)
from backend.data.pit_config import MOIL_MINES, get_mine_config

client = TestClient(app)


# ==========================================
# 1. UPSTREAM MODE 1 TESTS
# ==========================================

def test_band_ratios():
    """Verify Sentinel-2/ASTER band ratio equations."""
    b2 = np.array([0.1])
    b4 = np.array([0.2])
    b8 = np.array([0.15])
    b11 = np.array([0.3])
    b12 = np.array([0.25])

    iron, ferrous, hydroxyl = upstream_engine.calculate_band_ratios(b2, b4, b8, b11, b12)
    assert np.isclose(iron[0], 2.0, atol=1e-2)
    assert np.isclose(ferrous[0], 2.0, atol=1e-2)
    assert np.isclose(hydroxyl[0], 1.2, atol=1e-2)


def test_upstream_prospectivity_execution():
    """Verify Mode 1 prospectivity analysis runs and produces valid 0-1 MPI scores."""
    result = upstream_engine.run_prospectivity_analysis(mine_id="balaghat", grid_resolution=15)
    
    assert result["mine_id"] == "balaghat"
    assert "prospectivity_grid" in result
    assert len(result["prospectivity_grid"]) == 15 * 15
    
    # Check MPI range [0.0, 1.0]
    for pt in result["prospectivity_grid"]:
        assert 0.0 <= pt["mpi_score"] <= 1.0
        assert "classification" in pt

    # Check borehole vectoring targets
    assert len(result["borehole_targets"]) > 0
    target = result["borehole_targets"][0]
    assert "target_id" in target
    assert "mpi_confidence" in target
    assert target["estimated_mn_grade_pct"] > 35.0

    # Check economic savings calculations
    assert result["economic_benefits"]["speculative_boreholes_eliminated"] > 0
    assert result["economic_benefits"]["exploration_capital_savings_inr"] > 0


# ==========================================
# 2. MIDSTREAM MODE 2 TESTS
# ==========================================

def test_scs_curve_number_runoff():
    """Verify USDA SCS Curve Number calculation."""
    # Zero rain -> zero runoff
    assert calculate_scs_runoff(0.0, 90.0) == 0.0
    # Rain below initial abstraction -> zero runoff
    assert calculate_scs_runoff(5.0, 80.0) == 0.0
    # Heavy cloudburst rain -> positive runoff
    heavy_runoff = calculate_scs_runoff(50.0, 92.0)
    assert heavy_runoff > 20.0


def test_haul_slippage_index():
    """Verify traction slippage scales with moisture and rainfall."""
    dry_slip = calculate_haul_slippage_index(0.0, 10.0, 35.0)
    wet_slip = calculate_haul_slippage_index(45.0, 60.0, 35.0)
    assert 0.0 <= dry_slip <= 1.0
    assert 0.0 <= wet_slip <= 1.0
    assert wet_slip > dry_slip


def test_safety_cutoff_trigger():
    """Verify safety cutoff rule triggers when rainfall > 35mm or hazard > 0.75."""
    # Under heavy cloudburst (48.2mm), cutoff must trigger
    weather_heavy = fetch_imd_weather_forecast("balaghat", "heavy_cloudburst")
    bench_scada_heavy = get_current_bench_scada("balaghat", weather_heavy)
    halted = [b for b in bench_scada_heavy if b["dynamic_safety_cutoff_triggered"]]
    assert len(halted) > 0

    # Under dry conditions, no bench should be shut down by rain
    weather_dry = fetch_imd_weather_forecast("balaghat", "clear_dry")
    bench_scada_dry = get_current_bench_scada("balaghat", weather_dry)
    halted_dry = [b for b in bench_scada_dry if b["dynamic_safety_cutoff_triggered"]]
    assert len(halted_dry) == 0


def test_midstream_forecaster_and_shap():
    """Verify XGBoost prediction and TreeSHAP explainability."""
    res = midstream_forecaster.predict_shortfall_and_explain(
        mine_id="balaghat",
        weather_scenario="heavy_cloudburst",
        scheduled_target_tons=3200.0
    )

    assert "immediate_24h_forecast" in res
    assert res["immediate_24h_forecast"]["predicted_shortfall_tons"] > 0.0
    assert len(res["seven_day_projections"]) == 7
    
    # Check TreeSHAP explainability
    shap_info = res["treeshap_explainability"]
    assert "top_drivers" in shap_info
    assert len(shap_info["top_drivers"]) == 7
    
    # Verify risk contribution percentages sum near 100%
    total_pct = sum(d["risk_contribution_pct"] for d in shap_info["top_drivers"])
    assert 95.0 <= total_pct <= 105.0
    assert len(shap_info["dispatcher_physical_rationale"]) > 20


# ==========================================
# 3. PRESCRIPTIVE MODE 3 TESTS
# ==========================================

def test_prescriptive_optimizer_grade_lock_and_starvation():
    """
    Verify that MILP:
    1. Satisfies strict 38% +/- 1.5% Mn contract grade lock (36.5% - 39.5%)
    2. Completely eliminates crusher starvation under heavy monsoon cloudburst
    3. Reroutes dumpers away from halted benches to dry stockpiles
    """
    res = prescriptive_optimizer.solve_dispatch(
        mine_id="balaghat",
        weather_scenario="heavy_cloudburst",
        hourly_crusher_demand_tons=450.0
    )

    feed = res["crusher_feed_performance"]
    # Total delivered must equal demand (no starvation)
    assert np.isclose(feed["actual_delivered_tons_per_hour"], 450.0, atol=1.0)
    assert feed["unmet_demand_tons"] == 0.0
    assert "ZERO RISK" in feed["crusher_starvation_risk"]

    # Grade Lock must be strictly within 36.5% to 39.5% Mn
    assert 36.5 <= feed["blended_mn_grade_pct"] <= 39.5
    assert feed["contract_grade_lock_achieved"] is True

    # Check that halted benches receive ZERO allocation
    for b in res["bench_allocations"]:
        if b["is_safety_halted"]:
            assert b["allocated_tons_per_hour"] == 0.0

    # Check that dry stockpile was drawn to offset the halted benches
    dry_stockpile = next(s for s in res["stockpile_allocations"] if s["is_covered"])
    assert dry_stockpile["allocated_draw_tons_per_hour"] > 0.0

    # Check fleet routing directives
    assert len(res["fleet_dispatch_directives"]) > 0


# ==========================================
# 4. FASTAPI ENDPOINTS TESTS
# ==========================================

def test_root_and_health_endpoints():
    r1 = client.get("/")
    assert r1.status_code == 200
    assert r1.json()["organization"] == "MOIL Limited (Ministry of Steel)"

    r2 = client.get("/health")
    assert r2.status_code == 200
    assert r2.json()["status"] == "healthy"


def test_api_upstream_endpoint():
    r = client.get("/api/upstream/prospectivity?mine_id=balaghat&grid_resolution=10")
    assert r.status_code == 200
    data = r.json()
    assert data["mine_id"] == "balaghat"
    assert len(data["borehole_targets"]) > 0


def test_api_midstream_endpoint():
    r = client.get("/api/midstream/forecast?mine_id=balaghat&scenario=heavy_cloudburst")
    assert r.status_code == 200
    data = r.json()
    assert "immediate_24h_forecast" in data
    assert "treeshap_explainability" in data


def test_api_prescriptive_endpoint():
    payload = {
        "mine_id": "balaghat",
        "weather_scenario": "heavy_cloudburst",
        "hourly_crusher_demand_tons": 450.0
    }
    r = client.post("/api/prescriptive/optimize", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["crusher_feed_performance"]["contract_grade_lock_achieved"] is True


def test_api_telemetry_endpoints():
    r1 = client.get("/api/telemetry/mines")
    assert r1.status_code == 200
    assert len(r1.json()["mines"]) == 4

    r2 = client.get("/api/telemetry/pit-status?mine_id=balaghat")
    assert r2.status_code == 200
    assert r2.json()["mine_name"] == "Balaghat Manganese Mine"

    r3 = client.get("/api/telemetry/executive-kpis?mine_id=balaghat")
    assert r3.status_code == 200
    assert "economic" in r3.json()["triple_bottom_line"]
