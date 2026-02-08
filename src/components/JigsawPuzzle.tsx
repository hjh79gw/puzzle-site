'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  loadAndResizeImage,
  shuffleArray,
  formatTime,
  generateJigsawEdges,
  createJigsawPieceCanvas,
  createJigsawPiecePath,
  type JigsawEdges,
} from '@/lib/puzzle-engine';
import PuzzleComplete from './PuzzleComplete';

interface JigsawPuzzleProps {
  imageSrc: string;
  gridSize: number;
  onNewGame: () => void;
}

interface JigsawPiece {
  id: number;
  row: number;
  col: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  placed: boolean;
  pieceCanvas: HTMLCanvasElement;
  offsetX: number;
  offsetY: number;
  totalW: number;
  totalH: number;
}

interface BoardInfo {
  allEdges: JigsawEdges[][];
  pieceW: number;
  pieceH: number;
}

const BOARD_PADDING = 24;
const TRAY_GAP = 16;

export default function JigsawPuzzle({
  imageSrc,
  gridSize,
  onNewGame,
}: JigsawPuzzleProps) {
  const t = useTranslations('Play');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pieces, setPieces] = useState<JigsawPiece[]>([]);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [trayX, setTrayX] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement | null>(null);
  const [boardInfo, setBoardInfo] = useState<BoardInfo | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SNAP_DISTANCE = 30;

  // ── Initialise puzzle ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const containerW = containerRef.current?.clientWidth ?? 900;
      // Board takes ~60% of width, tray takes ~40%
      const boardMaxSize = Math.min(Math.floor(containerW * 0.48), 560);
      const imgCanvas = await loadAndResizeImage(imageSrc, boardMaxSize);
      if (cancelled) return;

      setOriginalCanvas(imgCanvas);

      const imgW = imgCanvas.width;
      const imgH = imgCanvas.height;
      setImageSize({ w: imgW, h: imgH });

      const pieceW = Math.floor(imgW / gridSize);
      const pieceH = Math.floor(imgH / gridSize);

      // Layout: [Board area] [Gap] [Tray area] side by side
      const boardAreaW = imgW + BOARD_PADDING * 2;
      const boardAreaH = imgH + BOARD_PADDING * 2;
      const trayW = Math.max(pieceW * 4, 300);
      const totalW = boardAreaW + TRAY_GAP + trayW;
      const totalH = boardAreaH;

      setCanvasSize({ w: totalW, h: totalH });
      setTrayX(boardAreaW + TRAY_GAP);

      const allEdges: JigsawEdges[][] = generateJigsawEdges(gridSize, gridSize);
      setBoardInfo({ allEdges, pieceW, pieceH });

      // Create pieces and scatter them in the tray area (right side)
      const allPieces: JigsawPiece[] = [];
      const trayStartX = boardAreaW + TRAY_GAP + 8;
      const availTrayW = trayW - 16;

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const { canvas, offsetX, offsetY, totalW: tw, totalH: th } =
            createJigsawPieceCanvas(
              imgCanvas, r, c, gridSize, gridSize, allEdges, pieceW, pieceH
            );

          const correctX = BOARD_PADDING + c * pieceW - offsetX;
          const correctY = BOARD_PADDING + r * pieceH - offsetY;

          // Scatter in the tray area
          const randX = trayStartX + Math.random() * Math.max(availTrayW - tw, 10);
          const randY = 8 + Math.random() * Math.max(totalH - th - 16, 10);

          allPieces.push({
            id: r * gridSize + c,
            row: r, col: c,
            correctX, correctY,
            currentX: randX, currentY: randY,
            placed: false,
            pieceCanvas: canvas,
            offsetX, offsetY,
            totalW: tw, totalH: th,
          });
        }
      }

      setPieces(shuffleArray(allPieces));
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

  // ── Draw loop ──────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pieces.length) return;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ── Board area (left side) ──
    if (boardInfo) {
      const { allEdges, pieceW, pieceH } = boardInfo;

      // Board background
      ctx.fillStyle = '#1f1f23';
      ctx.beginPath();
      ctx.roundRect(
        BOARD_PADDING - 5, BOARD_PADDING - 5,
        imageSize.w + 10, imageSize.h + 10, 8
      );
      ctx.fill();

      ctx.fillStyle = '#222228';
      ctx.fillRect(BOARD_PADDING, BOARD_PADDING, imageSize.w, imageSize.h);

      // Draw jigsaw outlines for empty slots only
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const pieceId = r * gridSize + c;
          const piece = pieces.find((p) => p.id === pieceId);
          if (piece?.placed) continue;

          const edges = allEdges[r][c];
          const path = createJigsawPiecePath(
            pieceW, pieceH, edges,
            BOARD_PADDING + c * pieceW,
            BOARD_PADDING + r * pieceH
          );

          ctx.fillStyle = '#1a1a1f';
          ctx.fill(path);
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.18)';
          ctx.lineWidth = 1.2;
          ctx.stroke(path);
        }
      }

      // Board outer border
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(
        BOARD_PADDING - 5, BOARD_PADDING - 5,
        imageSize.w + 10, imageSize.h + 10, 8
      );
      ctx.stroke();
    }

    // ── Tray area (right side) ──
    const trayW = canvasSize.w - trayX;
    ctx.fillStyle = '#16161a';
    ctx.beginPath();
    ctx.roundRect(trayX, 4, trayW - 4, canvasSize.h - 8, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(trayX, 4, trayW - 4, canvasSize.h - 8, 10);
    ctx.stroke();

    // Ghost hint
    if (showHint && originalCanvas) {
      ctx.globalAlpha = 0.2;
      ctx.drawImage(originalCanvas, BOARD_PADDING, BOARD_PADDING);
      ctx.globalAlpha = 1.0;
    }

    // Sort: placed at back, dragging on top
    const sortedPieces = [...pieces].sort((a, b) => {
      if (a.id === dragging) return 1;
      if (b.id === dragging) return -1;
      if (a.placed && !b.placed) return -1;
      if (!a.placed && b.placed) return 1;
      return 0;
    });

    for (const piece of sortedPieces) {
      ctx.save();

      if (piece.id === dragging) {
        ctx.shadowColor = 'rgba(139, 92, 246, 0.4)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        ctx.drawImage(piece.pieceCanvas, piece.currentX, piece.currentY);
      } else if (!piece.placed) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.drawImage(piece.pieceCanvas, piece.currentX, piece.currentY);
      } else {
        ctx.drawImage(piece.pieceCanvas, piece.currentX, piece.currentY);
      }

      ctx.restore();
    }
  }, [pieces, imageSize, canvasSize, trayX, dragging, showHint, originalCanvas, boardInfo, gridSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  // ── Completion check ───────────────────────────────────────────────────────
  useEffect(() => {
    if (pieces.length > 0 && pieces.every((p) => p.placed)) {
      setCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [pieces]);

  // ── Pointer helpers ────────────────────────────────────────────────────────
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

  const hitTest = (piece: JigsawPiece, px: number, py: number): boolean => {
    const lx = px - piece.currentX;
    const ly = py - piece.currentY;
    if (lx < 0 || ly < 0 || lx >= piece.totalW || ly >= piece.totalH) return false;
    const pctx = piece.pieceCanvas.getContext('2d');
    if (!pctx) return false;
    const pixel = pctx.getImageData(Math.floor(lx), Math.floor(ly), 1, 1).data;
    return pixel[3] > 20;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const pos = getCanvasPos(e.clientX, e.clientY);

    // Pick top-most piece (placed or not - allows removing placed pieces)
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      if (hitTest(p, pos.x, pos.y)) {
        // Unplace if it was placed
        if (p.placed) {
          setPieces((prev) =>
            prev.map((pp) => pp.id === p.id ? { ...pp, placed: false } : pp)
          );
        }
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
      prev.map((p) => {
        if (p.id !== dragging) return p;
        const newX = Math.max(-p.totalW * 0.5, Math.min(canvasSize.w - p.totalW * 0.5, pos.x - dragOffset.x));
        const newY = Math.max(-p.totalH * 0.5, Math.min(canvasSize.h - p.totalH * 0.5, pos.y - dragOffset.y));
        return { ...p, currentX: newX, currentY: newY };
      })
    );
  };

  const handlePointerUp = () => {
    if (dragging === null) return;

    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== dragging) return p;

        const dist = Math.sqrt(
          (p.currentX - p.correctX) ** 2 + (p.currentY - p.correctY) ** 2
        );

        if (dist < SNAP_DISTANCE) {
          return {
            ...p,
            currentX: p.correctX,
            currentY: p.correctY,
            placed: true,
          };
        }

        // If piece is out of canvas bounds, bring it back to tray
        if (p.currentX < 0 || p.currentX > canvasSize.w - 10 ||
            p.currentY < 0 || p.currentY > canvasSize.h - 10) {
          const trayStartX = trayX + 8;
          const availTrayW = canvasSize.w - trayX - 16;
          return {
            ...p,
            currentX: trayStartX + Math.random() * Math.max(availTrayW - p.totalW, 10),
            currentY: 8 + Math.random() * Math.max(canvasSize.h - p.totalH - 16, 10),
          };
        }

        return p;
      })
    );

    setMoves((m) => m + 1);
    setDragging(null);
  };

  // ── Reset / Shuffle ────────────────────────────────────────────────────────
  const handleReset = () => {
    const trayStartX = trayX + 8;
    const availTrayW = canvasSize.w - trayX - 16;

    setPieces((prev) =>
      shuffleArray(
        prev.map((p) => ({
          ...p,
          currentX: trayStartX + Math.random() * Math.max(availTrayW - p.totalW, 10),
          currentY: 8 + Math.random() * Math.max(canvasSize.h - p.totalH - 16, 10),
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

  // ── Render ─────────────────────────────────────────────────────────────────
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
      {/* Controls bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
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

      {/* Puzzle canvas + Original image preview */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full border border-white/[0.06] rounded-2xl touch-none cursor-grab active:cursor-grabbing"
          style={{ aspectRatio: `${canvasSize.w} / ${canvasSize.h}` }}
        />

        {/* Original image preview */}
        <div className="lg:w-48 w-full lg:sticky lg:top-24 shrink-0">
          <div className="glass-card p-3 rounded-xl">
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
