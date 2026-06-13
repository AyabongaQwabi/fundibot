import type { MetadataRoute } from 'next';
import { getAllInstitutionIds } from '@/lib/tools/data';

const BASE_URL = 'https://fundibot.qwabi.co.za';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/tools', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/tools/course-finder', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/tools/institutions', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/tools/career-recommender', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/tools/qualification-checker', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/tools/bursary-finder', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/tools/salary-predictor', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/tools/subject-advisor', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/tools/tvet-planner', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/tools/gap-year', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/tools/institution-comparison', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/tools/future-timeline', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/tools/deadline-tracker', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/stats', priority: 0.5, changeFrequency: 'monthly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const institutionEntries: MetadataRoute.Sitemap = getAllInstitutionIds().map((id) => ({
    url: `${BASE_URL}/tools/institution/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...institutionEntries];
}
