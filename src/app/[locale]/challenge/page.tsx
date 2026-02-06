'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useRef, useEffect } from 'react';
import ChallengeComplete from '@/components/ChallengeComplete';

type ChallengeState = 'select' | 'playing' | 'complete';
type GridSize = 3 | 4 | 5;

interface ChallengeImage {
  id: string;
  labelKey: string;
  src: string;
}

const CHALLENGE_IMAGES: ChallengeImage[] = [
  { id: 'donuts', labelKey: 'donuts', src: '/challenge/colorful-donuts.jpg' },
  { id: 'cat', labelKey: 'cat', src: '/challenge/cute-cat.jpg' },
  { id: 'paint', labelKey: 'paint', src: '/challenge/colorful-wall.jpg' },
  { id: 'sunflower', labelKey: 'sunflower', src: '/challenge/flowers.jpg' },
  { id: 'macaron', labelKey: 'macaron', src: '/challenge/macarons.jpg' },
];

const GRID_OPTIONS: { size: GridSize; labelKey: string }[] = [
  { size: 3, labelKey: 'easy' },
  { size: 4, labelKey: 'medium' },
  { size: 5, labelKey: 'hard' },
];

export default function ChallengePage() {
  const t = useTranslations('Challenge');
  const [state, setState] = useState<ChallengeState>('select');
  const [selectedImage, setSelectedImage] = useState<ChallengeImage | null>(null);
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [completionData, setCompletionData] = useState<{ time: number; moves: number } | null>(null);

  const handleStartChallenge = useCallback(() => {
    if (!selectedImage) return;
    setState('playing');
  }, [selectedImage]);

  const handleComplete = useCallback((time: number, moves: number) => {
    setCompletionData({ time, moves });
    setState('complete');
  }, []);

  const handleTryAgain = useCallback(() => {
    setCompletionData(null);
    setState('playing');
  }, []);

  const handleBackToSelect = useCallback(() => {
    setCompletionData(null);
    setState('select');
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />

      {/* SELECT STATE */}
      {state === 'select' && (
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-20 animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg">
              {t('subtitle')}
            </p>
          </div>

          {/* Image Selection */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              {t('selectImage')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {CHALLENGE_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage?.id === img.id
                      ? 'border-violet-500 scale-[1.02] shadow-lg shadow-violet-500/20'
                      : 'border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <img
                    src={img.src}
                    alt={t(img.labelKey)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="text-sm font-medium text-white">
                      {t(img.labelKey)}
                    </span>
                  </div>
                  {selectedImage?.id === img.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              {t('selectDifficulty')}
            </h2>
            <div className="flex gap-3">
              {GRID_OPTIONS.map((opt) => (
                <button
                  key={opt.size}
                  onClick={() => setGridSize(opt.size)}
                  className={`flex-1 py-4 rounded-xl font-medium text-sm transition-all ${
                    gridSize === opt.size
                      ? 'bg-violet-500/20 border-2 border-violet-500 text-violet-300'
                      : 'glass-card border border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-lg font-bold">{opt.size}x{opt.size}</div>
                  <div className="text-xs mt-1">{t(opt.labelKey)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartChallenge}
              disabled={!selectedImage}
              className="btn-glow inline-flex items-center gap-2 text-white font-semibold px-10 py-4 rounded-2xl text-base sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('startChallenge')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* PLAYING STATE */}
      {state === 'playing' && selectedImage && (
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6 sm:py-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-lg font-bold text-zinc-100">
              {t('title')} · {t(selectedImage.labelKey)} · {gridSize}x{gridSize}
            </h1>
            <button
              onClick={handleBackToSelect}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 border border-white/[0.06] hover:bg-white/[0.05] transition-colors min-h-10"
            >
              {t('backToSelect')}
            </button>
          </div>
          <ChallengeSlidePuzzle
            imageSrc={selectedImage.src}
            gridSize={gridSize}
            onComplete={handleComplete}
          />
        </div>
      )}

      {/* COMPLETE STATE */}
      {state === 'complete' && completionData && selectedImage && (
        <ChallengeComplete
          time={completionData.time}
          moves={completionData.moves}
          imageId={selectedImage.id}
          gridSize={gridSize}
          onTryAgain={handleTryAgain}
          onBackToSelect={handleBackToSelect}
        />
      )}
    </div>
  );
}

// ─── Challenge Slide Puzzle (with original image preview) ───────────────────

import {
  loadAndResizeImage,
  splitImage,
  generateSolvableSlidePuzzle,
  formatTime,
} from '@/lib/puzzle-engine';

interface ChallengeSlidePuzzleProps {
  imageSrc: string;
  gridSize: number;
  onComplete: (time: number, moves: number) => void;
}

function ChallengeSlidePuzzle({
  imageSrc,
  gridSize,
  onComplete,
}: ChallengeSlidePuzzleProps) {
  const t = useTranslations('Challenge');
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

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [snapAnim, setSnapAnim] = useState<SnapAnim | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<number>(0);
  const completedRef = useRef(false);

  const blankId = gridSize * gridSize - 1;
  const BOARD_PADDING = 20;
  const SNAP_THRESHOLD = 0.35;

  useEffect(() => {
    let cancelled = false;
    completedRef.current = false;

    async function init() {
      const maxSize = Math.min(
        (containerRef.current?.clientWidth ?? 800) - 20,
        900
      );
      const canvas = await loadAndResizeImage(imageSrc, maxSize);
      if (cancelled) return;

      setOriginalCanvas(canvas);
      const { pieces, pieceWidth, pieceHeight } = splitImage(canvas, gridSize, gridSize);
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

  const drawTile = useCallback(
    (ctx: CanvasRenderingContext2D, tileId: number, x: number, y: number, isCorrect: boolean) => {
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

      ctx.strokeStyle = isCorrect ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = isCorrect ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(x + gap, y + gap, pieceSize.w - gap * 2, pieceSize.h - gap * 2, r);
      ctx.stroke();
    },
    [pieceImages, pieceSize]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tiles.length || !pieceImages.length) return;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const boardW = pieceSize.w * gridSize;
    const boardH = pieceSize.h * gridSize;

    ctx.fillStyle = '#1f1f23';
    ctx.beginPath();
    ctx.roundRect(BOARD_PADDING - 4, BOARD_PADDING - 4, boardW + 8, boardH + 8, 8);
    ctx.fill();

    ctx.fillStyle = '#25252b';
    ctx.fillRect(BOARD_PADDING, BOARD_PADDING, boardW, boardH);

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

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(BOARD_PADDING - 4, BOARD_PADDING - 4, boardW + 8, boardH + 8, 8);
    ctx.stroke();

    if (showHint && originalCanvas) {
      ctx.globalAlpha = 0.2;
      ctx.drawImage(originalCanvas, BOARD_PADDING, BOARD_PADDING);
      ctx.globalAlpha = 1.0;
    }

    const activeTilePos = dragState?.tilePos ?? snapAnim?.tilePos ?? -1;

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
  }, [tiles, pieceImages, pieceSize, gridSize, blankId, showHint, originalCanvas, dragState, snapAnim, drawTile]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Check completion
  useEffect(() => {
    if (tiles.length > 0 && tiles.every((tileId, pos) => tileId === pos) && !completedRef.current) {
      completedRef.current = true;
      setCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(seconds, moves);
    }
  }, [tiles, seconds, moves, onComplete]);

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

  const animateSnap = useCallback(
    (anim: Omit<SnapAnim, 'progress'>, onSnapComplete: () => void) => {
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
          onSnapComplete();
        }
      };
      animRef.current = requestAnimationFrame(step);
    },
    []
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (dragState || snapAnim || completed) return;
    const pos = getCanvasPos(e.clientX, e.clientY);
    const gridPos = getGridPos(pos.x, pos.y);
    if (gridPos < 0) return;

    const tileId = tiles[gridPos];
    if (tileId === blankId) return;

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
        const minX = Math.min(prev.startX, prev.targetX);
        const maxX = Math.max(prev.startX, prev.targetX);
        const newX = Math.max(minX, Math.min(maxX, pos.x - pieceSize.w / 2));
        return { ...prev, currentX: newX, currentY: prev.startY };
      } else {
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

    setSnapAnim({ tilePos, blankPos, fromX: currentX, fromY: currentY, toX, toY, progress: 0, willSwap });
    setDragState(null);

    const onSnapComplete = willSwap
      ? () => {
          setTiles((prev) => {
            const next = [...prev];
            [next[tilePos], next[blankPos]] = [next[blankPos], next[tilePos]];
            return next;
          });
          setMoves((m) => m + 1);
        }
      : () => {};

    animateSnap({ tilePos, blankPos, fromX: currentX, fromY: currentY, toX, toY, willSwap }, onSnapComplete);
  };

  const handleReset = () => {
    const arrangement = generateSolvableSlidePuzzle(gridSize);
    setTiles(arrangement);
    setMoves(0);
    setSeconds(0);
    setCompleted(false);
    completedRef.current = false;
    setDragState(null);
    setSnapAnim(null);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
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
        {/* Puzzle canvas */}
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
