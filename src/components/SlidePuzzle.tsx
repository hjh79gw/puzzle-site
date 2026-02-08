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

interface DragState {
  tilePos: number;
  blankPos: number;
  axis: 'x' | 'y';
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
}

interface SnapAnim {
  tilePos: number;
  blankPos: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  willSwap: boolean;
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
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [snapAnim, setSnapAnim] = useState<SnapAnim | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<number>(0);

  const blankId = gridSize * gridSize - 1;
  const BOARD_PADDING = 20;
  const SNAP_THRESHOLD = 0.35; // drag 35% of the way to commit

  // Initialize
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const maxSize = Math.min(
        ((containerRef.current?.clientWidth ?? 800) - 20) * dpr,
        1400
      );
      const canvas = await loadAndResizeImage(imageSrc, maxSize);
      if (cancelled) return;

      setOriginalCanvas(canvas);

      const { pieces, pieceWidth, pieceHeight } = splitImage(
        canvas,
        gridSize,
        gridSize
      );
      setPieceImages(pieces);
      setPieceSize({ w: pieceWidth, h: pieceHeight });
      setCanvasSize({
        w: canvas.width + BOARD_PADDING * 2,
        h: canvas.height + BOARD_PADDING * 2,
      });

      const arrangement = generateSolvableSlidePuzzle(gridSize);
      setTiles(arrangement);
      setMoves(0);
      setSeconds(0);
      setCompleted(false);
      setDragState(null);
      setSnapAnim(null);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }

    init();
    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [imageSrc, gridSize]);

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tiles.length || !pieceImages.length) return;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const boardW = pieceSize.w * gridSize;
    const boardH = pieceSize.h * gridSize;

    // Board background
    ctx.fillStyle = '#1f1f23';
    ctx.beginPath();
    ctx.roundRect(BOARD_PADDING - 4, BOARD_PADDING - 4, boardW + 8, boardH + 8, 8);
    ctx.fill();

    ctx.fillStyle = '#25252b';
    ctx.fillRect(BOARD_PADDING, BOARD_PADDING, boardW, boardH);

    // Grid lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.lineWidth = 1;
    for (let r = 0; r <= gridSize; r++) {
      const y = BOARD_PADDING + r * pieceSize.h;
      ctx.beginPath();
      ctx.moveTo(BOARD_PADDING, y);
      ctx.lineTo(BOARD_PADDING + boardW, y);
      ctx.stroke();
    }
    for (let c = 0; c <= gridSize; c++) {
      const x = BOARD_PADDING + c * pieceSize.w;
      ctx.beginPath();
      ctx.moveTo(x, BOARD_PADDING);
      ctx.lineTo(x, BOARD_PADDING + boardH);
      ctx.stroke();
    }

    // Board border
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(BOARD_PADDING - 4, BOARD_PADDING - 4, boardW + 8, boardH + 8, 8);
    ctx.stroke();

    // Hint
    if (showHint && originalCanvas) {
      ctx.globalAlpha = 0.2;
      ctx.drawImage(originalCanvas, BOARD_PADDING, BOARD_PADDING);
      ctx.globalAlpha = 1.0;
    }

    // Determine which tile to skip (being dragged or snapping)
    const activeTilePos = dragState?.tilePos ?? snapAnim?.tilePos ?? -1;

    // Draw static tiles
    for (let pos = 0; pos < tiles.length; pos++) {
      const tileId = tiles[pos];
      if (tileId === blankId) continue;
      if (pos === activeTilePos) continue;

      const col = pos % gridSize;
      const row = Math.floor(pos / gridSize);
      const x = BOARD_PADDING + col * pieceSize.w;
      const y = BOARD_PADDING + row * pieceSize.h;

      drawTile(ctx, tileId, x, y, tileId === pos);
    }

    // Draw dragged tile
    if (dragState) {
      const tileId = tiles[dragState.tilePos];
      if (tileId !== blankId) {
        ctx.save();
        ctx.shadowColor = 'rgba(139, 92, 246, 0.4)';
        ctx.shadowBlur = 15;
        drawTile(ctx, tileId, dragState.currentX, dragState.currentY, false);
        ctx.restore();
      }
    }

    // Draw snapping tile
    if (snapAnim) {
      const tileId = tiles[snapAnim.tilePos];
      if (tileId !== blankId) {
        const x = snapAnim.fromX + (snapAnim.toX - snapAnim.fromX) * snapAnim.progress;
        const y = snapAnim.fromY + (snapAnim.toY - snapAnim.fromY) * snapAnim.progress;

        ctx.save();
        ctx.shadowColor = 'rgba(139, 92, 246, 0.3)';
        ctx.shadowBlur = 10;
        drawTile(ctx, tileId, x, y, false);
        ctx.restore();
      }
    }

    // Blank space indicator
    const blankPos = tiles.indexOf(blankId);
    const blankCol = blankPos % gridSize;
    const blankRow = Math.floor(blankPos / gridSize);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.04)';
    ctx.fillRect(
      BOARD_PADDING + blankCol * pieceSize.w,
      BOARD_PADDING + blankRow * pieceSize.h,
      pieceSize.w,
      pieceSize.h
    );
  }, [tiles, pieceImages, pieceSize, gridSize, blankId, showHint, originalCanvas, dragState, snapAnim]);

  const drawTile = useCallback((
    ctx: CanvasRenderingContext2D,
    tileId: number,
    x: number,
    y: number,
    isCorrect: boolean
  ) => {
    if (!pieceImages[tileId]) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = pieceSize.w;
    tempCanvas.height = pieceSize.h;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(pieceImages[tileId], 0, 0);

    const r = 6;
    const gap = 1.5;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x + gap, y + gap, pieceSize.w - gap * 2, pieceSize.h - gap * 2, r);
    ctx.clip();
    ctx.drawImage(tempCanvas, x, y);
    ctx.restore();

    ctx.strokeStyle = isCorrect
      ? 'rgba(34, 197, 94, 0.5)'
      : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = isCorrect ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x + gap, y + gap, pieceSize.w - gap * 2, pieceSize.h - gap * 2, r);
    ctx.stroke();
  }, [pieceImages, pieceSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Check completion
  useEffect(() => {
    if (tiles.length > 0 && tiles.every((tileId, pos) => tileId === pos)) {
      setCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [tiles]);

  // Canvas coord helpers
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

  const getGridPos = (cx: number, cy: number) => {
    const col = Math.floor((cx - BOARD_PADDING) / pieceSize.w);
    const row = Math.floor((cy - BOARD_PADDING) / pieceSize.h);
    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      return row * gridSize + col;
    }
    return -1;
  };

  // ── Snap animation after release ──
  const animateSnap = useCallback((
    anim: Omit<SnapAnim, 'progress'>,
    onComplete: () => void
  ) => {
    const duration = 120;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);

      setSnapAnim({ ...anim, progress: eased });

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setSnapAnim(null);
        onComplete();
      }
    };

    animRef.current = requestAnimationFrame(step);
  }, []);

  // ── Pointer handlers: real drag ──
  const handlePointerDown = (e: React.PointerEvent) => {
    if (dragState || snapAnim) return;

    const pos = getCanvasPos(e.clientX, e.clientY);
    const gridPos = getGridPos(pos.x, pos.y);
    if (gridPos < 0) return;

    const tileId = tiles[gridPos];
    if (tileId === blankId) return;

    // Check if adjacent to blank
    const blankPos = tiles.indexOf(blankId);
    const tileRow = Math.floor(gridPos / gridSize);
    const tileCol = gridPos % gridSize;
    const blankRow = Math.floor(blankPos / gridSize);
    const blankCol = blankPos % gridSize;

    const isAdjacent =
      (Math.abs(tileRow - blankRow) === 1 && tileCol === blankCol) ||
      (Math.abs(tileCol - blankCol) === 1 && tileRow === blankRow);

    if (!isAdjacent) return;

    const axis = tileRow === blankRow ? 'x' : 'y';
    const startX = BOARD_PADDING + tileCol * pieceSize.w;
    const startY = BOARD_PADDING + tileRow * pieceSize.h;
    const targetX = BOARD_PADDING + blankCol * pieceSize.w;
    const targetY = BOARD_PADDING + blankRow * pieceSize.h;

    setDragState({
      tilePos: gridPos,
      blankPos,
      axis,
      startX,
      startY,
      targetX,
      targetY,
      currentX: startX,
      currentY: startY,
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;

    const pos = getCanvasPos(e.clientX, e.clientY);

    setDragState((prev) => {
      if (!prev) return prev;

      if (prev.axis === 'x') {
        // Constrain X between start and target, Y stays fixed
        const minX = Math.min(prev.startX, prev.targetX);
        const maxX = Math.max(prev.startX, prev.targetX);
        const newX = Math.max(minX, Math.min(maxX, pos.x - pieceSize.w / 2));
        return { ...prev, currentX: newX, currentY: prev.startY };
      } else {
        // Constrain Y between start and target, X stays fixed
        const minY = Math.min(prev.startY, prev.targetY);
        const maxY = Math.max(prev.startY, prev.targetY);
        const newY = Math.max(minY, Math.min(maxY, pos.y - pieceSize.h / 2));
        return { ...prev, currentX: prev.startX, currentY: newY };
      }
    });
  };

  const handlePointerUp = () => {
    if (!dragState) return;

    const { tilePos, blankPos, axis, startX, startY, targetX, targetY, currentX, currentY } = dragState;

    let dragFraction: number;
    if (axis === 'x') {
      const totalDist = targetX - startX;
      dragFraction = totalDist !== 0 ? (currentX - startX) / totalDist : 0;
    } else {
      const totalDist = targetY - startY;
      dragFraction = totalDist !== 0 ? (currentY - startY) / totalDist : 0;
    }

    const willSwap = dragFraction > SNAP_THRESHOLD;
    const toX = willSwap ? targetX : startX;
    const toY = willSwap ? targetY : startY;

    // Set snapAnim immediately (same batch as clearing drag) to prevent flicker
    setSnapAnim({ tilePos, blankPos, fromX: currentX, fromY: currentY, toX, toY, progress: 0, willSwap });
    setDragState(null);

    // Then animate
    const onComplete = willSwap
      ? () => {
          setTiles((prev) => {
            const next = [...prev];
            [next[tilePos], next[blankPos]] = [next[blankPos], next[tilePos]];
            return next;
          });
          setMoves((m) => m + 1);
        }
      : () => {};

    animateSnap({ tilePos, blankPos, fromX: currentX, fromY: currentY, toX, toY, willSwap }, onComplete);
  };

  const handleReset = () => {
    const arrangement = generateSolvableSlidePuzzle(gridSize);
    setTiles(arrangement);
    setMoves(0);
    setSeconds(0);
    setCompleted(false);
    setDragState(null);
    setSnapAnim(null);
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
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* Controls bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-5 text-sm text-zinc-300">
          <span>
            {t('time')}:{' '}
            <strong className="text-violet-400">{formatTime(seconds)}</strong>
          </span>
          <span>
            {t('moves')}:{' '}
            <strong className="text-violet-400">{moves}</strong>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 rounded-xl text-sm min-h-10 px-4 py-2 transition-colors"
          >
            {showHint ? t('hideHint') : t('hint')}
          </button>
          <button
            onClick={handleReset}
            className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-400 rounded-xl text-sm min-h-10 px-4 py-2 transition-colors"
          >
            {t('reset')}
          </button>
        </div>
      </div>

      {/* Puzzle + Original image side by side */}
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-start justify-center gap-6">
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="max-w-2xl w-full border border-white/[0.06] rounded-2xl touch-none cursor-grab active:cursor-grabbing"
          style={{ aspectRatio: `${canvasSize.w} / ${canvasSize.h}` }}
        />

        {/* Original image preview */}
        <div className="lg:w-48 w-full lg:sticky lg:top-24 shrink-0">
          <div className="glass-card p-3 rounded-xl">
            <p className="text-xs text-zinc-500 font-medium mb-2 text-center">{t('hint')}</p>
            <img
              src={imageSrc}
              alt="Original"
              className="w-full rounded-lg border border-white/[0.06]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
