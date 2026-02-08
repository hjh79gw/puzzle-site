'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('langSwitched')) {
      setShowArrow(true);
    }
  }, []);

  const toggleLocale = () => {
    const next = locale === 'ko' ? 'en' : 'ko';
    localStorage.setItem('langSwitched', '1');
    setShowArrow(false);
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleLocale}
        className="px-4 py-2 text-sm font-bold rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 hover:text-violet-200 border border-violet-500/30 transition-colors"
        aria-label="Switch language"
      >
        {locale === 'ko' ? 'English' : '한국어'}
      </button>
      {showArrow && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 animate-bounce pointer-events-none flex flex-col items-center">
          <span className="text-violet-400 text-lg">▲</span>
          <span className="text-violet-400 text-xs font-medium whitespace-nowrap">
            {locale === 'ko' ? 'Select Language!' : '언어를 선택하세요!'}
          </span>
        </div>
      )}
    </div>
  );
}
