'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageLoad: (objectUrl: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUploader({ onImageLoad }: ImageUploaderProps) {
  const t = useTranslations('Play');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback(
    (file: File) => {
      setError('');
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('JPG, PNG, WebP only');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('Max 10MB');
        return;
      }
      const url = URL.createObjectURL(file);
      onImageLoad(url);
    },
    [onImageLoad]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden group ${
        dragActive
          ? 'border-violet-500/60 bg-violet-500/5 scale-[1.01]'
          : 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl group-hover:bg-violet-500/8 transition-colors" />
      </div>

      <div className="relative px-6 py-16 sm:py-24 flex flex-col items-center">
        {/* Puzzle grid hint icon */}
        <div className="grid grid-cols-2 gap-1.5 mb-8 opacity-40 group-hover:opacity-60 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/10" />
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/10" />
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/10" />
          <div className="w-8 h-8 rounded-lg bg-violet-400/20 border border-violet-400/10" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-3 text-center">
          {t('uploadTitle')}
        </h3>

        <p className="text-sm sm:text-base text-zinc-500 mb-8 text-center max-w-sm leading-relaxed">
          {t('uploadDesc')}
        </p>

        <button
          type="button"
          className="btn-glow text-white font-semibold px-8 py-3.5 rounded-2xl text-base min-h-12"
        >
          {t('uploadButton')}
        </button>

        <p className="text-xs text-zinc-600 mt-6">
          {t('supportedFormats')}
        </p>

        {error && (
          <div className="mt-6 px-5 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
