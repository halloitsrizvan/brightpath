import { MetadataRoute } from 'next';
import { PublicService } from '@/lib/services/publicService';
import { TUITION_ROUTES } from '@/utils/tuitionHelper';

// Bump when page content materially changes; a fake "now" lastmod makes Google ignore the field
const CONTENT_LAST_MODIFIED = '2026-10-31';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.brightpatheduvora.com';
    // Core institutional marketing pages (excluding private, gated, or utility pages)
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
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: CONTENT_LAST_MODIFIED,
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Tuition landing pages (classes, subjects, boards, locations)
    const tuitionRoutes: MetadataRoute.Sitemap = Object.entries(TUITION_ROUTES).flatMap(
        ([category, slugs]) => slugs.map((slug) => ({
            url: `${baseUrl}/tuition/${category}/${slug}`,
            lastModified: CONTENT_LAST_MODIFIED,
            changeFrequency: 'monthly' as const,
            priority: category === 'tuition-by-location' ? 0.8 : 0.85,
        }))
    );

    // Blog articles
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const posts = await PublicService.getAllBlogPosts();
        if (posts && posts.length > 0) {
            blogRoutes = posts.map((post: any) => ({
                url: `${baseUrl}/blog/${post.slug || post._id}`,
                lastModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : CONTENT_LAST_MODIFIED,
                changeFrequency: 'monthly',
                priority: 0.7,
            }));
        }
    } catch {
        // Fallback gracefully if database is unreachable at build time
    }

    return [
        ...staticRoutes,
        ...tuitionRoutes,
        ...blogRoutes,
    ];
}
