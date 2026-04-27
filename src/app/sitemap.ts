import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://brightpatheduvora.com';
    
    // Only include public-facing institutional pages
    const routes = [
        '',
        '/about',
        '/curriculum',
        '/contact',
        '/tutors',
        '/testimonials',
        '/our-system',
        '/blog',
        '/become-tutor',
        '/privacy',
        '/terms',
        '/subjects',
        '/services',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
