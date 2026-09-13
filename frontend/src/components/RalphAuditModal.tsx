import React from 'react';
import { ShieldCheck, X, CheckCircle2, RotateCcw } from 'lucide-react';
import type { ActivityLogEntry } from '../types';

interface RalphAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLogEntry[];
  onUndoLastAction: () => void;
}

export const RalphAuditModal: React.FC<RalphAuditModalProps> = ({
  isOpen,
  onClose,
  logs,
  onUndoLastAction
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-2xl tactical-panel rounded-2xl border border-emerald-500/60 p-5 shadow-2xl space-y-4 font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 tracking-wider uppercase">
                RALPH LOOP // AUTONOMOUS AUDIT LEDGER (TASKS.JSON)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Continuous state verification &amp; sequential diff tracking engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-slate-100 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">AUTO-VERIFIED ACTIONS</span>
            <span className="text-lg font-bold text-emerald-400 glow-emerald">{logs.length}</span>
          </div>
          <div className="p-2 rounded bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">GATE STATUS</span>
            <span className="text-lg font-bold text-cyan-400 glow-cyan">100% GREEN</span>
          </div>
          <div className="p-2 rounded bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 block uppercase">ROLLBACK CAPABILITY</span>
            <span className="text-lg font-bold text-amber-400 glow-amber">ACTIVE</span>
          </div>
        </div>

        {/* Audit Log Entries List */}
        <div className="h-64 overflow-y-auto space-y-2 pr-1">
          {logs.length === 0 ? (
            <div className="text-center text-zinc-500 py-10">NO STATE MUTATIONS LOGGED YET</div>
          ) : (
            logs.map((entry) => (
              <div 
                key={entry.id}
                className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-amber-400">{entry.actionType}</span>
                    <span className="text-zinc-300 font-semibold">{entry.pinId}</span>
                  </div>
                  <span className="text-zinc-500 text-[10px]">{entry.timestamp.slice(11, 19)} UTC</span>
                </div>
                <div className="text-[11px] text-zinc-300 pl-5">{entry.details}</div>
                {entry.diffPayload && (
                  <div className="text-[10px] font-mono text-cyan-400 pl-5 bg-zinc-950/60 p-1 rounded mt-1 border border-zinc-900 truncate">
                    DIFF: {entry.diffPayload}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <button
            onClick={onUndoLastAction}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TRIGGER ROLLBACK / UNDO LAST ACTION</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
          >
            DISMISS AUDITOR
          </button>
        </div>
      </div>
    </div>
  );
};
