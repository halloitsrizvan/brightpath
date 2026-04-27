import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
    title: "BrightPath Eduvora | 1:1 Online Tuition Academy KG-12",
    description: "Learn Right. Grow Bright. High-quality 1:1 personalized online tuition for KG to 12th grade. Global standards, trusted tutors, and expert mentorship for academic excellence.",
    alternates: {
        canonical: '/',
    },
};

export default function LandingPage() {
    return <HomeClient />;
}
