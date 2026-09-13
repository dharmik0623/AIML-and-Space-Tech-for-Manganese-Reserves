import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import type { TacticalPin, TacticalPinCategory, ShiftType } from '../types';

interface AddPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPin: (pin: TacticalPin) => void;
}

export const AddPinModal: React.FC<AddPinModalProps> = ({
  isOpen,
  onClose,
  onAddPin
}) => {
  const [lat, setLat] = useState('21.9045');
  const [lon, setLon] = useState('85.3470');
  const [elevation, setElevation] = useState(365);
  const [category, setCategory] = useState<TacticalPinCategory>('EXTRACTION');
  const [grade, setGrade] = useState(43.5);
  const [shift, setShift] = useState<ShiftType>('MORNING SHIFT');
  const [unit, setUnit] = useState('EX-03 (HITACHI EX1200)');
  const [notes, setNotes] = useState('High-grade pyrolusite outcrop exposed along Bench 3 North wall.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat) || 21.9045;
    const lonNum = parseFloat(lon) || 85.3470;

    // Convert to relative canvas percentage around pit center
    const xPercent = Math.max(10, Math.min(90, ((lonNum - 85.3380) / 0.020) * 100));
    const yPercent = Math.max(10, Math.min(90, ((21.9080 - latNum) / 0.015) * 100));

    const newPin: TacticalPin = {
      id: `pin-${Date.now()}`,
      pinId: `PIN-${category.slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      coordinates: {
        lat: latNum,
        lon: lonNum,
        latDms: `${latNum.toFixed(4)}° N`,
        lonDms: `${lonNum.toFixed(4)}° E`
      },
      elevationM: elevation,
      category,
      predictedGradeMn: grade,
      date: new Date().toISOString().slice(0, 10),
      shift,
      status: 'PENDING',
      assignedUnit: unit,
      notes,
      canvasX: parseFloat(xPercent.toFixed(1)),
      canvasY: parseFloat(yPercent.toFixed(1)),
      createdAt: new Date().toISOString()
    };

    onAddPin(newPin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md tactical-panel rounded-2xl border border-amber-500/60 p-5 shadow-2xl space-y-4 font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 tracking-wider uppercase">
              MANUAL COORDINATE PIN INGESTION
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-slate-100 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">LATITUDE (DECIMAL DEG)</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-cyan-300 font-bold text-xs"
                required
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">LONGITUDE (DECIMAL DEG)</label>
              <input
                type="text"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-cyan-300 font-bold text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">ELEVATION (METERS RL)</label>
              <input
                type="number"
                value={elevation}
                onChange={(e) => setElevation(parseInt(e.target.value) || 300)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-amber-300 font-bold text-xs"
                required
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">OPERATION TYPE</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TacticalPinCategory)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-slate-100 font-bold text-xs"
              >
                <option value="EXTRACTION">[EXTRACTION] Daily Blast Target</option>
                <option value="ASSAY SAMPLE">[ASSAY SAMPLE] Core Calibration</option>
                <option value="SLOPE RISK">[SLOPE RISK] Geotech Monitoring</option>
                <option value="HAUL ROUTE">[HAUL ROUTE] Transport Waypoint</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">PREDICTED GRADE (% MN)</label>
              <input
                type="number"
                step="0.1"
                value={grade}
                onChange={(e) => setGrade(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-amber-400 font-bold text-xs"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1 text-[11px]">SHIFT</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftType)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-slate-100 font-bold text-xs"
              >
                <option value="MORNING SHIFT">MORNING SHIFT</option>
                <option value="NIGHT SHIFT">NIGHT SHIFT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 text-[11px]">ASSIGNED EXCAVATOR / FLEET ID</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-slate-100 font-bold text-xs"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1 text-[11px]">OPERATIONAL NOTES</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-slate-100 text-xs"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold tracking-wider"
            >
              RECORD &amp; VERIFY PIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
