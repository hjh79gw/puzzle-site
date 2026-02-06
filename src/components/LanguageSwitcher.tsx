'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const next = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-3 py-1.5 text-sm font-medium rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] transition-colors"
      aria-label="Switch language"
    >
      {locale === 'ko' ? 'EN' : '한국어'}
    </button>
  );
}
