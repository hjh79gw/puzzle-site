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
    <div className="text-center py-16 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-6 animate-float">🎉</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-2">
          {t('complete')}
        </h2>
        <p className="text-zinc-400 mb-10 text-lg">
          {t('completeMsg')}
        </p>

        <div className="flex justify-center gap-4 mb-10">
          <div className="flex-1 p-5 glass-card">
            <div className="text-2xl font-bold text-violet-400">
              {formatTime(time)}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mt-1">
              {t('yourTime')}
            </div>
          </div>
          <div className="flex-1 p-5 glass-card">
            <div className="text-2xl font-bold text-violet-400">
              {moves}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mt-1">
              {t('yourMoves')}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onPlayAgain}
            className="btn-glow text-white font-semibold py-3 px-8 rounded-xl"
          >
            {t('playAgain')}
          </button>
          <button
            onClick={onNewGame}
            className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            {t('newGame')}
          </button>
        </div>
      </div>
    </div>
  );
}
