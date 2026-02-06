import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Terms');

  const sections = Array.from({ length: 5 }, (_, i) => ({
    title: t(`section${i + 1}Title`),
    desc: t(`section${i + 1}Desc`),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">
        {t('lastUpdated')}
      </p>
      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              {section.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
