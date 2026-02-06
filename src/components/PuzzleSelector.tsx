'use client';

import { useTranslations } from 'next-intl';

export type PuzzleType = 'jigsaw' | 'slide';

interface PuzzleSelectorProps {
  puzzleType: PuzzleType;
  gridSize: number;
  onTypeChange: (type: PuzzleType) => void;
  onGridSizeChange: (size: number) => void;
  onStart: () => void;
}

export default function PuzzleSelector({
  puzzleType,
  gridSize,
  onTypeChange,
  onGridSizeChange,
  onStart,
}: PuzzleSelectorProps) {
  const t = useTranslations('Play');

  return (
    <div className="space-y-6">
      {/* Puzzle Type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          {t('puzzleType')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onTypeChange('jigsaw')}
            className={`py-3 px-4 rounded-xl text-sm font-medium min-h-12 transition-all duration-200 ${
              puzzleType === 'jigsaw'
                ? 'btn-glow text-white'
                : 'bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
            }`}
          >
            🧩 {t('jigsaw')}
          </button>
          <button
            onClick={() => onTypeChange('slide')}
            className={`py-3 px-4 rounded-xl text-sm font-medium min-h-12 transition-all duration-200 ${
              puzzleType === 'slide'
                ? 'btn-glow text-white'
                : 'bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
            }`}
          >
            🔀 {t('slide')}
          </button>
        </div>
      </div>

      {/* Grid Size */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          {t('gridSize')}
        </label>
        <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.06]">
          <div className="text-center mb-3">
            <span className="text-3xl font-bold text-zinc-100">
              {gridSize}x{gridSize}
            </span>
            <span className="block text-xs text-zinc-500 mt-1">
              {gridSize * gridSize} pieces
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={8}
            value={gridSize}
            onChange={(e) => onGridSizeChange(Number(e.target.value))}
            className="w-full h-2 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-2">
            <span>3x3 Easy</span>
            <span>8x8 Hard</span>
          </div>
        </div>
      </div>

      {/* Start */}
      <button
        onClick={onStart}
        className="btn-glow w-full py-3.5 rounded-xl text-white font-semibold text-base min-h-12"
      >
        {t('startGame')}
      </button>
    </div>
  );
}
