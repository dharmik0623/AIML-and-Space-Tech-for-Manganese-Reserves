"""
API Router for Mode 1: Upstream Mineral Prospectivity Mapping (MPM).
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from backend.models.upstream_mpm import upstream_engine
from backend.data.pit_config import get_mine_config, MOIL_MINES

router = APIRouter(prefix="/api/upstream", tags=["Mode 1: Upstream Ore Prospecting"])


@router.get("/prospectivity")
def get_prospectivity_map(
    mine_id: str = Query("balaghat", description="MOIL mine ID (balaghat, dongri_buzurg, mansar, gumgaon)"),
    grid_resolution: int = Query(25, ge=10, le=50, description="Spatial raster grid resolution")
):
    """
    Run Earth Observation spectral analysis (B4/B2, B11/B8, B11/B12) + Random Forest
    to generate 0.0 - 1.0 MPI Geo-grid, borehole drilling vectors, and capital savings.
    """
    try:
        return upstream_engine.run_prospectivity_analysis(mine_id=mine_id, grid_resolution=grid_resolution)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prospectivity analysis failed: {str(e)}")


@router.get("/borehole-targets")
def get_borehole_targets(
    mine_id: str = Query("balaghat", description="MOIL mine ID")
):
    """
    Return targeted drill coordinates with priority, depth, and predicted Mn grade.
    """
    try:
        data = upstream_engine.run_prospectivity_analysis(mine_id=mine_id, grid_resolution=20)
        return {
            "mine_id": mine_id,
            "borehole_targets": data["borehole_targets"],
            "drilling_cost_savings": data["economic_benefits"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
