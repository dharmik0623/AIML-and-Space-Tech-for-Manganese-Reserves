import React from 'react';
import { ShieldCheck, X, CheckCircle2, RotateCcw } from 'lucide-react';
import type { AuditLogEntry } from '../types';

interface SystemAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
  onRollback: () => void;
  canRollback: boolean;
}

export const SystemAuditModal: React.FC<SystemAuditModalProps> = ({
  isOpen,
  onClose,
  logs,
  onRollback,
  canRollback
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/80 backdrop-blur-sm select-none p-4">
      <div className="w-full max-w-2xl bg-[#121722] border border-[#262E3D] rounded-lg shadow-2xl p-5 space-y-4 font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262E3D] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-[#1A202C] text-[#2E7D32] border border-[#262E3D]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#E6EDF3] tracking-wide">
                SYSTEM OPERATIONAL AUDIT &amp; TELEMETRY LEDGER
              </h3>
              <p className="text-[10px] text-[#657386]">
                Concession Boundary Compliance &amp; Dispatch Mutation History
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9DA7B5] hover:text-[#E6EDF3] p-1 rounded hover:bg-[#1A202C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-[#0B0E14] border border-[#262E3D]">
            <span className="text-[9px] text-[#657386] block">COMMITTED EVENTS</span>
            <span className="text-base font-bold text-[#E6EDF3]">{logs.length}</span>
          </div>
          <div className="p-2 rounded bg-[#0B0E14] border border-[#262E3D]">
            <span className="text-[9px] text-[#657386] block">CONCESSION BOUNDARY</span>
            <span className="text-base font-bold text-[#2E7D32]">100% IN-BOUNDS</span>
          </div>
          <div className="p-2 rounded bg-[#0B0E14] border border-[#262E3D]">
            <span className="text-[9px] text-[#657386] block">ROLLBACK STACK</span>
            <span className={`text-base font-bold ${canRollback ? 'text-[#D97706]' : 'text-[#657386]'}`}>
              {canRollback ? 'ACTIVE' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Log Entries */}
        <div className="h-64 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
          {logs.length === 0 ? (
            <div className="text-center text-[#657386] py-12">NO SYSTEM MUTATIONS REGISTERED</div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className="p-2 rounded bg-[#1A202C] border border-[#262E3D] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" />
                    <span className="font-semibold text-[#D97706]">{entry.eventCode}</span>
                    <span className="text-[#E6EDF3]">{entry.pointId}</span>
                  </div>
                  <span className="text-[#657386] text-[10px]">
                    {entry.timestamp.slice(11, 23)} UTC
                  </span>
                </div>
                <div className="text-[#9DA7B5] pl-5">{entry.details}</div>
                {entry.diffPayload && (
                  <div className="text-[10px] text-[#0284C7] bg-[#0B0E14] p-1 rounded border border-[#262E3D] pl-3 truncate">
                    DIFF: {entry.diffPayload}
                  </div>
                )}
                <div className="text-[9px] text-[#657386] pl-5">
                  OPERATOR: {entry.operator}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#262E3D]">
          <button
            onClick={onRollback}
            disabled={!canRollback}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#1A202C] hover:bg-[#232B3B] disabled:opacity-30 disabled:cursor-not-allowed text-[#D97706] border border-[#262E3D] text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TRIGGER ROLLBACK TO PREVIOUS STATE</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#262E3D] hover:bg-[#3B465A] text-[#E6EDF3] font-semibold text-xs transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
