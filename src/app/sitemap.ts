import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog-posts';

const BASE_URL = 'https://puzzle-site-kappa.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/play', '/challenge', '/how-to-play', '/about', '/blog', '/privacy', '/terms'];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : route === '/blog' ? 'weekly' : 'monthly',
      priority: route === '' ? 1.0 : route === '/play' ? 0.9 : route === '/blog' ? 0.8 : 0.7,
      alternates: {
        languages: {
          ko: `${BASE_URL}${route}`,
          en: `${BASE_URL}/en${route}`,
        },
      },
    });
  }

  for (const post of blogPosts) {
    entries.push({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          ko: `${BASE_URL}/blog/${post.slug}`,
          en: `${BASE_URL}/en/blog/${post.slug}`,
        },
      },
    });
  }

  return entries;
}
