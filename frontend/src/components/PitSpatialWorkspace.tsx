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
  MapPin,
  Upload,
  Image as ImageIcon
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom Uploaded Site Imagery
  const [customSiteImage, setCustomSiteImage] = useState<string | null>(() => {
    return localStorage.getItem('mnsight_custom_site_image') || null;
  });
  const [customImageName, setCustomImageName] = useState<string | null>(() => {
    return localStorage.getItem('mnsight_custom_site_name') || null;
  });
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, TIFF, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomSiteImage(dataUrl);
        setCustomImageName(file.name);
        try {
          localStorage.setItem('mnsight_custom_site_image', dataUrl);
          localStorage.setItem('mnsight_custom_site_name', file.name);
        } catch {
          // In case local storage quota is reached, still keeps in memory
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleResetToDefaultImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomSiteImage(null);
    setCustomImageName(null);
    localStorage.removeItem('mnsight_custom_site_image');
    localStorage.removeItem('mnsight_custom_site_name');
  };

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
    <div className="w-full h-full relative overflow-hidden bg-[#0D1117] select-none flex">
      {/* 1. MAIN INTERACTIVE MAP CANVAS CONTAINER */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleFileDrop}
        className={`w-full h-full relative overflow-hidden ${
          isCrosshairDropMode ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* DRAG-AND-DROP OVERLAY INDICATOR */}
        {isDraggingFile && (
          <div className="absolute inset-0 z-50 bg-[#0D1117]/85 border-2 border-dashed border-[#D97706] flex flex-col items-center justify-center pointer-events-none backdrop-blur-xs">
            <Upload className="w-12 h-12 text-[#D97706] mb-3 animate-bounce" />
            <div className="text-sm font-semibold text-[#E6EDF3] tracking-wide">DROP PIT RASTER / ORTHOMOSAIC HERE</div>
            <div className="text-xs font-mono text-[#8B949E] mt-1">Accepts PNG, JPG, WebP, GeoTIFF imagery</div>
          </div>
        )}

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
          <div className="relative w-[92%] h-[90%] max-w-[1400px] max-h-[800px] rounded border border-[#30363D] overflow-hidden bg-[#0D1117]">
            {layers.trueColorBasemap && (
              <img 
                src={customSiteImage || "/front_end_mg.png"} 
                alt="Pit Orthomosaic Basemap"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('front_end_mg.png')) {
                    target.src = '/front_end_mg.png';
                  } else {
                    target.src = '/front end mg.png';
                  }
                }}
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
                  <stop offset="60%" stopColor="#A16207" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#B45309" stopOpacity="0.0" />
                </radialGradient>
                <radialGradient id="swirHaloBeta" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#A16207" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.0" />
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
                    fill="rgba(161,98,7,0.15)" 
                    stroke="#A16207" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 2" 
                  />
                </g>
              )}

              {/* 2. DEM Bench Elevation Contours */}
              {layers.benchContours && (
                <g stroke="#6E7681" strokeWidth="0.8" opacity="0.45" fill="none">
                  <path d="M 120,80 Q 300,120 520,90 T 900,140" />
                  <path d="M 100,180 Q 280,240 500,200 T 880,260" stroke="#8B949E" strokeWidth="1" />
                  <path d="M 90,280 Q 260,350 480,310 T 860,380" />
                  <path d="M 80,390 Q 250,470 470,420 T 840,490" stroke="#8B949E" strokeWidth="1" />
                  <path d="M 70,490 Q 240,560 460,510 T 820,570" />
                </g>
              )}

              {/* 3. DEM Bench Slope Gradient / Shear Risk Zones */}
              {layers.demSlopeGradient && (
                <g className="transition-opacity duration-300">
                  <path 
                    d="M 220,440 Q 310,500 410,480" 
                    stroke="#DA3633" 
                    strokeWidth="3.5" 
                    strokeDasharray="6 3" 
                    fill="none" 
                  />
                  <polygon 
                    points="210,430 320,490 280,520 180,460" 
                    fill="rgba(218,54,51,0.18)" 
                    stroke="#DA3633" 
                    strokeWidth="1" 
                  />
                  <text x="235" y="475" fill="#DA3633" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
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
                    stroke="#1F6FEB" 
                    strokeDasharray="8 4" 
                  />
                  {/* Secondary Haul Ramp West */}
                  <path 
                    d="M 120,120 L 280,240 L 360,360" 
                    stroke="#334155" 
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
                ? 'bg-[#1F6FEB] border-[#1158C7]' 
                : isPiezometer 
                ? 'bg-[#DA3633] border-[#B62324]' 
                : 'bg-[#238636] border-[#1C6A2B]';

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
                  <div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#161B22] border border-[#30363D] rounded shadow-xl whitespace-nowrap z-30 flex-col items-center pointer-events-none">
                    <span className="text-xs font-semibold text-[#E6EDF3]">{wp.pointId}</span>
                    <span className="text-[9px] font-mono text-[#8B949E]">
                      {wp.estimatedGradeMn > 0 ? `${wp.estimatedGradeMn}% Mn` : wp.operationalClass}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hidden File Input for Site Image Upload */}
        <input 
          type="file"
          ref={fileInputRef}
          accept="image/*,.tif,.tiff"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 2. TOP-LEFT ACTION CONTROLS */}
        <div className="absolute top-3 left-3 z-30 flex items-center space-x-2">
          {/* Add Waypoint Button */}
          <button
            onClick={() => setIsCrosshairDropMode(!isCrosshairDropMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all cursor-pointer shadow-lg ${
              isCrosshairDropMode 
                ? 'bg-[#D97706] text-zinc-950 border-[#B45309] font-semibold' 
                : 'bg-[#161B22] text-[#E6EDF3] border-[#30363D] hover:bg-[#21262D]'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{isCrosshairDropMode ? 'CLICK ON PIT TO LOG' : 'LOG OPERATIONAL COORDINATE'}</span>
          </button>

          {/* Upload Custom Site Raster Button */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload custom pit orthomosaic, drone raster, or satellite imagery"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all cursor-pointer shadow-lg ${
                customSiteImage
                  ? 'bg-[#21262D] text-[#D97706] border-[#D97706]'
                  : 'bg-[#161B22] text-[#E6EDF3] border-[#30363D] hover:bg-[#21262D]'
              }`}
            >
              {customSiteImage ? (
                <ImageIcon className="w-3.5 h-3.5 text-[#D97706]" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-[#8B949E]" />
              )}
              <span>{customImageName ? `RASTER: ${customImageName.slice(0, 16)}...` : 'UPLOAD SITE RASTER'}</span>
            </button>

            {customSiteImage && (
              <button
                onClick={handleResetToDefaultImage}
                title="Reset to default Sector 4B Pit Basemap"
                className="px-2 py-1.5 rounded border border-[#30363D] bg-[#161B22] hover:bg-[#21262D] text-[#8B949E] hover:text-[#E6EDF3] text-xs transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Class Filter Dropdown */}
          <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded px-2 py-1 text-xs">
            <Filter className="w-3 h-3 text-[#6E7681] mr-1.5" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent text-xs text-[#E6EDF3] border-none outline-none cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-[#161B22]">ALL OPERATIONAL CLASSES</option>
              <option value="Controlled Pre-Split Blast" className="bg-[#161B22]">PRE-SPLIT BLAST</option>
              <option value="Grade Verification Borehole" className="bg-[#161B22]">GRADE BOREHOLE</option>
              <option value="Geotechnical Piezometer" className="bg-[#161B22]">PIEZOMETER ARRAY</option>
              <option value="Haul Ramp Maintenance" className="bg-[#161B22]">HAUL RAMP MAINTENANCE</option>
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
                isLayerMenuOpen ? 'bg-[#21262D] text-[#E6EDF3] border-[#D97706]' : 'bg-[#161B22] text-[#8B949E] border-[#30363D] hover:text-[#E6EDF3]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>LAYERS</span>
            </button>

            {/* Layer Toggles Popover */}
            {isLayerMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-[#161B22] border border-[#30363D] rounded-md shadow-2xl p-2.5 space-y-2 z-40 text-xs font-sans">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6E7681] pb-1 border-b border-[#30363D]">
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
          <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded overflow-hidden shadow-lg">
            <button
              onClick={() => setZoom(z => Math.min(3.5, z * 1.2))}
              className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-[#30363D]" />
            <button
              onClick={() => setZoom(z => Math.max(0.65, z * 0.8))}
              className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-[#30363D]" />
            <button
              onClick={resetView}
              className="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. BOTTOM-LEFT: Industrial Metric Scale Bar & Compass Rose */}
        <div className="absolute bottom-3 left-3 z-30 flex items-end space-x-3 pointer-events-none">
          {/* Compass Rose */}
          <div className="w-9 h-9 rounded bg-[#161B22]/90 border border-[#30363D] flex flex-col items-center justify-center font-mono text-[9px] text-[#8B949E]">
            <span className="font-bold text-[#D97706]">N</span>
            <span className="text-[7px] text-[#6E7681]">000°</span>
          </div>

          {/* Metric Scale Bar */}
          <div className="bg-[#161B22]/90 border border-[#30363D] px-2.5 py-1.5 rounded flex flex-col space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-[#8B949E] w-36">
              <span>0</span>
              <span>100m</span>
              <span>250m</span>
              <span>500m</span>
            </div>
            <div className="w-36 h-1.5 border border-[#30363D] flex">
              <div className="w-1/4 h-full bg-[#E6EDF3]" />
              <div className="w-1/4 h-full bg-[#30363D]" />
              <div className="w-1/2 h-full bg-[#E6EDF3]" />
            </div>
            <span className="text-[8px] font-mono text-[#6E7681] text-center">GSD: 0.10M / PIXEL</span>
          </div>
        </div>

        {/* 5. BOTTOM-RIGHT: Real-Time Cursor HUD */}
        <div className="absolute bottom-3 right-3 z-30 pointer-events-none">
          <div className="bg-[#161B22]/95 border border-[#30363D] px-3 py-1.5 rounded shadow-xl flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#1F6FEB]">{cursorHud.lat}</span>
            <span className="text-[#6E7681]">,</span>
            <span className="text-[#1F6FEB]">{cursorHud.lon}</span>
            <span className="text-[#30363D]">|</span>
            <span className="text-[#8B949E]">{cursorHud.utm}</span>
            <span className="text-[#30363D]">|</span>
            <span className="text-[#D97706] font-medium">{cursorHud.elevation}</span>
          </div>
        </div>
      </div>

      {/* 6. RIGHT-HAND WAYPOINT INSPECTOR DRAWER */}
      {selectedWaypoint && (
        <div className="w-80 h-full bg-[#161B22] border-l border-[#30363D] flex flex-col z-40 p-4 font-sans text-xs space-y-3 flex-shrink-0 animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#30363D]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#D97706]" />
              <div>
                <h3 className="font-semibold text-sm text-[#E6EDF3]">{selectedWaypoint.pointId}</h3>
                <span className="text-[10px] font-mono text-[#6E7681]">{selectedWaypoint.coordinates.utm}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedWaypoint(null)}
              className="text-[#8B949E] hover:text-[#E6EDF3] p-1 rounded hover:bg-[#21262D] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {/* Class */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">OPERATIONAL CLASS</label>
              <select
                value={selectedWaypoint.operationalClass}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, operationalClass: e.target.value as OperationalClass };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
              >
                <option value="Controlled Pre-Split Blast">Controlled Pre-Split Blast</option>
                <option value="Grade Verification Borehole">Grade Verification Borehole</option>
                <option value="Geotechnical Piezometer">Geotechnical Piezometer</option>
                <option value="Haul Ramp Maintenance">Haul Ramp Maintenance</option>
              </select>
            </div>

            {/* Estimated Mn Grade */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">ESTIMATED GRADE (% Mn)</label>
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
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs font-mono text-[#E6EDF3] outline-none"
              />
            </div>

            {/* Shift Assignment */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">SHIFT ASSIGNMENT</label>
              <select
                value={selectedWaypoint.shift}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, shift: e.target.value as ShiftAssignment };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
              >
                <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
              </select>
            </div>

            {/* Assigned Rig / Fleet */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">ASSIGNED RIG / FLEET UNIT</label>
              <input 
                type="text"
                value={selectedWaypoint.assignedRigOrFleet}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, assignedRigOrFleet: e.target.value };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
                placeholder="e.g. Rig DRILL-04"
              />
            </div>

            {/* Field Remarks */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">FIELD REMARKS & LOG</label>
              <textarea
                rows={3}
                value={selectedWaypoint.fieldRemarks}
                onChange={(e) => {
                  const updated = { ...selectedWaypoint, fieldRemarks: e.target.value };
                  setSelectedWaypoint(updated);
                  onUpdateWaypoint(updated);
                }}
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none resize-none"
              />
            </div>

            {/* Status Button Toggle */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">DISPATCH STATUS</label>
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
                    ? 'bg-[#238636]/15 text-[#3FB950] border-[#238636]/40'
                    : selectedWaypoint.status === 'IN PROGRESS'
                    ? 'bg-[#B08800]/15 text-[#D29922] border-[#B08800]/40'
                    : 'bg-[#21262D] text-[#8B949E] border-[#30363D]'
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
          <div className="pt-2 border-t border-[#30363D]">
            <button
              onClick={() => {
                onDeleteWaypoint(selectedWaypoint.id);
                setSelectedWaypoint(null);
              }}
              className="w-full py-1.5 rounded bg-[#21262D] hover:bg-[#DA3633]/20 border border-[#30363D] hover:border-[#DA3633] text-[#8B949E] hover:text-[#DA3633] text-xs font-mono transition-colors flex items-center justify-center space-x-1 cursor-pointer"
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
