import React, { useMemo } from 'react';
import { generateQrMatrix } from '../utils/qrGenerator';

interface QrCodeSvgProps {
  value: string;
  size?: number; // pixel width/height
  fgColor?: string;
  bgColor?: string;
  className?: string;
  centerBadgeText?: string;
}

export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({
  value,
  size = 140,
  fgColor = '#0f172a',
  bgColor = '#ffffff',
  className = '',
  centerBadgeText,
}) => {
  const matrix = useMemo(() => generateQrMatrix(value, 25), [value]);
  const matrixSize = matrix.length;
  const cellSize = 10;
  const viewBoxSize = matrixSize * cellSize;

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        <rect width={viewBoxSize} height={viewBoxSize} fill={bgColor} />
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fgColor}
              />
            );
          })
        )}
      </svg>
      {centerBadgeText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white border-2 border-slate-900 px-1.5 py-0.5 rounded shadow-sm">
            <span className="text-[10px] font-bold text-slate-900 tracking-tight leading-none">
              {centerBadgeText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
