import React, { useState, useEffect } from 'react';
import { Satellite, ShieldCheck, Activity, Compass } from 'lucide-react';

interface TopCommandBarProps {
  auditVerificationCount: number;
  ralphVerificationCount?: number;
  onOpenAuditLog: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  auditVerificationCount,
  ralphVerificationCount,
  onOpenAuditLog,
}) => {
  const count = auditVerificationCount ?? ralphVerificationCount ?? 0;
  const [latency, setLatency] = useState(28);

  // Live latency fluctuation around 28 ms
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(prev => Math.max(26, Math.min(31, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 w-full bg-zinc-950/95 border-b border-zinc-800/90 px-4 flex items-center justify-between z-40 relative backdrop-blur-xl select-none">
      {/* LEFT: Branding */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center">
          <img 
            src="/logo.jpeg" 
            alt="MnSight Logo" 
            className="w-8 h-8 rounded-full border border-amber-500/50 object-cover shadow-lg shadow-amber-500/30"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-wider text-slate-100 uppercase flex items-center gap-1.5">
              <span className="text-amber-400 glow-amber">MNSIGHT</span>
              <span className="text-zinc-500">//</span>
              <span className="text-cyan-400 glow-cyan text-lg">TACTICAL MINING INTELLIGENCE &amp; SATELLITE AI</span>
            </h1>
          </div>
        </div>
      </div>

      {/* CENTER: Location & Coordinates Banner */}
      <div className="hidden xl:flex items-center space-x-2 px-3.5 py-1.5 rounded bg-zinc-900/90 border border-zinc-800 shadow-inner">
        <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
        <span className="text-sm tracking-wider text-zinc-300 font-bold">
          SECTOR 4B PIT - ODISHA MANGANESE BELT 
        </span>
        <span className="text-xs tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 font-semibold">
          21°54'12"N, 85°20'45"E
        </span>
      </div>

      {/* RIGHT: Live Telemetry Indicators */}
      <div className="flex items-center space-x-3">
        {/* Satellite Sync */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900/80 border border-zinc-800 text-xs tracking-wider text-zinc-300">
          <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-zinc-200 font-semibold">SENTINEL-2 / LANDSAT-9 SWIR STACK ACTIVE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Latency */}
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-900/80 border border-zinc-800 text-xs tracking-wider">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">{latency} MS</span>
        </div>

        {/* Autonomous Audit Engine Active State */}
        <button
          onClick={onOpenAuditLog}
          className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900/50 text-emerald-400 text-xs tracking-wider transition-all shadow-sm shadow-emerald-500/20 cursor-pointer group"
          title="Click to view Autonomous System Audit & Verification Ledger"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold">AI DISPATCH VERIFIED: LIVE AUDIT</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-extrabold">
            {count}
          </span>
        </button>
      </div>
    </header>
  );
};
