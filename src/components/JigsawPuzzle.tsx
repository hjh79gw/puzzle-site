'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  loadAndResizeImage,
  splitImage,
  shuffleArray,
  formatTime,
} from '@/lib/puzzle-engine';
import PuzzleComplete from './PuzzleComplete';

interface JigsawPuzzleProps {
  imageSrc: string;
  gridSize: number;
  onNewGame: () => void;
}

interface Piece {
  id: number;
  correctIndex: number;
  currentX: number;
  currentY: number;
  placed: boolean;
  imageData: ImageData;
}

export default function JigsawPuzzle({
  imageSrc,
  gridSize,
  onNewGame,
}: JigsawPuzzleProps) {
  const t = useTranslations('Play');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [pieceSize, setPieceSize] = useState({ w: 0, h: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SNAP_DISTANCE = 20;

  // Initialize puzzle
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const maxSize = Math.min(
        (containerRef.current?.clientWidth ?? 600) - 20,
        600
      );
      const canvas = await loadAndResizeImage(imageSrc, maxSize);
      if (cancelled) return;

      setOriginalCanvas(canvas);
      setCanvasSize({ w: canvas.width, h: canvas.height });

      const { pieces: imageDataPieces, pieceWidth, pieceHeight } = splitImage(
        canvas,
        gridSize,
        gridSize
      );
      setPieceSize({ w: pieceWidth, h: pieceHeight });

      // Create pieces with random positions
      const allPieces: Piece[] = imageDataPieces.map((imgData, i) => ({
        id: i,
        correctIndex: i,
        currentX: Math.random() * (canvas.width - pieceWidth),
        currentY: Math.random() * (canvas.height - pieceHeight),
        placed: false,
        imageData: imgData,
      }));

      setPieces(shuffleArray(allPieces));
      setMoves(0);
      setSeconds(0);
      setCompleted(false);

      // Start timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    init();

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imageSrc, gridSize]);

  // Draw pieces on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pieces.length) return;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid guide
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * pieceSize.w, 0);
      ctx.lineTo(i * pieceSize.w, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * pieceSize.h);
      ctx.lineTo(canvas.width, i * pieceSize.h);
      ctx.stroke();
    }

    // Draw hint if active
    if (showHint && originalCanvas) {
      ctx.globalAlpha = 0.2;
      ctx.drawImage(originalCanvas, 0, 0);
      ctx.globalAlpha = 1.0;
    }

    // Draw placed pieces first, then unplaced, dragging piece last
    const sortedPieces = [...pieces].sort((a, b) => {
      if (a.id === dragging) return 1;
      if (b.id === dragging) return -1;
      if (a.placed && !b.placed) return -1;
      if (!a.placed && b.placed) return 1;
      return 0;
    });

    for (const piece of sortedPieces) {
      // Create temp canvas for piece
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = pieceSize.w;
      tempCanvas.height = pieceSize.h;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(piece.imageData, 0, 0);

      ctx.save();

      if (piece.placed) {
        ctx.globalAlpha = 1.0;
      } else if (piece.id === dragging) {
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
      }

      ctx.drawImage(tempCanvas, piece.currentX, piece.currentY);

      // Draw border
      ctx.strokeStyle = piece.placed
        ? 'rgba(34, 197, 94, 0.6)'
        : 'rgba(100, 116, 139, 0.4)';
      ctx.lineWidth = piece.placed ? 2 : 1;
      ctx.strokeRect(
        piece.currentX,
        piece.currentY,
        pieceSize.w,
        pieceSize.h
      );

      ctx.restore();
    }
  }, [pieces, pieceSize, gridSize, dragging, showHint, originalCanvas]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Check completion
  useEffect(() => {
    if (pieces.length > 0 && pieces.every((p) => p.placed)) {
      setCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [pieces]);

  // Mouse/Touch handlers
  const getCanvasPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const pos = getCanvasPos(e.clientX, e.clientY);

    // Find topmost unplaced piece under cursor
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      if (p.placed) continue;
      if (
        pos.x >= p.currentX &&
        pos.x <= p.currentX + pieceSize.w &&
        pos.y >= p.currentY &&
        pos.y <= p.currentY + pieceSize.h
      ) {
        setDragging(p.id);
        setDragOffset({ x: pos.x - p.currentX, y: pos.y - p.currentY });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging === null) return;
    const pos = getCanvasPos(e.clientX, e.clientY);

    setPieces((prev) =>
      prev.map((p) =>
        p.id === dragging
          ? {
              ...p,
              currentX: pos.x - dragOffset.x,
              currentY: pos.y - dragOffset.y,
            }
          : p
      )
    );
  };

  const handlePointerUp = () => {
    if (dragging === null) return;

    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== dragging) return p;

        const correctCol = p.correctIndex % gridSize;
        const correctRow = Math.floor(p.correctIndex / gridSize);
        const targetX = correctCol * pieceSize.w;
        const targetY = correctRow * pieceSize.h;

        const dist = Math.sqrt(
          (p.currentX - targetX) ** 2 + (p.currentY - targetY) ** 2
        );

        if (dist < SNAP_DISTANCE) {
          return { ...p, currentX: targetX, currentY: targetY, placed: true };
        }
        return p;
      })
    );

    setMoves((m) => m + 1);
    setDragging(null);
  };

  const handleReset = () => {
    setPieces((prev) =>
      shuffleArray(
        prev.map((p) => ({
          ...p,
          currentX: Math.random() * (canvasSize.w - pieceSize.w),
          currentY: Math.random() * (canvasSize.h - pieceSize.h),
          placed: false,
        }))
      )
    );
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full border border-[var(--color-border)] rounded-lg touch-none"
        style={{ aspectRatio: `${canvasSize.w} / ${canvasSize.h}` }}
      />
    </div>
  );
}
