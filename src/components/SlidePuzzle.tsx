'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  loadAndResizeImage,
  splitImage,
  generateSolvableSlidePuzzle,
  formatTime,
} from '@/lib/puzzle-engine';
import PuzzleComplete from './PuzzleComplete';

interface SlidePuzzleProps {
  imageSrc: string;
  gridSize: number;
  onNewGame: () => void;
}

export default function SlidePuzzle({
  imageSrc,
  gridSize,
  onNewGame,
}: SlidePuzzleProps) {
  const t = useTranslations('Play');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState<number[]>([]);
  const [pieceImages, setPieceImages] = useState<ImageData[]>([]);
  const [pieceSize, setPieceSize] = useState({ w: 0, h: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const blankId = gridSize * gridSize - 1;

  // Initialize
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const maxSize = Math.min(
        (containerRef.current?.clientWidth ?? 500) - 20,
        500
      );
      const canvas = await loadAndResizeImage(imageSrc, maxSize);
      if (cancelled) return;

      setOriginalCanvas(canvas);
      setCanvasSize({ w: canvas.width, h: canvas.height });

      const { pieces, pieceWidth, pieceHeight } = splitImage(
        canvas,
        gridSize,
        gridSize
      );
      setPieceImages(pieces);
      setPieceSize({ w: pieceWidth, h: pieceHeight });

      const arrangement = generateSolvableSlidePuzzle(gridSize);
      setTiles(arrangement);
      setMoves(0);
      setSeconds(0);
      setCompleted(false);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }

    init();
    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imageSrc, gridSize]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tiles.length || !pieceImages.length) return;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw hint
    if (showHint && originalCanvas) {
      ctx.globalAlpha = 0.15;
      ctx.drawImage(originalCanvas, 0, 0);
      ctx.globalAlpha = 1.0;
    }

    for (let pos = 0; pos < tiles.length; pos++) {
      const tileId = tiles[pos];
      if (tileId === blankId) continue; // Skip blank

      const col = pos % gridSize;
      const row = Math.floor(pos / gridSize);
      const x = col * pieceSize.w;
      const y = row * pieceSize.h;

      // Draw piece image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = pieceSize.w;
      tempCanvas.height = pieceSize.h;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(pieceImages[tileId], 0, 0);
      ctx.drawImage(tempCanvas, x, y);

      // Draw border
      const isCorrect = tileId === pos;
      ctx.strokeStyle = isCorrect
        ? 'rgba(34, 197, 94, 0.6)'
        : 'rgba(100, 116, 139, 0.3)';
      ctx.lineWidth = isCorrect ? 2 : 1;
      ctx.strokeRect(x, y, pieceSize.w, pieceSize.h);
    }

    // Draw blank space
    const blankPos = tiles.indexOf(blankId);
    const blankCol = blankPos % gridSize;
    const blankRow = Math.floor(blankPos / gridSize);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(
      blankCol * pieceSize.w,
      blankRow * pieceSize.h,
      pieceSize.w,
      pieceSize.h
    );
  }, [tiles, pieceImages, pieceSize, gridSize, blankId, showHint, originalCanvas]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Check completion
  useEffect(() => {
    if (
      tiles.length > 0 &&
      tiles.every((tileId, pos) => tileId === pos)
    ) {
      setCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [tiles]);

  // Move tile
  const moveTile = useCallback(
    (clickedPos: number) => {
      const blankPos = tiles.indexOf(blankId);
      const clickedRow = Math.floor(clickedPos / gridSize);
      const clickedCol = clickedPos % gridSize;
      const blankRow = Math.floor(blankPos / gridSize);
      const blankCol = blankPos % gridSize;

      // Check adjacency
      const isAdjacent =
        (Math.abs(clickedRow - blankRow) === 1 && clickedCol === blankCol) ||
        (Math.abs(clickedCol - blankCol) === 1 && clickedRow === blankRow);

      if (!isAdjacent) return;

      setTiles((prev) => {
        const next = [...prev];
        [next[clickedPos], next[blankPos]] = [next[blankPos], next[clickedPos]];
        return next;
      });
      setMoves((m) => m + 1);
    },
    [tiles, blankId, gridSize]
  );

  // Click handler
  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(x / pieceSize.w);
    const row = Math.floor(y / pieceSize.h);
    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      moveTile(row * gridSize + col);
    }
  };

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const minSwipe = 30;
    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;

    const blankPos = tiles.indexOf(blankId);
    const blankRow = Math.floor(blankPos / gridSize);
    const blankCol = blankPos % gridSize;

    let targetPos = -1;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe - move piece INTO blank
      if (dx > 0 && blankCol > 0) {
        targetPos = blankRow * gridSize + (blankCol - 1);
      } else if (dx < 0 && blankCol < gridSize - 1) {
        targetPos = blankRow * gridSize + (blankCol + 1);
      }
    } else {
      // Vertical swipe
      if (dy > 0 && blankRow > 0) {
        targetPos = (blankRow - 1) * gridSize + blankCol;
      } else if (dy < 0 && blankRow < gridSize - 1) {
        targetPos = (blankRow + 1) * gridSize + blankCol;
      }
    }

    if (targetPos >= 0) {
      moveTile(targetPos);
    }
  };

  const handleReset = () => {
    const arrangement = generateSolvableSlidePuzzle(gridSize);
    setTiles(arrangement);
    setMoves(0);
    setSeconds(0);
    setCompleted(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  if (completed) {
    return (
      <PuzzleComplete
        time={seconds}
        moves={moves}
        onPlayAgain={handleReset}
        onNewGame={onNewGame}
      />
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-4 text-sm">
          <span>
            ⏱ {t('time')}: <strong>{formatTime(seconds)}</strong>
          </span>
          <span>
            👆 {t('moves')}: <strong>{moves}</strong>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
          >
            {showHint ? t('hideHint') : t('hint')}
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
          >
            {t('reset')}
          </button>
          <button
            onClick={onNewGame}
            className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
          >
            {t('newPhoto')}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full border border-[var(--color-border)] rounded-lg cursor-pointer touch-none"
        style={{ aspectRatio: `${canvasSize.w} / ${canvasSize.h}` }}
      />
    </div>
  );
}
