import React, { useState } from 'react';
import { 
  Sparkles, 
  Table, 
  CloudRain, 
  Mountain, 
  Layers, 
  Truck, 
  ChevronRight, 
  Flame, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Target, 
  Crosshair,
  Maximize2,
  Minimize2
} from 'lucide-react';
import type { ForecastDay, TacticalPin, VerificationStatus } from '../types';
import { SEVEN_DAY_FORECAST } from '../data/forecastData';

export type DashboardTab = 'PREDICTIVE_MINE' | 'AI_RECOMMENDATIONS' | 'DAILY_LEDGER';

interface TacticalOperationsTabsProps {
  selectedDay: ForecastDay;
  onSelectDay: (day: ForecastDay) => void;
  onVectorDayTarget: (day: ForecastDay) => void;
  pins: TacticalPin[];
  onUpdatePinStatus: (pinId: string, newStatus: VerificationStatus) => void;
  onExportGeoJson: () => void;
  onExportCsv: () => void;
  activeTab?: DashboardTab;
  onTabChange?: (tab: DashboardTab) => void;
}

export const TacticalOperationsTabs: React.FC<TacticalOperationsTabsProps> = ({
  selectedDay,
  onSelectDay,
  onVectorDayTarget,
  pins,
  onUpdatePinStatus,
  onExportGeoJson,
  onExportCsv,
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<DashboardTab>('PREDICTIVE_MINE');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isExpandedFull, setIsExpandedFull] = useState<boolean>(false);

  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = (tab: DashboardTab) => {
    if (externalOnTabChange) externalOnTabChange(tab);
    setInternalActiveTab(tab);
    if (isCollapsed) setIsCollapsed(false);
  };

  return (
    <div className={`w-full bg-zinc-950/95 border-t border-zinc-800/90 flex flex-col font-sans select-none transition-all duration-300 z-30 shadow-2xl ${
      isCollapsed ? 'h-11' : isExpandedFull ? 'h-[440px]' : 'h-[275px]'
    }`}>
      {/* 1. MASTER TACTICAL TAB HEADER BAR */}
      <div className="h-11 px-3 flex items-center justify-between bg-zinc-900/90 border-b border-zinc-800/80 flex-shrink-0">
        {/* Left: Tab Switcher Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {/* TAB 1: PREDICTIVE BEST TIME TO MINE */}
          <button
            onClick={() => setActiveTab('PREDICTIVE_MINE')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border ${
              activeTab === 'PREDICTIVE_MINE' && !isCollapsed
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-slate-200 hover:bg-zinc-800'
            }`}
          >
            <Flame className={`w-4 h-4 ${activeTab === 'PREDICTIVE_MINE' ? 'text-amber-400 animate-pulse' : 'text-zinc-400'}`} />
            <span>PREDICTIVE "BEST TIME TO MINE"</span>
            <span className="px-1.5 py-0.2 bg-amber-950 text-amber-400 text-[10px] rounded border border-amber-500/40">
              5–6 DAYS RADAR
            </span>
          </button>

          {/* TAB 2: AI RECOMMENDATIONS */}
          <button
            onClick={() => setActiveTab('AI_RECOMMENDATIONS')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border relative ${
              activeTab === 'AI_RECOMMENDATIONS' && !isCollapsed
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-lg shadow-purple-500/10'
                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-slate-200 hover:bg-zinc-800'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'AI_RECOMMENDATIONS' ? 'text-purple-400 animate-bounce' : 'text-zinc-400'}`} />
            <span>AI RECOMMENDATIONS</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
          </button>

          {/* TAB 3: DAILY OPERATIONS LEDGER */}
          <button
            onClick={() => setActiveTab('DAILY_LEDGER')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border ${
              activeTab === 'DAILY_LEDGER' && !isCollapsed
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-slate-200 hover:bg-zinc-800'
            }`}
          >
            <Table className={`w-4 h-4 ${activeTab === 'DAILY_LEDGER' ? 'text-cyan-400' : 'text-zinc-400'}`} />
            <span>DAILY OPERATIONS LEDGER</span>
            <span className="px-1.5 py-0.2 bg-zinc-800 text-cyan-300 text-[10px] rounded font-bold border border-zinc-700">
              {pins.length} TARGETS
            </span>
          </button>
        </div>

        {/* Right: Quick actions and panel sizing */}
        <div className="flex items-center space-x-2">
          {/* Quick Exports (Always accessible) */}
          <button
            onClick={onExportCsv}
            className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-slate-200 text-xs tracking-wider transition-colors cursor-pointer border border-zinc-700"
            title="Export operations ledger as CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">EXPORT CSV</span>
          </button>

          <button
            onClick={onExportGeoJson}
            className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs tracking-wider font-bold transition-colors cursor-pointer"
            title="Export coordinates as GeoJSON layer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT GEOJSON</span>
          </button>

          {/* Size toggle: Fullscreen / Compact */}
          {!isCollapsed && (
            <button
              onClick={() => setIsExpandedFull(!isExpandedFull)}
              className="text-zinc-400 hover:text-slate-100 p-1.5 rounded hover:bg-zinc-800 transition-colors"
              title={isExpandedFull ? "Restore compact view" : "Expand to tall view"}
            >
              {isExpandedFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Collapse / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-zinc-400 hover:text-slate-100 p-1.5 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT PANES */}
      {!isCollapsed && (
        <div className="flex-1 w-full overflow-y-auto p-3 bg-zinc-950/90">
          {/* ========================================================================= */}
          {/* TAB 1: PREDICTIVE "BEST TIME TO MINE" (5–6 DAYS PRIOR FORECAST) */}
          {/* ========================================================================= */}
          {activeTab === 'PREDICTIVE_MINE' && (
            <div className="flex flex-col space-y-3">
              {/* Subheader with Active Day Summary Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-zinc-900/60 border border-zinc-800 px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">SELECTED TIMELINE DAY:</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                    {selectedDay.dayName} ({selectedDay.dateString})
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    FEASIBILITY: {selectedDay.feasibilityScore}%
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-zinc-400">STATUS:</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    selectedDay.badgeVariant === 'optimal'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : selectedDay.badgeVariant === 'high_yield'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                      : selectedDay.badgeVariant === 'hazard'
                      ? 'bg-red-950 text-red-300 border border-red-500/50 animate-pulse'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {selectedDay.statusBadge}
                  </span>
                </div>
              </div>

              {/* 7-Day Visual Forecast Timeline Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {SEVEN_DAY_FORECAST.map((day) => {
                  const isSelected = selectedDay.dayNumber === day.dayNumber;
                  const isOptimalWindow = day.dayNumber === 5 || day.dayNumber === 6;

                  return (
                    <div
                      key={day.dayNumber}
                      onClick={() => onSelectDay(day)}
                      className={`p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected
                          ? 'bg-zinc-900/95 border-amber-400 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10'
                          : isOptimalWindow
                          ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400 hover:bg-zinc-900/70'
                          : day.badgeVariant === 'hazard'
                          ? 'bg-red-950/20 border-red-500/40 hover:border-red-400'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {/* Special Tag for Days 5 & 6 */}
                      {isOptimalWindow && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-amber-500 text-zinc-950 text-[9px] font-extrabold rounded uppercase shadow-sm">
                          {day.dayNumber === 5 ? 'TARGET PEAK' : 'HIGH RUN-RATE'}
                        </span>
                      )}

                      {/* Day Name & Date */}
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1 mb-1.5">
                        <span className={`text-xs tracking-wider font-bold ${
                          isSelected ? 'text-amber-400' : isOptimalWindow ? 'text-amber-300' : 'text-zinc-300'
                        }`}>
                          {day.dayName}
                        </span>
                        <span className="text-[10px] tracking-wider text-zinc-400">{day.dateString.slice(5)}</span>
                      </div>

                      {/* Feasibility Score */}
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-[10px] tracking-wider text-zinc-400 font-semibold">FEASIBILITY</span>
                        <span className={`text-xl font-bold tracking-wider ${
                          day.feasibilityScore >= 90
                            ? 'text-emerald-400 glow-emerald'
                            : day.feasibilityScore >= 60
                            ? 'text-amber-400'
                            : 'text-red-400 glow-crimson'
                        }`}>
                          {day.feasibilityScore}%
                        </span>
                      </div>

                      {/* Badge */}
                      <div className="mb-2">
                        <span className={`text-[9px] tracking-wider font-bold px-1.5 py-0.5 rounded block text-center truncate ${
                          day.badgeVariant === 'optimal'
                            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60'
                            : day.badgeVariant === 'high_yield'
                            ? 'bg-amber-950/90 text-amber-300 border border-amber-500/60'
                            : day.badgeVariant === 'hazard'
                            ? 'bg-red-950/90 text-red-300 border border-red-500/60 animate-pulse'
                            : 'bg-zinc-800/80 text-zinc-300'
                        }`}>
                          {day.statusBadge}
                        </span>
                      </div>

                      {/* 4 Multi-Factor Quick Spark Meters */}
                      <div className="grid grid-cols-2 gap-1 text-[9px] tracking-wider pt-1 border-t border-zinc-800/80 text-zinc-400">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-0.5">
                            <CloudRain className="w-2.5 h-2.5 text-cyan-400" /> WX:
                          </span>
                          <span className={day.weatherRiskScore < 20 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            {100 - day.weatherRiskScore}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-0.5">
                            <Mountain className="w-2.5 h-2.5 text-amber-400" /> SLP:
                          </span>
                          <span className="text-zinc-200 font-bold">{day.slopeStabilityScore}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-0.5">
                            <Layers className="w-2.5 h-2.5 text-purple-400" /> ORE:
                          </span>
                          <span className="text-zinc-200 font-bold">{day.oreAccessibilityScore}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-0.5">
                            <Truck className="w-2.5 h-2.5 text-emerald-400" /> RTE:
                          </span>
                          <span className="text-zinc-200 font-bold">{day.trafficabilityScore}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AI DISPATCH & EXTRACTION RECOMMENDATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'AI_RECOMMENDATIONS' && (
            <div className="flex flex-col space-y-3">
              {/* Primary AI Recommendation Banner */}
              <div className="bg-gradient-to-r from-purple-950/70 via-zinc-900 to-zinc-900 border-l-4 border-purple-500 border-y border-r border-zinc-800 p-3 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40 flex-shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">
                        AI MODEL RECOMMENDATION // ODISHA SECTOR 4B PIT
                      </span>
                      <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40 font-bold">
                        PREDICTION CONFIDENCE: 94.6%
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-100 tracking-wide mt-1">
                      {selectedDay.aiRecommendation}
                    </p>
                  </div>
                </div>

                {/* Direct Action: Vector Target Pin */}
                <button
                  onClick={() => onVectorDayTarget(selectedDay)}
                  className="inline-flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 text-xs font-bold tracking-wider uppercase rounded-lg shadow-lg shadow-amber-500/20 transition-all flex-shrink-0 cursor-pointer"
                >
                  <Target className="w-4 h-4" />
                  <span>VECTOR TARGET PIN TO GIS CANVAS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Pillars of Mining Optimization Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* 1. DRILL & BLAST WINDOW */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-2.5 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-xs">
                    <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> DRILL & BLAST WINDOW
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.2 rounded">OPTIMAL</span>
                  </div>
                  <div className="py-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Target Shift:</span>
                      <span className="text-slate-200 font-bold">06:00 – 11:30 HRS (DAY 5)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Blast Burden / Spacing:</span>
                      <span className="text-slate-200 font-bold">3.2m × 3.8m Grid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Vibration Limit:</span>
                      <span className="text-slate-200 font-bold">&lt; 5.0 mm/s (PPV)</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-300/90 bg-amber-950/40 p-1.5 rounded border border-amber-500/30">
                    Safe blast clearance confirmed. Zero ground vibrations at south slope perimeter.
                  </div>
                </div>

                {/* 2. BENCH EXPOSURE & GRADE */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-2.5 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-xs">
                    <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" /> ORE EXPOSURE
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-950 px-1.5 py-0.2 rounded">PEAK 88%</span>
                  </div>
                  <div className="py-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Target Formation:</span>
                      <span className="text-slate-200 font-bold">Bench 3 North Pyrolusite</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Predicted Mn Grade:</span>
                      <span className="text-amber-400 font-bold">44.8% Mn (High-Grade)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">SWIR B11/B12 Ratio:</span>
                      <span className="text-slate-200 font-bold">1.52 (Pure Manganese)</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-purple-300/90 bg-purple-950/40 p-1.5 rounded border border-purple-500/30">
                    Pyrolusite outcrop completely exposed following dry atmospheric window.
                  </div>
                </div>

                {/* 3. SLOPE & GEOTECHNICAL INTEGRITY */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-2.5 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-xs">
                    <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-emerald-400" /> SLOPE STABILITY
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.2 rounded">96% SECURE</span>
                  </div>
                  <div className="py-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">DEM Shear Factor:</span>
                      <span className="text-slate-200 font-bold">1.84 (Factor of Safety)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Pore Pressure:</span>
                      <span className="text-slate-200 font-bold">12.4 kPa (Nominal)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Bench Crack Risk:</span>
                      <span className="text-emerald-400 font-bold">ZERO ANOMALIES</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-300/90 bg-emerald-950/40 p-1.5 rounded border border-emerald-500/30">
                    Inter-ramp angle of 48° maintained with zero tension crack propagation.
                  </div>
                </div>

                {/* 4. HAUL TRAFFICABILITY & FLEET */}
                <div className="bg-zinc-900/70 border border-zinc-800 p-2.5 rounded-lg flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800 text-xs">
                    <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" /> HAUL FLEET DISPATCH
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-1.5 py-0.2 rounded">READY</span>
                  </div>
                  <div className="py-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Assigned Primary Shovel:</span>
                      <span className="text-slate-200 font-bold">EX-01 (CAT 6040)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Haul Route Slippage:</span>
                      <span className="text-emerald-400 font-bold">0.02 (Dry Compaction)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Crusher Starvation Risk:</span>
                      <span className="text-slate-200 font-bold">0% (Guaranteed Flow)</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-cyan-300/90 bg-cyan-950/40 p-1.5 rounded border border-cyan-500/30">
                    Ramp 2 cleared for high-tonnage 50T dumpers. Grade lock 38% ± 1.5% guaranteed.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DAILY OPERATIONS & COORDINATION LEDGER */}
          {/* ========================================================================= */}
          {activeTab === 'DAILY_LEDGER' && (
            <div className="flex flex-col space-y-2 font-mono">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-xs">
                <div className="flex items-center space-x-2">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-zinc-300 font-bold tracking-wider">
                    ODISHA SECTOR 4B DISPATCH TARGETS // {pins.length} REGISTERED MARKERS
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-zinc-400">
                  <span>CLICK STATUS BUTTON TO CYCLE: PENDING → IN PROGRESS → VERIFIED</span>
                </div>
              </div>

              <div className="overflow-x-auto">
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
                          <td className="py-1.5 px-3 font-bold text-amber-400 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{pin.pinId}</span>
                          </td>

                          {/* COORDINATES */}
                          <td className="py-1.5 px-3 text-cyan-400 font-semibold">
                            {pin.coordinates.latDms}, {pin.coordinates.lonDms}
                          </td>

                          {/* ELEVATION */}
                          <td className="py-1.5 px-3 text-zinc-300 font-bold">
                            {pin.elevationM} M RL
                          </td>

                          {/* OPERATION TYPE */}
                          <td className="py-1.5 px-3">
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
                          <td className="py-1.5 px-3">
                            {pin.predictedGradeMn > 0 ? (
                              <span className="font-bold text-amber-300 glow-amber">
                                {pin.predictedGradeMn.toFixed(1)}% Mn
                              </span>
                            ) : (
                              <span className="text-zinc-600 font-bold">N/A (HAUL)</span>
                            )}
                          </td>

                          {/* DATE & SHIFT */}
                          <td className="py-1.5 px-3 text-zinc-300">
                            <div className="font-semibold">{pin.date}</div>
                            <div className="text-[10px] text-zinc-500 font-bold">{pin.shift}</div>
                          </td>

                          {/* ASSIGNED UNIT */}
                          <td className="py-1.5 px-3 text-zinc-300 font-semibold truncate max-w-xs">
                            {pin.assignedUnit || 'UNASSIGNED'}
                          </td>

                          {/* STATUS BUTTON TOGGLE */}
                          <td className="py-1.5 px-3 text-right">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};
