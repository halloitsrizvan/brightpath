import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Request a free 1:1 diagnostic demo session or get in touch with our academic advisors. Start your academic transformation today.",
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactPage() {
    return <ContactClient />;
}
