import React, { useState, useRef, type MouseEvent, type WheelEvent } from 'react';
import { 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Filter, 
  Trash2, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin
} from 'lucide-react';
import type { 
  OperationalWaypoint, 
  OperationalClass, 
  ShiftAssignment, 
  WaypointStatus 
} from '../types';

interface PitSpatialWorkspaceProps {
  waypoints: OperationalWaypoint[];
  onAddWaypoint?: (waypoint: OperationalWaypoint) => void;
  onUpdateWaypoint: (waypoint: OperationalWaypoint) => void;
  onDeleteWaypoint: (waypointId: string) => void;
  onOpenWaypointModal: (presetCoords?: { lat: number; lon: number; utm: string; rl: number; canvasX: number; canvasY: number }) => void;
}

export const PitSpatialWorkspace: React.FC<PitSpatialWorkspaceProps> = ({
  waypoints,
  onUpdateWaypoint,
  onDeleteWaypoint,
  onOpenWaypointModal
}) => {
  // 1. Pan & Zoom Camera State
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 2. Real-Time Cursor HUD Coordinates
  const [cursorHud, setCursorHud] = useState<{
    lat: string;
    lon: string;
    utm: string;
    elevation: string;
  }>({
    lat: '21.9034° N',
    lon: '85.3459° E',
    utm: '45Q UC 85340 21900',
    elevation: '318.2m RL'
  });

  // 3. Layer Switcher State
  const [layers, setLayers] = useState({
    trueColorBasemap: true,
    swirBandRatio: true,
    demSlopeGradient: false,
    activeWaypoints: true,
    benchContours: true,
    haulRampVectors: true
  });
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // 4. Interactive Waypoint Mode & Selection
  const [isCrosshairDropMode, setIsCrosshairDropMode] = useState<boolean>(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState<OperationalWaypoint | null>(null);
  const [classFilter, setClassFilter] = useState<string>('ALL');

  const containerRef = useRef<HTMLDivElement>(null);

  // Pan handling
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 0 && !isCrosshairDropMode) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width;
    const yRel = (e.clientY - rect.top) / rect.height;

    // Geographic mapping
    const lat = 21.9000 + (1 - yRel) * 0.0080;
    const lon = 85.3410 + xRel * 0.0120;
    const easting = Math.round(85000 + xRel * 1000);
    const northing = Math.round(21000 + (1 - yRel) * 1000);
    const elev = (310.0 + (1 - yRel) * 85.0 - (xRel > 0.4 && xRel < 0.7 ? 35.0 : 0.0)).toFixed(1);

    setCursorHud({
      lat: `${lat.toFixed(4)}° N`,
      lon: `${lon.toFixed(4)}° E`,
      utm: `45Q UC ${easting} ${northing}`,
      elevation: `${elev}m RL`
    });

    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom(prev => Math.min(3.5, Math.max(0.65, prev * zoomFactor)));
  };

  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Dropping a waypoint directly on the map
  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!isCrosshairDropMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));

    const lat = 21.9000 + (1 - yPct / 100) * 0.0080;
    const lon = 85.3410 + (xPct / 100) * 0.0120;
    const easting = Math.round(85000 + (xPct / 100) * 1000);
    const northing = Math.round(21000 + (1 - yPct / 100) * 1000);
    const elev = parseFloat((310.0 + (1 - yPct / 100) * 85.0).toFixed(1));

    setIsCrosshairDropMode(false);

    onOpenWaypointModal({
      lat: parseFloat(lat.toFixed(5)),
      lon: parseFloat(lon.toFixed(5)),
      utm: `45Q UC ${easting} ${northing}`,
      rl: elev,
      canvasX: parseFloat(xPct.toFixed(1)),
      canvasY: parseFloat(yPct.toFixed(1))
    });
  };

  const filteredWaypoints = waypoints.filter(wp => {
    if (classFilter === 'ALL') return true;
    return wp.operationalClass === classFilter;
  });

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0B0E14] select-none flex">
      {/* 1. MAIN INTERACTIVE MAP CANVAS CONTAINER */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className={`w-full h-full relative overflow-hidden ${
          isCrosshairDropMode ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* TRANSFORM WRAPPER: Decoupled raster basemap + vector overlays */}
        <div 
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease-out'
          }}
          className="w-full h-full relative flex items-center justify-center pointer-events-auto"
        >
          {/* A. CLEAN RASTER BASEMAP (Sentinel-2 Orthomosaic) */}
          <div className="relative w-[92%] h-[90%] max-w-[1400px] max-h-[800px] rounded border border-[#262E3D] shadow-2xl overflow-hidden bg-[#0B0E14]">
            {layers.trueColorBasemap && (
              <img 
                src="/front end mg.png" 
                alt="Pit Orthomosaic Basemap"
                className="w-full h-full object-cover select-none pointer-events-none filter brightness-90 contrast-110"
                draggable={false}
              />
            )}

            {/* B. TRUE DECOUPLED SVG VECTOR OVERLAYS (Rendered dynamically OVER the raster) */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
            >
              <defs>
                {/* SWIR Pyrolusite Alteration Gradients */}
                <radialGradient id="swirHaloAlpha" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.55" />
                  <stop offset="60%" stopColor="#C27803" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#B45309" stopOpacity="0.0" />
                </radialGradient>
                <radialGradient id="swirHaloBeta" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#C27803" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* 1. SWIR Band 11/12 Mineralization Halos */}
              {layers.swirBandRatio && (
                <g className="transition-opacity duration-300">
                  <ellipse cx="360" cy="220" rx="140" ry="85" fill="url(#swirHaloAlpha)" />
                  <ellipse cx="560" cy="380" rx="180" ry="110" fill="url(#swirHaloBeta)" />
                  {/* High-Grade Seam Outlines */}
                  <polygon 
                    points="320,180 410,160 460,240 380,270" 
                    fill="rgba(217,119,6,0.15)" 
                    stroke="#D97706" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 2" 
                  />
                  <polygon 
                    points="520,330 640,310 680,420 540,440" 
                    fill="rgba(217,119,6,0.12)" 
                    stroke="#C27803" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 2" 
                  />
                </g>
              )}

              {/* 2. DEM Bench Elevation Contours */}
              {layers.benchContours && (
                <g stroke="#657386" strokeWidth="0.8" opacity="0.45" fill="none">
                  <path d="M 120,80 Q 300,120 520,90 T 900,140" />
                  <path d="M 100,180 Q 280,240 500,200 T 880,260" stroke="#9DA7B5" strokeWidth="1" />
                  <path d="M 90,280 Q 260,350 480,310 T 860,380" />
                  <path d="M 80,390 Q 250,470 470,420 T 840,490" stroke="#9DA7B5" strokeWidth="1" />
                  <path d="M 70,490 Q 240,560 460,510 T 820,570" />
                </g>
              )}

              {/* 3. DEM Bench Slope Gradient / Shear Risk Zones */}
              {layers.demSlopeGradient && (
                <g className="transition-opacity duration-300">
                  <path 
                    d="M 220,440 Q 310,500 410,480" 
                    stroke="#B91C1C" 
                    strokeWidth="3.5" 
                    strokeDasharray="6 3" 
                    fill="none" 
                  />
                  <polygon 
                    points="210,430 320,490 280,520 180,460" 
                    fill="rgba(185,28,28,0.18)" 
                    stroke="#B91C1C" 
                    strokeWidth="1" 
                  />
                  <text x="235" y="475" fill="#B91C1C" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
                    BENCH SHEAR RISK // FoS: 1.12
                  </text>
                </g>
              )}

              {/* 4. Haul Ramp Vectors */}
              {layers.haulRampVectors && (
                <g fill="none" strokeWidth="2.2">
                  {/* Primary Haul Ramp East */}
                  <path 
                    d="M 880,180 L 680,280 L 520,380 L 360,490" 
                    stroke="#0284C7" 
                    strokeDasharray="8 4" 
                  />
                  {/* Secondary Haul Ramp West */}
                  <path 
                    d="M 120,120 L 280,240 L 360,360" 
                    stroke="#475569" 
                    strokeDasharray="4 4" 
                  />
                </g>
              )}
            </svg>

            {/* C. ACTIVE OPERATIONAL WAYPOINT MARKERS */}
            {layers.activeWaypoints && filteredWaypoints.map((wp) => {
              const isSelected = selectedWaypoint?.id === wp.id;
              const isPreSplit = wp.operationalClass === 'Controlled Pre-Split Blast';
              const isBorehole = wp.operationalClass === 'Grade Verification Borehole';
              const isPiezometer = wp.operationalClass === 'Geotechnical Piezometer';

              // Industrial muted colors
              const markerBg = isPreSplit 
                ? 'bg-[#D97706] border-[#B45309]' 
                : isBorehole 
                ? 'bg-[#0284C7] border-[#0369A1]' 
                : isPiezometer 
                ? 'bg-[#B91C1C] border-[#991B1B]' 
                : 'bg-[#2E7D32] border-[#1B5E20]';

              return (
                <div
                  key={wp.id}
                  style={{
                    left: `${wp.canvasX}%`,
                    top: `${wp.canvasY}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWaypoint(wp);
                  }}
                  className="absolute z-20 cursor-pointer group"
                >
                  {/* Marker Pin */}
                  <div className={`w-6 h-6 rounded flex items-center justify-center border text-white font-mono text-[10px] font-bold shadow-md transition-transform ${markerBg} ${
                    isSelected ? 'ring-2 ring-[#E6EDF3] scale-125' : 'hover:scale-110'
                  }`}>
                    {isPreSplit ? 'BL' : isBorehole ? 'BH' : isPiezometer ? 'PZ' : 'RP'}
                  </div>

                  {/* Hover Tag */}
                  <div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#121722] border border-[#262E3D] rounded shadow-xl whitespace-nowrap z-30 flex-col items-center pointer-events-none">
                    <span className="text-xs font-semibold text-[#E6EDF3]">{wp.pointId}</span>
                    <span className="text-[9px] font-mono text-[#9DA7B5]">
                      {wp.estimatedGradeMn > 0 ? `${wp.estimatedGradeMn}% Mn` : wp.operationalClass}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. TOP-LEFT ACTION CONTROLS */}
        <div className="absolute top-3 left-3 z-30 flex items-center space-x-2">
          {/* Add Waypoint Button */}
          <button
            onClick={() => setIsCrosshairDropMode(!isCrosshairDropMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all cursor-pointer shadow-lg ${
              isCrosshairDropMode 
                ? 'bg-[#D97706] text-zinc-950 border-[#B45309] font-semibold' 
                : 'bg-[#121722] text-[#E6EDF3] border-[#262E3D] hover:bg-[#1A202C]'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isCrosshairDropMode ? 'CLICK ON PIT TO LOG' : 'LOG OPERATIONAL COORDINATE'}</span>
          </button>

          {/* Class Filter Dropdown */}
          <div className="flex items-center bg-[#121722] border border-[#262E3D] rounded px-2 py-1 text-xs">
            <Filter className="w-3 h-3 text-[#657386] mr-1.5" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent text-xs text-[#E6EDF3] border-none outline-none cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-[#121722]">ALL OPERATIONAL CLASSES</option>
              <option value="Controlled Pre-Split Blast" className="bg-[#121722]">PRE-SPLIT BLAST</option>
              <option value="Grade Verification Borehole" className="bg-[#121722]">GRADE BOREHOLE</option>
              <option value="Geotechnical Piezometer" className="bg-[#121722]">PIEZOMETER ARRAY</option>
              <option value="Haul Ramp Maintenance" className="bg-[#121722]">HAUL RAMP MAINTENANCE</option>
            </select>
          </div>
        </div>

        {/* 3. TOP-RIGHT LAYER SWITCHER & ZOOM TOOLBAR */}
        <div className="absolute top-3 right-3 z-30 flex items-start space-x-2">
          {/* Layer Menu Button */}
          <div className="relative">
            <button
              onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded border text-xs font-medium transition-colors cursor-pointer shadow-lg ${
                isLayerMenuOpen ? 'bg-[#1A202C] text-[#E6EDF3] border-[#D97706]' : 'bg-[#121722] text-[#9DA7B5] border-[#262E3D] hover:text-[#E6EDF3]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>LAYERS</span>
            </button>

            {/* Layer Toggles Popover */}
            {isLayerMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-[#121722] border border-[#262E3D] rounded-md shadow-2xl p-2.5 space-y-2 z-40 text-xs font-sans">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#657386] pb-1 border-b border-[#262E3D]">
                  WebGIS Layer Overlays
                </div>

                <label className="flex items-center justify-between cursor-pointer text-[#E6EDF3] hover:text-white">
                  <span>Orthorectified True-Color Basemap</span>
                  <input 
                    type="checkbox" 
                    checked={layers.trueColorBasemap}
                    onChange={() => setLayers(l => ({ ...l, trueColorBasemap: !l.trueColorBasemap }))}
                    className="accent-[#D97706] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-[#E6EDF3] hover:text-white">
                  <span>SWIR Band 11/12 Ratio (Mn-Oxide)</span>
                  <input 
                    type="checkbox" 
                    checked={layers.swirBandRatio}
                    onChange={() => setLayers(l => ({ ...l, swirBandRatio: !l.swirBandRatio }))}
                    className="accent-[#D97706] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-[#E6EDF3] hover:text-white">
                  <span>DEM Bench Slope Gradient (Shear)</span>
                  <input 
                    type="checkbox" 
                    checked={layers.demSlopeGradient}
                    onChange={() => setLayers(l => ({ ...l, demSlopeGradient: !l.demSlopeGradient }))}
                    className="accent-[#D97706] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-[#E6EDF3] hover:text-white">
                  <span>Bench Elevation Contours</span>
                  <input 
                    type="checkbox" 
                    checked={layers.benchContours}
                    onChange={() => setLayers(l => ({ ...l, benchContours: !l.benchContours }))}
                    className="accent-[#D97706] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-[#E6EDF3] hover:text-white">
                  <span>Active Operational Waypoints</span>
                  <input 
                    type="checkbox" 
                    checked={layers.activeWaypoints}
                    onChange={() => setLayers(l => ({ ...l, activeWaypoints: !l.activeWaypoints }))}
                    className="accent-[#D97706] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-[#E6EDF3] hover:text-white">
                  <span>Haul Ramp Network Vectors</span>
                  <input 
                    type="checkbox" 
                    checked={layers.haulRampVectors}
                    onChange={() => setLayers(l => ({ ...l, haulRampVectors: !l.haulRampVectors }))}
                    className="accent-[#D97706] rounded"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Zoom / Reset Tool Buttons */}
          <div className="flex items-center bg-[#121722] border border-[#262E3D] rounded overflow-hidden shadow-lg">
            <button
              onClick={() => setZoom(z => Math.min(3.5, z * 1.2))}
              className="p-1.5 text-[#9DA7B5] hover:text-[#E6EDF3] hover:bg-[#1A202C] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-[#262E3D]" />
            <button
              onClick={() => setZoom(z => Math.max(0.65, z * 0.8))}
              className="p-1.5 text-[#9DA7B5] hover:text-[#E6EDF3] hover:bg-[#1A202C] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-[#262E3D]" />
            <button
              onClick={resetView}
              className="p-1.5 text-[#9DA7B5] hover:text-[#E6EDF3] hover:bg-[#1A202C] transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. BOTTOM-LEFT: Industrial Metric Scale Bar & Compass Rose */}
        <div className="absolute bottom-3 left-3 z-30 flex items-end space-x-3 pointer-events-none">
          {/* Compass Rose */}
          <div className="w-9 h-9 rounded bg-[#121722]/90 border border-[#262E3D] flex flex-col items-center justify-center font-mono text-[9px] text-[#9DA7B5]">
            <span className="font-bold text-[#D97706]">N</span>
            <span className="text-[7px] text-[#657386]">000°</span>
          </div>

          {/* Metric Scale Bar */}
          <div className="bg-[#121722]/90 border border-[#262E3D] px-2.5 py-1.5 rounded flex flex-col space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-[#9DA7B5] w-36">
              <span>0</span>
              <span>100m</span>
              <span>250m</span>
              <span>500m</span>
            </div>
            <div className="w-36 h-1.5 border border-[#262E3D] flex">
              <div className="w-1/4 h-full bg-[#E6EDF3]" />
              <div className="w-1/4 h-full bg-[#262E3D]" />
              <div className="w-1/2 h-full bg-[#E6EDF3]" />
            </div>
            <span className="text-[8px] font-mono text-[#657386] text-center">GSD: 0.10M / PIXEL</span>
          </div>
        </div>

        {/* 5. BOTTOM-RIGHT: Real-Time Cursor HUD */}
        <div className="absolute bottom-3 right-3 z-30 pointer-events-none">
          <div className="bg-[#121722]/95 border border-[#262E3D] px-3 py-1.5 rounded shadow-xl flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#0284C7]">{cursorHud.lat}</span>
            <span className="text-[#657386]">,</span>
            <span className="text-[#0284C7]">{cursorHud.lon}</span>
            <span className="text-[#262E3D]">|</span>
            <span className="text-[#9DA7B5]">{cursorHud.utm}</span>
            <span className="text-[#262E3D]">|</span>
            <span className="text-[#D97706] font-medium">{cursorHud.elevation}</span>
          </div>
        </div>
      </div>

      {/* 6. RIGHT-HAND WAYPOINT INSPECTOR DRAWER */}
      {selectedWaypoint && (
        <div className="w-80 h-full bg-[#121722] border-l border-[#262E3D] flex flex-col z-40 p-4 font-sans text-xs space-y-3 flex-shrink-0 animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#262E3D]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#D97706]" />
              <div>
                <h3 className="font-semibold text-sm text-[#E6EDF3]">{selectedWaypoint.pointId}</h3>
                <span className="text-[10px] font-mono text-[#657386]">{selectedWaypoint.coordinates.utm}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedWaypoint(null)}
              className="text-[#9DA7B5] hover:text-[#E6EDF3] p-1 rounded hover:bg-[#1A202C] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {/* Class */}
            <div>
              <label className="block text-[11px] font-mono text-[#9DA7B5] mb-1">OPERATIONAL CLASS</label>
              <select
                value={selectedWaypoint.operationalClass}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, operationalClass: e.target.value as OperationalClass };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#1A202C] border border-[#262E3D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
              >
                <option value="Controlled Pre-Split Blast">Controlled Pre-Split Blast</option>
                <option value="Grade Verification Borehole">Grade Verification Borehole</option>
                <option value="Geotechnical Piezometer">Geotechnical Piezometer</option>
                <option value="Haul Ramp Maintenance">Haul Ramp Maintenance</option>
              </select>
            </div>

            {/* Estimated Mn Grade */}
            <div>
              <label className="block text-[11px] font-mono text-[#9DA7B5] mb-1">ESTIMATED GRADE (% Mn)</label>
              <input 
                type="number"
                step="0.1"
                min="0"
                max="65"
                value={selectedWaypoint.estimatedGradeMn}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, estimatedGradeMn: parseFloat(e.target.value) || 0 };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#1A202C] border border-[#262E3D] rounded px-2.5 py-1.5 text-xs font-mono text-[#E6EDF3] outline-none"
              />
            </div>

            {/* Shift Assignment */}
            <div>
              <label className="block text-[11px] font-mono text-[#9DA7B5] mb-1">SHIFT ASSIGNMENT</label>
              <select
                value={selectedWaypoint.shift}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, shift: e.target.value as ShiftAssignment };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#1A202C] border border-[#262E3D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
              >
                <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
              </select>
            </div>

            {/* Assigned Rig / Fleet */}
            <div>
              <label className="block text-[11px] font-mono text-[#9DA7B5] mb-1">ASSIGNED RIG / FLEET UNIT</label>
              <input 
                type="text"
                value={selectedWaypoint.assignedRigOrFleet}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, assignedRigOrFleet: e.target.value };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#1A202C] border border-[#262E3D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
                placeholder="e.g. Rig DRILL-04"
              />
            </div>

            {/* Field Remarks */}
            <div>
              <label className="block text-[11px] font-mono text-[#9DA7B5] mb-1">FIELD REMARKS & LOG</label>
              <textarea
                rows={3}
                value={selectedWaypoint.fieldRemarks}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, fieldRemarks: e.target.value };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#1A202C] border border-[#262E3D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none resize-none"
              />
            </div>

            {/* Status Button Toggle */}
            <div>
              <label className="block text-[11px] font-mono text-[#9DA7B5] mb-1">DISPATCH STATUS</label>
              <button
                onClick={() => {
                  const next: WaypointStatus = 
                    selectedWaypoint.status === 'LOGGED' ? 'IN PROGRESS' :
                    selectedWaypoint.status === 'IN PROGRESS' ? 'VERIFIED' : 'LOGGED';
                  const updated = { ...selectedWaypoint, status: next };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className={`w-full py-2 px-3 rounded text-xs font-mono font-medium flex items-center justify-center space-x-2 border transition-colors cursor-pointer ${
                  selectedWaypoint.status === 'VERIFIED'
                    ? 'bg-[#1A202C] text-[#2E7D32] border-[#2E7D32]'
                    : selectedWaypoint.status === 'IN PROGRESS'
                    ? 'bg-[#1A202C] text-[#D97706] border-[#D97706]'
                    : 'bg-[#1A202C] text-[#9DA7B5] border-[#262E3D]'
                }`}
              >
                {selectedWaypoint.status === 'VERIFIED' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : selectedWaypoint.status === 'IN PROGRESS' ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{selectedWaypoint.status} (CLICK TO CYCLE)</span>
              </button>
            </div>
          </div>

          {/* Delete Action */}
          <div className="pt-2 border-t border-[#262E3D]">
            <button
              onClick={() => {
                onDeleteWaypoint(selectedWaypoint.id);
                setSelectedWaypoint(null);
              }}
              className="w-full py-1.5 rounded bg-[#1A202C] hover:bg-[#B91C1C]/20 border border-[#262E3D] hover:border-[#B91C1C] text-[#9DA7B5] hover:text-[#B91C1C] text-xs font-mono transition-colors flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>DELETE WAYPOINT</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
