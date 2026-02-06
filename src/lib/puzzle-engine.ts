export interface PuzzlePiece {
  id: number;
  currentIndex: number;
  correctIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Loads an image from a blob URL and resizes it to fit within maxSize.
 * Returns an HTMLCanvasElement with the resized image.
 */
export function loadAndResizeImage(
  src: string,
  maxSize: number
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      // Make dimensions divisible by common grid sizes
      width = Math.floor(width / 8) * 8;
      height = Math.floor(height / 8) * 8;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Splits a canvas image into a grid of pieces.
 * Returns ImageData for each piece.
 */
export function splitImage(
  canvas: HTMLCanvasElement,
  cols: number,
  rows: number
): { pieces: ImageData[]; pieceWidth: number; pieceHeight: number } {
  const ctx = canvas.getContext('2d')!;
  const pieceWidth = Math.floor(canvas.width / cols);
  const pieceHeight = Math.floor(canvas.height / rows);
  const pieces: ImageData[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push(
        ctx.getImageData(
          col * pieceWidth,
          row * pieceHeight,
          pieceWidth,
          pieceHeight
        )
      );
    }
  }

  return { pieces, pieceWidth, pieceHeight };
}

/**
 * Fisher-Yates shuffle for jigsaw puzzle pieces.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Counts the number of inversions in an array.
 * An inversion is when a larger number appears before a smaller number.
 */
function countInversions(arr: number[]): number {
  let inversions = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

/**
 * Generates a solvable slide puzzle arrangement.
 * For a slide puzzle to be solvable:
 * - If grid width is odd: number of inversions must be even
 * - If grid width is even: inversions + row of blank from bottom must be odd
 */
export function generateSolvableSlidePuzzle(size: number): number[] {
  const total = size * size;
  const blankIndex = total - 1; // blank is last

  while (true) {
    // Create array [0, 1, 2, ..., total-2] (without the blank)
    const tiles = Array.from({ length: total - 1 }, (_, i) => i);
    const shuffled = shuffleArray(tiles);

    // Add blank at the end (bottom-right)
    shuffled.push(blankIndex);

    // Check solvability (blank at bottom-right = row 1 from bottom)
    const inversions = countInversions(
      shuffled.filter((x) => x !== blankIndex)
    );

    if (size % 2 === 1) {
      // Odd grid: inversions must be even
      if (inversions % 2 === 0) return shuffled;
    } else {
      // Even grid: inversions + blank row from bottom must be odd
      const blankRow = Math.floor(shuffled.indexOf(blankIndex) / size);
      const blankRowFromBottom = size - 1 - blankRow;
      if ((inversions + blankRowFromBottom) % 2 === 1) return shuffled;
    }
  }
}

/**
 * Formats seconds into MM:SS string.
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ─── Jigsaw Piece Shape Engine ────────────────────────────────────────────────

/** Edge types: 0 = flat (border), 1 = tab (outward bump), -1 = blank (inward indent) */
export interface JigsawEdges {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Minimal path interface so we can draw on both Path2D and CanvasRenderingContext2D */
interface PathLike {
  lineTo(x: number, y: number): void;
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): void;
}

/**
 * Generates complementary jigsaw edge assignments for every piece in a grid.
 * Internal edges are randomly tab (1) or blank (-1).
 * Border edges are flat (0).
 * Neighbouring pieces always get the opposite sign so they interlock.
 */
export function generateJigsawEdges(
  rows: number,
  cols: number
): JigsawEdges[][] {
  // Horizontal shared edges (between row r and row r+1)
  const horizontalEdges: number[][] = [];
  for (let r = 0; r < rows - 1; r++) {
    horizontalEdges[r] = [];
    for (let c = 0; c < cols; c++) {
      horizontalEdges[r][c] = Math.random() > 0.5 ? 1 : -1;
    }
  }

  // Vertical shared edges (between col c and col c+1)
  const verticalEdges: number[][] = [];
  for (let r = 0; r < rows; r++) {
    verticalEdges[r] = [];
    for (let c = 0; c < cols - 1; c++) {
      verticalEdges[r][c] = Math.random() > 0.5 ? 1 : -1;
    }
  }

  // Build per-piece edge descriptors
  const edges: JigsawEdges[][] = [];
  for (let r = 0; r < rows; r++) {
    edges[r] = [];
    for (let c = 0; c < cols; c++) {
      edges[r][c] = {
        top: r === 0 ? 0 : -horizontalEdges[r - 1][c],
        right: c === cols - 1 ? 0 : verticalEdges[r][c],
        bottom: r === rows - 1 ? 0 : horizontalEdges[r][c],
        left: c === 0 ? 0 : -verticalEdges[r][c - 1],
      };
    }
  }

  return edges;
}

/**
 * Draws one jigsaw edge along a straight line from (x1,y1) to (x2,y2).
 *  tabType  0 → straight line (border edge)
 *  tabType  1 → tab bulging outward (perpendicular to travel direction)
 *  tabType -1 → blank / indent (opposite direction)
 *
 * The curve is a classic jigsaw "neck + rounded bump" drawn with bezier segments.
 */
export function drawJigsawEdge(
  path: PathLike,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tabType: number
): void {
  if (tabType === 0) {
    path.lineTo(x2, y2);
    return;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Unit tangent (along the edge)
  const tx = dx / len;
  const ty = dy / len;

  // Unit normal (perpendicular), sign controlled by tabType
  const nx = -ty * tabType;
  const ny = tx * tabType;

  // Tab height relative to edge length
  const tabH = len * 0.20;

  // Key positions along the edge (parametric t values)
  // Straight run → neck inward → rounded bump → neck inward → straight run
  const neckStart = 0.35;
  const neckEnd = 0.65;
  const neckWidth = len * 0.04; // slight inward pinch at neck

  // Neck start point
  const nsX = x1 + dx * neckStart;
  const nsY = y1 + dy * neckStart;

  // Neck end point
  const neX = x1 + dx * neckEnd;
  const neY = y1 + dy * neckEnd;

  // Midpoint
  const mx = x1 + dx * 0.5;
  const my = y1 + dy * 0.5;

  // Straight segment to neck start
  path.lineTo(nsX, nsY);

  // Neck pinch inward then curve out to the tab peak (left half)
  path.bezierCurveTo(
    nsX - nx * neckWidth,
    nsY - ny * neckWidth,
    mx - tx * len * 0.15 + nx * tabH,
    my - ty * len * 0.15 + ny * tabH,
    mx + nx * tabH,
    my + ny * tabH
  );

  // Tab peak back down to the neck (right half)
  path.bezierCurveTo(
    mx + tx * len * 0.15 + nx * tabH,
    my + ty * len * 0.15 + ny * tabH,
    neX - nx * neckWidth,
    neY - ny * neckWidth,
    neX,
    neY
  );

  // Straight segment to the edge end
  path.lineTo(x2, y2);
}

/**
 * Creates the full closed outline for a jigsaw piece as a Path2D.
 * The piece rectangle occupies (offsetX, offsetY) to (offsetX+pieceW, offsetY+pieceH),
 * but tabs may protrude beyond that rectangle.
 */
export function createJigsawPiecePath(
  pieceW: number,
  pieceH: number,
  edges: JigsawEdges,
  offsetX: number,
  offsetY: number
): Path2D {
  const path = new Path2D();
  const x = offsetX;
  const y = offsetY;

  path.moveTo(x, y);

  // Top edge (left → right)
  drawJigsawEdge(path, x, y, x + pieceW, y, edges.top);

  // Right edge (top → bottom)
  drawJigsawEdge(path, x + pieceW, y, x + pieceW, y + pieceH, edges.right);

  // Bottom edge (right → left)
  drawJigsawEdge(
    path,
    x + pieceW,
    y + pieceH,
    x,
    y + pieceH,
    edges.bottom
  );

  // Left edge (bottom → top)
  drawJigsawEdge(path, x, y + pieceH, x, y, edges.left);

  path.closePath();
  return path;
}

/**
 * Renders a single jigsaw piece from the source image onto its own canvas,
 * clipped to the jigsaw shape.  Returns the canvas plus layout metadata so
 * the caller knows how to position it.
 */
export function createJigsawPieceCanvas(
  sourceCanvas: HTMLCanvasElement,
  row: number,
  col: number,
  rows: number,
  cols: number,
  allEdges: JigsawEdges[][],
  pieceW: number,
  pieceH: number
): {
  canvas: HTMLCanvasElement;
  offsetX: number;
  offsetY: number;
  totalW: number;
  totalH: number;
} {
  const edges = allEdges[row][col];
  // Maximum tab protrusion (matches tabH = len * 0.20 inside drawJigsawEdge,
  // but we use the smaller dimension so corner pieces stay safe)
  const tabSize = Math.min(pieceW, pieceH) * 0.25;

  // Extra canvas padding on each side to accommodate outward tabs
  const extraLeft = edges.left !== 0 ? tabSize : 0;
  const extraRight = edges.right !== 0 ? tabSize : 0;
  const extraTop = edges.top !== 0 ? tabSize : 0;
  const extraBottom = edges.bottom !== 0 ? tabSize : 0;

  const totalW = pieceW + extraLeft + extraRight;
  const totalH = pieceH + extraTop + extraBottom;

  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(totalW);
  canvas.height = Math.ceil(totalH);
  const ctx = canvas.getContext('2d')!;

  // Source rectangle in the original image
  const srcX = col * pieceW;
  const srcY = row * pieceH;

  // Build the jigsaw clip path (piece grid rect starts at (extraLeft, extraTop))
  const path = createJigsawPiecePath(pieceW, pieceH, edges, extraLeft, extraTop);

  // Clip & draw the image region
  ctx.save();
  ctx.clip(path);
  ctx.drawImage(
    sourceCanvas,
    srcX - extraLeft,
    srcY - extraTop,
    totalW,
    totalH,
    0,
    0,
    totalW,
    totalH
  );
  ctx.restore();

  // Subtle dark outline so piece shapes are visible
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke(path);

  // Thin inner highlight for depth
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
  ctx.lineWidth = 0.75;
  ctx.stroke(path);

  return { canvas, offsetX: extraLeft, offsetY: extraTop, totalW, totalH };
}
