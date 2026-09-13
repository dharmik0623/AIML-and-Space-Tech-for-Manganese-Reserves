import type { 
  OperationalWaypoint, 
  DEWPForecastDay, 
  ADSDirective, 
  MineLeaseOption, 
  AuditLogEntry 
} from '../types';

export const MINE_LEASES: MineLeaseOption[] = [
  {
    id: 'omdc-barbil-4b',
    name: 'OMDC — Barbil Sector 4B Pit',
    code: 'LEAS-OMDC-OR-4B',
    region: 'Kendujhar-Bonai Iron-Manganese Complex, Odisha',
    centerCoordinates: '21°54\'12" N, 85°20\'45" E',
    datumRl: '284m RL'
  },
  {
    id: 'moil-balaghat-central',
    name: 'MOIL — Balaghat Central Mine (Pit 2 Lode)',
    code: 'LEAS-MOIL-MP-02',
    region: 'Bharweli Braunite Horizon, Madhya Pradesh',
    centerCoordinates: '21°48\'11" N, 80°11\'04" E',
    datumRl: '312m RL'
  },
  {
    id: 'moil-dongri-buzurg',
    name: 'MOIL — Dongri Buzurg Battery Ore Pit',
    code: 'LEAS-MOIL-MH-01',
    region: 'Tumsar Dioxide Ridge, Maharashtra',
    centerCoordinates: '21°33\'15" N, 79°41\'29" E',
    datumRl: '295m RL'
  }
];

export const INITIAL_OPERATIONAL_WAYPOINTS: OperationalWaypoint[] = [
  {
    id: 'wp-001',
    pointId: 'MN-WP-401',
    coordinates: {
      lat: 21.9038,
      lon: 85.3462,
      latDms: '21°54\'13.7" N',
      lonDms: '85°20\'46.3" E',
      utm: '45Q UC 85346 21903'
    },
    elevationRl: 384.0,
    operationalClass: 'Controlled Pre-Split Blast',
    estimatedGradeMn: 44.2,
    assignedRigOrFleet: 'Rig DRILL-04 (Atlas Copco)',
    shift: 'Shift A (06:00 - 14:00)',
    status: 'VERIFIED',
    fieldRemarks: 'Bench 3 North-West face blast pattern Alpha-4. Zero back-break risk.',
    canvasX: 35.5,
    canvasY: 28.0,
    timestampIso: '2026-09-13T06:30:00.000Z'
  },
  {
    id: 'wp-002',
    pointId: 'MN-WP-402',
    coordinates: {
      lat: 21.9029,
      lon: 85.3475,
      latDms: '21°54\'10.4" N',
      lonDms: '85°20\'51.0" E',
      utm: '45Q UC 85480 21800'
    },
    elevationRl: 362.5,
    operationalClass: 'Grade Verification Borehole',
    estimatedGradeMn: 41.8,
    assignedRigOrFleet: 'Rig CORING-02 (Longyear 44)',
    shift: 'Shift A (06:00 - 14:00)',
    status: 'IN PROGRESS',
    fieldRemarks: 'Core sample SWIR spectral calibration depth 18.5m. Braunite contact verified.',
    canvasX: 52.0,
    canvasY: 44.5,
    timestampIso: '2026-09-13T07:15:22.000Z'
  },
  {
    id: 'wp-003',
    pointId: 'MN-WP-403',
    coordinates: {
      lat: 21.9015,
      lon: 85.3451,
      latDms: '21°54\'05.4" N',
      lonDms: '85°20\'42.4" E',
      utm: '45Q UC 85230 21650'
    },
    elevationRl: 328.0,
    operationalClass: 'Geotechnical Piezometer',
    estimatedGradeMn: 0.0,
    assignedRigOrFleet: 'Sensor Array PIEZ-12',
    shift: 'Shift A (06:00 - 14:00)',
    status: 'VERIFIED',
    fieldRemarks: 'Vibrating wire piezometer logged at 12.4 kPa. South-East footwall nominal.',
    canvasX: 26.0,
    canvasY: 64.0,
    timestampIso: '2026-09-13T08:00:10.000Z'
  },
  {
    id: 'wp-004',
    pointId: 'MN-WP-404',
    coordinates: {
      lat: 21.9046,
      lon: 85.3488,
      latDms: '21°54\'16.6" N',
      lonDms: '85°20\'55.7" E',
      utm: '45Q UC 85610 21990'
    },
    elevationRl: 395.0,
    operationalClass: 'Haul Ramp Maintenance',
    estimatedGradeMn: 0.0,
    assignedRigOrFleet: 'Grader GR-02 (Cat 16M)',
    shift: 'Shift B (14:00 - 22:00)',
    status: 'LOGGED',
    fieldRemarks: 'Grading and compacted murrum application along Ramp East gradient (8.2%).',
    canvasX: 68.5,
    canvasY: 34.0,
    timestampIso: '2026-09-13T13:45:00.000Z'
  },
  {
    id: 'wp-005',
    pointId: 'MN-WP-405',
    coordinates: {
      lat: 21.9022,
      lon: 85.3466,
      latDms: '21°54\'07.9" N',
      lonDms: '85°20\'47.8" E',
      utm: '45Q UC 85390 21720'
    },
    elevationRl: 344.0,
    operationalClass: 'Controlled Pre-Split Blast',
    estimatedGradeMn: 39.5,
    assignedRigOrFleet: 'Rig DRILL-01 (Sandvik DP1500i)',
    shift: 'Shift B (14:00 - 22:00)',
    status: 'LOGGED',
    fieldRemarks: 'Secondary trim blast pattern Beta-2 for 38% Mn blending stock.',
    canvasX: 42.0,
    canvasY: 53.0,
    timestampIso: '2026-09-13T14:10:00.000Z'
  }
];

export const DEWP_SEVEN_DAY_FORECAST: DEWPForecastDay[] = [
  {
    dayIndex: 1,
    code: 'T+1',
    dateLabel: '14 SEP 2026',
    numericFeasibilityPct: 42,
    statusBadge: 'UNFAVORABLE',
    precipitationMm: 34.2,
    benchFoS: 1.18,
    pyrolusiteClarityPct: 34,
    haulRollingResistanceKnT: 48,
    engineeringSummary: 'Elevated precipitation radar. Inundation risk on lower sump benches.',
    isTargetWindow: false
  },
  {
    dayIndex: 2,
    code: 'T+2',
    dateLabel: '15 SEP 2026',
    numericFeasibilityPct: 35,
    statusBadge: 'UNFAVORABLE',
    precipitationMm: 48.6,
    benchFoS: 1.12,
    pyrolusiteClarityPct: 21,
    haulRollingResistanceKnT: 56,
    engineeringSummary: 'Monsoon runoff surge. Safety cutoff triggered for heavy haulage.',
    isTargetWindow: false
  },
  {
    dayIndex: 3,
    code: 'T+3',
    dateLabel: '16 SEP 2026',
    numericFeasibilityPct: 68,
    statusBadge: 'CONDITIONAL',
    precipitationMm: 8.4,
    benchFoS: 1.29,
    pyrolusiteClarityPct: 58,
    haulRollingResistanceKnT: 34,
    engineeringSummary: 'Runoff drainage active. Sump pumping operational; selective dry mining only.',
    isTargetWindow: false
  },
  {
    dayIndex: 4,
    code: 'T+4',
    dateLabel: '17 SEP 2026',
    numericFeasibilityPct: 78,
    statusBadge: 'CONDITIONAL',
    precipitationMm: 2.1,
    benchFoS: 1.36,
    pyrolusiteClarityPct: 72,
    haulRollingResistanceKnT: 28,
    engineeringSummary: 'Gradual surface drying. Benching clearance progressing along Ramp 1.',
    isTargetWindow: false
  },
  {
    dayIndex: 5,
    code: 'T+5',
    dateLabel: '18 SEP 2026',
    numericFeasibilityPct: 94,
    statusBadge: 'OPTIMAL EXTRACTION WINDOW',
    precipitationMm: 0.0,
    benchFoS: 1.44,
    pyrolusiteClarityPct: 88,
    haulRollingResistanceKnT: 22,
    engineeringSummary: 'Favorable extraction window: Bench 4 North-East face (Est. Grade: 38.6% - 42.1% Mn, FoS: 1.44, dry haul conditions).',
    isTargetWindow: true
  },
  {
    dayIndex: 6,
    code: 'T+6',
    dateLabel: '19 SEP 2026',
    numericFeasibilityPct: 91,
    statusBadge: 'OPTIMAL EXTRACTION WINDOW',
    precipitationMm: 1.2,
    benchFoS: 1.41,
    pyrolusiteClarityPct: 85,
    haulRollingResistanceKnT: 24,
    engineeringSummary: 'High-tonnage extraction sustained. Ideal blending parity for sinter grade feed.',
    isTargetWindow: true
  },
  {
    dayIndex: 7,
    code: 'T+7',
    dateLabel: '20 SEP 2026',
    numericFeasibilityPct: 82,
    statusBadge: 'CONDITIONAL',
    precipitationMm: 6.5,
    benchFoS: 1.34,
    pyrolusiteClarityPct: 76,
    haulRollingResistanceKnT: 29,
    engineeringSummary: 'Approaching localized overcast front. Complete Bench 4 trim cycle by 14:00 HRS.',
    isTargetWindow: false
  }
];

export const ADS_DIRECTIVES: ADSDirective[] = [
  {
    id: 'ads-001',
    incidentPrefix: '[TARGET EXTRACTION]',
    category: 'TARGET EXTRACTION',
    directiveText: 'Prioritize blast pattern Alpha-4 at Bench 3 West; spectral de-mixing indicates high-grade pyrolusite seam (44.2% Mn) with minimal overburden.',
    targetSector: 'Sector 4B — Bench 3 West (Grid 85-34)',
    confidencePct: 94.2,
    timestampIst: '14:22:08.412 IST',
    targetCoordinates: {
      lat: 21.9038,
      lon: 85.3462,
      utm: '45Q UC 85346 21903',
      elevationRl: 384.0
    },
    suggestedGradeMn: 44.2,
    assignedRigOrFleet: 'CAT-6040 Shovel + 4x CAT-777D',
    acknowledged: true,
    dispatched: false
  },
  {
    id: 'ads-002',
    incidentPrefix: '[HAUL & FLEET]',
    category: 'HAUL & FLEET',
    directiveText: 'Re-route CAT-777 haul cycle via Ramp East; Ramp West shows +3.8% moisture increase and elevated tire slip probability.',
    targetSector: 'Ramp East Gradient Contact (Elev 360m)',
    confidencePct: 91.8,
    timestampIst: '14:21:44.180 IST',
    targetCoordinates: {
      lat: 21.9046,
      lon: 85.3488,
      utm: '45Q UC 85610 21990',
      elevationRl: 395.0
    },
    suggestedGradeMn: 0.0,
    assignedRigOrFleet: 'Dispatch Cycle Fleet A',
    acknowledged: true,
    dispatched: true
  },
  {
    id: 'ads-003',
    incidentPrefix: '[GEOTECHNICAL]',
    category: 'GEOTECHNICAL',
    directiveText: 'Deploy secondary piezometer array at Sector 2C fault boundary; micro-strain sensor #12 indicates slight bench settlement.',
    targetSector: 'Sector 2C Fault Splays (Footwall Zone)',
    confidencePct: 96.5,
    timestampIst: '14:20:12.605 IST',
    targetCoordinates: {
      lat: 21.9015,
      lon: 85.3451,
      utm: '45Q UC 85230 21650',
      elevationRl: 328.0
    },
    suggestedGradeMn: 0.0,
    assignedRigOrFleet: 'Geotech Survey Unit 02',
    acknowledged: false,
    dispatched: false
  },
  {
    id: 'ads-004',
    incidentPrefix: '[ENV-02]',
    category: 'HAUL & FLEET',
    directiveText: 'Activate Sump Pump Station 3 prior to T+2 monsoon surge; maintain pit water table below 265m RL datum.',
    targetSector: 'Pit Floor Sump Catchment 03',
    confidencePct: 89.4,
    timestampIst: '14:18:33.918 IST',
    targetCoordinates: {
      lat: 21.9008,
      lon: 85.3458,
      utm: '45Q UC 85290 21580',
      elevationRl: 265.0
    },
    suggestedGradeMn: 0.0,
    assignedRigOrFleet: 'Sump Dewatering Pump 03',
    acknowledged: true,
    dispatched: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-13T08:52:19.412Z',
    eventCode: 'WAYPOINT_COMMITTED',
    pointId: 'MN-WP-401',
    details: 'Blast pattern Alpha-4 coordinates validated against mine concession polygon.',
    diffPayload: '+{ pointId: "MN-WP-401", lat: 21.9038, lon: 85.3462, elev: 384.0m, grade: 44.2% }',
    operator: 'admin@omdc.gov.in',
    verifiedBySystem: true
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-13T09:14:02.805Z',
    eventCode: 'STATUS_TRANSITION',
    pointId: 'MN-WP-402',
    details: 'Diamond coring station status transitioned from LOGGED to IN PROGRESS.',
    diffPayload: '~{ status: LOGGED -> IN PROGRESS }',
    operator: 'geotech.lead@omdc.gov.in',
    verifiedBySystem: true
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-13T10:30:45.190Z',
    eventCode: 'DIRECTIVE_DISPATCHED',
    pointId: 'ADS-DISP-02',
    details: 'Haul cycle re-routing dispatched to fleet dispatch SCADA via Modbus TCP.',
    diffPayload: '+{ route: "Ramp East", vehicles: ["CAT-777D-01", "CAT-777D-04"] }',
    operator: 'dispatch.officer@omdc.gov.in',
    verifiedBySystem: true
  }
];
