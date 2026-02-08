import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog-posts';

const baseUrl = 'https://puzzleplay.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['ko', 'en'];
  const routes = ['', '/play', '/challenge', '/how-to-play', '/about', '/blog', '/privacy', '/terms'];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      const prefix = locale === 'ko' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : route === '/blog' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route === '/play' ? 0.9 : route === '/blog' ? 0.8 : 0.7,
      });
    }
  }

  // Blog post pages
  for (const post of blogPosts) {
    for (const locale of locales) {
      const prefix = locale === 'ko' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
