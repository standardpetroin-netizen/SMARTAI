/**
 * Deterministic SVG QR Matrix Generator
 * Generates valid-looking, high-contrast QR patterns for badges, checkpoints, and print sheets
 */

export function generateQrMatrix(text: string, size: number = 25): boolean[][] {
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Helper to place finder pattern (7x7)
  const placeFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer 7x7 ring
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // Inner 3x3 solid box
        ) {
          matrix[startRow + r][startCol + c] = true;
        } else {
          matrix[startRow + r][startCol + c] = false;
        }
      }
    }
  };

  // 1. Finder patterns at Top-Left, Top-Right, Bottom-Left
  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // 2. Timing patterns (Row 6 and Col 6)
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Alignment pattern at (size-9, size-9) if size >= 25
  if (size >= 25) {
    const alignR = size - 9;
    const alignC = size - 9;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
          matrix[alignR + r][alignC + c] = true;
        }
      }
    }
  }

  // 4. Deterministic hash-based data fill for remaining cells
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let bitIndex = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const inTopLeftFinder = r < 8 && c < 8;
      const inTopRightFinder = r < 8 && c >= size - 8;
      const inBottomLeftFinder = r >= size - 8 && c < 8;
      const inTiming = (r === 6 && c >= 8 && c < size - 8) || (c === 6 && r >= 8 && r < size - 8);
      const inAlign = size >= 25 && r >= size - 9 && r <= size - 5 && c >= size - 9 && c <= size - 5;

      if (inTopLeftFinder || inTopRightFinder || inBottomLeftFinder || inTiming || inAlign) {
        continue;
      }

      // Generate pseudorandom deterministic bits
      const seed = Math.sin(hash + bitIndex * 9301 + 49297) * 233280;
      matrix[r][c] = (seed - Math.floor(seed)) > 0.48;
      bitIndex++;
    }
  }

  return matrix;
}
