import type { MetadataRoute } from 'next';

const baseUrl = 'https://puzzleplay.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['ko', 'en'];
  const routes = ['', '/play', '/how-to-play', '/about', '/privacy', '/terms'];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      const prefix = locale === 'ko' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route === '/play' ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
