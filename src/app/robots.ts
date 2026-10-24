import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.brightpatheduvora.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/_next/static/',
                    '/favicon.ico',
                    '/icon.png',
                    '/llms.txt',
                    '/llms-full.txt',
                ],
                disallow: [
                    '/admin',
                    '/admin/',
                    '/admin-dashboard',
                    '/admin-dashboard/',
                    '/teacher',
                    '/teacher/',
                    '/teacher-dashboard',
                    '/teacher-dashboard/',
                    '/student',
                    '/student/',
                    '/student-dashboard',
                    '/student-dashboard/',
                    '/api/',
                    '/downloads',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
