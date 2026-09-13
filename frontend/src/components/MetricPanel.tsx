import { 
  Boxes, 
  Percent, 
  Cpu, 
  TrendingUp, 
  CheckCircle2, 
  Radio, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { BeltSector } from '../types';

interface MetricPanelProps {
  sector: BeltSector;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectMetric?: (metricId: string) => void;
}

export const MetricPanel: React.FC<MetricPanelProps> = ({
  sector,
  isCollapsed,
  onToggleCollapse,
}) => {
  if (isCollapsed) {
    return (
      <div className="absolute top-18 left-3 z-30">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg bg-slate-900/90 border border-slate-700/70 text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-all shadow-xl backdrop-blur-md cursor-pointer"
          title="Expand Quick-Metric Panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-18 left-3 z-30 w-76 flex flex-col space-y-2.5 transition-all">
      {/* Header bar with collapse button */}
      <div className="flex items-center justify-between px-2.5 py-1 bg-slate-900/85 backdrop-blur-md rounded-lg border border-slate-800/80 shadow-md">
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          AI Exploration HUD
        </span>
        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CARD 1: Estimated Reserves */}
      <div className="tactical-glass tactical-card-amber p-3.5 rounded-xl transition-transform hover:scale-[1.01] hover:border-amber-500/50 group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Estimated Reserves</span>
          <Boxes className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-mono text-slate-100 glow-amber">
            {sector.reservesMt.toFixed(2)}
          </span>
          <span className="text-sm font-semibold text-amber-400 font-mono">Mt (Metric Tons)</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-1.5">
          <span>Proven & Inferred Lode</span>
          <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
            <TrendingUp className="w-3 h-3" /> +8.4% vs seismic
          </span>
        </div>
      </div>

      {/* CARD 2: High-Grade Probability Area */}
      <div className="tactical-glass tactical-card-emerald p-3.5 rounded-xl transition-transform hover:scale-[1.01] hover:border-emerald-500/50 group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">High-Grade Prob. Area</span>
          <Percent className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-mono text-slate-100 glow-emerald">
            {sector.highGradeProbPct.toFixed(1)}%
          </span>
          <span className="text-xs font-mono text-emerald-400/90 font-medium">(2.14 sq km)</span>
        </div>
        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-800/90 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
            style={{ width: `${sector.highGradeProbPct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Cutoff: &gt;40% Mn Grade</span>
          <span className="text-emerald-300 font-bold">Low Gangue</span>
        </div>
      </div>

      {/* CARD 3: Model Classification Confidence */}
      <div className="tactical-glass tactical-card-cyan p-3.5 rounded-xl transition-transform hover:scale-[1.01] hover:border-cyan-500/50 group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Model Confidence</span>
          <Cpu className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-mono text-slate-100 glow-cyan">
            {sector.confidencePct.toFixed(1)}%
          </span>
          <span className="text-xs font-mono text-cyan-400 font-medium">Random Forest + XGB</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-1.5">
          <span className="flex items-center gap-1 text-slate-300">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> F1-Score: 0.941
          </span>
          <span className="text-slate-400">Validated Ground Truth</span>
        </div>
      </div>

      {/* CARD 4: Dominant Mineral Signature */}
      <div className="tactical-glass tactical-card-purple p-3.5 rounded-xl transition-transform hover:scale-[1.01] hover:border-purple-500/50 group">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold">Dominant Mineral</span>
          <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-base font-bold font-mono text-purple-200">
          Pyrolusite & Psilomelane
        </div>
        <div className="mt-1 text-xs font-mono text-amber-300 flex items-center justify-between bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30">
          <span>SWIR Band 11/12 ratio:</span>
          <span className="font-bold text-amber-400">{sector.swirRatio.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
          <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">Pyrolusite 64%</span>
          <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">Braunite 22%</span>
          <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">Psilomelane 14%</span>
        </div>
      </div>
    </div>
  );
};
