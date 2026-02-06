import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://puzzleplay.app';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const canonicalUrl = locale === 'ko' ? BASE_URL : `${BASE_URL}/${locale}`;

  return {
    title: { default: t('title'), template: `%s | PuzzlePlay` },
    description: t('description'),
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: canonicalUrl, languages: { ko: BASE_URL, en: `${BASE_URL}/en` } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const, 'max-snippet': -1 } },
    openGraph: { title: t('title'), description: t('description'), url: canonicalUrl, siteName: 'PuzzlePlay', type: 'website', locale: locale === 'ko' ? 'ko_KR' : 'en_US' },
    twitter: { card: 'summary_large_image' as const, title: t('title'), description: t('description') },
    manifest: '/manifest.json',
  };
}

function JsonLd({ locale }: { locale: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PuzzlePlay',
    url: locale === 'ko' ? BASE_URL : `${BASE_URL}/${locale}`,
    description: locale === 'ko'
      ? '사진을 업로드하여 직소 퍼즐 또는 슬라이드 퍼즐로 플레이하세요.'
      : 'Upload your photos and play them as jigsaw or slide puzzles.',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: locale,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ko' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#09090b" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9131545638684988" crossOrigin="anonymous" />
        <JsonLd locale={locale} />
      </head>
      <body className={`${inter.className} min-h-screen grid grid-rows-[auto_1fr_auto] bg-[#09090b] text-zinc-100`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="w-full">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
