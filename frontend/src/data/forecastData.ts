import type { ForecastDay, TacticalPin } from '../types';

export const SEVEN_DAY_FORECAST: ForecastDay[] = [
  {
    dayNumber: 1,
    dayName: 'DAY 1',
    dateString: '2026-09-14',
    feasibilityScore: 68,
    statusBadge: 'MODERATE RUNOFF - CAUTION',
    badgeVariant: 'normal',
    weatherRiskScore: 32,
    slopeStabilityScore: 74,
    oreAccessibilityScore: 65,
    trafficabilityScore: 68,
    swirMoistureIndex: 0.38,
    pyrolusiteExposurePct: 62,
    aiRecommendation: 'ROUTINE EXTRACTION AT UPPER BENCH 1. MONITOR SLIPPAGE ON ACCESS RAMP 2.'
  },
  {
    dayNumber: 2,
    dayName: 'DAY 2',
    dateString: '2026-09-15',
    feasibilityScore: 72,
    statusBadge: 'STABLE DISPATCH CYCLE',
    badgeVariant: 'normal',
    weatherRiskScore: 26,
    slopeStabilityScore: 79,
    oreAccessibilityScore: 70,
    trafficabilityScore: 74,
    swirMoistureIndex: 0.32,
    pyrolusiteExposurePct: 69,
    aiRecommendation: 'PROCEED WITH PLANNED SHIFT PRODUCTION. CORE RECOVERY STABLE AT 38.5% MN.'
  },
  {
    dayNumber: 3,
    dayName: 'DAY 3',
    dateString: '2026-09-16',
    feasibilityScore: 36,
    statusBadge: 'HIGH HAZARD - HEAVY RUNOFF',
    badgeVariant: 'hazard',
    weatherRiskScore: 82,
    slopeStabilityScore: 42,
    oreAccessibilityScore: 48,
    trafficabilityScore: 30,
    swirMoistureIndex: 0.74,
    pyrolusiteExposurePct: 45,
    aiRecommendation: 'HALT LOWER SUMP BENCH HAULAGE. DRAW FEED FROM COVERED DRY STOCKPILES ONLY.'
  },
  {
    dayNumber: 4,
    dayName: 'DAY 4',
    dateString: '2026-09-17',
    feasibilityScore: 64,
    statusBadge: 'DRAINAGE & RECOVERY',
    badgeVariant: 'normal',
    weatherRiskScore: 38,
    slopeStabilityScore: 68,
    oreAccessibilityScore: 62,
    trafficabilityScore: 59,
    swirMoistureIndex: 0.44,
    pyrolusiteExposurePct: 60,
    aiRecommendation: 'DEPLOY SUMP PUMPS AT SECTOR 4B FLOOR. RE-INSPECT BENCH TOE COMPACTNESS.'
  },
  {
    dayNumber: 5,
    dayName: 'DAY 5',
    dateString: '2026-09-18',
    feasibilityScore: 94,
    statusBadge: 'OPTIMAL EXTRACTION WINDOW - DAY 5',
    badgeVariant: 'optimal',
    weatherRiskScore: 8,
    slopeStabilityScore: 93,
    oreAccessibilityScore: 88,
    trafficabilityScore: 91,
    swirMoistureIndex: 0.12,
    pyrolusiteExposurePct: 88,
    aiRecommendation: 'COMMENCE DRILL & BLAST AT BENCH 3 SECTOR C ON DAY 5 AT 06:00 HRS. ORE EXPOSURE PEAKS AT 88% WITH ZERO RAIN HAZARD.'
  },
  {
    dayNumber: 6,
    dayName: 'DAY 6',
    dateString: '2026-09-19',
    feasibilityScore: 91,
    statusBadge: 'HIGH YIELD / LOW MOISTURE - DAY 6',
    badgeVariant: 'high_yield',
    weatherRiskScore: 12,
    slopeStabilityScore: 90,
    oreAccessibilityScore: 89,
    trafficabilityScore: 88,
    swirMoistureIndex: 0.15,
    pyrolusiteExposurePct: 89,
    aiRecommendation: 'MAXIMIZE CRUSHER THROUGHPUT (450 TPH). DRY RUN-OF-MINE FEED GUARANTEES CONTRACTUAL 38% MN BLEND WITHOUT CHUTE FOULING.'
  },
  {
    dayNumber: 7,
    dayName: 'DAY 7',
    dateString: '2026-09-20',
    feasibilityScore: 78,
    statusBadge: 'STABLE PRODUCTION',
    badgeVariant: 'normal',
    weatherRiskScore: 24,
    slopeStabilityScore: 82,
    oreAccessibilityScore: 76,
    trafficabilityScore: 77,
    swirMoistureIndex: 0.28,
    pyrolusiteExposurePct: 75,
    aiRecommendation: 'TRANSITION DRILLING FLEET TOWARDS EAST HANGING WALL RECONNAISSANCE.'
  }
];

export const INITIAL_TACTICAL_PINS: TacticalPin[] = [
  {
    id: 'pin-1',
    pinId: 'PIN-EXT-041',
    coordinates: {
      lat: 21.9038,
      lon: 85.3462,
      latDms: '21°54\'13.7" N',
      lonDms: '85°20\'46.3" E'
    },
    elevationM: 384,
    category: 'EXTRACTION',
    predictedGradeMn: 44.2,
    date: '2026-09-18', // Day +5 Target
    shift: 'MORNING SHIFT',
    status: 'VERIFIED',
    assignedUnit: 'EX-01 (CAT 6040)',
    notes: 'Primary blast boundary along high-grade braunite reef. Drill depth 14m.',
    canvasX: 34.5,
    canvasY: 26.2,
    createdAt: '2026-09-13T08:15:00Z'
  },
  {
    id: 'pin-2',
    pinId: 'PIN-ASY-019',
    coordinates: {
      lat: 21.9021,
      lon: 85.3485,
      latDms: '21°54\'07.6" N',
      lonDms: '85°20\'54.6" E'
    },
    elevationM: 412,
    category: 'ASSAY SAMPLE',
    predictedGradeMn: 38.6,
    date: '2026-09-13', // Today
    shift: 'MORNING SHIFT',
    status: 'VERIFIED',
    assignedUnit: 'CORE RIG-04',
    notes: 'Diamond-core calibration hole verifying SWIR B11/B12 absorption ratio 1.48.',
    canvasX: 47.8,
    canvasY: 42.1,
    createdAt: '2026-09-13T09:40:00Z'
  },
  {
    id: 'pin-3',
    pinId: 'PIN-SLP-007',
    coordinates: {
      lat: 21.9054,
      lon: 85.3421,
      latDms: '21°54\'19.4" N',
      lonDms: '85°20\'31.6" E'
    },
    elevationM: 445,
    category: 'SLOPE RISK',
    predictedGradeMn: 22.0,
    date: '2026-09-13', // Today
    shift: 'NIGHT SHIFT',
    status: 'IN PROGRESS',
    assignedUnit: 'GEOTECH SENSOR SKID-02',
    notes: 'Sub-surface shear strain sensor detecting 2.4mm horizontal creep post-rain.',
    canvasX: 21.2,
    canvasY: 31.8,
    createdAt: '2026-09-13T10:10:00Z'
  },
  {
    id: 'pin-4',
    pinId: 'PIN-RTE-088',
    coordinates: {
      lat: 21.8992,
      lon: 85.3524,
      latDms: '21°53\'57.1" N',
      lonDms: '85°21\'08.6" E'
    },
    elevationM: 325,
    category: 'HAUL ROUTE',
    predictedGradeMn: 0.0,
    date: '2026-09-18', // Day +5
    shift: 'MORNING SHIFT',
    status: 'PENDING',
    assignedUnit: 'HAUL FLEET DT-101..108',
    notes: 'Prescriptive dynamic bypass route directing trucks to dry covered buffer stockpile.',
    canvasX: 63.5,
    canvasY: 67.2,
    createdAt: '2026-09-13T11:00:00Z'
  },
  {
    id: 'pin-5',
    pinId: 'PIN-EXT-042',
    coordinates: {
      lat: 21.9015,
      lon: 85.3440,
      latDms: '21°54\'05.4" N',
      lonDms: '85°20\'38.4" E'
    },
    elevationM: 350,
    category: 'EXTRACTION',
    predictedGradeMn: 42.5,
    date: '2026-09-19', // Day +6 Target
    shift: 'MORNING SHIFT',
    status: 'PENDING',
    assignedUnit: 'EX-02 (KOMATSU PC3000)',
    notes: 'Secondary extraction block. Exposure 89%, moisture <3.5%.',
    canvasX: 41.0,
    canvasY: 56.4,
    createdAt: '2026-09-13T11:45:00Z'
  }
];
