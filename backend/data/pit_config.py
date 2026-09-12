"""
Pit Configuration and Geological Profiles for MOIL Limited Mines.
Central Indian Manganese Belt (Balaghat, Dongri Buzurg, Mansar, Gumgaon).
Calibrated against GSI (Geological Survey of India) and MOIL historical records.
"""

from typing import Dict, List, Any

# Target blending specification for Primary Crusher feed
TARGET_CRUSHER_GRADE = 38.0  # % Mn
TARGET_GRADE_TOLERANCE = 1.5  # +/- 1.5% Mn (Range: 36.5% - 39.5%)
CRUSHER_HOURLY_CAPACITY_TONS = 450.0  # Metric tons/hour
CRUSHER_STARVATION_COST_PER_HOUR_INR = 35000.0  # INR per hour of primary crusher idle time
DRILLING_COST_PER_METER_INR = 3800.0  # Average diamond-core drilling cost (₹2500 - ₹5000/m)
AVERAGE_BOREHOLE_DEPTH_M = 120.0  # Standard depth per speculative borehole

MOIL_MINES: Dict[str, Dict[str, Any]] = {
    "balaghat": {
        "id": "balaghat",
        "name": "Balaghat Manganese Mine",
        "state": "Madhya Pradesh",
        "district": "Balaghat",
        "coordinates": {"lat": 21.8033, "lon": 80.1842},
        "description": "MOIL's flagship and largest manganese deposit in Central India. Gondite formation with high-grade braunite and pyrolusite.",
        "elevation_range_m": [310, 480],
        "lease_area_hectares": 180.5,
        "boundary_polygon": [
            [21.8120, 80.1750],
            [21.8145, 80.1920],
            [21.7960, 80.1980],
            [21.7920, 80.1810]
        ],
        "benches": [
            {
                "id": "B-01",
                "name": "North Upper Bench (Gondite Contact)",
                "elevation_rl": 450,
                "grade_mn_pct": 34.2,
                "base_moisture_pct": 4.5,
                "lithology": "Gondite / Quartzite",
                "slope_angle_deg": 38,
                "haul_distance_to_crusher_km": 1.8,
                "shovel_assigned": "SH-01",
                "capacity_tons_per_hour": 180,
                "base_slope_hazard": 0.22,
                "runoff_curve_number_cn": 88
            },
            {
                "id": "B-02",
                "name": "Central Main Lode Bench (Braunite Reef)",
                "elevation_rl": 410,
                "grade_mn_pct": 43.5,
                "base_moisture_pct": 3.8,
                "lithology": "High-Grade Braunite Ore",
                "slope_angle_deg": 44,
                "haul_distance_to_crusher_km": 2.2,
                "shovel_assigned": "SH-02",
                "capacity_tons_per_hour": 240,
                "base_slope_hazard": 0.45,
                "runoff_curve_number_cn": 92
            },
            {
                "id": "B-03",
                "name": "Deep Pit Lowland Bench (Sump Proximity)",
                "elevation_rl": 370,
                "grade_mn_pct": 39.1,
                "base_moisture_pct": 6.2,
                "lithology": "Manganese Ore with Schistose Band",
                "slope_angle_deg": 48,
                "haul_distance_to_crusher_km": 2.9,
                "shovel_assigned": "SH-03",
                "capacity_tons_per_hour": 210,
                "base_slope_hazard": 0.68,
                "runoff_curve_number_cn": 95
            },
            {
                "id": "B-04",
                "name": "South West Hanging Wall Bench",
                "elevation_rl": 430,
                "grade_mn_pct": 31.8,
                "base_moisture_pct": 4.1,
                "lithology": "Mica Schist & Low-Grade Gondite",
                "slope_angle_deg": 35,
                "haul_distance_to_crusher_km": 1.4,
                "shovel_assigned": "SH-04",
                "capacity_tons_per_hour": 160,
                "base_slope_hazard": 0.18,
                "runoff_curve_number_cn": 84
            }
        ],
        "stockpiles": [
            {
                "id": "SP-DRY",
                "name": "Dry Covered Buffer Stockpile #1",
                "grade_mn_pct": 38.0,
                "moisture_pct": 2.5,
                "available_tons": 8500,
                "haul_distance_to_crusher_km": 0.6,
                "is_covered": True,
                "recovery_cost_per_ton": 85.0
            },
            {
                "id": "SP-HG",
                "name": "High-Grade Run-of-Mine Stockpile",
                "grade_mn_pct": 45.2,
                "moisture_pct": 5.0,
                "available_tons": 4200,
                "haul_distance_to_crusher_km": 0.9,
                "is_covered": False,
                "recovery_cost_per_ton": 65.0
            },
            {
                "id": "SP-LG",
                "name": "Low-Grade Blending Pad",
                "grade_mn_pct": 29.5,
                "moisture_pct": 4.8,
                "available_tons": 12000,
                "haul_distance_to_crusher_km": 0.8,
                "is_covered": False,
                "recovery_cost_per_ton": 55.0
            }
        ],
        "dumpers": [
            {"id": "DT-101", "capacity_tons": 35, "status": "active", "speed_kmh": 22},
            {"id": "DT-102", "capacity_tons": 35, "status": "active", "speed_kmh": 22},
            {"id": "DT-103", "capacity_tons": 35, "status": "active", "speed_kmh": 20},
            {"id": "DT-104", "capacity_tons": 35, "status": "active", "speed_kmh": 21},
            {"id": "DT-105", "capacity_tons": 50, "status": "active", "speed_kmh": 18},
            {"id": "DT-106", "capacity_tons": 50, "status": "active", "speed_kmh": 19},
            {"id": "DT-107", "capacity_tons": 50, "status": "active", "speed_kmh": 18},
            {"id": "DT-108", "capacity_tons": 35, "status": "standby", "speed_kmh": 22}
        ]
    },
    "dongri_buzurg": {
        "id": "dongri_buzurg",
        "name": "Dongri Buzurg Manganese Mine",
        "state": "Maharashtra",
        "district": "Bhandara",
        "coordinates": {"lat": 21.5542, "lon": 79.6914},
        "description": "Premier open-cast pit famous for high-purity battery-grade and chemical-grade dioxide ore (Pyrolusite/Cryptomelane).",
        "elevation_range_m": [280, 410],
        "lease_area_hectares": 142.0,
        "boundary_polygon": [
            [21.5620, 79.6830],
            [21.5640, 79.7020],
            [21.5450, 79.6990],
            [21.5430, 79.6810]
        ],
        "benches": [
            {
                "id": "DB-01",
                "name": "Dioxide Ridge Bench (Pyrolusite)",
                "elevation_rl": 390,
                "grade_mn_pct": 46.8,
                "base_moisture_pct": 3.2,
                "lithology": "Dioxide Manganese Ore",
                "slope_angle_deg": 42,
                "haul_distance_to_crusher_km": 1.6,
                "shovel_assigned": "SH-DB1",
                "capacity_tons_per_hour": 220,
                "base_slope_hazard": 0.28,
                "runoff_curve_number_cn": 86
            },
            {
                "id": "DB-02",
                "name": "Central Pit Floor Bench",
                "elevation_rl": 320,
                "grade_mn_pct": 37.4,
                "base_moisture_pct": 5.5,
                "lithology": "Cryptomelane & Siliceous Ore",
                "slope_angle_deg": 46,
                "haul_distance_to_crusher_km": 2.4,
                "shovel_assigned": "SH-DB2",
                "capacity_tons_per_hour": 200,
                "base_slope_hazard": 0.58,
                "runoff_curve_number_cn": 93
            },
            {
                "id": "DB-03",
                "name": "East Wall Transition Bench",
                "elevation_rl": 350,
                "grade_mn_pct": 32.5,
                "base_moisture_pct": 4.6,
                "lithology": "Ferruginous Gondite",
                "slope_angle_deg": 37,
                "haul_distance_to_crusher_km": 1.9,
                "shovel_assigned": "SH-DB3",
                "capacity_tons_per_hour": 170,
                "base_slope_hazard": 0.32,
                "runoff_curve_number_cn": 87
            }
        ],
        "stockpiles": [
            {
                "id": "SP-DB-DRY",
                "name": "Dry Battery Grade Buffer Stockpile",
                "grade_mn_pct": 42.0,
                "moisture_pct": 2.2,
                "available_tons": 6000,
                "haul_distance_to_crusher_km": 0.5,
                "is_covered": True,
                "recovery_cost_per_ton": 90.0
            },
            {
                "id": "SP-DB-ROM",
                "name": "Standard ROM Blending Pad",
                "grade_mn_pct": 34.0,
                "moisture_pct": 4.5,
                "available_tons": 9500,
                "haul_distance_to_crusher_km": 0.7,
                "is_covered": False,
                "recovery_cost_per_ton": 60.0
            }
        ],
        "dumpers": [
            {"id": "DB-DT-01", "capacity_tons": 35, "status": "active", "speed_kmh": 22},
            {"id": "DB-DT-02", "capacity_tons": 35, "status": "active", "speed_kmh": 21},
            {"id": "DB-DT-03", "capacity_tons": 35, "status": "active", "speed_kmh": 22},
            {"id": "DB-DT-04", "capacity_tons": 50, "status": "active", "speed_kmh": 19},
            {"id": "DB-DT-05", "capacity_tons": 50, "status": "active", "speed_kmh": 18}
        ]
    },
    "mansar": {
        "id": "mansar",
        "name": "Mansar Manganese Mine",
        "state": "Maharashtra",
        "district": "Nagpur",
        "coordinates": {"lat": 21.3962, "lon": 79.2881},
        "description": "Historic Central Indian open-cast working with gondite and braunite intercalations.",
        "elevation_range_m": [300, 390],
        "lease_area_hectares": 95.0,
        "boundary_polygon": [
            [21.4020, 79.2810],
            [21.4040, 79.2960],
            [21.3890, 79.2940],
            [21.3870, 79.2800]
        ],
        "benches": [
            {
                "id": "MN-01",
                "name": "North Hill Crest Bench",
                "elevation_rl": 380,
                "grade_mn_pct": 36.5,
                "base_moisture_pct": 4.0,
                "lithology": "Braunite & Gondite Band",
                "slope_angle_deg": 36,
                "haul_distance_to_crusher_km": 1.3,
                "shovel_assigned": "SH-MN1",
                "capacity_tons_per_hour": 190,
                "base_slope_hazard": 0.20,
                "runoff_curve_number_cn": 85
            },
            {
                "id": "MN-02",
                "name": "South Deep Sump Bench",
                "elevation_rl": 310,
                "grade_mn_pct": 41.2,
                "base_moisture_pct": 6.8,
                "lithology": "Dense Braunite Reef",
                "slope_angle_deg": 45,
                "haul_distance_to_crusher_km": 2.1,
                "shovel_assigned": "SH-MN2",
                "capacity_tons_per_hour": 210,
                "base_slope_hazard": 0.62,
                "runoff_curve_number_cn": 94
            }
        ],
        "stockpiles": [
            {
                "id": "SP-MN-DRY",
                "name": "Mansar Dry Covered Shed",
                "grade_mn_pct": 38.5,
                "moisture_pct": 2.6,
                "available_tons": 5000,
                "haul_distance_to_crusher_km": 0.6,
                "is_covered": True,
                "recovery_cost_per_ton": 80.0
            }
        ],
        "dumpers": [
            {"id": "MN-DT-01", "capacity_tons": 35, "status": "active", "speed_kmh": 22},
            {"id": "MN-DT-02", "capacity_tons": 35, "status": "active", "speed_kmh": 20},
            {"id": "MN-DT-03", "capacity_tons": 35, "status": "active", "speed_kmh": 21},
            {"id": "MN-DT-04", "capacity_tons": 35, "status": "active", "speed_kmh": 22}
        ]
    },
    "gumgaon": {
        "id": "gumgaon",
        "name": "Gumgaon Manganese Mine",
        "state": "Maharashtra",
        "district": "Nagpur",
        "coordinates": {"lat": 21.4112, "lon": 78.9873},
        "description": "Steep open-cast and semi-mechanized working with high-grade manganese reefs.",
        "elevation_range_m": [290, 360],
        "lease_area_hectares": 78.5,
        "boundary_polygon": [
            [21.4170, 78.9810],
            [21.4180, 78.9950],
            [21.4050, 78.9920],
            [21.4040, 78.9800]
        ],
        "benches": [
            {
                "id": "GM-01",
                "name": "Main Fault Bench",
                "elevation_rl": 350,
                "grade_mn_pct": 39.8,
                "base_moisture_pct": 4.2,
                "lithology": "Gonditic Manganese",
                "slope_angle_deg": 40,
                "haul_distance_to_crusher_km": 1.5,
                "shovel_assigned": "SH-GM1",
                "capacity_tons_per_hour": 180,
                "base_slope_hazard": 0.35,
                "runoff_curve_number_cn": 89
            },
            {
                "id": "GM-02",
                "name": "Lower Sump Bench",
                "elevation_rl": 295,
                "grade_mn_pct": 42.1,
                "base_moisture_pct": 7.1,
                "lithology": "Rich Black Oxide Ore",
                "slope_angle_deg": 47,
                "haul_distance_to_crusher_km": 2.3,
                "shovel_assigned": "SH-GM2",
                "capacity_tons_per_hour": 190,
                "base_slope_hazard": 0.70,
                "runoff_curve_number_cn": 96
            }
        ],
        "stockpiles": [
            {
                "id": "SP-GM-DRY",
                "name": "Gumgaon Dry Buffer Pad",
                "grade_mn_pct": 37.8,
                "moisture_pct": 2.8,
                "available_tons": 4500,
                "haul_distance_to_crusher_km": 0.7,
                "is_covered": True,
                "recovery_cost_per_ton": 75.0
            }
        ],
        "dumpers": [
            {"id": "GM-DT-01", "capacity_tons": 35, "status": "active", "speed_kmh": 22},
            {"id": "GM-DT-02", "capacity_tons": 35, "status": "active", "speed_kmh": 21},
            {"id": "GM-DT-03", "capacity_tons": 35, "status": "active", "speed_kmh": 20}
        ]
    }
}


def get_mine_config(mine_id: str) -> Dict[str, Any]:
    """Retrieve configuration for a specific MOIL mine pit."""
    clean_id = mine_id.lower().replace(" ", "_")
    if clean_id not in MOIL_MINES:
        raise ValueError(f"Mine '{mine_id}' not found. Available: {list(MOIL_MINES.keys())}")
    return MOIL_MINES[clean_id]


def list_available_mines() -> List[Dict[str, Any]]:
    """Return summary metadata for all configured MOIL mines."""
    return [
        {
            "id": mine["id"],
            "name": mine["name"],
            "state": mine["state"],
            "district": mine["district"],
            "coordinates": mine["coordinates"],
            "lease_area_hectares": mine["lease_area_hectares"],
            "bench_count": len(mine["benches"]),
            "stockpile_count": len(mine["stockpiles"]),
            "fleet_count": len(mine["dumpers"])
        }
        for mine in MOIL_MINES.values()
    ]
