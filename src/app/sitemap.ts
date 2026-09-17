import { MetadataRoute } from 'next';
import { PublicService } from '@/lib/services/publicService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.brightpatheduvora.com';
    const now = new Date().toISOString();
    
    // Core institutional pages
    const staticRoutes: MetadataRoute.Sitemap = [
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
        '/careers',
        '/boards',
        '/downloads',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Class tuition pages
    const classSlugs = [
        'class-1-5', 'class-1', 'class-2', 'class-3', 'class-4', 'class-5',
        'class-6', 'class-7', 'class-8', 'class-9', 'class-10', 'class-11', 'class-12'
    ];
    const classRoutes: MetadataRoute.Sitemap = classSlugs.map((slug) => ({
        url: `${baseUrl}/tuition/tuition-by-classes/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
    }));

    // Subject tuition pages
    const subjectSlugs = [
        'english', 'maths', 'science', 'social-science',
        'malayalam', 'hindi', 'physics', 'chemistry', 'biology'
    ];
    const subjectRoutes: MetadataRoute.Sitemap = subjectSlugs.map((slug) => ({
        url: `${baseUrl}/tuition/tuition-by-subject/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
    }));

    // Board tuition pages
    const boardSlugs = ['cbse', 'icse', 'state', 'igcse'];
    const boardRoutes: MetadataRoute.Sitemap = boardSlugs.map((slug) => ({
        url: `${baseUrl}/tuition/tuition-by-board/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
    }));

    // Location tuition pages
    const locationSlugs = ['kerala', 'dubai', 'qatar', 'chennai', 'bangalore', 'coimbatore', 'hyderabad'];
    const locationRoutes: MetadataRoute.Sitemap = locationSlugs.map((slug) => ({
        url: `${baseUrl}/tuition/tuition-by-location/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Blog articles
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const posts = await PublicService.getBlogPosts();
        if (posts && posts.length > 0) {
            blogRoutes = posts.map((post: any) => ({
                url: `${baseUrl}/blog/${post.slug || post._id}`,
                lastModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : now,
                changeFrequency: 'monthly',
                priority: 0.7,
            }));
        }
    } catch {
        // Fallback gracefully if database is unreachable at build time
    }

    return [
        ...staticRoutes,
        ...classRoutes,
        ...subjectRoutes,
        ...boardRoutes,
        ...locationRoutes,
        ...blogRoutes,
    ];
}
