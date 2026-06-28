import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // block API routes
    },
    sitemap: 'https://watch.4thground.com/sitemap.xml',
  }
}
