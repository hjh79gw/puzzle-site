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
    // Revoke previous image URL if exists
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(url);
    setGameState('config');
  }, [imageSrc]);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleNewGame = useCallback(() => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setGameState('upload');
  }, [imageSrc]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      {gameState === 'upload' && (
        <div>
          <ImageUploader onImageLoad={handleImageLoad} />
          <AdBanner format="horizontal" className="mt-8" />
        </div>
      )}

      {gameState === 'config' && imageSrc && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={imageSrc}
              alt="Preview"
              className="w-full rounded-lg border border-[var(--color-border)]"
            />
          </div>
          <div>
            <PuzzleSelector
              puzzleType={puzzleType}
              gridSize={gridSize}
              onTypeChange={setPuzzleType}
              onGridSizeChange={setGridSize}
              onStart={handleStart}
            />
            <button
              onClick={handleNewGame}
              className="mt-4 w-full py-2 text-sm border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              {t('newPhoto')}
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && imageSrc && (
        <div>
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
          <AdBanner format="horizontal" className="mt-8" />
        </div>
      )}
    </div>
  );
}
