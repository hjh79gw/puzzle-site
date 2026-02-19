import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { blogPosts } from '@/data/blog-posts';
import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';

const BASE_URL = 'https://puzzle-site-kappa.vercel.app';

const postContentKeys: Record<string, { contentKeys: string[] }> = {
  'how-to-solve-slide-puzzle': {
    contentKeys: ['post1Content1', 'post1Content2Title', 'post1Content2', 'post1Content3Title', 'post1Content3', 'post1Content4Title', 'post1Content4', 'post1Content5Title', 'post1Content5'],
  },
  'jigsaw-puzzle-tips': {
    contentKeys: ['post2Content1', 'post2Content2Title', 'post2Content2', 'post2Content3Title', 'post2Content3', 'post2Content4Title', 'post2Content4', 'post2Content5Title', 'post2Content5', 'post2Content6Title', 'post2Content6'],
  },
  'puzzle-brain-benefits': {
    contentKeys: ['post3Content1', 'post3Content2Title', 'post3Content2', 'post3Content3Title', 'post3Content3', 'post3Content4Title', 'post3Content4', 'post3Content5Title', 'post3Content5', 'post3Content6Title', 'post3Content6'],
  },
  'history-of-photo-puzzles': {
    contentKeys: ['post4Content1', 'post4Content2Title', 'post4Content2', 'post4Content3Title', 'post4Content3', 'post4Content4Title', 'post4Content4', 'post4Content5Title', 'post4Content5'],
  },
  'difficulty-guide': {
    contentKeys: ['post5Content1', 'post5Content2Title', 'post5Content2', 'post5Content3Title', 'post5Content3', 'post5Content4Title', 'post5Content4', 'post5Content5Title', 'post5Content5', 'post5Content6Title', 'post5Content6'],
  },
  'choosing-puzzle-photos': {
    contentKeys: ['post6Content1', 'post6Content2Title', 'post6Content2', 'post6Content3Title', 'post6Content3', 'post6Content4Title', 'post6Content4', 'post6Content5Title', 'post6Content5', 'post6Content6Title', 'post6Content6', 'post6Content7Title', 'post6Content7'],
  },
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const title = t(post.titleKey);
  const description = t(post.descKey);
  const prefix = locale === 'ko' ? '' : `/${locale}`;
  const url = `${BASE_URL}${prefix}/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ko: `${BASE_URL}/blog/${slug}`,
        en: `${BASE_URL}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.date,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
    },
  };
}

function BlogPostJsonLd({ locale, post, title, description }: { locale: string; post: { slug: string; date: string; category: string }; title: string; description: string }) {
  const prefix = locale === 'ko' ? '' : `/${locale}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: post.date,
    url: `${BASE_URL}${prefix}/blog/${post.slug}`,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: 'PuzzlePlay' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Blog');

  const post = blogPosts.find((p) => p.slug === slug);
  const content = postContentKeys[slug];

  if (!post || !content) {
    notFound();
  }

  const postTitle = t(post.titleKey);
  const postDesc = t(post.descKey);

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <BlogPostJsonLd locale={locale} post={post} title={postTitle} description={postDesc} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none overflow-hidden" />

      {/* Left vertical ad - desktop only */}
      <div className="hidden xl:block absolute right-full mr-4 top-16">
        <div className="sticky top-24">
          <AdBanner format="vertical" className="w-[160px] min-h-[600px]" />
        </div>
      </div>

      <div className="relative">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToBlog')}
        </Link>

        <div className="text-xs text-violet-400 font-medium uppercase tracking-wider mb-3">
          {post.category}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-100 mb-4 leading-tight">
          {t(post.titleKey)}
        </h1>
        <p className="text-sm text-zinc-500 mb-10">{post.date}</p>

        <div className="space-y-6">
          {content.contentKeys.map((key, i) => {
            const isTitle = key.includes('Title') && !key.endsWith('Desc');
            if (isTitle) {
              return (
                <h2 key={i} className="text-xl font-semibold text-zinc-100 mt-10 mb-2">
                  {t(key)}
                </h2>
              );
            }
            return (
              <p key={i} className="text-base text-zinc-400 leading-relaxed">
                {t(key)}
              </p>
            );
          })}
        </div>

        <AdBanner format="horizontal" className="mt-12" />

        <div className="mt-16 pt-8 border-t border-white/[0.06] text-center">
          <Link
            href="/play"
            className="btn-glow inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl"
          >
            {locale === 'ko' ? '지금 퍼즐 플레이하기' : 'Play Puzzles Now'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
