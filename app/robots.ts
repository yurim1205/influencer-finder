import type { MetadataRoute } from 'next';

const SITE_URL = 'https://influencer-finder-eight.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/mypage', '/login', '/signup', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}