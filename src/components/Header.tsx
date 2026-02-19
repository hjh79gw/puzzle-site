'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useState } from 'react';

export default function Header() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/' as const, label: t('home') },
    { href: '/play' as const, label: t('play') },
    { href: '/challenge' as const, label: t('challenge') },
    { href: '/leaderboard' as const, label: t('leaderboard') },
    { href: '/how-to-play' as const, label: t('howToPlay') },
    { href: '/about' as const, label: t('about') },
    { href: '/blog' as const, label: t('blog') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold gradient-text">PuzzlePlay</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'text-violet-400'
                  : 'text-zinc-400 hover:text-violet-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2 pl-2 border-l border-white/[0.06]">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-3 rounded-lg hover:bg-white/[0.05] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm md:hidden z-40"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="md:hidden absolute top-16 left-0 right-0 bg-zinc-900 border-b border-white/[0.06] px-4 py-4 flex flex-col gap-1 z-50">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-violet-400 bg-white/[0.05]'
                    : 'text-zinc-400 hover:text-violet-400 hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-white/[0.06]">
              <LanguageSwitcher />
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
