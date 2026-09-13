import React, { useState } from 'react';
import { X, Save, Crosshair } from 'lucide-react';
import type { 
  OperationalWaypoint, 
  OperationalClass, 
  ShiftAssignment 
} from '../types';

interface WaypointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (waypoint: OperationalWaypoint) => void;
  initialCoords?: {
    lat: number;
    lon: number;
    utm: string;
    rl: number;
    canvasX: number;
    canvasY: number;
  };
}

export const WaypointModal: React.FC<WaypointModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCoords
}) => {
  const [pointId, setPointId] = useState(`MN-WP-${Math.floor(406 + Math.random() * 40)}`);
  const [operationalClass, setOperationalClass] = useState<OperationalClass>('Controlled Pre-Split Blast');
  const [estimatedGradeMn, setEstimatedGradeMn] = useState(42.5);
  const [assignedRigOrFleet, setAssignedRigOrFleet] = useState('Rig DRILL-04 (Atlas Copco)');
  const [shift, setShift] = useState<ShiftAssignment>('Shift A (06:00 - 14:00)');
  const [fieldRemarks, setFieldRemarks] = useState('Pre-split blast pattern logged on Bench 3 North wall.');

  if (!isOpen) return null;

  const lat = initialCoords?.lat ?? 21.9042;
  const lon = initialCoords?.lon ?? 85.3468;
  const utm = initialCoords?.utm ?? '45Q UC 85420 21910';
  const elevationRl = initialCoords?.rl ?? 375.0;
  const canvasX = initialCoords?.canvasX ?? 45.0;
  const canvasY = initialCoords?.canvasY ?? 35.0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newWaypoint: OperationalWaypoint = {
      id: `wp-${Date.now()}`,
      pointId: pointId.trim() || `MN-WP-${Date.now().toString().slice(-3)}`,
      coordinates: {
        lat,
        lon,
        latDms: `${lat.toFixed(4)}° N`,
        lonDms: `${lon.toFixed(4)}° E`,
        utm
      },
      elevationRl,
      operationalClass,
      estimatedGradeMn: operationalClass === 'Geotechnical Piezometer' || operationalClass === 'Haul Ramp Maintenance' ? 0.0 : estimatedGradeMn,
      assignedRigOrFleet: assignedRigOrFleet.trim() || 'UNASSIGNED',
      shift,
      status: 'LOGGED',
      fieldRemarks: fieldRemarks.trim() || 'Standard operational coordinate registered.',
      canvasX,
      canvasY,
      timestampIso: new Date().toISOString()
    };

    onSave(newWaypoint);
    onClose();
  };  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1117]/85 backdrop-blur-sm select-none p-4">
      <div className="w-full max-w-lg bg-[#161B22] border border-[#30363D] rounded-lg shadow-2xl p-5 space-y-4 font-sans text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#30363D]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded bg-[#21262D] border border-[#30363D] text-[#D97706]">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#E6EDF3]">Log Operational Coordinate</h3>
              <p className="text-[11px] font-mono text-[#6E7681]">WGS 84 / UTM Zone 45N Dispatch Ingestion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B949E] hover:text-[#E6EDF3] p-1 rounded hover:bg-[#21262D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Readonly Coordinate Preview */}
          <div className="bg-[#21262D] border border-[#30363D] p-2.5 rounded font-mono text-[11px] space-y-1 text-[#8B949E]">
            <div className="flex justify-between">
              <span className="text-[#6E7681]">GEOGRAPHIC:</span>
              <span className="text-[#1F6FEB] font-medium">{lat.toFixed(5)}° N, {lon.toFixed(5)}° E</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E7681]">PROJECTION UTM:</span>
              <span className="text-[#E6EDF3]">{utm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E7681]">PIT ELEVATION:</span>
              <span className="text-[#D97706] font-medium">{elevationRl}m RL</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Point ID */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">POINT ID</label>
              <input
                type="text"
                value={pointId}
                onChange={(e) => setPointId(e.target.value)}
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs font-mono text-[#E6EDF3] outline-none"
                required
              />
            </div>

            {/* Operational Class */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">OPERATIONAL CLASS</label>
              <select
                value={operationalClass}
                onChange={(e) => setOperationalClass(e.target.value as OperationalClass)}
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
              >
                <option value="Controlled Pre-Split Blast">Controlled Pre-Split Blast</option>
                <option value="Grade Verification Borehole">Grade Verification Borehole</option>
                <option value="Geotechnical Piezometer">Geotechnical Piezometer</option>
                <option value="Haul Ramp Maintenance">Haul Ramp Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Est Grade */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">EST. Mn GRADE (%)</label>
              <input 
                type="number"
                step="0.1"
                min="0"
                max="65"
                disabled={operationalClass === 'Geotechnical Piezometer' || operationalClass === 'Haul Ramp Maintenance'}
                value={operationalClass === 'Geotechnical Piezometer' || operationalClass === 'Haul Ramp Maintenance' ? 0 : estimatedGradeMn}
                onChange={(e) => setEstimatedGradeMn(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs font-mono text-[#E6EDF3] outline-none disabled:opacity-40"
              />
            </div>

            {/* Shift Assignment */}
            <div>
              <label className="block text-[11px] font-mono text-[#8B949E] mb-1">SHIFT ASSIGNMENT</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftAssignment)}
                className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
              >
                <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                <option value="Night Shift (22:00 - 06:00)">Night Shift (22:00 - 06:00)</option>
              </select>
            </div>
          </div>

          {/* Assigned Rig / Fleet */}
          <div>
            <label className="block text-[11px] font-mono text-[#8B949E] mb-1">ASSIGNED RIG / FLEET UNIT</label>
            <input 
              type="text"
              value={assignedRigOrFleet}
              onChange={(e) => setAssignedRigOrFleet(e.target.value)}
              className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none"
              placeholder="e.g. Rig DRILL-04 (Atlas Copco)"
            />
          </div>

          {/* Field Remarks */}
          <div>
            <label className="block text-[11px] font-mono text-[#8B949E] mb-1">FIELD REMARKS</label>
            <textarea
              rows={2}
              value={fieldRemarks}
              onChange={(e) => setFieldRemarks(e.target.value)}
              className="w-full bg-[#21262D] border border-[#30363D] rounded px-2.5 py-1.5 text-xs text-[#E6EDF3] outline-none resize-none"
              placeholder="Operational instructions, geotechnical precautions, or ore seam notes"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#30363D]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#21262D] hover:bg-[#282E37] border border-[#30363D] text-[#8B949E] text-xs font-mono transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#D97706] hover:bg-[#B45309] text-black text-xs font-mono font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>COMMIT TO LEDGER</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
