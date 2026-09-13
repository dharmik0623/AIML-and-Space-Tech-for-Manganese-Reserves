export type OperationalClass = 
  | 'Grade Verification Borehole'
  | 'Controlled Pre-Split Blast'
  | 'Geotechnical Piezometer'
  | 'Haul Ramp Maintenance';

export type ShiftAssignment = 
  | 'Shift A (06:00 - 14:00)'
  | 'Shift B (14:00 - 22:00)'
  | 'Night Shift (22:00 - 06:00)';

export type WaypointStatus = 
  | 'LOGGED'
  | 'IN PROGRESS'
  | 'VERIFIED';

export interface OperationalWaypoint {
  id: string;
  pointId: string; // e.g. "MN-WP-409"
  coordinates: {
    lat: number;
    lon: number;
    latDms: string;
    lonDms: string;
    utm: string; // e.g. "45Q UC 85346 21903"
  };
  elevationRl: number; // e.g. 318.2
  operationalClass: OperationalClass;
  estimatedGradeMn: number;
  assignedRigOrFleet: string;
  shift: ShiftAssignment;
  status: WaypointStatus;
  fieldRemarks: string;
  canvasX: number; // 0-100%
  canvasY: number; // 0-100%
  timestampIso: string;
}

export interface DEWPForecastDay {
  dayIndex: number; // 1 to 7
  code: string; // e.g. "T+1", "T+5"
  dateLabel: string;
  numericFeasibilityPct: number;
  statusBadge: 'UNFAVORABLE' | 'CONDITIONAL' | 'OPTIMAL EXTRACTION WINDOW';
  precipitationMm: number;
  benchFoS: number; // Factor of Safety (e.g., 1.44)
  pyrolusiteClarityPct: number; // Surface exposure %
  haulRollingResistanceKnT: number; // kN/t rolling resistance
  engineeringSummary: string;
  isTargetWindow: boolean; // True for T+5 and T+6
}

export interface ADSDirective {
  id: string;
  incidentPrefix: string; // e.g. "[GEOT-04]", "[DISP-11]", "[ENV-02]"
  category: 'TARGET EXTRACTION' | 'HAUL & FLEET' | 'GEOTECHNICAL';
  directiveText: string;
  targetSector: string;
  confidencePct: number;
  timestampIst: string; // e.g. "14:22:08.412 IST"
  targetCoordinates: {
    lat: number;
    lon: number;
    utm: string;
    elevationRl: number;
  };
  suggestedGradeMn?: number;
  assignedRigOrFleet?: string;
  acknowledged: boolean;
  dispatched: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventCode: string;
  pointId: string;
  details: string;
  diffPayload: string;
  operator: string;
  verifiedBySystem: boolean;
}

export interface MineLeaseOption {
  id: string;
  name: string;
  code: string;
  region: string;
  centerCoordinates: string;
  datumRl: string;
}

// Backward compatibility interfaces
export type TacticalPinCategory = OperationalClass | 'EXTRACTION' | 'ASSAY SAMPLE' | 'SLOPE RISK' | 'HAUL ROUTE';
export type VerificationStatus = WaypointStatus | 'PENDING';
export type ShiftType = 'MORNING SHIFT' | 'NIGHT SHIFT' | ShiftAssignment;
export type DateFilterType = 'ALL' | 'PAST 7 DAYS' | 'TODAY' | 'DAY +5 FORECAST TARGET';

export interface TacticalPin {
  id: string;
  pinId: string;
  coordinates: {
    lat: number;
    lon: number;
    latDms: string;
    lonDms: string;
  };
  elevationM: number;
  category: TacticalPinCategory;
  predictedGradeMn: number;
  date: string;
  shift: ShiftType;
  status: VerificationStatus;
  assignedUnit: string;
  notes: string;
  canvasX: number;
  canvasY: number;
  createdAt: string;
}

export interface ForecastDay {
  dayNumber: number;
  dayName: string;
  dateString: string;
  feasibilityScore: number;
  statusBadge: string;
  badgeVariant: 'optimal' | 'high_yield' | 'hazard' | 'normal';
  weatherRiskScore: number;
  slopeStabilityScore: number;
  oreAccessibilityScore: number;
  trafficabilityScore: number;
  swirMoistureIndex: number;
  pyrolusiteExposurePct: number;
  aiRecommendation: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  actionType: 'PIN_CREATED' | 'PIN_UPDATED' | 'PIN_VERIFIED' | 'PIN_REMOVED' | 'ROLLBACK_EXECUTED' | 'EXPORT_GENERATED';
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
  coordinates: { lat: string; lon: string; elev: string };
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
