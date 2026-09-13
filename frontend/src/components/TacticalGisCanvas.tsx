import React, { useState, useRef, type MouseEvent, type WheelEvent } from 'react';
import { 
  MapPin, 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  PlusCircle, 
  Filter, 
  Compass,
  X,
  Save,
  Trash2,
  Undo2
} from 'lucide-react';
import type { 
  TacticalPin, 
  TacticalPinCategory, 
  ShiftType, 
  VerificationStatus,
  DateFilterType 
} from '../types';

interface TacticalGisCanvasProps {
  pins: TacticalPin[];
  onAddPin: (pin: TacticalPin) => void;
  onUpdatePin: (pin: TacticalPin) => void;
  onDeletePin: (pinId: string) => void;
  onUndoLastAction: () => void;
  canUndo: boolean;
  activeFilter: DateFilterType;
  onSetFilter: (filter: DateFilterType) => void;
  isAddPinMode: boolean;
  onToggleAddPinMode: () => void;
}

export const TacticalGisCanvas: React.FC<TacticalGisCanvasProps> = ({
  pins,
  onAddPin,
  onUpdatePin,
  onDeletePin,
  onUndoLastAction,
  canUndo,
  activeFilter,
  onSetFilter,
  isAddPinMode,
  onToggleAddPinMode
}) => {
  // Pan and Zoom Transformation States
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Selected Pin for Editing / Inspection
  const [selectedPin, setSelectedPin] = useState<TacticalPin | null>(null);

  // Edit form states for selected pin
  const [editCategory, setEditCategory] = useState<TacticalPinCategory>('EXTRACTION');
  const [editGrade, setEditGrade] = useState<number>(42.0);
  const [editShift, setEditShift] = useState<ShiftType>('MORNING SHIFT');
  const [editStatus, setEditStatus] = useState<VerificationStatus>('PENDING');
  const [editUnit, setEditUnit] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Hover coordinate tracker HUD
  const [cursorCoords, setCursorCoords] = useState({
    lat: 21.9033,
    lon: 85.3458,
    latDms: '21°54\'12.0" N',
    lonDms: '85°20\'45.0" E',
    elev: 312,
    mgrs: '44Q NV 35712 22591'
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Mouse wheel zoom handler
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom(prev => Math.min(4.0, Math.max(0.75, prev * zoomFactor)));
  };

  // Drag pan handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
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

    // Dynamic coordinate calculation based on cursor over orthomosaic
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width;
      const yRel = (e.clientY - rect.top) / rect.height;

      const lat = 21.9080 - yRel * 0.015;
      const lon = 85.3380 + xRel * 0.020;
      const elev = Math.round(420 - yRel * 110 + Math.sin(xRel * 8) * 12);

      setCursorCoords({
        lat: parseFloat(lat.toFixed(4)),
        lon: parseFloat(lon.toFixed(4)),
        latDms: `21°54'${(35 - yRel * 50).toFixed(1)}" N`,
        lonDms: `85°20'${(20 + xRel * 60).toFixed(1)}" E`,
        elev,
        mgrs: `44Q NV ${Math.round(35000 + xRel * 1000)} ${Math.round(22000 + yRel * 1000)}`
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Click on map to add pin if Add Pin Mode is active
  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!isAddPinMode) return;
    if (isDragging) return;

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const xPercent = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

      const newPin: TacticalPin = {
        id: `pin-${Date.now()}`,
        pinId: `PIN-EXT-${Math.floor(100 + Math.random() * 900)}`,
        coordinates: {
          lat: cursorCoords.lat,
          lon: cursorCoords.lon,
          latDms: cursorCoords.latDms,
          lonDms: cursorCoords.lonDms
        },
        elevationM: cursorCoords.elev,
        category: 'EXTRACTION',
        predictedGradeMn: 41.5,
        date: new Date().toISOString().slice(0, 10),
        shift: 'MORNING SHIFT',
        status: 'PENDING',
        assignedUnit: 'EX-01 (CAT 6040)',
        notes: `Tactical operational point marked via map HUD. Elevation ${cursorCoords.elev}m RL.`,
        canvasX: parseFloat(xPercent.toFixed(1)),
        canvasY: parseFloat(yPercent.toFixed(1)),
        createdAt: new Date().toISOString()
      };

      onAddPin(newPin);
      setSelectedPin(newPin);
      populateEditForm(newPin);
      onToggleAddPinMode(); // Exit add pin mode
    }
  };

  const populateEditForm = (pin: TacticalPin) => {
    setEditCategory(pin.category);
    setEditGrade(pin.predictedGradeMn);
    setEditShift(pin.shift);
    setEditStatus(pin.status);
    setEditUnit(pin.assignedUnit);
    setEditNotes(pin.notes);
  };

  const handleSelectPin = (pin: TacticalPin) => {
    setSelectedPin(pin);
    populateEditForm(pin);
  };

  const handleSavePinEdits = () => {
    if (!selectedPin) return;
    const updated: TacticalPin = {
      ...selectedPin,
      category: editCategory,
      predictedGradeMn: editGrade,
      shift: editShift,
      status: editStatus,
      assignedUnit: editUnit,
      notes: editNotes
    };
    onUpdatePin(updated);
    setSelectedPin(null);
  };

  // Filter pins based on activeFilter
  const filteredPins = pins.filter(pin => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'TODAY') return pin.date === '2026-09-13';
    if (activeFilter === 'DAY +5 FORECAST TARGET') return pin.date === '2026-09-18';
    if (activeFilter === 'PAST 7 DAYS') return true;
    return true;
  });

  return (
    <div 
      ref={canvasRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleMapClick}
      className={`relative w-full h-[58vh] bg-zinc-950 overflow-hidden select-none border-b border-zinc-800/90 ${
        isAddPinMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* 1. TOP-LEFT CONTROLS: ADD PIN BUTTON, FILTER TABS & UNDO */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2">
        {/* Add Tactical Pin Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleAddPinMode();
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs tracking-wider font-bold transition-all shadow-lg cursor-pointer ${
            isAddPinMode 
              ? 'bg-amber-500 text-zinc-950 ring-2 ring-amber-300 animate-pulse' 
              : 'bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 border border-amber-500/50'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isAddPinMode ? 'CLICK MAP TO DROP PIN' : 'ADD TACTICAL PIN'}</span>
        </button>

        {/* Undo Rollback Button */}
        {canUndo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUndoLastAction();
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-700 text-xs tracking-wider transition-colors cursor-pointer"
            title="Rollback last coordination change (Undo)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>UNDO</span>
          </button>
        )}

        {/* Date Filter Tabs */}
        <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded p-0.5 text-[11px] tracking-wider">
          <Filter className="w-3 h-3 text-zinc-500 ml-1.5 mr-1" />
          {(['ALL', 'TODAY', 'DAY +5 FORECAST TARGET', 'PAST 7 DAYS'] as DateFilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={(e) => {
                e.stopPropagation();
                onSetFilter(filter);
              }}
              className={`px-2 py-1 rounded transition-colors cursor-pointer font-bold ${
                activeFilter === filter
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TOP-RIGHT MAP CONTROLS (Zoom, Reset) */}
      <div className="absolute top-3 right-3 z-30 flex flex-col space-y-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(prev => Math.min(4.0, prev * 1.2));
          }}
          className="p-2 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-cyan-400 shadow-lg cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(prev => Math.max(0.75, prev * 0.8));
          }}
          className="p-2 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-cyan-400 shadow-lg cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-2 rounded bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-amber-400 shadow-lg cursor-pointer"
          title="Reset Orthomosaic"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3. CENTER ORTHOMOSAIC CANVAS */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        <div className="relative w-[1400px] h-[780px] flex-shrink-0 shadow-2xl">
          {/* SATELLITE ORTHOMOSAIC IMAGE */}
          <img 
            src="/front_end_mg.png" 
            alt="Mining Pit Orthomosaic"
            className="w-full h-full object-cover select-none pointer-events-none contrast-125 brightness-95"
          />

          {/* FALSE-COLOR MINERALIZATION CONTOURS (Amber/Rust) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-75" viewBox="0 0 1400 780">
            <defs>
              <radialGradient id="oreHalo1" cx="35%" cy="32%" r="22%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="oreHalo2" cx="50%" cy="52%" r="26%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#b45309" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#451a03" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="480" cy="240" r="190" fill="url(#oreHalo1)" filter="blur(18px)" />
            <circle cx="680" cy="400" r="230" fill="url(#oreHalo2)" filter="blur(22px)" />
          </svg>

          {/* TACTICAL DROPPED PINS LAYER */}
          {filteredPins.map((pin) => {
            const isSelected = selectedPin?.id === pin.id;
            const isExtraction = pin.category === 'EXTRACTION';
            const isAssay = pin.category === 'ASSAY SAMPLE';
            const isSlope = pin.category === 'SLOPE RISK';

            const pinColor = isExtraction 
              ? '#f59e0b' // Amber
              : isAssay 
              ? '#06b6d4' // Cyan
              : isSlope 
              ? '#ef4444' // Crimson
              : '#10b981'; // Emerald

            return (
              <div
                key={pin.id}
                style={{
                  left: `${pin.canvasX}%`,
                  top: `${pin.canvasY}%`,
                  transform: 'translate(-50%, -100%)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPin(pin);
                }}
                className="absolute z-25 flex flex-col items-center cursor-pointer group"
              >
                {/* Tactical Badge on Pin */}
                <div 
                  className={`px-2 py-0.5 rounded text-[10px] tracking-wider font-bold shadow-xl border flex items-center space-x-1 transition-all ${
                    isSelected 
                      ? 'scale-125 ring-2 ring-white text-zinc-950 font-extrabold' 
                      : 'hover:scale-110 text-slate-100 bg-zinc-950/90'
                  }`}
                  style={{
                    backgroundColor: isSelected ? pinColor : 'rgba(9, 9, 11, 0.9)',
                    borderColor: pinColor
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? '#09090b' : pinColor }} />
                  <span>{pin.pinId}</span>
                  {pin.predictedGradeMn > 0 && (
                    <span className="opacity-90">({pin.predictedGradeMn}% Mn)</span>
                  )}
                </div>

                {/* Pin Pointer Icon */}
                <MapPin 
                  className="w-6 h-6 drop-shadow-md animate-bounce" 
                  style={{ color: pinColor }}
                  fill={isSelected ? pinColor : `${pinColor}44`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. EDITABLE PIN INSPECTOR DRAWER (Opens when a pin is selected) */}
      {selectedPin && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-12 right-12 z-40 w-88 tactical-panel rounded-xl border border-amber-500/60 p-4 shadow-2xl space-y-3 font-mono text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-bold">
                {selectedPin.pinId}
              </span>
              <span className="text-zinc-400 font-bold">TACTICAL PIN INSPECTOR</span>
            </div>
            <button 
              onClick={() => setSelectedPin(null)}
              className="text-zinc-400 hover:text-zinc-100 p-1 rounded hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Coordinate Readout */}
          <div className="bg-zinc-900/90 p-2.5 rounded border border-zinc-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">COORDINATES:</span>
              <span className="text-cyan-400 font-bold">{selectedPin.coordinates.latDms}, {selectedPin.coordinates.lonDms}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-400">ELEVATION:</span>
              <span className="text-amber-400 font-bold">{selectedPin.elevationM} M RL</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">OPERATION CATEGORY</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as TacticalPinCategory)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-slate-100 text-xs font-bold"
              >
                <option value="EXTRACTION">[EXTRACTION] Daily Blast &amp; Extraction Target</option>
                <option value="ASSAY SAMPLE">[ASSAY SAMPLE] Core Drilling &amp; Spectral Point</option>
                <option value="SLOPE RISK">[SLOPE RISK] Geotechnical Crack Monitoring</option>
                <option value="HAUL ROUTE">[HAUL ROUTE] Transport Path Waypoint</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-400 block mb-1 text-[11px]">PREDICTED GRADE (% MN)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editGrade}
                  onChange={(e) => setEditGrade(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-amber-400 font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1 text-[11px]">SHIFT</label>
                <select
                  value={editShift}
                  onChange={(e) => setEditShift(e.target.value as ShiftType)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-slate-100 text-xs font-bold"
                >
                  <option value="MORNING SHIFT">MORNING SHIFT</option>
                  <option value="NIGHT SHIFT">NIGHT SHIFT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">ASSIGNED UNIT / EXCAVATOR ID</label>
              <input
                type="text"
                value={editUnit}
                onChange={(e) => setEditUnit(e.target.value)}
                placeholder="e.g. EX-01 (CAT 6040)"
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-slate-100 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">OPERATIONAL NOTES</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">VERIFICATION STATUS</label>
              <div className="flex space-x-1.5">
                {(['PENDING', 'IN PROGRESS', 'VERIFIED'] as VerificationStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setEditStatus(st)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold border transition-colors ${
                      editStatus === st
                        ? st === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                          : st === 'IN PROGRESS'
                          ? 'bg-amber-950 text-amber-300 border-amber-500'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-500'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <button
              onClick={() => {
                onDeletePin(selectedPin.id);
                setSelectedPin(null);
              }}
              className="flex items-center space-x-1 px-2.5 py-1 text-red-400 hover:text-red-300 rounded border border-red-500/30 hover:bg-red-950/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>DELETE PIN</span>
            </button>
            <button
              onClick={handleSavePinEdits}
              className="flex items-center space-x-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE &amp; VERIFY</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. BOTTOM REAL-TIME COORDINATE HUD */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-zinc-950/95 border-t border-zinc-800 px-4 flex items-center justify-between z-30 font-mono text-xs text-zinc-400 backdrop-blur-md">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-500 uppercase font-bold text-[10px]">DECIMAL:</span>
            <span className="text-cyan-300 font-bold">{cursorCoords.lat}° N, {cursorCoords.lon}° E</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-zinc-500 uppercase font-bold text-[10px]">DMS:</span>
            <span className="text-zinc-200">{cursorCoords.latDms}, {cursorCoords.lonDms}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-500 uppercase font-bold text-[10px]">ELEV:</span>
            <span className="text-amber-400 font-bold">{cursorCoords.elev} M RL</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-zinc-500 uppercase font-bold text-[10px]">MGRS:</span>
            <span className="text-emerald-400 font-bold">{cursorCoords.mgrs}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-zinc-500 uppercase font-bold text-[10px]">PINS ACTIVE:</span>
            <span className="text-amber-400 font-bold">{filteredPins.length}</span>
          </div>
          <div className="flex items-center space-x-1 text-zinc-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-zinc-400">DATUM: WGS-84 UTM 45N</span>
          </div>
        </div>
      </div>
    </div>
  );
};
