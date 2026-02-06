'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageLoad: (objectUrl: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
        dragActive
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      <div className="text-5xl mb-4">📸</div>
      <h3 className="text-lg font-semibold mb-2">{t('uploadTitle')}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        {t('uploadDesc')}
      </p>
      <span className="inline-block px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium">
        {t('uploadButton')}
      </span>
      <p className="text-xs text-[var(--color-text-secondary)] mt-3">
        {t('supportedFormats')}
      </p>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
