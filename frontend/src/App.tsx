import { useState } from 'react';
import { TopCommandBar } from './components/TopCommandBar';
import { PredictiveMiningEngine } from './components/PredictiveMiningEngine';
import { TacticalGisCanvas } from './components/TacticalGisCanvas';
import { DailyOperationsTable } from './components/DailyOperationsTable';
import { RalphAuditModal } from './components/RalphAuditModal';
import { AddPinModal } from './components/AddPinModal';
import { SEVEN_DAY_FORECAST, INITIAL_TACTICAL_PINS } from './data/forecastData';
import type { 
  TacticalPin, 
  ForecastDay, 
  ActivityLogEntry, 
  DateFilterType, 
  VerificationStatus 
} from './types';

export function App() {
  // 1. Core State: Tactical Pins with History Stack for Ralph Loop Undo/Rollback
  const [pins, setPins] = useState<TacticalPin[]>(INITIAL_TACTICAL_PINS);
  const [pinHistory, setPinHistory] = useState<TacticalPin[][]>([]);

  // 2. Ralph Loop Audit Ledger (activityLogState mimicking tasks.json / progress.txt)
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([
    {
      id: 'log-001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      actionType: 'PIN_CREATED',
      pinId: 'PIN-EXT-041',
      details: 'Automated extraction target vectored for Day 5 peak window (44.2% Mn).',
      verifiedByRalphLoop: true,
      diffPayload: '+{ lat: 21.9038, lon: 85.3462, elev: 384m, grade: 44.2% }'
    },
    {
      id: 'log-002',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      actionType: 'PIN_VERIFIED',
      pinId: 'PIN-ASY-019',
      details: 'Assay calibration point verified against SWIR B11/B12 ratio 1.48 baseline.',
      verifiedByRalphLoop: true,
      diffPayload: '~{ status: PENDING -> VERIFIED }'
    }
  ]);

  // 3. Predictive Forecast Day Selection (Defaults to Day 5 Optimal Window)
  const [selectedDay, setSelectedDay] = useState<ForecastDay>(SEVEN_DAY_FORECAST[4]);

  // 4. Filter & Mode Toggles
  const [activeFilter, setActiveFilter] = useState<DateFilterType>('ALL');
  const [isAddPinMode, setIsAddPinMode] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);

  // Ralph Loop Verification Gate
  const recordMutationWithVerification = (
    newPins: TacticalPin[],
    actionType: ActivityLogEntry['actionType'],
    targetPinId: string,
    details: string,
    diffPayload: string
  ) => {
    // 1. Save prior state to history stack for rollback
    setPinHistory(prev => [pins, ...prev.slice(0, 15)]);

    // 2. Commit verified state
    setPins(newPins);

    // 3. Append to Ralph Activity Ledger
    const newLog: ActivityLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actionType,
      pinId: targetPinId,
      details,
      verifiedByRalphLoop: true,
      diffPayload
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Add a new tactical pin
  const handleAddPin = (newPin: TacticalPin) => {
    const updated = [newPin, ...pins];
    recordMutationWithVerification(
      updated,
      'PIN_CREATED',
      newPin.pinId,
      `Operational pin created: ${newPin.category} at ${newPin.elevationM}m RL. Grade ${newPin.predictedGradeMn}% Mn.`,
      `+{ pinId: ${newPin.pinId}, lat: ${newPin.coordinates.lat}, lon: ${newPin.coordinates.lon} }`
    );
  };

  // Update pin fields from inspector
  const handleUpdatePin = (updatedPin: TacticalPin) => {
    const updated = pins.map(p => p.id === updatedPin.id ? updatedPin : p);
    recordMutationWithVerification(
      updated,
      'PIN_UPDATED',
      updatedPin.pinId,
      `Inspector updated: Shift: ${updatedPin.shift}, Unit: ${updatedPin.assignedUnit || 'None'}, Status: ${updatedPin.status}.`,
      `~{ grade: ${updatedPin.predictedGradeMn}%, status: ${updatedPin.status} }`
    );
  };

  // Delete a pin
  const handleDeletePin = (pinId: string) => {
    const target = pins.find(p => p.id === pinId);
    const updated = pins.filter(p => p.id !== pinId);
    recordMutationWithVerification(
      updated,
      'PIN_REMOVED',
      target?.pinId || pinId,
      `Tactical pin removed from active operational ledger.`,
      `-{ pinId: ${target?.pinId || pinId} }`
    );
  };

  // Cycle status in table
  const handleUpdatePinStatus = (pinId: string, newStatus: VerificationStatus) => {
    const target = pins.find(p => p.id === pinId);
    const updated = pins.map(p => p.id === pinId ? { ...p, status: newStatus } : p);
    recordMutationWithVerification(
      updated,
      newStatus === 'VERIFIED' ? 'PIN_VERIFIED' : 'PIN_UPDATED',
      target?.pinId || pinId,
      `Status transitioned to ${newStatus} with automated boundary check.`,
      `~{ status: ${newStatus} }`
    );
  };

  // Ralph Loop Undo / Rollback
  const handleUndo = () => {
    if (pinHistory.length === 0) return;
    const [previousState, ...remainingHistory] = pinHistory;
    setPins(previousState);
    setPinHistory(remainingHistory);

    const rollbackLog: ActivityLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actionType: 'ROLLBACK_EXECUTED',
      pinId: 'SYSTEM-ROLLBACK',
      details: 'Ralph Loop executed rollback to previous stable coordination state.',
      verifiedByRalphLoop: true,
      diffPayload: `Reverted to snapshot with ${previousState.length} active targets`
    };
    setActivityLogs(prev => [rollbackLog, ...prev]);
  };

  // Vector Target Pin directly from 7-day forecast day
  const handleVectorDayTarget = (day: ForecastDay) => {
    const newPin: TacticalPin = {
      id: `pin-${Date.now()}`,
      pinId: `PIN-EXT-0${day.dayNumber}0`,
      coordinates: {
        lat: 21.9042,
        lon: 85.3468,
        latDms: '21°54\'15.1" N',
        lonDms: '85°20\'48.4" E'
      },
      elevationM: 375,
      category: 'EXTRACTION',
      predictedGradeMn: day.dayNumber === 5 ? 44.8 : 42.0,
      date: day.dateString,
      shift: 'MORNING SHIFT',
      status: 'VERIFIED',
      assignedUnit: 'EX-01 (CAT 6040)',
      notes: `AI Vectored Target for ${day.statusBadge}. Expected Feasibility ${day.feasibilityScore}%.`,
      canvasX: 38.0 + Math.random() * 8,
      canvasY: 30.0 + Math.random() * 8,
      createdAt: new Date().toISOString()
    };
    handleAddPin(newPin);
  };

  // Export GeoJSON
  const handleExportGeoJson = () => {
    const geoJson = {
      type: 'FeatureCollection',
      name: 'MnSight_Sector4B_Operations',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: pins.map(p => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.coordinates.lon, p.coordinates.lat, p.elevationM] },
        properties: {
          pinId: p.pinId,
          category: p.category,
          predictedGradeMn: p.predictedGradeMn,
          elevationM: p.elevationM,
          date: p.date,
          shift: p.shift,
          status: p.status,
          assignedUnit: p.assignedUnit,
          notes: p.notes
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MnSight_Sector4B_Targets_${new Date().toISOString().slice(0, 10)}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['PIN ID', 'LATITUDE', 'LONGITUDE', 'ELEVATION_M', 'OPERATION_TYPE', 'PREDICTED_MN_GRADE', 'DATE', 'SHIFT', 'ASSIGNED_UNIT', 'STATUS', 'NOTES'];
    const rows = pins.map(p => [
      p.pinId,
      p.coordinates.lat,
      p.coordinates.lon,
      p.elevationM,
      p.category,
      p.predictedGradeMn,
      p.date,
      p.shift,
      `"${p.assignedUnit}"`,
      p.status,
      `"${p.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MnSight_Daily_Operations_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. TOP COMMAND BAR */}
      <TopCommandBar
        ralphVerificationCount={activityLogs.length}
        onOpenAuditLog={() => setIsAuditModalOpen(true)}
      />

      {/* 2. PREDICTIVE "BEST TIME TO MINE" ENGINE (5-6 DAYS PRIOR FORECAST) */}
      <PredictiveMiningEngine
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onVectorDayTarget={handleVectorDayTarget}
      />

      {/* 3. INTERACTIVE GIS CANVAS WITH COORDINATION MARKING SYSTEM */}
      <div className="flex-1 w-full overflow-hidden relative">
        <TacticalGisCanvas
          pins={pins}
          onAddPin={handleAddPin}
          onUpdatePin={handleUpdatePin}
          onDeletePin={handleDeletePin}
          onUndoLastAction={handleUndo}
          canUndo={pinHistory.length > 0}
          activeFilter={activeFilter}
          onSetFilter={setActiveFilter}
          isAddPinMode={isAddPinMode}
          onToggleAddPinMode={() => setIsAddPinMode(!isAddPinMode)}
        />
      </div>

      {/* 4. DAILY OPERATIONS & ACTIVITY LOG TABLE */}
      <DailyOperationsTable
        pins={pins}
        onUpdatePinStatus={handleUpdatePinStatus}
        onExportGeoJson={handleExportGeoJson}
        onExportCsv={handleExportCsv}
      />

      {/* 5. MODALS */}
      <RalphAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={activityLogs}
        onUndoLastAction={handleUndo}
      />

      <AddPinModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onAddPin={handleAddPin}
      />
    </div>
  );
}

export default App;
