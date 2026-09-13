export interface HotspotAnomaly {
  id: string;
  name: string;
  targetId: string;
  xPercent: number; // Position percentage on orthomosaic
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  estimatedDepth: string; // e.g. "14m – 22m"
  estimatedGradeMn: number; // e.g. 44.8%
  swirRatio: number; // e.g. 1.52
  prospectivityConfidence: number; // e.g. 0.94
  lithology: string; // e.g. "High-Grade Braunite Reef"
  recommendedBorehole: string;
  polygonPoints: [number, number][]; // Relative coordinates for SVG polygon
}

export interface LayerState {
  trueColorBasemap: boolean; // Layer 1
  alterationHalos: boolean; // Layer 2
  geotechnicalElevation: boolean; // Layer 3
  anomalyPolygons: boolean; // Layer 4
  vehicleTelemetry: boolean;
  hexGridOverlay: boolean;
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
