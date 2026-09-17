import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
    title: "BrightPath Eduvora | 1:1 Online Tuition & Expert Mentors for KG-12 Students",
    description: "BrightPath Eduvora provides personalized 1:1 online tuition for KG to 12th grade students. Certified expert tutors for CBSE, ICSE, State & IGCSE boards.",
    alternates: {
        canonical: 'https://www.brightpatheduvora.com',
    },
    openGraph: {
        title: "BrightPath Eduvora | 1:1 Online Tuition & Expert Mentors",
        description: "Personalized 1:1 online tuition for KG to 12th grade students. Expert tutors, flexible scheduling, and custom study plans.",
        url: "https://www.brightpatheduvora.com",
        siteName: "BrightPath Eduvora",
        locale: "en_US",
        type: "website",
    },
};

export default function LandingPage() {
    return <HomeClient />;
}
