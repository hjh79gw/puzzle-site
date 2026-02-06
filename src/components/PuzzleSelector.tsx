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
        <label className="block text-sm font-medium mb-2">
          {t('puzzleType')}
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => onTypeChange('jigsaw')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors ${
              puzzleType === 'jigsaw'
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
            }`}
          >
            🧩 {t('jigsaw')}
          </button>
          <button
            onClick={() => onTypeChange('slide')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors ${
              puzzleType === 'slide'
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
            }`}
          >
            🔀 {t('slide')}
          </button>
        </div>
      </div>

      {/* Grid Size */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('gridSize')}: {gridSize}x{gridSize}
        </label>
        <input
          type="range"
          min={3}
          max={8}
          value={gridSize}
          onChange={(e) => onGridSizeChange(Number(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
        />
        <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
          <span>3x3</span>
          <span>8x8</span>
        </div>
      </div>

      {/* Start */}
      <button
        onClick={onStart}
        className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-colors text-lg"
      >
        {t('startGame')}
      </button>
    </div>
  );
}
