import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import AdBanner from '@/components/AdBanner';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');

  return (
    <div>
      {/* ===== HERO: Full-width centered ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-violet-600/10 blur-[180px]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-10">
              {t('badge')}
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
              <span className="text-zinc-100">{t('heroLine1')}</span>
              <br />
              <span className="gradient-text">{t('heroLine2')}</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-zinc-400 leading-relaxed mb-12 max-w-2xl mx-auto">
              {t('heroSub1')}
              <br />
              <span className="text-violet-400 font-semibold text-lg sm:text-xl lg:text-2xl">{t('heroSub2Highlight')}</span>{t('heroSub2Rest')}
            </p>

            <div className="relative z-20 flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                href="/play"
                className="btn-glow inline-flex items-center justify-center gap-2 text-white font-semibold px-10 py-4 rounded-2xl text-base sm:text-lg"
              >
                {t('startButton')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/challenge"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl text-base font-medium text-zinc-400 border border-white/[0.08] hover:bg-white/[0.03] hover:text-zinc-200 transition-all"
              >
                {t('challengeButton')}
              </Link>
            </div>

            {/* Puzzle grid visualization */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/8 rounded-3xl blur-3xl scale-125 pointer-events-none" />
                <div className="relative grid grid-cols-4 gap-2 sm:gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.06]">
                  {[
                    'from-violet-500/30 to-violet-600/10',
                    'from-blue-500/25 to-blue-600/10',
                    'from-violet-400/20 to-purple-600/10',
                    'from-indigo-500/25 to-blue-500/10',
                    'from-indigo-400/20 to-violet-500/10',
                    'from-violet-600/25 to-violet-500/10',
                    'from-blue-400/20 to-indigo-600/10',
                    'from-purple-500/25 to-violet-600/10',
                    'from-violet-500/20 to-blue-500/10',
                    'from-blue-500/20 to-violet-500/10',
                    'from-indigo-400/25 to-violet-500/10',
                    'from-violet-400/25 to-indigo-500/10',
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} border border-white/[0.06] animate-fade-in`}
                      style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <div className="border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-6 flex flex-wrap justify-center gap-x-10 sm:gap-x-14 gap-y-3 text-sm text-zinc-500">
          {[t('trustFree'), t('trustNoSignup'), t('trustPrivate'), t('trustMobile')].map((item, i) => (
            <span key={i} className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Ad #1 */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto my-4 px-6" />

      {/* ===== FEATURES: Clean 2x2 Grid ===== */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-violet-600/8 blur-[160px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              {t('whyTitle')}
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-base">{t('whyDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="glass-card p-8 sm:p-10 transition-all duration-300 hover:border-white/[0.12]">
              <h3 className="text-lg font-bold text-zinc-100 mb-3">{t('feature1Title')}</h3>
              <p className="text-zinc-400 leading-relaxed">{t('feature1Desc')}</p>
            </div>
            <div className="glass-card p-8 sm:p-10 transition-all duration-300 hover:border-white/[0.12]">
              <h3 className="text-lg font-bold text-zinc-100 mb-3">{t('feature2Title')}</h3>
              <p className="text-zinc-400 leading-relaxed">{t('feature2Desc')}</p>
            </div>
            <div className="glass-card p-8 sm:p-10 transition-all duration-300 hover:border-white/[0.12]">
              <h3 className="text-lg font-bold text-zinc-100 mb-3">{t('feature3Title')}</h3>
              <p className="text-zinc-400 leading-relaxed">{t('feature3Desc')}</p>
            </div>
            <div className="glass-card p-8 sm:p-10 transition-all duration-300 hover:border-white/[0.12]">
              <h3 className="text-lg font-bold text-zinc-100 mb-3">{t('feature4Title')}</h3>
              <p className="text-zinc-400 leading-relaxed">{t('feature4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full bg-violet-600/8 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-indigo-600/6 blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              {t('useCasesTitle')}
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-base">{t('useCasesDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t('useCase1Title'), desc: t('useCase1Desc') },
              { title: t('useCase2Title'), desc: t('useCase2Desc') },
              { title: t('useCase3Title'), desc: t('useCase3Desc') },
              { title: t('useCase4Title'), desc: t('useCase4Desc') },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card p-7 sm:p-8 transition-all duration-300 hover:border-white/[0.12] group"
              >
                <h3 className="font-semibold text-zinc-100 mb-3">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad #2 */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto my-4 px-6" />

      {/* ===== HOW IT WORKS: 3 steps ===== */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-[600px] h-[400px] rounded-full bg-violet-600/8 blur-[150px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
              {t('howItWorks')}
            </h2>
            <p className="text-zinc-500 text-base">{t('howItWorksDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: t('step1'), desc: t('step1Desc') },
              { num: '2', title: t('step2'), desc: t('step2Desc') },
              { num: '3', title: t('step3'), desc: t('step3Desc') },
            ].map((step, i) => (
              <div key={i} className="glass-card p-8 sm:p-10 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/15 text-violet-400 text-lg font-bold mb-6">
                  {step.num}
                </div>
                <h3 className="font-semibold text-zinc-100 text-lg mb-3">{step.title}</h3>
                <p className={`text-sm text-zinc-500 leading-relaxed ${locale === 'ko' ? 'whitespace-nowrap' : ''}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad #3 */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto my-4 px-6" />

      {/* ===== CTA + PRIVACY ===== */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-violet-950/20 via-violet-950/10 to-transparent">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-5">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg text-zinc-400 mb-12">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/play"
              className="btn-glow inline-flex items-center justify-center gap-2 text-white font-semibold text-lg px-12 py-4 rounded-2xl"
            >
              {t('startButton')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/challenge"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300 font-semibold text-lg px-12 py-4 rounded-2xl transition-colors"
            >
              {t('challengeButton')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-zinc-600 whitespace-nowrap">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t('privacyBannerDesc')}
          </p>
        </div>
      </section>
    </div>
  );
}
