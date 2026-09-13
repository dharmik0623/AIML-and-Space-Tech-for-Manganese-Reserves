import { 
  ChevronRight, 
  ChevronLeft, 
  BarChart2, 
  Layers, 
  TrendingDown, 
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { SPECTRAL_CURVE_DATA } from '../mockData';
import type { HotspotAnomaly } from '../types';

interface AnalysisDrawerProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  selectedHotspot: HotspotAnomaly | null;
}

export const AnalysisDrawer: React.FC<AnalysisDrawerProps> = ({
  isOpen,
  onToggleOpen,
  selectedHotspot
}) => {
  return (
    <div 
      className={`fixed top-14 right-0 bottom-9 z-30 transition-all duration-300 flex ${
        isOpen ? 'w-88' : 'w-10'
      }`}
    >
      {/* Collapse Toggle Handle */}
      <button
        onClick={onToggleOpen}
        className="w-10 h-16 self-center -ml-5 bg-slate-900/95 hover:bg-slate-800 border border-slate-700/80 rounded-l-xl flex items-center justify-center text-slate-300 hover:text-amber-400 shadow-2xl backdrop-blur-xl cursor-pointer transition-colors z-40"
        title={isOpen ? 'Collapse Analysis Drawer' : 'Expand Analysis Drawer'}
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Drawer Body */}
      {isOpen && (
        <div className="w-full h-full tactical-glass border-l border-slate-800/80 p-3.5 overflow-y-auto flex flex-col space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-xs font-mono tracking-wider uppercase text-slate-200">
                Spectrochemical Analysis
              </h3>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">
              SWIR 2.4 μm
            </span>
          </div>

          {/* 1. MINERAL EXPLORATION LEGEND */}
          <div className="space-y-2 bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
            <h4 className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Exploration Classification Legend
            </h4>
            
            <div className="space-y-1.5 font-mono text-xs">
              {/* Rust/Amber */}
              <div className="flex items-start space-x-2.5 p-1 rounded hover:bg-slate-800/40">
                <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-amber-500 to-orange-700 flex-shrink-0 mt-0.5 shadow-sm shadow-amber-500/50" />
                <div>
                  <div className="font-semibold text-amber-300 text-[11px]">Rust / Amber</div>
                  <div className="text-[10px] text-slate-400">Primary Mn Mineralization (Pyrolusite/Rhodochrosite)</div>
                </div>
              </div>

              {/* Copper/Gold */}
              <div className="flex items-start space-x-2.5 p-1 rounded hover:bg-slate-800/40">
                <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-yellow-500 to-amber-600 flex-shrink-0 mt-0.5 shadow-sm shadow-yellow-500/50" />
                <div>
                  <div className="font-semibold text-yellow-300 text-[11px]">Copper / Gold</div>
                  <div className="text-[10px] text-slate-400">Hydrothermal Alteration Halos (Clay &amp; Gossan)</div>
                </div>
              </div>

              {/* Charcoal/Dark Slate */}
              <div className="flex items-start space-x-2.5 p-1 rounded hover:bg-slate-800/40">
                <span className="w-3.5 h-3.5 rounded-sm bg-slate-700 border border-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-300 text-[11px]">Charcoal / Dark Slate</div>
                  <div className="text-[10px] text-slate-400">Surrounding Host Rock &amp; Barren Overburden</div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI DETECTION CONFIDENCE GRADIENT BAR */}
          <div className="space-y-1.5 bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 font-mono">
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase font-bold text-slate-400 tracking-wider">AI Prospectivity Score</span>
              <span className="text-cyan-400 font-bold">0.0 → 1.0 MPI</span>
            </div>

            {/* Gradient Bar */}
            <div className="relative h-4 w-full rounded-md overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-yellow-600 to-amber-500" />
              {/* Tick Markers */}
              <div className="absolute inset-0 flex justify-between px-1 text-[8px] font-bold text-slate-950 items-center select-none">
                <span>0.0</span>
                <span>0.3</span>
                <span>0.6</span>
                <span>0.8</span>
                <span>1.0</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
              <span>Barren Country</span>
              <span className="text-amber-400 font-bold">High-Grade Ore Trap</span>
            </div>
          </div>

          {/* 3. MINI SPECTRAL CURVE CHART (Recharts) */}
          <div className="space-y-1 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/80 font-mono">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase font-bold text-slate-300">
                Spectral Absorption Curve
              </span>
              <span className="text-[10px] text-amber-400 flex items-center gap-1 font-bold">
                <TrendingDown className="w-3 h-3" /> Mn Dip @ 2260nm
              </span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight mb-2">
              Characteristic SWIR absorption dip in Pyrolusite vs. Iron-Oxide background.
            </div>

            {/* Recharts Line Chart */}
            <div className="w-full h-44 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SPECTRAL_CURVE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="wavelength" 
                    stroke="#64748b" 
                    tick={{ fontSize: 9, fill: '#94a3b8' }} 
                    unit="nm"
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 9, fill: '#94a3b8' }} 
                    domain={[0, 0.6]} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderColor: '#334155', 
                      borderRadius: '8px', 
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                  {/* Reference line marking diagnostic Mn dip at 2260nm */}
                  <ReferenceLine x={2260} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Mn Dip', fill: '#f59e0b', fontSize: 9 }} />
                  <Line 
                    type="monotone" 
                    dataKey="mnReflectance" 
                    name="Manganese Signature" 
                    stroke="#f59e0b" 
                    strokeWidth={2.5} 
                    dot={{ r: 2, fill: '#f59e0b' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hostReflectance" 
                    name="Iron-Oxide Host" 
                    stroke="#64748b" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 2" 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. EXPLORATION CAPITAL SAVINGS (Hackathon ROI Card) */}
          <div className="tactical-glass p-3 rounded-xl border border-emerald-500/40 font-mono space-y-1.5">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Exploration ROI
              </span>
              <span>₹42.8 Lakhs Saved</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Targeted satellite band vectoring eliminated <strong className="text-emerald-400">14 speculative boreholes</strong> at ₹3,800/m diamond-core cost.
            </p>
          </div>

          {/* 5. CURRENT TARGET SUMMARY (If selected) */}
          {selectedHotspot && (
            <div className="bg-amber-950/30 border border-amber-500/50 p-3 rounded-xl font-mono text-xs space-y-1">
              <div className="text-amber-400 font-bold flex items-center justify-between">
                <span>ACTIVE INSPECTOR:</span>
                <span>{selectedHotspot.targetId}</span>
              </div>
              <div className="text-slate-300 text-[11px]">{selectedHotspot.lithology}</div>
              <div className="text-[10px] text-slate-400 pt-1">
                Rec: {selectedHotspot.recommendedBorehole}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
