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
    let title = `${displayName} Online Tuition | 1:1 Classes | BrightPath Eduvora`;
    let description = `Personalized 1:1 online tuition for ${displayName}. Expert certified tutors, individual attention, and customized learning roadmaps.`;

    if (category === 'tuition-by-classes') {
        title = `${displayName} Online Tuition | 1:1 Personal Classes | BrightPath`;
        description = `Personalized 1:1 online tuition for ${displayName} students. Expert certified mentors, individual doubt clearing, and customized curriculum support across CBSE, ICSE & State boards.`;
    } else if (category === 'tuition-by-board') {
        title = `${displayName} Online Tuition | 1:1 Expert Mentors | BrightPath`;
        description = `Specialized 1:1 online tuition aligned strictly with ${displayName} curriculum. Build conceptual clarity, solve previous question papers, and boost exam confidence.`;
    } else if (category === 'tuition-by-subject') {
        title = `1:1 Online ${displayName} Tuition | Expert Subject Mentors | BrightPath`;
        description = `Master ${displayName} with dedicated 1:1 online tutoring for KG-12 students. Clear foundational doubts, practice numericals/concepts, and score higher marks.`;
    } else if (category === 'tuition-by-location') {
        title = `Online Tuition in ${displayName} | 1:1 Classes for CBSE & State | BrightPath`;
        description = `Top-rated 1:1 online tuition for students in ${displayName}. Individual attention for CBSE, ICSE, and Kerala State syllabus with flexible scheduling from home.`;
    }

    return { displayName, title, description };
}
