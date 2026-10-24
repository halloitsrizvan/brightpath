import { Metadata } from 'next';
import TestimonialsClient from './TestimonialsClient';

export const metadata: Metadata = {
    title: "Parent & Student Reviews | BrightPath 1:1 Online Tuition Stories",
    description: "Read real reviews and feedback from parents and students across Kerala and GCC experiencing transformative academic growth with BrightPath 1:1 online tuition.",
    alternates: {
        canonical: 'https://www.brightpatheduvora.com/testimonials',
    },
    openGraph: {
        title: "Parent & Student Reviews | BrightPath 1:1 Online Tuition Stories",
        description: "Read real reviews and feedback from parents and students across Kerala and GCC experiencing transformative academic growth with BrightPath 1:1 online tuition.",
        url: "https://www.brightpatheduvora.com/testimonials",
        siteName: "BrightPath Eduvora",
        locale: "en_IN",
        type: "website",
    }
};

export default function TestimonialsPage() {
    return <TestimonialsClient />;
}
