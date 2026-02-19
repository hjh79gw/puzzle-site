import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { challengeImages, getChallengeImage, challengeImageIds } from '@/data/challenge-images';
import { getLeaderboardEntries } from '@/lib/leaderboard-utils';
import { formatTime } from '@/lib/puzzle-engine';
import AdBanner from '@/components/AdBanner';

const BASE_URL = 'https://puzzle-site-kappa.vercel.app';

export const revalidate = 60;

export function generateStaticParams() {
  return challengeImageIds.map((imageId) => ({ imageId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; imageId: string }>;
}): Promise<Metadata> {
  const { locale, imageId } = await params;
  const image = getChallengeImage(imageId);
  if (!image) return {};

  const t = await getTranslations({ locale, namespace: 'Challenge' });
  const td = await getTranslations({ locale, namespace: 'ChallengeDetail' });
  const tm = await getTranslations({ locale, namespace: 'Metadata' });

  const name = t(image.labelKey);
  const title = td('heroTitle', { name });
  const description = tm('challengeDetailDesc');
  const prefix = locale === 'ko' ? '' : `/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${prefix}/challenge/${imageId}`,
      languages: {
        ko: `${BASE_URL}/challenge/${imageId}`,
        en: `${BASE_URL}/en/challenge/${imageId}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ url: `${BASE_URL}${image.src}` }],
    },
  };
}

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; imageId: string }>;
}) {
  const { locale, imageId } = await params;
  setRequestLocale(locale);

  const image = getChallengeImage(imageId);
  if (!image) notFound();

  const t = await getTranslations('Challenge');
  const td = await getTranslations('ChallengeDetail');

  const name = t(image.labelKey);
  const categoryKey = `category_${image.category}` as const;

  // Fetch leaderboard data for all 3 difficulties
  const [lb3, lb4, lb5] = await Promise.all([
    getLeaderboardEntries(imageId, 3, 5),
    getLeaderboardEntries(imageId, 4, 5),
    getLeaderboardEntries(imageId, 5, 5),
  ]);

  const leaderboards = [
    { size: 3, label: t('easy'), entries: lb3 },
    { size: 4, label: t('medium'), entries: lb4 },
    { size: 5, label: t('hard'), entries: lb5 },
  ];

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
        {/* Back link */}
        <Link
          href="/challenge"
          className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {td('backToList')}
        </Link>

        {/* Hero: Image + Title + Badge */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/2">
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/[0.06]">
              <img
                src={image.src}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-300 mb-4">
              {td(categoryKey)}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              {td('heroTitle', { name })}
            </h1>
            <Link
              href="/challenge"
              className="btn-glow inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl w-fit mt-4"
            >
              {td('startChallenge')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Image Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">
            {td('imageDescTitle')}
          </h2>
          <div className="space-y-4 text-base text-zinc-400 leading-relaxed">
            <p>{td(`${imageId}_desc1`)}</p>
            <p>{td(`${imageId}_desc2`)}</p>
            <p>{td(`${imageId}_desc3`)}</p>
          </div>
        </section>

        {/* Tips by Difficulty */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">
            {td('tipsTitle')}
          </h2>
          <div className="space-y-6">
            {[
              { key: 'tips3x3', titleKey: 'tips3x3Title' },
              { key: 'tips4x4', titleKey: 'tips4x4Title' },
              { key: 'tips5x5', titleKey: 'tips5x5Title' },
            ].map((tip) => (
              <div key={tip.key} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">
                  {td(tip.titleKey)}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {td(`${imageId}_${tip.key}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why This Image is Great */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">
            {td('whyGreatTitle')}
          </h2>
          <div className="glass-card p-6">
            <p className="text-zinc-400 leading-relaxed">
              {td(`${imageId}_whyGreat`)}
            </p>
          </div>
        </section>

        {/* Leaderboard Top 5 by difficulty */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">
            {td('leaderboardTitle')}
          </h2>
          <div className="space-y-6">
            {leaderboards.map((lb) => (
              <div key={lb.size} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                  {lb.size}x{lb.size} ({lb.label})
                </h3>
                {lb.entries.length === 0 ? (
                  <p className="text-zinc-500 text-sm">{td('noRecords')}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="py-2 px-3 text-left text-zinc-500 font-medium">{t('rank')}</th>
                          <th className="py-2 px-3 text-left text-zinc-500 font-medium">{t('player')}</th>
                          <th className="py-2 px-3 text-right text-zinc-500 font-medium">{t('yourTime')}</th>
                          <th className="py-2 px-3 text-right text-zinc-500 font-medium">{t('yourMoves')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lb.entries.map((entry, i) => (
                          <tr
                            key={i}
                            className={`border-b border-white/[0.03] ${i < 3 ? 'text-zinc-100' : 'text-zinc-400'}`}
                          >
                            <td className="py-2.5 px-3 text-left">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                            </td>
                            <td className="py-2.5 px-3 text-left font-medium">{entry.nickname}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-violet-400">{formatTime(entry.time)}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{entry.moves}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <AdBanner format="horizontal" className="mb-12" />

        {/* CTA */}
        <div className="text-center pt-8 border-t border-white/[0.06]">
          <Link
            href="/challenge"
            className="btn-glow inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl"
          >
            {td('startChallenge')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
