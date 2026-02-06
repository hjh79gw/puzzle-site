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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <p className="text-[var(--color-text-secondary)] mb-10 text-lg leading-relaxed">
        {t('intro')}
      </p>

      {/* Jigsaw */}
      <section className="mb-10 p-6 rounded-xl border border-[var(--color-border)]">
        <h2 className="text-2xl font-semibold mb-3">🧩 {t('jigsawTitle')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('jigsawDesc')}
        </p>
        <h3 className="font-medium mb-2">Tips:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-text-secondary)]">
          <li>{t('jigsawTip1')}</li>
          <li>{t('jigsawTip2')}</li>
          <li>{t('jigsawTip3')}</li>
        </ul>
      </section>

      {/* Slide */}
      <section className="mb-10 p-6 rounded-xl border border-[var(--color-border)]">
        <h2 className="text-2xl font-semibold mb-3">🔀 {t('slideTitle')}</h2>
        <p className="text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {t('slideDesc')}
        </p>
        <h3 className="font-medium mb-2">Tips:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-text-secondary)]">
          <li>{t('slideTip1')}</li>
          <li>{t('slideTip2')}</li>
          <li>{t('slideTip3')}</li>
        </ul>
      </section>

      {/* Difficulty */}
      <section className="mb-10 p-6 rounded-xl border border-[var(--color-border)]">
        <h2 className="text-2xl font-semibold mb-3">📊 {t('difficultyTitle')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('difficultyDesc')}
        </p>
      </section>

      {/* Privacy */}
      <section className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <h2 className="text-2xl font-semibold mb-3">🔒 {t('privacyTitle')}</h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {t('privacyDesc')}
        </p>
      </section>
    </div>
  );
}
