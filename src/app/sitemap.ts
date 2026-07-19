import { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/get-site-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alihamieh.com';
  const site = await getSiteContent();
  const lastMod = new Date();
  
  const projectUrls = site.projects.map((project: any) => ({
    url: `${baseUrl}/project/${project.slug || project.id}`,
    lastModified: lastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const interviewUrls = site.interviews.map((interview: any) => ({
    url: `${baseUrl}/interview/${interview.id}`,
    lastModified: lastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const achievementUrls = site.achievements.map((achievement: any) => ({
    url: `${baseUrl}/achievement/${achievement.id}`,
    lastModified: lastMod,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
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
    ...projectUrls,
    ...interviewUrls,
    ...achievementUrls,
  ];
}
