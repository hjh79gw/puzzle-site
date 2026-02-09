import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const BASE_URL = 'https://puzzle-site-kappa.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const prefix = locale === 'ko' ? '' : `/${locale}`;
  return {
    title: locale === 'ko' ? '챌린지 모드' : 'Challenge Mode',
    description: t('challengeDesc'),
    alternates: { canonical: `${BASE_URL}${prefix}/challenge`, languages: { ko: `${BASE_URL}/challenge`, en: `${BASE_URL}/en/challenge` } },
  };
}

export default function ChallengeLayout({ children }: { children: ReactNode }) {
  return children;
}
