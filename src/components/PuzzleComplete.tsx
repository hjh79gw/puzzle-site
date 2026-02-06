'use client';

import { useTranslations } from 'next-intl';
import { formatTime } from '@/lib/puzzle-engine';

interface PuzzleCompleteProps {
  time: number;
  moves: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export default function PuzzleComplete({
  time,
  moves,
  onPlayAgain,
  onNewGame,
}: PuzzleCompleteProps) {
  const t = useTranslations('Play');

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold mb-2">{t('complete')}</h2>
      <p className="text-[var(--color-text-secondary)] mb-8">
        {t('completeMsg')}
      </p>

      <div className="flex justify-center gap-8 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--color-primary)]">
            {formatTime(time)}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">
            {t('yourTime')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[var(--color-accent)]">
            {moves}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">
            {t('yourMoves')}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onPlayAgain}
          className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          {t('playAgain')}
        </button>
        <button
          onClick={onNewGame}
          className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg font-medium hover:bg-[var(--color-bg-secondary)] transition-colors"
        >
          {t('newGame')}
        </button>
      </div>
    </div>
  );
}
