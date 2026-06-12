import { Metadata } from 'next';
import TestimonialsClient from './TestimonialsClient';

export const metadata: Metadata = {
    title: "Success Stories",
    description: "Read testimonials from families, parents, and students who have transformed their grades and confidence with BrightPath online tuition.",
    alternates: {
        canonical: '/testimonials',
    },
};

export default function TestimonialsPage() {
    return <TestimonialsClient />;
}
