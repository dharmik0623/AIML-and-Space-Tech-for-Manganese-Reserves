import React from 'react';
import { 
  Sparkles, 
  CloudRain, 
  Mountain, 
  Layers, 
  Truck, 
  ChevronRight,
  Flame
} from 'lucide-react';
import type { ForecastDay } from '../types';
import { SEVEN_DAY_FORECAST } from '../data/forecastData';

interface PredictiveMiningEngineProps {
  selectedDay: ForecastDay;
  onSelectDay: (day: ForecastDay) => void;
  onVectorDayTarget: (day: ForecastDay) => void;
}

export const PredictiveMiningEngine: React.FC<PredictiveMiningEngineProps> = ({
  selectedDay,
  onSelectDay,
  onVectorDayTarget
}) => {
  return (
    <div className="w-full bg-zinc-950/95 border-b border-zinc-800/90 p-3 select-none flex flex-col space-y-2.5">
      {/* 1. TOP HEADER & ACTIVE AI RECOMMENDATION BANNER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base tracking-wider font-bold text-slate-100 uppercase flex items-center gap-2">
              <span>PREDICTIVE "BEST TIME TO MINE" ENGINE</span>
              <span className="text-xs text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 font-semibold">
                5–6 DAYS ADVANCE RADAR
              </span>
            </h2>
          </div>
        </div>

        {/* Dynamic AI Recommendation Banner */}
        <div className="flex-1 max-w-4xl bg-gradient-to-r from-amber-950/70 via-zinc-900 to-zinc-900 border-l-4 border-amber-500 border-y border-r border-zinc-800 px-3 py-1.5 rounded flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
            <span className="text-zinc-400 font-bold">AI RECOMMENDATION:</span>
            <span className="text-amber-300 font-semibold">{selectedDay.aiRecommendation}</span>
          </div>
          <button
            onClick={() => onVectorDayTarget(selectedDay)}
            className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded transition-colors flex-shrink-0 ml-3 cursor-pointer"
          >
            <span>VECTOR TARGET PIN</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC 7-DAY FORECAST GRID (Highlighting Days 5 & 6) */}
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
              {/* Special Indicator Tag for Days 5 & 6 */}
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

              {/* Mining Feasibility Index Score */}
              <div className="flex items-baseline justify-between mb-1.5">
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

              {/* Status Badge */}
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
  );
};
