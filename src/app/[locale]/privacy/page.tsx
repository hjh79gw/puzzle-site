import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Privacy');

  const sections = Array.from({ length: 6 }, (_, i) => ({
    title: t(`section${i + 1}Title`),
    desc: t(`section${i + 1}Desc`),
  }));

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />
      <div className="mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-sm text-zinc-600">
          {t('lastUpdated')}
        </p>
      </div>

      <p className="mb-10 sm:mb-12 text-zinc-400 leading-relaxed text-lg">
        {t('intro')}
      </p>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <article key={i}>
            <h2 className="text-lg font-semibold text-zinc-100 mb-2">
              {i + 1}. {section.title}
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              {section.desc}
            </p>
            {i < sections.length - 1 && (
              <div className="mt-8 border-b border-white/[0.06]" />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
