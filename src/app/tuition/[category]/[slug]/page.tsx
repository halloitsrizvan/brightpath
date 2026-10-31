import { Metadata } from 'next';
import TuitionPageClient from './TuitionPageClient';
import { notFound } from 'next/navigation';
import { getTuitionSEO, TUITION_ROUTES } from '@/utils/tuitionHelper';
import { getTuitionContent } from '@/utils/tuitionContent';

interface Props {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

// Prerender every known landing page (cacheable, fast TTFB) and 404 anything else
export const dynamicParams = false;

export function generateStaticParams() {
    return Object.entries(TUITION_ROUTES).flatMap(([category, slugs]) =>
        slugs.map((slug) => ({ category, slug }))
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, slug } = await params;
    const { title, description } = getTuitionSEO(category, slug);
    const canonicalUrl = `https://www.brightpatheduvora.com/tuition/${category}/${slug}`;

    return {
        title: { absolute: title },
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'BrightPath Eduvora',
            locale: 'en_IN',
            type: 'website',
            images: [
                {
                    url: '/bn2.png',
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/bn2.png'],
        }
    };
}

export default async function TuitionClassPage({ params }: Props) {
    const { category, slug } = await params;
    const { displayName, description } = getTuitionSEO(category, slug);
    const content = getTuitionContent(category, slug);
    if (!content) notFound();
    const canonicalUrl = `https://www.brightpatheduvora.com/tuition/${category}/${slug}`;

    // Schema.org Structured Data
    const categoryName = category
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.brightpatheduvora.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": categoryName,
                "item": `https://www.brightpatheduvora.com/services`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": displayName,
                "item": canonicalUrl
            }
        ]
    };

    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": `${displayName} 1:1 Online Tuition`,
        "description": description,
        "provider": {
            "@type": "EducationalOrganization",
            "name": "BrightPath Eduvora",
            "url": "https://www.brightpatheduvora.com"
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": "PT1H"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, courseSchema, faqSchema]).replace(/</g, '\\u003c') }}
            />
            <TuitionPageClient category={category} slug={slug} content={content} />
        </>
    );
}
