import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Compass, 
  Satellite, 
  Radio, 
  Clock, 
  User, 
  ChevronDown, 
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { MINE_LEASES } from '../data/miningData';
import type { MineLeaseOption } from '../types';

interface GlobalHeaderBarProps {
  selectedLease: MineLeaseOption;
  onSelectLease: (lease: MineLeaseOption) => void;
  onExportGeoJson: () => void;
  onExportCsv: () => void;
  onOpenAuditModal: () => void;
  auditCount: number;
}

export const GlobalHeaderBar: React.FC<GlobalHeaderBarProps> = ({
  selectedLease,
  onSelectLease,
  onExportGeoJson,
  onExportCsv,
  onOpenAuditModal,
  auditCount
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);

  // Live IST Clock (UTC+05:30) with millisecond precision display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to IST
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const formatted = new Intl.DateTimeFormat('en-GB', options).format(now);
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      setIstTime(`${formatted}.${ms} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 w-full bg-[#161B22] border-b border-[#30363D] px-4 flex items-center justify-between z-40 select-none">
      {/* 1. LEFT: Wordmark, Release, and Mining Lease Switcher */}
      <div className="flex items-center space-x-3">
        {/* Exact circular emblem without square background */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="MnSight Logo" 
            className="w-8 h-8 rounded-full object-contain"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#238636] rounded-full border border-[#161B22]" />
        </div>

        {/* Wordmark & Release Tag */}
        <div className="flex items-center space-x-2">
          <span className="text-base font-semibold tracking-tight text-[#E6EDF3]">
            MnSight
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#21262D] text-[#6E7681] font-mono text-[10px] font-medium border border-[#30363D]">
            v4.2.1-prod
          </span>
        </div>

        <div className="h-4 w-[1px] bg-[#30363D] mx-1" />

        {/* Lease Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLeaseDropdownOpen(!isLeaseDropdownOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#282E37] border border-[#30363D] text-xs text-[#E6EDF3] transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="font-medium max-w-[200px] truncate">{selectedLease.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6E7681]" />
          </button>

          {isLeaseDropdownOpen && (
            <div className="absolute left-0 mt-1 w-72 bg-[#161B22] border border-[#30363D] rounded-md shadow-2xl z-50 py-1 font-sans">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6E7681] border-b border-[#30363D]">
                Active Mineral Concession Leases
              </div>
              {MINE_LEASES.map((lease) => (
                <button
                  key={lease.id}
                  onClick={() => {
                    onSelectLease(lease);
                    setIsLeaseDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex flex-col space-y-0.5 cursor-pointer ${
                    lease.id === selectedLease.id
                      ? 'bg-[#282E37] text-[#E6EDF3] border-l-2 border-[#D97706]'
                      : 'text-[#8B949E] hover:bg-[#21262D] hover:text-[#E6EDF3]'
                  }`}
                >
                  <span className="font-medium text-[#E6EDF3]">{lease.name}</span>
                  <span className="text-[10px] font-mono text-[#6E7681]">{lease.region}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER: Real-Time Projection & Geographic Coordinate HUD */}
      <div className="hidden xl:flex items-center space-x-3 px-3 py-1 bg-[#0D1117] border border-[#30363D] rounded">
        <Compass className="w-3.5 h-3.5 text-[#1F6FEB]" />
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-[#8B949E]">PROJ:</span>
          <span className="text-[#E6EDF3] font-medium">EPSG:32645 - WGS 84 / UTM Zone 45N</span>
          <span className="text-[#6E7681]">|</span>
          <span className="text-[#8B949E]">DATUM:</span>
          <span className="text-[#D97706] font-medium">{selectedLease.datumRl}</span>
        </div>
      </div>

      {/* 3. RIGHT: Industrial Telemetry Feeds, Clock & Operator Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Orbital Sensor Feed */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#21262D] border border-[#30363D] text-[11px] font-mono text-[#8B949E]">
          <Satellite className="w-3.5 h-3.5 text-[#1F6FEB]" />
          <span>S2-L2A + L9-OLI2</span>
          <span className="text-[#6E7681]">[04:12 UTC]</span>
        </div>

        {/* RTK GNSS Base Status */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#21262D] border border-[#30363D] text-[11px] font-mono">
          <Radio className="w-3.5 h-3.5 text-[#238636]" />
          <span className="text-[#E6EDF3]">RTK-FIXED</span>
          <span className="text-[#6E7681] text-[10px]">(H:±8mm, V:±12mm)</span>
        </div>

        {/* Live IST Clock */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0D1117] border border-[#30363D] text-[11px] font-mono text-[#E6EDF3]">
          <Clock className="w-3 h-3 text-[#6E7681]" />
          <span>{istTime || '14:22:08.412 IST'}</span>
        </div>

        {/* Export Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onExportCsv}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#282E37] border border-[#30363D] text-xs font-medium text-[#E6EDF3] transition-colors cursor-pointer"
            title="Export shift coordinates to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#8B949E]" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={onExportGeoJson}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#282E37] border border-[#30363D] text-xs font-medium text-[#E6EDF3] transition-colors cursor-pointer"
            title="Export concession GIS layers as GeoJSON"
          >
            <Download className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>

          {/* System Audit Trigger */}
          <button
            onClick={onOpenAuditModal}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#21262D] hover:bg-[#282E37] border border-[#30363D] text-xs font-medium text-[#238636] transition-colors cursor-pointer"
            title="View system event and coordination audit ledger"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#238636]" />
            <span className="font-mono text-[10px] text-[#8B949E]">{auditCount}</span>
          </button>
        </div>

        {/* Operator User Badge */}
        <div className="flex items-center space-x-1.5 pl-2 border-l border-[#30363D]">
          <div className="w-7 h-7 rounded bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#8B949E]">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden 2xl:flex flex-col text-left font-mono">
            <span className="text-[11px] font-medium text-[#E6EDF3] leading-none">admin@omdc.gov.in</span>
            <span className="text-[9px] text-[#6E7681] leading-tight">CHIEF DISPATCHER</span>
          </div>
        </div>
      </div>
    </header>
  );
};
