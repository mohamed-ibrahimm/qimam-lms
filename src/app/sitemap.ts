import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mohamedibrahim-chi.vercel.app';

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/diplomas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/instructors/join`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    // Dynamic course routes
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, updatedAt: true },
    });

    const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
      url: `${baseUrl}/courses/${c.id}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    // Dynamic digital books routes
    const books = await prisma.digitalBook.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, updatedAt: true },
    });

    const bookRoutes: MetadataRoute.Sitemap = books.map((b) => ({
      url: `${baseUrl}/books/${b.id}`,
      lastModified: b.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...courseRoutes, ...bookRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
