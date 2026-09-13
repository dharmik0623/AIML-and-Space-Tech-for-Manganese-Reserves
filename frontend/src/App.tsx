import { useState } from 'react';
import { GlobalHeaderBar } from './components/GlobalHeaderBar';
import { PitSpatialWorkspace } from './components/PitSpatialWorkspace';
import { DockedConsole } from './components/DockedConsole';
import { WaypointModal } from './components/WaypointModal';
import { SystemAuditModal } from './components/SystemAuditModal';
import { 
  MINE_LEASES, 
  INITIAL_OPERATIONAL_WAYPOINTS, 
  DEWP_SEVEN_DAY_FORECAST, 
  INITIAL_AUDIT_LOGS 
} from './data/miningData';
import type { 
  OperationalWaypoint, 
  DEWPForecastDay, 
  ADSDirective, 
  MineLeaseOption, 
  AuditLogEntry, 
  WaypointStatus 
} from './types';

export function App() {
  // 1. Concession Lease State
  const [selectedLease, setSelectedLease] = useState<MineLeaseOption>(MINE_LEASES[0]);

  // 2. Operational Waypoints with Rollback History Stack
  const [waypoints, setWaypoints] = useState<OperationalWaypoint[]>(INITIAL_OPERATIONAL_WAYPOINTS);
  const [waypointHistory, setWaypointHistory] = useState<OperationalWaypoint[][]>([]);

  // 3. System Operational Audit Ledger
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // 4. DEWP Rolling Forecast Selected Day (Defaults to T+5 Optimal Window)
  const [selectedForecastDay, setSelectedForecastDay] = useState<DEWPForecastDay>(DEWP_SEVEN_DAY_FORECAST[4]);

  // 5. Modal States
  const [isWaypointModalOpen, setIsWaypointModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [presetModalCoords, setPresetModalCoords] = useState<{
    lat: number;
    lon: number;
    utm: string;
    rl: number;
    canvasX: number;
    canvasY: number;
  } | undefined>(undefined);

  // State Mutation with System Verification Ledger
  const commitMutationWithAudit = (
    newWaypoints: OperationalWaypoint[],
    eventCode: string,
    pointId: string,
    details: string,
    diffPayload: string
  ) => {
    // 1. Push previous state to rollback history
    setWaypointHistory(prev => [waypoints, ...prev.slice(0, 15)]);

    // 2. Set new waypoints
    setWaypoints(newWaypoints);

    // 3. Append to system audit ledger
    const logEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventCode,
      pointId,
      details,
      diffPayload,
      operator: 'admin@omdc.gov.in',
      verifiedBySystem: true
    };
    setAuditLogs(prev => [logEntry, ...prev]);
  };

  // Add Operational Waypoint
  const handleAddWaypoint = (newWaypoint: OperationalWaypoint) => {
    const updated = [newWaypoint, ...waypoints];
    commitMutationWithAudit(
      updated,
      'WAYPOINT_COMMITTED',
      newWaypoint.pointId,
      `New coordinate logged: ${newWaypoint.operationalClass} at ${newWaypoint.elevationRl}m RL. Grade: ${newWaypoint.estimatedGradeMn}% Mn.`,
      `+{ pointId: "${newWaypoint.pointId}", utm: "${newWaypoint.coordinates.utm}", elev: ${newWaypoint.elevationRl}m }`
    );
  };

  // Update Waypoint from Inspector
  const handleUpdateWaypoint = (updatedWaypoint: OperationalWaypoint) => {
    const updated = waypoints.map(w => w.id === updatedWaypoint.id ? updatedWaypoint : w);
    commitMutationWithAudit(
      updated,
      'WAYPOINT_UPDATED',
      updatedWaypoint.pointId,
      `Waypoint fields modified: ${updatedWaypoint.operationalClass}, Shift: ${updatedWaypoint.shift}, Status: ${updatedWaypoint.status}.`,
      `~{ grade: ${updatedWaypoint.estimatedGradeMn}%, status: ${updatedWaypoint.status} }`
    );
  };

  // Delete Waypoint
  const handleDeleteWaypoint = (waypointId: string) => {
    const target = waypoints.find(w => w.id === waypointId);
    const updated = waypoints.filter(w => w.id !== waypointId);
    commitMutationWithAudit(
      updated,
      'WAYPOINT_PURGED',
      target?.pointId || waypointId,
      `Waypoint removed from active shift concession registry.`,
      `-{ pointId: "${target?.pointId || waypointId}" }`
    );
  };

  // Cycle Status in Ledger Table
  const handleUpdateWaypointStatus = (pointId: string, status: WaypointStatus) => {
    const target = waypoints.find(w => w.id === pointId);
    const updated = waypoints.map(w => w.id === pointId ? { ...w, status } : w);
    commitMutationWithAudit(
      updated,
      'STATUS_TRANSITION',
      target?.pointId || pointId,
      `Operational status transitioned to ${status}. Concession bounds verified.`,
      `~{ status: "${status}" }`
    );
  };

  // Dispatch Directive from ADS Tab
  const handleDispatchDirective = (directive: ADSDirective) => {
    // Generate operational coordinate if target coordinates exist
    const newWp: OperationalWaypoint = {
      id: `wp-${Date.now()}`,
      pointId: `MN-WP-${Math.floor(420 + Math.random() * 50)}`,
      coordinates: {
        lat: directive.targetCoordinates.lat,
        lon: directive.targetCoordinates.lon,
        latDms: `${directive.targetCoordinates.lat.toFixed(4)}° N`,
        lonDms: `${directive.targetCoordinates.lon.toFixed(4)}° E`,
        utm: directive.targetCoordinates.utm
      },
      elevationRl: directive.targetCoordinates.elevationRl,
      operationalClass: directive.category === 'TARGET EXTRACTION' 
        ? 'Controlled Pre-Split Blast' 
        : directive.category === 'GEOTECHNICAL' 
        ? 'Geotechnical Piezometer' 
        : 'Haul Ramp Maintenance',
      estimatedGradeMn: directive.suggestedGradeMn ?? 0.0,
      assignedRigOrFleet: directive.assignedRigOrFleet ?? 'Dispatched Field Rig',
      shift: 'Shift A (06:00 - 14:00)',
      status: 'IN PROGRESS',
      fieldRemarks: `ADS Directive: ${directive.directiveText}`,
      canvasX: 38.0 + Math.random() * 8,
      canvasY: 30.0 + Math.random() * 8,
      timestampIso: new Date().toISOString()
    };

    const updated = [newWp, ...waypoints];
    commitMutationWithAudit(
      updated,
      'DIRECTIVE_DISPATCHED',
      newWp.pointId,
      `ADS Directive dispatched to field telemetry: ${directive.directiveText.slice(0, 75)}...`,
      `+{ pointId: "${newWp.pointId}", category: "${directive.category}", conf: ${directive.confidencePct}% }`
    );
  };

  // Rollback to Previous State
  const handleRollback = () => {
    if (waypointHistory.length === 0) return;
    const [previousState, ...remainingHistory] = waypointHistory;
    setWaypoints(previousState);
    setWaypointHistory(remainingHistory);

    const rollbackEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventCode: 'ROLLBACK_TRIGGERED',
      pointId: 'SYSTEM-RESTORE',
      details: 'Concession state reverted to previous stable snapshot.',
      diffPayload: `Reverted to snapshot with ${previousState.length} active registered waypoints`,
      operator: 'admin@omdc.gov.in',
      verifiedBySystem: true
    };
    setAuditLogs(prev => [rollbackEntry, ...prev]);
  };

  // Export GeoJSON
  const handleExportGeoJson = () => {
    const geoJson = {
      type: 'FeatureCollection',
      name: `MnSight_${selectedLease.id}_Operations`,
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:EPSG::32645' }
      },
      features: waypoints.map(w => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [w.coordinates.lon, w.coordinates.lat, w.elevationRl]
        },
        properties: {
          pointId: w.pointId,
          operationalClass: w.operationalClass,
          estimatedGradeMn: w.estimatedGradeMn,
          elevationRl: w.elevationRl,
          assignedRigOrFleet: w.assignedRigOrFleet,
          shift: w.shift,
          status: w.status,
          fieldRemarks: w.fieldRemarks,
          timestampIso: w.timestampIso
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MnSight_${selectedLease.code}_${new Date().toISOString().slice(0, 10)}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'POINT_ID', 
      'LATITUDE', 
      'LONGITUDE', 
      'UTM_ZONE45N', 
      'ELEVATION_RL', 
      'OPERATIONAL_CLASS', 
      'EST_MN_GRADE_PCT', 
      'ASSIGNED_RIG_OR_FLEET', 
      'SHIFT', 
      'STATUS', 
      'FIELD_REMARKS'
    ];
    const rows = waypoints.map(w => [
      w.pointId,
      w.coordinates.lat,
      w.coordinates.lon,
      `"${w.coordinates.utm}"`,
      w.elevationRl,
      `"${w.operationalClass}"`,
      w.estimatedGradeMn,
      `"${w.assignedRigOrFleet}"`,
      `"${w.shift}"`,
      w.status,
      `"${w.fieldRemarks.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MnSight_${selectedLease.code}_ShiftManifest_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0D1117] text-[#E6EDF3] flex flex-col font-sans select-none">
      {/* 1. GLOBAL HEADER BAR */}
      <GlobalHeaderBar
        selectedLease={selectedLease}
        onSelectLease={setSelectedLease}
        onExportGeoJson={handleExportGeoJson}
        onExportCsv={handleExportCsv}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        auditCount={auditLogs.length}
      />

      {/* 2. INTERACTIVE PIT SPATIAL WORKSPACE (VIEWPORT) */}
      <div className="flex-1 w-full overflow-hidden relative">
        <PitSpatialWorkspace
          waypoints={waypoints}
          onAddWaypoint={handleAddWaypoint}
          onUpdateWaypoint={handleUpdateWaypoint}
          onDeleteWaypoint={handleDeleteWaypoint}
          onOpenWaypointModal={(presetCoords) => {
            setPresetModalCoords(presetCoords);
            setIsWaypointModalOpen(true);
          }}
        />
      </div>

      {/* 3. DOCKED BOTTOM CONSOLE (DEWP, ADS, SPATIAL OPERATIONS LEDGER) */}
      <DockedConsole
        waypoints={waypoints}
        onUpdateWaypointStatus={handleUpdateWaypointStatus}
        onExportGeoJson={handleExportGeoJson}
        onExportCsv={handleExportCsv}
        onDispatchDirective={handleDispatchDirective}
        selectedForecastDay={selectedForecastDay}
        onSelectForecastDay={setSelectedForecastDay}
      />

      {/* 4. MODALS */}
      <WaypointModal
        isOpen={isWaypointModalOpen}
        onClose={() => {
          setIsWaypointModalOpen(false);
          setPresetModalCoords(undefined);
        }}
        onSave={handleAddWaypoint}
        initialCoords={presetModalCoords}
      />

      <SystemAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={auditLogs}
        onRollback={handleRollback}
        canRollback={waypointHistory.length > 0}
      />
    </div>
  );
}

export default App;
