import React, { useState } from 'react';
import { 
  Table, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet, 
  MapPin, 
  ShieldCheck
} from 'lucide-react';
import type { TacticalPin, VerificationStatus } from '../types';

interface DailyOperationsTableProps {
  pins: TacticalPin[];
  onUpdatePinStatus: (pinId: string, newStatus: VerificationStatus) => void;
  onExportGeoJson: () => void;
  onExportCsv: () => void;
}

export const DailyOperationsTable: React.FC<DailyOperationsTableProps> = ({
  pins,
  onUpdatePinStatus,
  onExportGeoJson,
  onExportCsv
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full bg-zinc-950/95 border-t border-zinc-800/90 flex flex-col font-mono text-xs select-none">
      {/* 1. TRAY HEADER BAR */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-10 px-4 flex items-center justify-between bg-zinc-900/80 hover:bg-zinc-850 border-b border-zinc-800/80 cursor-pointer transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Table className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold tracking-wider text-slate-100 uppercase">
            DAILY OPERATIONS &amp; COORDINATION LEDGER
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold">
            {pins.length} TARGETS RECORDED
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            RALPH AUDITED
          </span>
        </div>

        {/* Right Actions: Export buttons & Collapse toggle */}
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onExportCsv}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs tracking-wider transition-colors cursor-pointer border border-zinc-700"
            title="Export marked targets as CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">EXPORT CSV</span>
          </button>

          <button
            onClick={onExportGeoJson}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs tracking-wider font-bold transition-colors cursor-pointer"
            title="Export coordinates as GeoJSON layer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT GEOJSON</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-400 hover:text-slate-100 p-1 rounded hover:bg-zinc-800 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. EXPANDED TABLE CONTENT */}
      {isExpanded && (
        <div className="h-44 overflow-y-auto p-2 bg-zinc-950/90">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] tracking-wider text-zinc-400 uppercase bg-zinc-900/60 sticky top-0 z-10">
                <th className="py-1.5 px-3">PIN ID</th>
                <th className="py-1.5 px-3">COORDINATES (LAT/LONG)</th>
                <th className="py-1.5 px-3">ELEVATION</th>
                <th className="py-1.5 px-3">OPERATION TYPE</th>
                <th className="py-1.5 px-3">PREDICTED MN GRADE</th>
                <th className="py-1.5 px-3">DATE &amp; SHIFT</th>
                <th className="py-1.5 px-3">ASSIGNED UNIT</th>
                <th className="py-1.5 px-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-xs">
              {pins.map((pin) => {
                const isExtraction = pin.category === 'EXTRACTION';
                const isAssay = pin.category === 'ASSAY SAMPLE';
                const isSlope = pin.category === 'SLOPE RISK';

                return (
                  <tr key={pin.id} className="hover:bg-zinc-900/50 transition-colors group">
                    {/* PIN ID */}
                    <td className="py-2 px-3 font-bold text-amber-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{pin.pinId}</span>
                    </td>

                    {/* COORDINATES */}
                    <td className="py-2 px-3 text-cyan-400 font-semibold">
                      {pin.coordinates.latDms}, {pin.coordinates.lonDms}
                    </td>

                    {/* ELEVATION */}
                    <td className="py-2 px-3 text-zinc-300 font-bold">
                      {pin.elevationM} M RL
                    </td>

                    {/* OPERATION TYPE */}
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isExtraction 
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50' 
                          : isAssay 
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50' 
                          : isSlope 
                          ? 'bg-red-950/80 text-red-300 border border-red-500/50' 
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                      }`}>
                        {pin.category}
                      </span>
                    </td>

                    {/* PREDICTED MN GRADE */}
                    <td className="py-2 px-3">
                      {pin.predictedGradeMn > 0 ? (
                        <span className="font-bold text-amber-300 glow-amber">
                          {pin.predictedGradeMn.toFixed(1)}% Mn
                        </span>
                      ) : (
                        <span className="text-zinc-600 font-bold">N/A (HAUL)</span>
                      )}
                    </td>

                    {/* DATE & SHIFT */}
                    <td className="py-2 px-3 text-zinc-300">
                      <div className="font-semibold">{pin.date}</div>
                      <div className="text-[10px] text-zinc-500 font-bold">{pin.shift}</div>
                    </td>

                    {/* ASSIGNED UNIT */}
                    <td className="py-2 px-3 text-zinc-300 font-semibold truncate max-w-xs">
                      {pin.assignedUnit || 'UNASSIGNED'}
                    </td>

                    {/* STATUS BUTTON TOGGLE */}
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => {
                          const nextStatus: VerificationStatus = 
                            pin.status === 'PENDING' ? 'IN PROGRESS' :
                            pin.status === 'IN PROGRESS' ? 'VERIFIED' : 'PENDING';
                          onUpdatePinStatus(pin.id, nextStatus);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider cursor-pointer border transition-all ${
                          pin.status === 'VERIFIED'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500 hover:bg-emerald-900'
                            : pin.status === 'IN PROGRESS'
                            ? 'bg-amber-950 text-amber-300 border-amber-500 hover:bg-amber-900'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800'
                        }`}
                        title="Click to cycle status: PENDING -> IN PROGRESS -> VERIFIED"
                      >
                        {pin.status === 'VERIFIED' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : pin.status === 'IN PROGRESS' ? (
                          <Clock className="w-3 h-3 text-amber-400" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-zinc-400" />
                        )}
                        <span>{pin.status}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
