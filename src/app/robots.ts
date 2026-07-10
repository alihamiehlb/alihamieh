import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://alihamieh.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'Google-Extended', 'PerplexityBot', 'Anthropic-ai'],
        allow: ['/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
