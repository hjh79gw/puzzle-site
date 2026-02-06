'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { formatTime } from '@/lib/puzzle-engine';

interface LeaderboardEntry {
  nickname: string;
  time: number;
  moves: number;
  date: string;
}

interface ChallengeCompleteProps {
  time: number;
  moves: number;
  imageId: string;
  gridSize: number;
  onTryAgain: () => void;
  onBackToSelect: () => void;
}

export default function ChallengeComplete({
  time,
  moves,
  imageId,
  gridSize,
  onTryAgain,
  onBackToSelect,
}: ChallengeCompleteProps) {
  const t = useTranslations('Challenge');
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);

  const fetchRankings = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaderboard?imageId=${imageId}&gridSize=${gridSize}`);
      const data = await res.json();
      setRankings(data.entries || []);
    } catch {
      setRankings([]);
    }
  }, [imageId, gridSize]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const handleSubmit = async () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 12) {
      setError(t('nicknameError'));
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, gridSize, nickname: trimmed, time, moves }),
      });

      if (!res.ok) {
        setError(t('serverError'));
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setSubmitting(false);
      fetchRankings();
    } catch {
      setError(t('serverError'));
      setSubmitting(false);
    }
  };

  return (
    <div className="text-center py-10 sm:py-16 animate-fade-in">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-6xl mb-6 animate-float">🏆</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-2">
          {t('complete')}
        </h2>
        <p className="text-zinc-400 mb-8 text-lg">{t('completeMsg')}</p>

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex-1 p-5 glass-card">
            <div className="text-2xl font-bold text-violet-400">
              {formatTime(time)}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mt-1">
              {t('yourTime')}
            </div>
          </div>
          <div className="flex-1 p-5 glass-card">
            <div className="text-2xl font-bold text-violet-400">{moves}</div>
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 mt-1">
              {t('yourMoves')}
            </div>
          </div>
        </div>

        {/* Nickname + Submit */}
        {!submitted ? (
          <div className="glass-card p-6 mb-8">
            <label className="block text-sm font-medium text-zinc-300 mb-2 text-left">
              {t('nickname')}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t('nicknamePlaceholder')}
                maxLength={12}
                className="flex-1 bg-zinc-800/50 border border-white/[0.08] rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-glow text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50 shrink-0"
              >
                {submitting ? t('submitting') : t('submitScore')}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-2 text-left">{error}</p>
            )}
          </div>
        ) : (
          <div className="glass-card p-4 mb-8 border-violet-500/20">
            <p className="text-violet-400 font-medium">{t('scoreSubmitted')}</p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-bold text-zinc-100 mb-4">{t('ranking')}</h3>
          {rankings.length === 0 ? (
            <p className="text-zinc-500 text-sm">{t('noRankings')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-2 px-3 text-left text-zinc-500 font-medium">
                      {t('rank')}
                    </th>
                    <th className="py-2 px-3 text-left text-zinc-500 font-medium">
                      {t('player')}
                    </th>
                    <th className="py-2 px-3 text-right text-zinc-500 font-medium">
                      {t('yourTime')}
                    </th>
                    <th className="py-2 px-3 text-right text-zinc-500 font-medium">
                      {t('yourMoves')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((entry, i) => (
                    <tr
                      key={i}
                      className={`border-b border-white/[0.03] ${
                        i < 3 ? 'text-zinc-100' : 'text-zinc-400'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-left">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </td>
                      <td className="py-2.5 px-3 text-left font-medium">
                        {entry.nickname}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-violet-400">
                        {formatTime(entry.time)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {entry.moves}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onTryAgain}
            className="btn-glow text-white font-semibold py-3 px-8 rounded-xl"
          >
            {t('tryAgain')}
          </button>
          <button
            onClick={onBackToSelect}
            className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            {t('backToSelect')}
          </button>
        </div>
      </div>
    </div>
  );
}
