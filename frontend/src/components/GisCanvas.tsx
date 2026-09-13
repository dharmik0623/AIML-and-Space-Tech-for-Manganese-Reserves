import { useState, useRef } from 'react';
import type { MouseEvent, WheelEvent } from 'react';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Crosshair, 
  Compass, 
  Target,
  Sparkles,
  Truck
} from 'lucide-react';
import type { HotspotAnomaly, LayerState, BeltSector } from '../types';
import { HOTSPOT_ANOMALIES, LIVE_VEHICLES } from '../mockData';

interface GisCanvasProps {
  currentSector: BeltSector;
  selectedHotspot: HotspotAnomaly | null;
  onSelectHotspot: (hotspot: HotspotAnomaly | null) => void;
  layers: LayerState;
  onToggleLayer: (layerKey: keyof LayerState) => void;
}

export const GisCanvas: React.FC<GisCanvasProps> = ({
  currentSector,
  selectedHotspot,
  onSelectHotspot,
  layers,
  onToggleLayer
}) => {
  // Pan and Zoom Transformation States
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLayerMenu, setShowLayerMenu] = useState(true);

  // Mouse coordinate tracker for bottom HUD
  const [cursorGeo, setCursorGeo] = useState({
    lat: currentSector.coordinates.lat,
    lon: currentSector.coordinates.lon,
    elev: currentSector.coordinates.elev,
    heading: '034° NNE',
    gsd: '0.12 m/px'
  });

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Mouse wheel zoom handler
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom(prev => Math.min(4.5, Math.max(0.8, prev * zoomFactor)));
  };

  // Drag pan handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Only drag with left click or middle click
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    // Dynamic coordinate tracker simulation
    if (canvasContainerRef.current) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width;
      const yRel = (e.clientY - rect.top) / rect.height;
      
      const baseLatDeg = 21.9051 - yRel * 0.012;
      const baseLonDeg = 85.3950 + xRel * 0.015;
      const elevM = Math.round(410 + (1 - yRel) * 85 + Math.sin(xRel * 10) * 15);

      setCursorGeo({
        lat: `${baseLatDeg.toFixed(4)}° N`,
        lon: `${baseLonDeg.toFixed(4)}° E`,
        elev: `${elevM} m RL`,
        heading: '034° NNE',
        gsd: `${(0.12 / zoom).toFixed(2)} m/px`
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onSelectHotspot(null);
  };

  return (
    <div 
      ref={canvasContainerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-[calc(100vh-3.5rem)] bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      {/* 1. VIEWPORT TRANSFORM CONTAINER */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {/* BASE ORTHOMOSAIC IMAGE (User-provided front end mg.png) */}
        <div className="relative max-w-none w-[1600px] h-[900px] flex-shrink-0 shadow-2xl">
          <img 
            src="/front_end_mg.png" 
            alt="Drone Orthomosaic Basemap"
            className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-500 ${
              layers.trueColorBasemap 
                ? 'contrast-125 brightness-95' 
                : 'contrast-110 brightness-75 grayscale-[30%]'
            }`}
          />

          {/* LAYER 2: Multi-Spectral Alteration Halos (Amber/Rust false-color overlay) */}
          {layers.alterationHalos && (
            <div className="absolute inset-0 pointer-events-none z-10 mix-blend-screen opacity-70">
              <svg className="w-full h-full" viewBox="0 0 1600 900">
                <defs>
                  <radialGradient id="haloGrad1" cx="35%" cy="30%" r="25%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                    <stop offset="60%" stopColor="#d97706" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#92400e" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="haloGrad2" cx="48%" cy="50%" r="30%">
                    <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#b45309" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="haloGrad3" cx="64%" cy="38%" r="20%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.75" />
                    <stop offset="70%" stopColor="#b45309" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="560" cy="270" r="220" fill="url(#haloGrad1)" filter="blur(25px)" />
                <circle cx="760" cy="450" r="260" fill="url(#haloGrad2)" filter="blur(30px)" />
                <circle cx="1020" cy="340" r="180" fill="url(#haloGrad3)" filter="blur(20px)" />
              </svg>
            </div>
          )}

          {/* LAYER 3: Geotechnical Elevation & Topo-Mesh (DEM Slope Contours) */}
          {layers.geotechnicalElevation && (
            <div className="absolute inset-0 pointer-events-none z-12 opacity-80 mix-blend-overlay">
              <svg className="w-full h-full" viewBox="0 0 1600 900">
                {/* Elevation Contours */}
                {[120, 190, 260, 330, 400, 470, 540].map((radius, idx) => (
                  <ellipse 
                    key={idx}
                    cx="720" 
                    cy="450" 
                    rx={radius * 1.5} 
                    ry={radius * 1.1} 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="1.2" 
                    strokeDasharray={idx % 2 === 0 ? '4 2' : 'none'}
                    opacity={0.4 + idx * 0.08}
                  />
                ))}
                {/* Bench slope vectors */}
                <path d="M 720,450 L 520,280 M 720,450 L 980,320 M 720,450 L 720,700 M 720,450 L 400,480" 
                  stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              </svg>
            </div>
          )}

          {/* LAYER 4: High-Confidence Anomaly Polygons & Clickable Hotspots */}
          {layers.anomalyPolygons && (
            <div className="absolute inset-0 z-20">
              <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 1600 900">
                {HOTSPOT_ANOMALIES.map((hotspot) => {
                  const isSelected = selectedHotspot?.id === hotspot.id;
                  const ptsString = hotspot.polygonPoints
                    .map(([x, y]) => `${(x / 100) * 1600},${(y / 100) * 900}`)
                    .join(' ');

                  return (
                    <g key={hotspot.id} className="cursor-pointer pointer-events-auto" onClick={(e) => {
                      e.stopPropagation();
                      onSelectHotspot(hotspot);
                    }}>
                      <polygon
                        points={ptsString}
                        fill={isSelected ? 'rgba(245, 158, 11, 0.45)' : 'rgba(234, 88, 12, 0.28)'}
                        stroke={isSelected ? '#38bdf8' : '#f59e0b'}
                        strokeWidth={isSelected ? 3 : 2}
                        strokeDasharray={isSelected ? 'none' : '4 2'}
                        className="transition-all duration-300 hover:fill-amber-500/50 hover:stroke-cyan-400"
                      />
                      {/* Center Pulse Marker */}
                      <circle
                        cx={(hotspot.xPercent / 100) * 1600}
                        cy={(hotspot.yPercent / 100) * 900}
                        r={isSelected ? 7 : 5}
                        fill={isSelected ? '#38bdf8' : '#f59e0b'}
                        className="animate-pulse"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* HTML Floating Hotspot Labels & Click Anchors */}
              {HOTSPOT_ANOMALIES.map((hotspot) => {
                const isSelected = selectedHotspot?.id === hotspot.id;
                return (
                  <div
                    key={hotspot.id}
                    style={{
                      left: `${hotspot.xPercent}%`,
                      top: `${hotspot.yPercent}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHotspot(hotspot);
                    }}
                    className={`absolute z-25 flex flex-col items-center cursor-pointer group`}
                  >
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg transition-all ${
                      isSelected 
                        ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300 scale-110' 
                        : 'bg-slate-900/90 text-amber-300 border border-amber-500/60 hover:scale-105'
                    }`}>
                      <Target className="w-2.5 h-2.5 text-current animate-spin-slow" />
                      <span>{hotspot.targetId}</span>
                      <span className="text-[9px] opacity-80">({hotspot.estimatedGradeMn}% Mn)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIVE VEHICLE TRACKS (from image overlay) */}
          {layers.vehicleTelemetry && (
            <div className="absolute inset-0 pointer-events-none z-15">
              {LIVE_VEHICLES.map((veh) => (
                <div 
                  key={veh.id}
                  style={{ left: `${veh.x}%`, top: `${veh.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-1"
                >
                  <div 
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center border shadow-lg"
                    style={{ backgroundColor: `${veh.color}33`, borderColor: veh.color }}
                  >
                    <Truck className="w-2 h-2" style={{ color: veh.color }} />
                  </div>
                  <span 
                    className="text-[9px] font-mono px-1 rounded bg-slate-950/80 border text-slate-200"
                    style={{ borderColor: `${veh.color}88` }}
                  >
                    {veh.id} ({veh.speed})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. INSPECTOR TOOLTIP OVERLAY (When a Hotspot is selected) */}
      {selectedHotspot && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-96 tactical-glass rounded-xl border border-amber-500/50 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono font-bold text-xs">
                  {selectedHotspot.targetId}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {(selectedHotspot.prospectivityConfidence * 100).toFixed(1)}% AI Match
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mt-1 font-mono">
                {selectedHotspot.name}
              </h4>
            </div>
            <button 
              onClick={() => onSelectHotspot(null)}
              className="text-slate-400 hover:text-slate-100 text-xs p-1 rounded-full hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs mb-3.5">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase">Estimated Depth</span>
              <span className="text-slate-100 font-bold text-sm">{selectedHotspot.estimatedDepth}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase">Estimated Grade</span>
              <span className="text-amber-400 font-bold text-sm glow-amber">
                {selectedHotspot.estimatedGradeMn}% Mn
              </span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase">SWIR Ratio (11/12)</span>
              <span className="text-cyan-400 font-bold text-sm">{selectedHotspot.swirRatio.toFixed(2)}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block uppercase">Formation</span>
              <span className="text-slate-200 text-[11px] font-semibold truncate block">
                {selectedHotspot.lithology}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-amber-400" />
              {selectedHotspot.recommendedBorehole}
            </span>
            <button 
              onClick={() => alert(`Borehole Coordinates for ${selectedHotspot.targetId} locked into dispatch plan!`)}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded transition-all font-mono"
            >
              Vector Core Borehole
            </button>
          </div>
        </div>
      )}

      {/* 3. MULTI-LAYER TOGGLE CONTROLS (Top Right Corner) */}
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end space-y-2">
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-200 shadow-xl backdrop-blur-md cursor-pointer"
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">GIS Map Layers</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 text-[10px] font-bold">
            {Object.values(layers).filter(Boolean).length}/6
          </span>
        </button>

        {showLayerMenu && (
          <div className="w-72 tactical-glass p-3 rounded-xl shadow-2xl space-y-2 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider pb-1 border-b border-slate-800 flex justify-between">
              <span>Raster & Vector Overlays</span>
              <span className="text-cyan-400">Live</span>
            </div>

            {/* Layer 1 */}
            <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer">
              <span className="text-slate-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
                [L1] True Color Basemap
              </span>
              <input 
                type="checkbox" 
                checked={layers.trueColorBasemap} 
                onChange={() => onToggleLayer('trueColorBasemap')}
                className="rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* Layer 2 */}
            <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer">
              <span className="text-amber-300 flex items-center gap-2 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shadow-sm shadow-amber-500" />
                [L2] Multi-Spectral Halos
              </span>
              <input 
                type="checkbox" 
                checked={layers.alterationHalos} 
                onChange={() => onToggleLayer('alterationHalos')}
                className="rounded accent-amber-500 cursor-pointer"
              />
            </label>

            {/* Layer 3 */}
            <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer">
              <span className="text-cyan-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                [L3] Topo-Mesh & DEM Contours
              </span>
              <input 
                type="checkbox" 
                checked={layers.geotechnicalElevation} 
                onChange={() => onToggleLayer('geotechnicalElevation')}
                className="rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* Layer 4 */}
            <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer">
              <span className="text-orange-300 flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shadow-sm shadow-orange-500" />
                [L4] AI Anomaly Polygons
              </span>
              <input 
                type="checkbox" 
                checked={layers.anomalyPolygons} 
                onChange={() => onToggleLayer('anomalyPolygons')}
                className="rounded accent-orange-500 cursor-pointer"
              />
            </label>

            {/* Additional Telemetry Toggles */}
            <div className="pt-1.5 border-t border-slate-800/80">
              <label className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer">
                <span className="text-emerald-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  Vehicle GPS Tracks
                </span>
                <input 
                  type="checkbox" 
                  checked={layers.vehicleTelemetry} 
                  onChange={() => onToggleLayer('vehicleTelemetry')}
                  className="rounded accent-emerald-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 4. CANVAS INTERACTIVE TOOLBAR (Zoom, Reset, Fullscreen) */}
      <div className="absolute right-4 bottom-14 z-30 flex flex-col space-y-1.5">
        <button
          onClick={() => setZoom(prev => Math.min(4.5, prev * 1.25))}
          className="p-2 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-400 transition-all shadow-lg cursor-pointer"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.8, prev * 0.8))}
          className="p-2 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-400 transition-all shadow-lg cursor-pointer"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-400 transition-all shadow-lg cursor-pointer"
          title="Reset Orthomosaic Center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 5. BOTTOM COORDINATE TRACKING HUD */}
      <div className="absolute bottom-0 left-0 right-0 h-9 bg-slate-950/95 border-t border-slate-800/80 px-4 flex items-center justify-between z-30 font-mono text-xs text-slate-400 backdrop-blur-md">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 uppercase font-bold text-[10px]">COORDINATE:</span>
            <span className="text-slate-200 font-semibold">{cursorGeo.lat}</span>
            <span className="text-slate-200 font-semibold">{cursorGeo.lon}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 uppercase font-bold text-[10px]">ELEV:</span>
            <span className="text-cyan-300 font-bold">{cursorGeo.elev}</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-slate-500 uppercase font-bold text-[10px]">HEADING:</span>
            <span className="text-slate-300">{cursorGeo.heading}</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 uppercase font-bold text-[10px]">SCALE GSD:</span>
            <span className="text-emerald-400 font-bold">{cursorGeo.gsd}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 uppercase font-bold text-[10px]">MAG:</span>
            <span className="text-amber-400 font-bold">{(zoom * 10).toFixed(1)}x</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span className="text-[10px] text-slate-400">WGS-84 UTM 44N</span>
          </div>
        </div>
      </div>
    </div>
  );
};
