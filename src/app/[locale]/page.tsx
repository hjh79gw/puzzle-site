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
      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-bg-secondary)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('hero')}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
          {t('heroSub')}
        </p>
        <Link
          href="/play"
          className="inline-block px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors text-lg"
        >
          {t('startButton')}
        </Link>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🎁', title: t('feature1Title'), desc: t('feature1Desc') },
            { icon: '🔒', title: t('feature2Title'), desc: t('feature2Desc') },
            { icon: '📊', title: t('feature3Title'), desc: t('feature3Desc') },
            { icon: '🧩', title: t('feature4Title'), desc: t('feature4Desc') },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <AdBanner format="horizontal" className="max-w-4xl mx-auto my-8" />

      {/* How it works */}
      <section className="py-16 px-4 bg-[var(--color-bg-secondary)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">{t('howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: t('step1'), desc: t('step1Desc'), icon: '📸' },
              { num: '2', title: t('step2'), desc: t('step2Desc'), icon: '🎯' },
              { num: '3', title: t('step3'), desc: t('step3Desc'), icon: '🏆' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/play"
            className="inline-block mt-10 px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            {t('startButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
