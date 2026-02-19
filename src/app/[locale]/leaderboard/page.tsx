import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { challengeImages } from '@/data/challenge-images';
import { getAllLeaderboards, computeStats } from '@/lib/leaderboard-utils';
import { formatTime } from '@/lib/puzzle-engine';
import AdBanner from '@/components/AdBanner';

const BASE_URL = 'https://puzzle-site-kappa.vercel.app';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const prefix = locale === 'ko' ? '' : `/${locale}`;
  return {
    title: locale === 'ko' ? '리더보드' : 'Leaderboard',
    description: t('leaderboardDesc'),
    alternates: {
      canonical: `${BASE_URL}${prefix}/leaderboard`,
      languages: {
        ko: `${BASE_URL}/leaderboard`,
        en: `${BASE_URL}/en/leaderboard`,
      },
    },
  };
}

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Leaderboard');
  const tc = await getTranslations('Challenge');

  const allBoards = await getAllLeaderboards();
  const stats = computeStats(allBoards);

  const gridSizes = [3, 4, 5] as const;
  const difficultyLabels: Record<number, string> = {
    3: tc('easy'),
    4: tc('medium'),
    5: tc('hard'),
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none overflow-hidden" />

      {/* Left vertical ad - desktop only */}
      <div className="hidden xl:block absolute right-full mr-4 top-16">
        <div className="sticky top-24">
          <AdBanner format="vertical" className="w-[160px] min-h-[600px]" />
        </div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Overall Statistics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">{t('statsTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-5 text-center">
              <div className="text-2xl font-bold text-violet-400">
                {stats.totalGames}
              </div>
              <div className="text-xs text-zinc-500 mt-1">{t('totalGames')}</div>
            </div>
            <div className="glass-card p-5 text-center">
              <div className="text-2xl font-bold text-violet-400">
                {stats.averageTime > 0 ? formatTime(stats.averageTime) : '-'}
              </div>
              <div className="text-xs text-zinc-500 mt-1">{t('averageTime')}</div>
            </div>
            <div className="glass-card p-5 text-center">
              <div className="text-2xl font-bold text-violet-400">
                {stats.bestTime > 0 ? formatTime(stats.bestTime) : '-'}
              </div>
              <div className="text-xs text-zinc-500 mt-1">{t('bestTime')}</div>
            </div>
            <div className="glass-card p-5 text-center">
              <div className="text-2xl font-bold text-violet-400 truncate">
                {stats.bestPlayer || '-'}
              </div>
              <div className="text-xs text-zinc-500 mt-1">{t('bestPlayer')}</div>
            </div>
          </div>
        </section>

        {/* Ranking System Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">{t('systemTitle')}</h2>
          <div className="space-y-4 text-base text-zinc-400 leading-relaxed">
            <p>{t('systemDesc1')}</p>
            <p>{t('systemDesc2')}</p>
            <p>{t('systemDesc3')}</p>
          </div>
        </section>

        {/* Challenge Leaderboards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">{t('boardTitle')}</h2>
          <div className="space-y-8">
            {challengeImages.map((image) => (
              <div key={image.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/[0.06] shrink-0">
                    <img src={image.src} alt={tc(image.labelKey)} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {tc(image.labelKey)}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gridSizes.map((size) => {
                    const entries = allBoards[image.id]?.[size] || [];
                    return (
                      <div key={size} className="glass-card p-4">
                        <h4 className="text-sm font-medium text-zinc-300 mb-3">
                          {size}x{size} ({difficultyLabels[size]})
                        </h4>
                        {entries.length === 0 ? (
                          <p className="text-zinc-600 text-xs">{t('noRecords')}</p>
                        ) : (
                          <div className="space-y-1.5">
                            {entries.map((entry, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-2 text-xs ${i < 3 ? 'text-zinc-200' : 'text-zinc-500'}`}
                              >
                                <span className="w-5 text-center shrink-0">
                                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                                </span>
                                <span className="flex-1 truncate font-medium">{entry.nickname}</span>
                                <span className="font-mono text-violet-400">{formatTime(entry.time)}</span>
                                <span className="font-mono text-zinc-500 w-8 text-right">{entry.moves}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <AdBanner format="horizontal" className="mb-12" />

        {/* Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">{t('tipsTitle')}</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n}>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {t(`tip${n}Title` as 'tip1Title')}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {t(`tip${n}Desc` as 'tip1Desc')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">{t('faqTitle')}</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card p-6">
                <h3 className="text-base font-semibold text-zinc-100 mb-2">
                  {t(`faq${n}Q` as 'faq1Q')}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t(`faq${n}A` as 'faq1A')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-white/[0.06]">
          <h2 className="text-xl font-bold text-zinc-100 mb-4">{t('ctaTitle')}</h2>
          <Link
            href="/challenge"
            className="btn-glow inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl"
          >
            {t('ctaButton')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
