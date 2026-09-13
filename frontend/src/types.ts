export type TacticalPinCategory = 
  | 'EXTRACTION' 
  | 'ASSAY SAMPLE' 
  | 'SLOPE RISK' 
  | 'HAUL ROUTE';

export type VerificationStatus = 
  | 'PENDING' 
  | 'IN PROGRESS' 
  | 'VERIFIED';

export type ShiftType = 
  | 'MORNING SHIFT' 
  | 'NIGHT SHIFT';

export type DateFilterType = 
  | 'ALL'
  | 'PAST 7 DAYS' 
  | 'TODAY' 
  | 'DAY +5 FORECAST TARGET';

export interface TacticalPin {
  id: string;
  pinId: string; // e.g. "PIN-EXT-041"
  coordinates: {
    lat: number;
    lon: number;
    latDms: string;
    lonDms: string;
  };
  elevationM: number;
  category: TacticalPinCategory;
  predictedGradeMn: number;
  date: string; // YYYY-MM-DD
  shift: ShiftType;
  status: VerificationStatus;
  assignedUnit: string; // e.g. "EX-02 (KOMATSU PC3000)"
  notes: string;
  canvasX: number; // Percent 0-100
  canvasY: number; // Percent 0-100
  createdAt: string;
}

export interface ForecastDay {
  dayNumber: number; // 1 to 7
  dayName: string; // "DAY 1", "DAY 5", etc.
  dateString: string;
  feasibilityScore: number; // 0 to 100%
  statusBadge: string; // e.g. "OPTIMAL EXTRACTION WINDOW - DAY 5"
  badgeVariant: 'optimal' | 'high_yield' | 'hazard' | 'normal';
  weatherRiskScore: number; // 0-100
  slopeStabilityScore: number; // 0-100
  oreAccessibilityScore: number; // 0-100
  trafficabilityScore: number; // 0-100
  swirMoistureIndex: number;
  pyrolusiteExposurePct: number;
  aiRecommendation: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  actionType: 
    | 'PIN_CREATED' 
    | 'PIN_UPDATED' 
    | 'PIN_VERIFIED' 
    | 'PIN_REMOVED' 
    | 'ROLLBACK_EXECUTED' 
    | 'EXPORT_GENERATED';
  pinId: string;
  details: string;
  verifiedBySystem: boolean;
  diffPayload: string;
}

export interface BeltSector {
  id: string;
  name: string;
  breadcrumb: string;
  region: string;
  coordinates: {
    lat: string;
    lon: string;
    elev: string;
  };
  reservesMt: number;
  highGradeProbPct: number;
  confidencePct: number;
  swirRatio: number;
}

export interface HotspotAnomaly {
  id: string;
  name: string;
  targetId: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  estimatedDepth: string;
  estimatedGradeMn: number;
  swirRatio: number;
  prospectivityConfidence: number;
  lithology: string;
  recommendedBorehole: string;
  polygonPoints: [number, number][];
}

export interface LayerState {
  trueColorBasemap: boolean;
  alterationHalos: boolean;
  geotechnicalElevation: boolean;
  tacticalPins: boolean;
  vehicleTracks: boolean;
  anomalyPolygons?: boolean;
  vehicleTelemetry?: boolean;
}
