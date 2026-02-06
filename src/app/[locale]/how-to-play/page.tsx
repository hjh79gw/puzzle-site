import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function HowToPlayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HowToPlay');

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          {t('intro')}
        </p>
      </div>

      {/* Jigsaw */}
      <section className="glass-card p-6 sm:p-8 mb-4 sm:mb-6">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">
          {t('jigsawTitle')}
        </h2>
        <p className="text-zinc-400 mb-5 leading-relaxed">
          {t('jigsawDesc')}
        </p>
        <div className="rounded-xl bg-zinc-800/50 border border-white/[0.06] p-4">
          <h3 className="font-medium text-sm text-zinc-300 mb-3">Tips</h3>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
              {t('jigsawTip1')}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
              {t('jigsawTip2')}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
              {t('jigsawTip3')}
            </li>
          </ul>
        </div>
      </section>

      {/* Slide */}
      <section className="glass-card p-6 sm:p-8 mb-4 sm:mb-6">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">
          {t('slideTitle')}
        </h2>
        <p className="text-zinc-400 mb-5 leading-relaxed">
          {t('slideDesc')}
        </p>
        <div className="rounded-xl bg-zinc-800/50 border border-white/[0.06] p-4">
          <h3 className="font-medium text-sm text-zinc-300 mb-3">Tips</h3>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
              {t('slideTip1')}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
              {t('slideTip2')}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
              {t('slideTip3')}
            </li>
          </ul>
        </div>
      </section>

      {/* Difficulty */}
      <section className="glass-card p-6 sm:p-8 mb-4 sm:mb-6">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">
          {t('difficultyTitle')}
        </h2>
        <p className="text-zinc-400 leading-relaxed">
          {t('difficultyDesc')}
        </p>
      </section>

      {/* Privacy */}
      <section className="glass-card p-6 sm:p-8 bg-violet-500/5 border-violet-500/10">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">
          {t('privacyTitle')}
        </h2>
        <p className="text-zinc-400 leading-relaxed">
          {t('privacyDesc')}
        </p>
      </section>
    </div>
  );
}
