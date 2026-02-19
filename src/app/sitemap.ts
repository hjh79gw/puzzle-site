import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog-posts';
import { challengeImageIds } from '@/data/challenge-images';

const BASE_URL = 'https://puzzle-site-kappa.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/play', '/challenge', '/leaderboard', '/how-to-play', '/about', '/blog', '/privacy', '/terms'];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : route === '/blog' ? 'weekly' : route === '/leaderboard' ? 'daily' : 'monthly',
      priority: route === '' ? 1.0 : route === '/play' ? 0.9 : route === '/blog' ? 0.8 : route === '/leaderboard' ? 0.8 : 0.7,
      alternates: {
        languages: {
          ko: `${BASE_URL}${route}`,
          en: `${BASE_URL}/en${route}`,
        },
      },
    });
  }

  // Challenge detail pages
  for (const imageId of challengeImageIds) {
    entries.push({
      url: `${BASE_URL}/challenge/${imageId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: {
        languages: {
          ko: `${BASE_URL}/challenge/${imageId}`,
          en: `${BASE_URL}/en/challenge/${imageId}`,
        },
      },
    });
  }

  // Blog posts
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
