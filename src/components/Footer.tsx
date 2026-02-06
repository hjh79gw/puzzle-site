'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-zinc-900/50 border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold gradient-text">PuzzlePlay</span>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              {t('Footer.tagline')}
            </p>
          </div>

          {/* Game */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-4">
              Game
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/play" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                  {t('Navigation.play')}
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                  {t('Navigation.howToPlay')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                  {t('Navigation.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                  {t('Navigation.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                  {t('Navigation.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-zinc-600">
            {t('Footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
