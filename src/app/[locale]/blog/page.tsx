import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { blogPosts } from '@/data/blog-posts';
import AdBanner from '@/components/AdBanner';

const BASE_URL = 'https://puzzle-site-kappa.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const prefix = locale === 'ko' ? '' : `/${locale}`;
  return {
    title: locale === 'ko' ? '블로그' : 'Blog',
    description: t('blogDesc'),
    alternates: { canonical: `${BASE_URL}${prefix}/blog`, languages: { ko: `${BASE_URL}/blog`, en: `${BASE_URL}/en/blog` } },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Blog');

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none overflow-hidden" />

      {/* Left vertical ad - desktop only */}
      <div className="hidden xl:block absolute right-full mr-4 top-16">
        <div className="sticky top-24">
          <AdBanner format="vertical" className="w-[160px] min-h-[600px]" />
        </div>
      </div>

      <div className="relative text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}` as '/blog/how-to-solve-slide-puzzle'}
            className="glass-card p-6 sm:p-8 transition-all duration-300 hover:border-white/[0.12] hover:-translate-y-1 block"
          >
            <div className="text-xs text-violet-400 font-medium uppercase tracking-wider mb-3">
              {post.category}
            </div>
            <h2 className="text-lg font-semibold text-zinc-100 mb-2 leading-snug">
              {t(post.titleKey)}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              {t(post.descKey)}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">{post.date}</span>
              <span className="text-sm text-violet-400 font-medium">
                {t('readMore')} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <AdBanner format="horizontal" className="mt-10" />
    </div>
  );
}
