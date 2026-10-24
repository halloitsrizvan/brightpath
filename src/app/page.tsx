import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
    title: "Online Tuition in Kerala | 1:1 Classes KG–12 & Foundation | BrightPath",
    description: "Personalized online tuition for KG–12 students with individual attention, foundation support, and flexible scheduling. Contact BrightPath to discuss your child's learning needs.",
    alternates: {
        canonical: 'https://www.brightpatheduvora.com',
    },
    openGraph: {
        title: "Online Tuition in Kerala | 1:1 Classes KG–12 | BrightPath Eduvora",
        description: "Personalized online tuition for KG–12 students with individual attention, foundation support, and flexible scheduling across CBSE, ICSE, and Kerala State syllabus.",
        url: "https://www.brightpatheduvora.com",
        siteName: "BrightPath Eduvora",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: "/bn2.png",
                width: 1200,
                height: 630,
                alt: "BrightPath Eduvora 1:1 Online Tuition",
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Online Tuition in Kerala | 1:1 Classes KG–12 | BrightPath',
        description: 'Personalized online tuition for KG–12 students with individual attention, foundation support, and flexible scheduling.',
        images: ['/bn2.png'],
    }
};

export default function LandingPage() {
    return <HomeClient />;
}
