import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read the privacy policy of BrightPath Eduvora. Learn how we handle and protect student, parent, and tutor data.",
    alternates: {
        canonical: '/privacy',
    },
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <header className="pt-32 pb-12 bg-surface border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-gray-400">Last updated: April 2026</p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-3xl prose prose-gray prose-sm md:prose-base">
                    <h2>Introduction</h2>
                    <p>
                        At BrightPath Eduvora (referred to as &quot;the Academy&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we prioritize the privacy and safety of our students and parents. This Privacy Policy outlines how we collect, store, and utilize your personal information when you interact with our online tuition platform.
                    </p>

                    <h2>Information We Collect</h2>
                    <p>
                        We collect essential data to provide high-quality mentorship, including: student names, parental contact details (Phone/WhatsApp), email addresses, academic boards, and current grade levels. This information is exclusively used for matching students with appropriate mentors and scheduling demo sessions.
                    </p>

                    <h2>Data Security</h2>
                    <p>
                        Your personal data is protected by industry-standard encryption protocols. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Access to student records is strictly limited to authorized academic counselors and assigned tutors.
                    </p>

                    <h2>Usage of Data</h2>
                    <p>
                        Collected information is utilized to: personalize the learning experience, process enquiries, send academic progress reports, and communicate regarding schedule changes or technical support requirements.
                    </p>

                    <h2>Questions?</h2>
                    <p>
                        If you have any concerns about how your data is handled, please contact us at{' '}
                        <a href="mailto:legal@brightpatheduvora.com" className="text-primary hover:underline">legal@brightpatheduvora.com</a>.
                    </p>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
