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
    { title: t('what'), desc: t('whatDesc'), icon: '🧩' },
    { title: t('why'), desc: t('whyDesc'), icon: '💡' },
    { title: t('privacy'), desc: t('privacyDesc'), icon: '🔒' },
    { title: t('tech'), desc: t('techDesc'), icon: '⚡' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="space-y-8">
        {sections.map((section, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]"
          >
            <h2 className="text-xl font-semibold mb-3">
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </h2>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              {section.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
