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
