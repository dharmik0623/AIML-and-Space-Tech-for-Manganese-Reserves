import type { HotspotAnomaly, BeltSector } from './types';

export const BELT_SECTORS: BeltSector[] = [
  {
    id: 'odisha-sector-4b',
    name: 'Sector 4B Pit Survey',
    breadcrumb: 'Odisha-Jharkhand Manganese Belt > Sector 4B Pit Survey',
    region: 'Kendujhar-Bonai Iron-Manganese Complex, Odisha',
    coordinates: { lat: '21°54\'18.4" N', lon: '85°23\'42.1" E', elev: '482.5 m RL' },
    reservesMt: 4.82,
    highGradeProbPct: 38.4,
    confidencePct: 92.6,
    swirRatio: 1.48
  },
  {
    id: 'balaghat-main-lode',
    name: 'Sector 2 Main Lode',
    breadcrumb: 'Central Indian Manganese Belt > Balaghat Sector 2',
    region: 'Bharweli-Balaghat Braunite Horizon, MP',
    coordinates: { lat: '21°48\'11.8" N', lon: '80°11\'04.3" E', elev: '428.4 m RL' },
    reservesMt: 6.14,
    highGradeProbPct: 44.2,
    confidencePct: 94.8,
    swirRatio: 1.54
  },
  {
    id: 'dongri-buzurg-ridge',
    name: 'Sector 1 Dioxide Ridge',
    breadcrumb: 'Bhandara Belt > Dongri Buzurg Sector 1 Dioxide Ridge',
    region: 'Tumsar-Dongri Buzurg Battery Ore Pit, Maharashtra',
    coordinates: { lat: '21°33\'15.2" N', lon: '79°41\'29.0" E', elev: '385.0 m RL' },
    reservesMt: 3.95,
    highGradeProbPct: 41.0,
    confidencePct: 91.4,
    swirRatio: 1.46
  }
];

export const HOTSPOT_ANOMALIES: HotspotAnomaly[] = [
  {
    id: 'hs-01',
    name: 'North-East High Grade Braunite Reef',
    targetId: 'TARGET-MN-01',
    xPercent: 32,
    yPercent: 24,
    widthPercent: 14,
    heightPercent: 12,
    estimatedDepth: '12m – 22m',
    estimatedGradeMn: 44.8,
    swirRatio: 1.52,
    prospectivityConfidence: 0.942,
    lithology: 'High-Purity Braunite & Pyrolusite',
    recommendedBorehole: 'BH-VECT-01 (Priority 1 Core)',
    polygonPoints: [
      [28, 20], [36, 18], [42, 23], [39, 31], [31, 29]
    ]
  },
  {
    id: 'hs-02',
    name: 'Central Bench Ore Trap (Primary Anomaly)',
    targetId: 'TARGET-MN-02',
    xPercent: 44,
    yPercent: 46,
    widthPercent: 16,
    heightPercent: 15,
    estimatedDepth: '8m – 16m',
    estimatedGradeMn: 41.2,
    swirRatio: 1.48,
    prospectivityConfidence: 0.926,
    lithology: 'Gondite Alteration / Psilomelane Lode',
    recommendedBorehole: 'BH-VECT-02 (Immediate Confirmatory)',
    polygonPoints: [
      [38, 40], [52, 38], [56, 52], [46, 58], [37, 50]
    ]
  },
  {
    id: 'hs-03',
    name: 'East Haul-Ramp Structural Splay',
    targetId: 'TARGET-MN-03',
    xPercent: 62,
    yPercent: 35,
    widthPercent: 12,
    heightPercent: 11,
    estimatedDepth: '18m – 31m',
    estimatedGradeMn: 36.5,
    swirRatio: 1.38,
    prospectivityConfidence: 0.884,
    lithology: 'Siliceous Manganese & Ferruginous Schist',
    recommendedBorehole: 'BH-VECT-03 (Secondary Grid)',
    polygonPoints: [
      [58, 30], [68, 28], [72, 38], [64, 43], [57, 36]
    ]
  },
  {
    id: 'hs-04',
    name: 'South Floor Inundation Contact',
    targetId: 'TARGET-MN-04',
    xPercent: 36,
    yPercent: 66,
    widthPercent: 15,
    heightPercent: 13,
    estimatedDepth: '24m – 38m',
    estimatedGradeMn: 43.0,
    swirRatio: 1.49,
    prospectivityConfidence: 0.931,
    lithology: 'Massive Cryptomelane & Braunite Horizon',
    recommendedBorehole: 'BH-VECT-04 (Deep Core Vector)',
    polygonPoints: [
      [30, 62], [44, 60], [48, 72], [39, 78], [29, 70]
    ]
  }
];

// Reflectance vs. Wavelength showing diagnostic Manganese SWIR absorption dip around 2200-2350nm
export const SPECTRAL_CURVE_DATA = [
  { wavelength: 450, band: 'B1 Coastal', mnReflectance: 0.08, hostReflectance: 0.06, diff: 0.02 },
  { wavelength: 490, band: 'B2 Blue', mnReflectance: 0.11, hostReflectance: 0.09, diff: 0.02 },
  { wavelength: 560, band: 'B3 Green', mnReflectance: 0.17, hostReflectance: 0.16, diff: 0.01 },
  { wavelength: 665, band: 'B4 Red', mnReflectance: 0.22, hostReflectance: 0.28, diff: -0.06 },
  { wavelength: 705, band: 'B5 RedEdge', mnReflectance: 0.26, hostReflectance: 0.33, diff: -0.07 },
  { wavelength: 842, band: 'B8 NIR', mnReflectance: 0.31, hostReflectance: 0.42, diff: -0.11 },
  { wavelength: 1610, band: 'B11 SWIR-1', mnReflectance: 0.48, hostReflectance: 0.46, diff: 0.02 },
  { wavelength: 2190, band: 'B12 SWIR-2', mnReflectance: 0.24, hostReflectance: 0.49, diff: -0.25 }, // Sharp Mn Diagnostic Dip!
  { wavelength: 2260, band: 'ASTER B7', mnReflectance: 0.21, hostReflectance: 0.47, diff: -0.26 },  // Deepest absorption
  { wavelength: 2350, band: 'ASTER B8', mnReflectance: 0.27, hostReflectance: 0.44, diff: -0.17 },
  { wavelength: 2400, band: 'SWIR End', mnReflectance: 0.33, hostReflectance: 0.41, diff: -0.08 }
];

export const LIVE_VEHICLES = [
  { id: 'H24', type: 'Dumper 50T', x: 28, y: 35, status: 'Active (Zone B-3)', speed: '21 km/h', color: '#06b6d4' },
  { id: 'H19', type: 'Dumper 35T', x: 22, y: 26, status: 'Active (Zone B-1)', speed: '19 km/h', color: '#10b981' },
  { id: 'EX-01', type: 'Shovel 4.2m³', x: 20, y: 30, status: 'Excavating (Reef 2)', speed: '0 km/h', color: '#f59e0b' },
  { id: 'H31', type: 'Dumper 50T', x: 44, y: 52, status: 'Hauling to Crusher', speed: '24 km/h', color: '#06b6d4' },
  { id: 'E01', type: 'Hauler Patrol', x: 42, y: 69, status: 'Path Deviation Flag', speed: '14 km/h', color: '#ef4444' },
  { id: 'H11', type: 'Dumper 35T', x: 33, y: 68, status: 'Active (Bench 4)', speed: '22 km/h', color: '#10b981' }
];
