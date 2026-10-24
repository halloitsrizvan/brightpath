import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: "Contact BrightPath Eduvora | Book a Free 1:1 Diagnostic Demo Class",
    description: "Connect with our academic counselors to discuss your child's learning needs or schedule a free 1:1 online diagnostic demo session. WhatsApp and phone support available.",
    alternates: {
        canonical: 'https://www.brightpatheduvora.com/contact',
    },
    openGraph: {
        title: "Contact BrightPath Eduvora | Book a Free 1:1 Diagnostic Demo Class",
        description: "Connect with our academic counselors to discuss your child's learning needs or schedule a free 1:1 online diagnostic demo session.",
        url: "https://www.brightpatheduvora.com/contact",
        siteName: "BrightPath Eduvora",
        locale: "en_IN",
        type: "website",
    }
};

export default function ContactPage() {
    return <ContactClient />;
}
