import { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/get-site-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alihamieh.com';
  const site = await getSiteContent();
  const lastMod = new Date(); // Could use site.updatedAt if exposed, else Date.now()
  
  return [
    {
      url: baseUrl,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/cv`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
