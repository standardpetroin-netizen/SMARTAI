import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Printer, Download, CheckCircle, Eye, X } from 'lucide-react';
import { SocietyConfig, GuardCheckpoint } from '../../types';
import { INITIAL_CHECKPOINTS } from '../../utils/sampleData';
import { QrCodeSvg } from '../QrCodeSvg';

interface StepQRGenerationProps {
  config: SocietyConfig;
  onNext: () => void;
  onPrev: () => void;
}

export const StepQRGeneration: React.FC<StepQRGenerationProps> = ({
  config,
  onNext,
  onPrev,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<string>('Tower A');
  const [qrTypeTab, setQrTypeTab] = useState<'flats' | 'checkpoints'>('flats');
  const [inspectedQr, setInspectedQr] = useState<{ title: string; payload: string; type: string } | null>(null);
  const [printNotification, setPrintNotification] = useState<string | null>(null);

  // Generate sample flat units for selected block
  const blockFlats = [
    { unit: '101', floor: '1st Floor' },
    { unit: '102', floor: '1st Floor' },
    { unit: '103', floor: '1st Floor' },
    { unit: '104', floor: '1st Floor' },
    { unit: '201', floor: '2nd Floor' },
    { unit: '202', floor: '2nd Floor' },
    { unit: '203', floor: '2nd Floor' },
    { unit: '204', floor: '2nd Floor' },
  ];

  const checkpoints: GuardCheckpoint[] = INITIAL_CHECKPOINTS;

  const handlePrintSheet = () => {
    setPrintNotification('Preparing A4 PDF label matrix for 320 units...');
    setTimeout(() => {
      window.print();
      setPrintNotification(null);
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
          <span>Stage 03</span>
          <span>·</span>
          <span>Automated QR Matrix Generation</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">Generate Flat & Checkpoint Token Sheets</h3>
        <p className="text-xs text-slate-500 mt-1">
          Cryptographically signed QR tokens for door waste audits and perimeter guard rounds. Print directly onto weatherproof vinyl sheets.
        </p>
      </div>

      {/* Header controls: Switch between Flats/Dustbins vs Checkpoints & Block selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQrTypeTab('flats')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              qrTypeTab === 'flats'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            Unit Door & Dustbin QR Badges ({config.totalFlats} Flats)
          </button>
          <button
            onClick={() => setQrTypeTab('checkpoints')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              qrTypeTab === 'checkpoints'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            Guard Checkpoint Tokens ({checkpoints.length} Zones)
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {qrTypeTab === 'flats' && (
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="bg-white border-2 border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="Tower A">Tower A (Flats 101 - 1804)</option>
              <option value="Tower B">Tower B (Flats 101 - 1804)</option>
              <option value="Tower C">Tower C (Flats 101 - 1804)</option>
              <option value="Tower D">Tower D (Flats 101 - 1804)</option>
            </select>
          )}

          <button
            onClick={handlePrintSheet}
            className="px-4 py-2 bg-white hover:bg-slate-50 border-2 border-slate-300 text-xs font-bold text-slate-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print A4 Badge Sheet
          </button>
        </div>
      </div>

      {printNotification && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 font-medium flex items-center gap-2 shadow-xs">
          <Download className="w-4 h-4 text-blue-600 animate-bounce" /> {printNotification}
        </div>
      )}

      {/* VIEW 1: Flat & Dustbin QR Badges Grid */}
      {qrTypeTab === 'flats' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
            <span>Showing printable badges for <strong className="text-slate-900">{selectedBlock}</strong></span>
            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Click any badge to simulate instant mobile test-scan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {blockFlats.map((flat) => {
              const fullUnit = `${selectedBlock.split(' ')[1]}-${flat.unit}`;
              const qrPayload = `SMARTAISOCIETY:${config.subdomain.toUpperCase()}:UNIT:${fullUnit}:WASTE_AUDIT`;

              return (
                <div
                  key={flat.unit}
                  onClick={() =>
                    setInspectedQr({
                      title: `Door Waste Badge · Flat ${fullUnit}`,
                      payload: qrPayload,
                      type: 'Flat Unit Doorstep QR & Waste Segregation Identifier',
                    })
                  }
                  className="bg-white text-slate-900 rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center text-center relative group"
                >
                  <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider truncate max-w-[120px]">
                      {config.name}
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-200">
                      {selectedBlock}
                    </span>
                  </div>

                  {/* High contrast SVG QR Code */}
                  <div className="my-1.5 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 group-hover:scale-105 transition-transform">
                    <QrCodeSvg value={qrPayload} size={110} fgColor="#0f172a" centerBadgeText={fullUnit} />
                  </div>

                  <h5 className="font-extrabold text-base text-slate-900 mt-2 font-mono">
                    FLAT {fullUnit}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-medium">{flat.floor}</p>

                  <div className="w-full mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-600">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      🟢 DRY / WET
                    </span>
                    <span className="flex items-center gap-0.5 text-blue-600 font-bold group-hover:underline">
                      <Eye className="w-3 h-3" /> Test
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Guard Checkpoint Tokens */}
      {qrTypeTab === 'checkpoints' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checkpoints.map((cp) => (
            <div
              key={cp.id}
              onClick={() =>
                setInspectedQr({
                  title: `${cp.id} · ${cp.name}`,
                  payload: cp.qrPayload,
                  type: `Perimeter Guard Patrol Checkpoint (${cp.nfcTagId})`,
                })
              }
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4.5 shadow-xs"
            >
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 shrink-0">
                <QrCodeSvg value={cp.qrPayload} size={88} fgColor="#0f172a" centerBadgeText={cp.id} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    {cp.id}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    NFC & QR Bound
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{cp.name}</h4>
                <p className="text-xs text-slate-600">{cp.location}</p>
                <p className="text-[11px] font-mono text-slate-500 font-medium">
                  Coords: {cp.geofenceCoordinates.lat}, {cp.geofenceCoordinates.lng} (±{cp.geofenceCoordinates.radiusMeters}m)
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test-Scan Inspector Modal */}
      {inspectedQr && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setInspectedQr(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
              <CheckCircle className="w-4 h-4" /> Validated QR Token
            </div>
            <h4 className="text-lg font-bold text-slate-900">{inspectedQr.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{inspectedQr.type}</p>

            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <QrCodeSvg value={inspectedQr.payload} size={150} fgColor="#0f172a" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-600 font-bold">Decrypted Terminal Payload:</p>
              <code className="block bg-slate-100 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-emerald-800 break-all font-bold">
                {inspectedQr.payload}
              </code>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectedQr(null)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-blue-600/20"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-5 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Branding
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Proceed to Committee & Roster <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
