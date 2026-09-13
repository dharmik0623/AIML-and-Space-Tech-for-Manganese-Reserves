import React, { useState } from 'react';
import { 
  Table, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Search, 
  Activity, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { DEWP_SEVEN_DAY_FORECAST, ADS_DIRECTIVES } from '../data/miningData';
import type { 
  OperationalWaypoint, 
  DEWPForecastDay, 
  ADSDirective, 
  WaypointStatus 
} from '../types';

export type ConsoleTab = 'DEWP' | 'ADS' | 'OPERATIONS_LEDGER';

interface DockedConsoleProps {
  waypoints: OperationalWaypoint[];
  onUpdateWaypointStatus: (pointId: string, status: WaypointStatus) => void;
  onExportGeoJson: () => void;
  onExportCsv: () => void;
  onDispatchDirective: (directive: ADSDirective) => void;
  selectedForecastDay?: DEWPForecastDay;
  onSelectForecastDay?: (day: DEWPForecastDay) => void;
}

export const DockedConsole: React.FC<DockedConsoleProps> = ({
  waypoints,
  onUpdateWaypointStatus,
  onExportGeoJson,
  onExportCsv,
  onDispatchDirective,
  selectedForecastDay: externalSelectedDay,
  onSelectForecastDay: externalOnSelectDay
}) => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>('DEWP');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isExpandedFull, setIsExpandedFull] = useState<boolean>(false);

  // Selected forecast day
  const [internalSelectedDay, setInternalSelectedDay] = useState<DEWPForecastDay>(DEWP_SEVEN_DAY_FORECAST[4]);
  const activeDay = externalSelectedDay || internalSelectedDay;
  const handleSelectDay = (day: DEWPForecastDay) => {
    if (externalOnSelectDay) externalOnSelectDay(day);
    setInternalSelectedDay(day);
  };

  // Directives state
  const [directives, setDirectives] = useState<ADSDirective[]>(ADS_DIRECTIVES);

  // Ledger filters
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [ledgerClassFilter, setLedgerClassFilter] = useState<string>('ALL');

  const filteredWaypoints = waypoints.filter(wp => {
    const matchesSearch = 
      wp.pointId.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      wp.assignedRigOrFleet.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      wp.fieldRemarks.toLowerCase().includes(ledgerSearch.toLowerCase());
    const matchesClass = ledgerClassFilter === 'ALL' || wp.operationalClass === ledgerClassFilter;
    return matchesSearch && matchesClass;
  });

  const handleDispatch = (directive: ADSDirective) => {
    setDirectives(prev => prev.map(d => d.id === directive.id ? { ...d, dispatched: true, acknowledged: true } : d));
    onDispatchDirective(directive);
  };

  return (
    <div className={`w-full bg-[#161B22] border-t border-[#30363D] flex flex-col font-sans select-none transition-all duration-300 z-30 shadow-2xl ${
      isCollapsed ? 'h-11' : isExpandedFull ? 'h-[440px]' : 'h-[285px]'
    }`}>
      {/* 1. INDUSTRIAL CONSOLE SWITCH TAB BAR */}
      <div className="h-11 px-3 flex items-center justify-between bg-[#161B22] border-b border-[#30363D] flex-shrink-0">
        {/* Left: Industrial Switch Tabs */}
        <div className="flex items-center space-x-1 h-full">
          {/* TAB 1: DEWP */}
          <button
            onClick={() => {
              setActiveTab('DEWP');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`h-full flex items-center space-x-2 px-4 text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer border-b-2 ${
              activeTab === 'DEWP' && !isCollapsed
                ? 'border-[#D97706] text-[#E6EDF3] bg-[#1F242C]'
                : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1B2028]'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${activeTab === 'DEWP' ? 'text-[#D97706]' : 'text-[#6E7681]'}`} />
            <span>DYNAMIC EXTRACTION WINDOW PLANNING (DEWP)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded bg-[#0D1117] text-[#D97706] font-mono text-[10px] border border-[#30363D]">
              7-DAY ROLLING
            </span>
          </button>

          {/* TAB 2: ADS */}
          <button
            onClick={() => {
              setActiveTab('ADS');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`h-full flex items-center space-x-2 px-4 text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer border-b-2 ${
              activeTab === 'ADS' && !isCollapsed
                ? 'border-[#D97706] text-[#E6EDF3] bg-[#1F242C]'
                : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1B2028]'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activeTab === 'ADS' ? 'text-[#1F6FEB]' : 'text-[#6E7681]'}`} />
            <span>ANALYTICAL DECISION SUPPORT (ADS)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded bg-[#0D1117] text-[#1F6FEB] font-mono text-[10px] border border-[#30363D]">
              {directives.filter(d => !d.dispatched).length} PENDING
            </span>
          </button>

          {/* TAB 3: SPATIAL DISPATCH & OPERATIONS LEDGER */}
          <button
            onClick={() => {
              setActiveTab('OPERATIONS_LEDGER');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`h-full flex items-center space-x-2 px-4 text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer border-b-2 ${
              activeTab === 'OPERATIONS_LEDGER' && !isCollapsed
                ? 'border-[#D97706] text-[#E6EDF3] bg-[#1F242C]'
                : 'border-transparent text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1B2028]'
            }`}
          >
            <Table className={`w-3.5 h-3.5 ${activeTab === 'OPERATIONS_LEDGER' ? 'text-[#238636]' : 'text-[#6E7681]'}`} />
            <span>SPATIAL DISPATCH &amp; OPERATIONS LEDGER</span>
            <span className="ml-1 px-1.5 py-0.2 rounded bg-[#0D1117] text-[#8B949E] font-mono text-[10px] border border-[#30363D]">
              {waypoints.length} LOGS
            </span>
          </button>
        </div>

        {/* Right: Quick Tools & Sizing */}
        <div className="flex items-center space-x-2">
          {/* Quick CSV Export */}
          <button
            onClick={onExportCsv}
            className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#282E37] border border-[#30363D] text-[#E6EDF3] text-xs font-mono transition-colors cursor-pointer"
            title="Export shift coordinates to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#8B949E]" />
            <span>EXPORT SHIFT CSV</span>
          </button>

          {/* Quick GeoJSON Export */}
          <button
            onClick={onExportGeoJson}
            className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#282E37] border border-[#30363D] text-[#D97706] text-xs font-mono transition-colors cursor-pointer"
            title="Download GeoJSON dataset"
          >
            <Download className="w-3.5 h-3.5 text-[#D97706]" />
            <span>DOWNLOAD GEOJSON</span>
          </button>

          {/* Height Toggle */}
          {!isCollapsed && (
            <button
              onClick={() => setIsExpandedFull(!isExpandedFull)}
              className="text-[#8B949E] hover:text-[#E6EDF3] p-1.5 rounded hover:bg-[#21262D] transition-colors"
              title={isExpandedFull ? "Restore compact view" : "Expand to tall workbench"}
            >
              {isExpandedFull ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[#8B949E] hover:text-[#E6EDF3] p-1.5 rounded hover:bg-[#21262D] transition-colors cursor-pointer"
            title={isCollapsed ? "Expand console" : "Collapse console"}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4 text-[#D97706]" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. TAB WORKSPACE PANES */}
      {!isCollapsed && (
        <div className="flex-1 w-full overflow-y-auto p-3 bg-[#0D1117]">
          {/* ========================================================================= */}
          {/* TAB 1: DYNAMIC EXTRACTION WINDOW PLANNING (DEWP) */}
          {/* ========================================================================= */}
          {activeTab === 'DEWP' && (
            <div className="flex flex-col space-y-2.5">
              {/* Engineering Status Strip */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 bg-[#161B22] border border-[#30363D] px-3 py-2 rounded">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-mono text-[10px] text-[#6E7681]">GEOTECHNICAL WINDOW:</span>
                  <span className="font-semibold text-[#E6EDF3]">
                    {activeDay.code} ({activeDay.dateLabel})
                  </span>
                  <span className="text-[#30363D]">|</span>
                  <span className="font-mono text-[#D97706]">
                    FEASIBILITY: {activeDay.numericFeasibilityPct}%
                  </span>
                  <span className="text-[#30363D]">|</span>
                  <span className="text-[11px] font-mono text-[#8B949E]">
                    BENCH FoS: <span className={activeDay.benchFoS >= 1.4 ? 'text-[#238636] font-semibold' : 'text-[#DA3633] font-semibold'}>{activeDay.benchFoS}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-[#8B949E]">DISPATCH CLASSIFICATION:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${
                    activeDay.statusBadge === 'OPTIMAL EXTRACTION WINDOW'
                      ? 'bg-[#238636]/15 text-[#3FB950] border border-[#238636]/40'
                      : activeDay.statusBadge === 'CONDITIONAL'
                      ? 'bg-[#B08800]/15 text-[#D29922] border border-[#B08800]/40'
                      : 'bg-[#DA3633]/15 text-[#F85149] border border-[#DA3633]/40'
                  }`}>
                    {activeDay.statusBadge}
                  </span>
                </div>
              </div>

              {/* 7-Day Rolling Geotechnical Forecast Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {DEWP_SEVEN_DAY_FORECAST.map((day) => {
                  const isSelected = activeDay.code === day.code;
                  const isUnfavorable = day.statusBadge === 'UNFAVORABLE';

                  return (
                    <div
                      key={day.code}
                      onClick={() => handleSelectDay(day)}
                      className={`p-2.5 rounded border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-[#21262D] border-[#D97706] ring-1 ring-[#D97706]'
                          : day.isTargetWindow
                          ? 'bg-[#161B22] border-[#D97706]/40 hover:border-[#D97706]'
                          : isUnfavorable
                          ? 'bg-[#161B22] border-[#DA3633]/30 hover:border-[#DA3633]/60'
                          : 'bg-[#161B22] border-[#30363D] hover:border-[#484F58]'
                      }`}
                    >
                      {/* Highlight Badge for T+5 & T+6 */}
                      {day.isTargetWindow && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-[#D97706] text-black font-mono text-[8px] font-bold uppercase rounded">
                          {day.code === 'T+5' ? 'TARGET PEAK' : 'HIGH RUN-RATE'}
                        </span>
                      )}

                      {/* Code & Date */}
                      <div className="flex items-center justify-between pb-1 border-b border-[#30363D]">
                        <span className={`text-xs font-mono font-bold ${
                          isSelected ? 'text-[#D97706]' : 'text-[#E6EDF3]'
                        }`}>
                          {day.code}
                        </span>
                        <span className="text-[10px] font-mono text-[#6E7681]">{day.dateLabel.slice(0, 6)}</span>
                      </div>

                      {/* Feasibility Score */}
                      <div className="flex items-baseline justify-between my-1.5">
                        <span className="text-[9px] font-mono text-[#6E7681]">FEASIBILITY</span>
                        <span className={`text-lg font-mono font-bold ${
                          day.numericFeasibilityPct >= 90
                            ? 'text-[#3FB950]'
                            : day.numericFeasibilityPct >= 65
                            ? 'text-[#D29922]'
                            : 'text-[#F85149]'
                        }`}>
                          {day.numericFeasibilityPct}%
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="mb-2">
                        <span className={`text-[9px] font-mono font-medium px-1 py-0.5 rounded block text-center truncate ${
                          day.statusBadge === 'OPTIMAL EXTRACTION WINDOW'
                            ? 'bg-[#238636]/15 text-[#3FB950] border border-[#238636]/40'
                            : day.statusBadge === 'CONDITIONAL'
                            ? 'bg-[#B08800]/15 text-[#D29922] border border-[#B08800]/40'
                            : 'bg-[#DA3633]/15 text-[#F85149] border border-[#DA3633]/40'
                        }`}>
                          {day.statusBadge}
                        </span>
                      </div>

                      {/* 4 Rolling Parameters */}
                      <div className="grid grid-cols-2 gap-1 text-[9px] font-mono pt-1.5 border-t border-[#30363D] text-[#8B949E]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#6E7681]">RAIN:</span>
                          <span className={day.precipitationMm > 15 ? 'text-[#DA3633] font-semibold' : 'text-[#E6EDF3]'}>
                            {day.precipitationMm}mm
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#6E7681]">FoS:</span>
                          <span className={day.benchFoS < 1.2 ? 'text-[#DA3633] font-semibold' : 'text-[#E6EDF3]'}>
                            {day.benchFoS}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#6E7681]">EXPOS:</span>
                          <span className="text-[#E6EDF3]">{day.pyrolusiteClarityPct}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#6E7681]">ROLL:</span>
                          <span className="text-[#E6EDF3]">{day.haulRollingResistanceKnT}k</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Engineering Recommendation Note */}
              <div className="bg-[#161B22] border-l-2 border-[#D97706] border-y border-r border-[#30363D] p-2.5 rounded text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#D97706]">
                    ENGINEERING DISPATCH DIRECTIVE:
                  </span>
                  <span className="text-[#E6EDF3] font-medium">
                    {activeDay.engineeringSummary}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ANALYTICAL DECISION SUPPORT (ADS) */}
          {/* ========================================================================= */}
          {activeTab === 'ADS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5">
              {directives.map((dir) => {
                const isExtraction = dir.category === 'TARGET EXTRACTION';
                const isHaul = dir.category === 'HAUL & FLEET';

                const categoryColor = isExtraction 
                  ? 'text-[#D97706] border-[#D97706]/40 bg-[#D97706]/10' 
                  : isHaul 
                  ? 'text-[#1F6FEB] border-[#1F6FEB]/40 bg-[#1F6FEB]/10' 
                  : 'text-[#DA3633] border-[#DA3633]/40 bg-[#DA3633]/10';

                return (
                  <div
                    key={dir.id}
                    className="bg-[#161B22] border border-[#30363D] p-3 rounded flex flex-col justify-between space-y-2 relative"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#30363D]">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border ${categoryColor}`}>
                          {dir.incidentPrefix}
                        </span>
                        <span className="font-mono text-[10px] text-[#6E7681]">
                          {dir.timestampIst}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#3FB950] font-semibold">
                        CONF: {dir.confidencePct}%
                      </span>
                    </div>

                    {/* Body Directive Text */}
                    <p className="text-xs text-[#E6EDF3] leading-relaxed font-normal flex-1">
                      {dir.directiveText}
                    </p>

                    {/* Metadata Coordinates */}
                    <div className="bg-[#21262D] p-2 rounded border border-[#30363D] text-[10px] font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#6E7681]">TARGET SECTOR:</span>
                        <span className="text-[#E6EDF3] truncate max-w-[170px]">{dir.targetSector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6E7681]">COORDINATES:</span>
                        <span className="text-[#1F6FEB]">{dir.targetCoordinates.utm}</span>
                      </div>
                      {dir.assignedRigOrFleet && (
                        <div className="flex justify-between">
                          <span className="text-[#6E7681]">ALLOCATED FLEET:</span>
                          <span className="text-[#D97706]">{dir.assignedRigOrFleet}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 pt-1">
                      {!dir.dispatched ? (
                        <button
                          onClick={() => handleDispatch(dir)}
                          className="flex-1 py-1.5 px-2 bg-[#D97706] hover:bg-[#B45309] text-black font-mono text-xs font-semibold rounded transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <span>ACKNOWLEDGE &amp; DISPATCH</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <div className="flex-1 py-1.5 px-2 bg-[#21262D] text-[#3FB950] border border-[#238636]/40 font-mono text-xs font-medium rounded flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>DISPATCHED TO SCADA</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SPATIAL DISPATCH & OPERATIONS LEDGER */}
          {/* ========================================================================= */}
          {activeTab === 'OPERATIONS_LEDGER' && (
            <div className="flex flex-col space-y-2">
              {/* Ledger Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[#30363D]">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#6E7681] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search point ID, fleet, remarks..."
                      value={ledgerSearch}
                      onChange={(e) => setLedgerSearch(e.target.value)}
                      className="w-full bg-[#161B22] border border-[#30363D] rounded pl-8 pr-2.5 py-1 text-xs text-[#E6EDF3] placeholder-[#6E7681] outline-none font-mono"
                    />
                  </div>

                  {/* Class Filter */}
                  <select
                    value={ledgerClassFilter}
                    onChange={(e) => setLedgerClassFilter(e.target.value)}
                    className="bg-[#161B22] border border-[#30363D] rounded px-2.5 py-1 text-xs text-[#E6EDF3] font-mono outline-none cursor-pointer"
                  >
                    <option value="ALL">ALL CLASSES</option>
                    <option value="Controlled Pre-Split Blast">PRE-SPLIT BLAST</option>
                    <option value="Grade Verification Borehole">GRADE BOREHOLE</option>
                    <option value="Geotechnical Piezometer">PIEZOMETER</option>
                    <option value="Haul Ramp Maintenance">HAUL RAMP</option>
                  </select>
                </div>

                <div className="text-[11px] font-mono text-[#8B949E]">
                  SHOWING <span className="text-[#E6EDF3] font-semibold">{filteredWaypoints.length}</span> OF {waypoints.length} REGISTERED DISPATCH WAYPOINTS
                </div>
              </div>

              {/* Enterprise Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#30363D] text-[10px] text-[#6E7681] uppercase bg-[#1B2028] sticky top-0">
                      <th className="py-2 px-3">POINT ID</th>
                      <th className="py-2 px-3">COORDINATES (LAT/LNG)</th>
                      <th className="py-2 px-3">ELEVATION (RL)</th>
                      <th className="py-2 px-3">OPERATION TYPE</th>
                      <th className="py-2 px-3">PREDICTED MN GRADE</th>
                      <th className="py-2 px-3">ASSIGNED RIG/FLEET</th>
                      <th className="py-2 px-3">SHIFT</th>
                      <th className="py-2 px-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]">
                    {filteredWaypoints.map((wp) => {
                      const isPreSplit = wp.operationalClass === 'Controlled Pre-Split Blast';
                      const isBorehole = wp.operationalClass === 'Grade Verification Borehole';
                      const isPiezometer = wp.operationalClass === 'Geotechnical Piezometer';

                      const classColor = isPreSplit 
                        ? 'text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30' 
                        : isBorehole 
                        ? 'text-[#1F6FEB] bg-[#1F6FEB]/10 border-[#1F6FEB]/30' 
                        : isPiezometer 
                        ? 'text-[#DA3633] bg-[#DA3633]/10 border-[#DA3633]/30' 
                        : 'text-[#238636] bg-[#238636]/10 border-[#238636]/30';

                      return (
                        <tr key={wp.id} className="hover:bg-[#21262D] transition-colors">
                          {/* Point ID */}
                          <td className="py-2 px-3 font-semibold text-[#E6EDF3] flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>{wp.pointId}</span>
                          </td>

                          {/* Coordinates */}
                          <td className="py-2 px-3 text-[#1F6FEB]">
                            {wp.coordinates.latDms}, {wp.coordinates.lonDms}
                          </td>

                          {/* Elevation */}
                          <td className="py-2 px-3 text-[#8B949E]">
                            {wp.elevationRl}m RL
                          </td>

                          {/* Operation Type */}
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] border ${classColor}`}>
                              {wp.operationalClass}
                            </span>
                          </td>

                          {/* Predicted Mn Grade */}
                          <td className="py-2 px-3">
                            {wp.estimatedGradeMn > 0 ? (
                              <span className="font-semibold text-[#D97706]">
                                {wp.estimatedGradeMn.toFixed(1)}% Mn
                              </span>
                            ) : (
                              <span className="text-[#6E7681]">N/A</span>
                            )}
                          </td>

                          {/* Assigned Rig/Fleet */}
                          <td className="py-2 px-3 text-[#E6EDF3] truncate max-w-xs">
                            {wp.assignedRigOrFleet}
                          </td>

                          {/* Shift */}
                          <td className="py-2 px-3 text-[#8B949E]">
                            {wp.shift.slice(0, 7)}
                          </td>

                          {/* Status Toggle */}
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => {
                                const next: WaypointStatus = 
                                  wp.status === 'LOGGED' ? 'IN PROGRESS' :
                                  wp.status === 'IN PROGRESS' ? 'VERIFIED' : 'LOGGED';
                                onUpdateWaypointStatus(wp.id, next);
                              }}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                                wp.status === 'VERIFIED'
                                  ? 'bg-[#238636]/15 text-[#3FB950] border-[#238636]/40 hover:bg-[#238636]/25'
                                  : wp.status === 'IN PROGRESS'
                                  ? 'bg-[#B08800]/15 text-[#D29922] border-[#B08800]/40 hover:bg-[#B08800]/25'
                                  : 'bg-[#21262D] text-[#8B949E] border-[#30363D] hover:bg-[#282E37]'
                              }`}
                              title="Click to cycle status: LOGGED -> IN PROGRESS -> VERIFIED"
                            >
                              {wp.status === 'VERIFIED' ? (
                                <CheckCircle2 className="w-3 h-3 text-[#3FB950]" />
                              ) : wp.status === 'IN PROGRESS' ? (
                                <Clock className="w-3 h-3 text-[#D29922]" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-[#6E7681]" />
                              )}
                              <span>{wp.status}</span>
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
