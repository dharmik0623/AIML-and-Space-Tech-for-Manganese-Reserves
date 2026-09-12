"""
API Router for Mode 3: Prescriptive Dynamic Dispatch & Grade Blending.
"""

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict
from backend.models.prescriptive_optimizer import prescriptive_optimizer
from backend.data.pit_config import CRUSHER_HOURLY_CAPACITY_TONS

router = APIRouter(prefix="/api/prescriptive", tags=["Mode 3: Prescriptive Dynamic Dispatch"])


class OptimizationRequest(BaseModel):
    mine_id: str = Field("balaghat", description="Mine ID")
    weather_scenario: str = Field("heavy_cloudburst", description="Active weather condition")
    hourly_crusher_demand_tons: float = Field(CRUSHER_HOURLY_CAPACITY_TONS, ge=100.0, le=1000.0)
    manual_bench_shutoff_overrides: Optional[Dict[str, bool]] = Field(
        default=None,
        description="Manual bench lock/unlock overrides from pit supervisor"
    )


@router.post("/optimize")
def run_prescriptive_dispatch_optimization(payload: OptimizationRequest):
    """
    Run Mixed-Integer Linear Programming (MILP) solver to:
    1. Cut haulage to benches where precipitation > 35mm or hazard > 0.75
    2. Reroute dumpers to dry buffer stockpiles
    3. Lock blended feed at 38% +/- 1.5% Mn
    4. Eliminate primary crusher starvation
    """
    try:
        res = prescriptive_optimizer.solve_dispatch(
            mine_id=payload.mine_id,
            weather_scenario=payload.weather_scenario,
            hourly_crusher_demand_tons=payload.hourly_crusher_demand_tons
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MILP Solver error: {str(e)}")


@router.get("/quick-solve")
def quick_solve_dispatch(
    mine_id: str = Query("balaghat"),
    scenario: str = Query("heavy_cloudburst"),
    demand_tph: float = Query(CRUSHER_HOURLY_CAPACITY_TONS)
):
    """
    GET endpoint for rapid real-time dashboard updates.
    """
    try:
        return prescriptive_optimizer.solve_dispatch(
            mine_id=mine_id,
            weather_scenario=scenario,
            hourly_crusher_demand_tons=demand_tph
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
