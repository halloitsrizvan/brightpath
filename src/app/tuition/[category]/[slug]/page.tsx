import { Metadata } from 'next';
import TuitionPageClient from './TuitionPageClient';

interface Props {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category, slug } = await params;
    
    const displayName = slug 
        ? slug
            .replace(/(\d)-(\d)/g, '$1_RANGE_$2') 
            .replace(/-/g, ' ')
            .replace(/_RANGE_/g, '-')
            .replace(/\b\w/g, l => l.toUpperCase()) 
        : 'Academic';

    const title = `${displayName} Online Tuition | BrightPath Eduvora`;
    const description = `Get personalized 1:1 online tuition for ${displayName}. Expert mentors, customized learning plans, and academic excellence for students in ${displayName} and worldwide.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/tuition/${category}/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://brightpatheduvora.com/tuition/${category}/${slug}`,
        }
    };
}

export default async function TuitionClassPage({ params }: Props) {
    const { category, slug } = await params;
    
    return <TuitionPageClient category={category} slug={slug} />;
}
