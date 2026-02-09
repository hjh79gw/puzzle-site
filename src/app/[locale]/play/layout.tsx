import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const BASE_URL = 'https://puzzle-site-kappa.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const prefix = locale === 'ko' ? '' : `/${locale}`;
  return {
    title: locale === 'ko' ? '게임하기' : 'Play',
    description: t('playDesc'),
    alternates: { canonical: `${BASE_URL}${prefix}/play`, languages: { ko: `${BASE_URL}/play`, en: `${BASE_URL}/en/play` } },
  };
}

export default function PlayLayout({ children }: { children: ReactNode }) {
  return children;
}
