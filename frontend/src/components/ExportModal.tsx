import { useState } from 'react';
import { 
  Download, 
  FileText, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  X, 
  Sparkles 
} from 'lucide-react';
import type { BeltSector } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sector: BeltSector;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, sector }) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = (format: string, filename: string) => {
    setDownloading(format);
    setTimeout(() => {
      // Create and trigger mock blob download
      const element = document.createElement('a');
      const file = new Blob([
        JSON.stringify({
          project: "MnSight: Satellite AI for Manganese Reserves",
          organization: "MOIL Limited / Ministry of Steel",
          sector: sector.breadcrumb,
          coordinates: sector.coordinates,
          timestamp: new Date().toISOString(),
          format: format,
          payload: "Geospatial coordinate raster with SWIR B11/B12 ratios and 0-1 MPI prospectivity grid."
        }, null, 2)
      ], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setDownloading(null);
      setDownloaded(format);
      setTimeout(() => setDownloaded(null), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg tactical-glass border border-slate-700/80 rounded-2xl p-5 shadow-2xl space-y-4 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase">Export Geospatial Intelligence</h3>
              <p className="text-[11px] text-slate-400">{sector.breadcrumb}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {/* 1. GeoTIFF */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <Layers className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-100">Multi-Band GeoTIFF (.tif)</div>
                <div className="text-[10px] text-slate-400">32-bit Float Raster (0.0–1.0 MPI Prospectivity Grid + SWIR Ratios)</div>
              </div>
            </div>
            <button
              onClick={() => handleDownload('geotiff', `${sector.id}_prospectivity_32bit.tif.json`)}
              className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {downloading === 'geotiff' ? 'Processing...' : (downloaded === 'geotiff' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" /> : 'Download')}
            </button>
          </div>

          {/* 2. ESRI Shapefile */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-100">ESRI Shapefile / GeoJSON (.zip)</div>
                <div className="text-[10px] text-slate-400">Target Hotspot Polygons, Bench Lithology &amp; Fault Strike Lines</div>
              </div>
            </div>
            <button
              onClick={() => handleDownload('shapefile', `${sector.id}_anomalies_shapefile.geojson`)}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {downloading === 'shapefile' ? 'Packaging...' : (downloaded === 'shapefile' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" /> : 'Download')}
            </button>
          </div>

          {/* 3. Borehole Drill Plan */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-100">Diamond-Core Drill Schedule (.csv)</div>
                <div className="text-[10px] text-slate-400">Coordinates, Depths, Estimated Mn Grades, and Azimuth Angles</div>
              </div>
            </div>
            <button
              onClick={() => handleDownload('csv', `${sector.id}_drill_targets.csv`)}
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {downloading === 'csv' ? 'Exporting...' : (downloaded === 'csv' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" /> : 'Download')}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 border-t border-slate-800">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Compliant with Geological Survey of India (GSI) &amp; UNFC Standards</span>
        </div>
      </div>
    </div>
  );
};
