import { useState, useEffect } from 'react';
import { TopNavBar } from './components/TopNavBar';
import { MetricPanel } from './components/MetricPanel';
import { GisCanvas } from './components/GisCanvas';
import { AnalysisDrawer } from './components/AnalysisDrawer';
import { ExportModal } from './components/ExportModal';
import type { BeltSector, HotspotAnomaly, LayerState } from './types';
import { BELT_SECTORS } from './mockData';

export function App() {
  // Sector Selection
  const [currentSector, setCurrentSector] = useState<BeltSector>(BELT_SECTORS[0]);

  // Selected Hotspot for Inspector Tooltip
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotAnomaly | null>(null);

  // Layer Visibility State
  const [layers, setLayers] = useState<LayerState>({
    trueColorBasemap: true,
    alterationHalos: true,
    geotechnicalElevation: true,
    anomalyPolygons: true,
    vehicleTelemetry: true,
    hexGridOverlay: true
  });

  // UI Panels Toggles
  const [isMetricPanelCollapsed, setIsMetricPanelCollapsed] = useState(false);
  const [isAnalysisDrawerOpen, setIsAnalysisDrawerOpen] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toggle individual layers
  const handleToggleLayer = (layerKey: keyof LayerState) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // Attempt to fetch live telemetry or prospectivity from FastAPI backend if available
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const res = await fetch('/api/telemetry/pit-status?mine_id=balaghat');
        if (res.ok) {
          const data = await res.json();
          console.log('[MnSight] Live MOIL telemetry connected:', data);
        }
      } catch (err) {
        console.log('[MnSight] Running in self-contained high-fidelity offline mode');
      }
    };
    fetchBackendData();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. TOP NAVIGATION BAR */}
      <TopNavBar
        currentSector={currentSector}
        onSelectSector={(sector) => {
          setCurrentSector(sector);
          setSelectedHotspot(null);
        }}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="relative flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* CENTER: Interactive GIS Canvas */}
        <GisCanvas
          currentSector={currentSector}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={setSelectedHotspot}
          layers={layers}
          onToggleLayer={handleToggleLayer}
        />

        {/* LEFT: Quick-Metric Overlay Panel */}
        <MetricPanel
          sector={currentSector}
          isCollapsed={isMetricPanelCollapsed}
          onToggleCollapse={() => setIsMetricPanelCollapsed(!isMetricPanelCollapsed)}
        />

        {/* RIGHT: Collapsible Analysis Drawer */}
        <AnalysisDrawer
          isOpen={isAnalysisDrawerOpen}
          onToggleOpen={() => setIsAnalysisDrawerOpen(!isAnalysisDrawerOpen)}
          selectedHotspot={selectedHotspot}
        />
      </div>

      {/* 3. EXPORT INTELLIGENCE MODAL */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        sector={currentSector}
      />
    </div>
  );
}

export default App;
