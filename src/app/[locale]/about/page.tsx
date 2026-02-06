import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  const sections = [
    { title: t('what'), desc: t('whatDesc') },
    { title: t('why'), desc: t('whyDesc') },
    { title: t('privacy'), desc: t('privacyDesc') },
    { title: t('tech'), desc: t('techDesc') },
  ];

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="relative text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 tracking-tight">
          {t('title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {sections.map((section, i) => (
          <div
            key={i}
            className="glass-card p-6 sm:p-8 transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-1"
          >
            <h2 className="text-lg font-semibold text-zinc-100 mb-2">
              {section.title}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {section.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
