import { useState, useEffect } from 'react';
import { 
  Satellite, 
  Download, 
  Activity, 
  ChevronDown, 
  Globe2, 
  Sparkles
} from 'lucide-react';
import type { BeltSector } from '../types';
import { BELT_SECTORS } from '../mockData';

interface TopNavBarProps {
  currentSector: BeltSector;
  onSelectSector: (sector: BeltSector) => void;
  onOpenExport: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentSector,
  onSelectSector,
  onOpenExport,
}) => {
  const [latency, setLatency] = useState(34);
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);

  // Subtle live jitter on latency counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(31, Math.min(38, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 w-full bg-slate-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between z-40 relative backdrop-blur-md">
      {/* LEFT: Branding & Engine Version */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="MnSight Logo" 
              className="w-9 h-9 rounded-full object-contain filter drop-shadow-[0_0_8px_rgba(245,158,11,0.45)]" 
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent font-mono">
                MnSight AI
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                AI Prospecting Engine v2.4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER: Interactive Breadcrumb & Sector Switcher */}
      <div className="relative">
        <button
          onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 transition-all text-xs font-mono text-slate-200 shadow-inner group"
        >
          <Globe2 className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="text-slate-400">Survey:</span>
          <span className="font-semibold text-slate-100">{currentSector.breadcrumb}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sectorDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {sectorDropdownOpen && (
          <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 w-80 bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-2xl p-1.5 z-50 backdrop-blur-xl">
            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
              Select Exploration Sector
            </div>
            {BELT_SECTORS.map((sector) => (
              <button
                key={sector.id}
                onClick={() => {
                  onSelectSector(sector);
                  setSectorDropdownOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded text-xs transition-colors flex flex-col space-y-0.5 ${
                  sector.id === currentSector.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-300 hover:bg-slate-800/70'
                }`}
              >
                <div className="font-semibold">{sector.breadcrumb}</div>
                <div className="text-[10px] text-slate-400">{sector.region}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Satellite Sync, Latency HUD, and Export Button */}
      <div className="flex items-center space-x-3">
        {/* Active Satellite Feed Status */}
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-300">
          <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>Sentinel-2 / Landsat-9 SWIR Stack - Live Synced</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Latency Counter */}
        <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-900/70 border border-slate-800 font-mono text-xs text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">{latency} ms</span>
        </div>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer font-mono"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export GeoTIFF / Shapefile</span>
        </button>
      </div>
    </header>
  );
};
