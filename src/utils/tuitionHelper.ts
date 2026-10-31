import { getTuitionContent } from './tuitionContent';

/**
 * Single source of truth for every tuition landing page. Used by the sitemap and by
 * generateStaticParams so the pages are prerendered and served from the CDN cache.
 */
export const TUITION_ROUTES: Record<string, string[]> = {
    'tuition-by-classes': [
        'class-1-5', 'class-1', 'class-2', 'class-3', 'class-4', 'class-5',
        'class-6', 'class-7', 'class-8', 'class-9', 'class-10', 'class-11', 'class-12'
    ],
    'tuition-by-subject': [
        'english', 'maths', 'science', 'social-science',
        'malayalam', 'hindi', 'physics', 'chemistry', 'biology'
    ],
    'tuition-by-board': ['cbse', 'icse', 'state', 'igcse'],
    'tuition-by-location': [
        'kerala', 'dubai', 'uae', 'qatar', 'saudi-arabia', 'oman', 'kuwait',
        'bahrain', 'chennai', 'bangalore', 'coimbatore', 'hyderabad'
    ],
};

/**
 * Helper to produce accurate, capitalized, and readable display names for tuition routes.
 */
export function formatTuitionDisplayName(slug: string): string {
    if (!slug) return 'Academic';
    const lower = slug.toLowerCase();
    if (lower === 'cbse') return 'CBSE';
    if (lower === 'icse') return 'ICSE';
    if (lower === 'igcse') return 'IGCSE';
    if (lower === 'state') return 'Kerala State Board';
    if (lower === 'uae') return 'UAE';
    if (lower === 'dubai') return 'Dubai';
    if (lower === 'qatar') return 'Qatar';
    if (lower === 'saudi-arabia') return 'Saudi Arabia';
    if (lower === 'social-science') return 'Social Science';
    if (lower === 'class-1-5') return 'Classes 1–5';
    
    if (lower.startsWith('class-')) {
        const num = lower.replace('class-', '');
        return `Class ${num}`;
    }

    return slug
        .replace(/(\d)-(\d)/g, '$1_RANGE_$2')
        .replace(/-/g, ' ')
        .replace(/_RANGE_/g, '-')
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Returns tailored meta titles and descriptions for tuition category routes.
 */
export function getTuitionSEO(category: string, slug: string) {
    const displayName = formatTuitionDisplayName(slug);
    // Titles are used as `absolute` (the root layout template would append the brand twice); keep <= 60 chars
    let title = `${displayName} Online Tuition | 1:1 Classes | BrightPath`;
    let description = `Personalized 1:1 online tuition for ${displayName}. Expert certified tutors, individual attention, and customized learning roadmaps.`;

    if (category === 'tuition-by-board') {
        title = `${displayName} Online Tuition | 1:1 Mentors | BrightPath`;
    } else if (category === 'tuition-by-subject') {
        title = `Online ${displayName} Tuition | 1:1 Tutors | BrightPath`;
    } else if (category === 'tuition-by-location') {
        title = `Online Tuition in ${displayName} | 1:1 Classes | BrightPath`;
    }

    const content = getTuitionContent(category, slug);
    if (content) description = content.description;

    return { displayName, title, description };
}
