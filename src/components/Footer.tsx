'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-2">
              🧩 PuzzlePlay
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t('Footer.tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">{t('Navigation.play')}</h4>
            <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
              <li>
                <Link href="/play" className="hover:text-[var(--color-primary)]">
                  {t('Navigation.play')}
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="hover:text-[var(--color-primary)]">
                  {t('Navigation.howToPlay')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">{t('Navigation.about')}</h4>
            <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
              <li>
                <Link href="/about" className="hover:text-[var(--color-primary)]">
                  {t('Navigation.about')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--color-primary)]">
                  {t('Navigation.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--color-primary)]">
                  {t('Navigation.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-secondary)]">
          {t('Footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
