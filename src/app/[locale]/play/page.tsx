'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';
import ImageUploader from '@/components/ImageUploader';
import PuzzleSelector, { type PuzzleType } from '@/components/PuzzleSelector';
import JigsawPuzzle from '@/components/JigsawPuzzle';
import SlidePuzzle from '@/components/SlidePuzzle';
import AdBanner from '@/components/AdBanner';

type GameState = 'upload' | 'config' | 'playing';

export default function PlayPage() {
  const t = useTranslations('Play');
  const [gameState, setGameState] = useState<GameState>('upload');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [puzzleType, setPuzzleType] = useState<PuzzleType>('jigsaw');
  const [gridSize, setGridSize] = useState(4);

  const handleImageLoad = useCallback((url: string) => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(url);
    setGameState('config');
  }, [imageSrc]);

  const handleStart = () => setGameState('playing');

  const handleNewGame = useCallback(() => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setGameState('upload');
  }, [imageSrc]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      {/* ===== UPLOAD STATE: Centered, immersive ===== */}
      {gameState === 'upload' && (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-5 sm:px-8 py-8">
          <div className="w-full max-w-xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-2">
                {t('title')}
              </h1>
              <p className="text-zinc-500 text-sm sm:text-base">
                {t('uploadDesc')}
              </p>
            </div>
            <ImageUploader onImageLoad={handleImageLoad} />
          </div>
          <AdBanner format="horizontal" className="w-full max-w-xl mx-auto mt-10" />
        </div>
      )}

      {/* ===== CONFIG STATE: Image + Settings ===== */}
      {gameState === 'config' && imageSrc && (
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12 animate-fade-in">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">{t('puzzleType')}</h1>
              <p className="text-sm text-zinc-500 mt-1">{t('uploadDesc')}</p>
            </div>
            <button
              onClick={handleNewGame}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-white/[0.06] hover:bg-white/[0.05] transition-colors min-h-11"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t('newPhoto')}
            </button>
          </div>

          {/* 3:2 split - image gets more space */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Image preview - 3/5 width */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
                <img
                  src={imageSrc}
                  alt="Preview"
                  className="w-full object-cover max-h-[70vh]"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>

            {/* Settings panel - 2/5 width */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24">
                <PuzzleSelector
                  puzzleType={puzzleType}
                  gridSize={gridSize}
                  onTypeChange={setPuzzleType}
                  onGridSizeChange={setGridSize}
                  onStart={handleStart}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PLAYING STATE: Centered game ===== */}
      {gameState === 'playing' && imageSrc && (
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6 sm:py-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-lg font-bold text-zinc-100">
              {puzzleType === 'jigsaw' ? t('jigsaw') : t('slide')} · {gridSize}x{gridSize}
            </h1>
            <button
              onClick={handleNewGame}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 border border-white/[0.06] hover:bg-white/[0.05] transition-colors min-h-10"
            >
              {t('newGame')}
            </button>
          </div>

          {puzzleType === 'jigsaw' ? (
            <JigsawPuzzle
              imageSrc={imageSrc}
              gridSize={gridSize}
              onNewGame={handleNewGame}
            />
          ) : (
            <SlidePuzzle
              imageSrc={imageSrc}
              gridSize={gridSize}
              onNewGame={handleNewGame}
            />
          )}
          <AdBanner format="horizontal" className="mt-8 max-w-2xl mx-auto" />
        </div>
      )}
    </div>
  );
}
