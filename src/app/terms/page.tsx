import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read the terms of service for BrightPath Eduvora's online tuition platform and mentorship services.",
    alternates: {
        canonical: '/terms',
    },
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <header className="pt-32 pb-12 bg-surface border-b border-gray-100">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight mb-2">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-gray-400">Last updated: April 2026</p>
                </div>
            </header>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-3xl prose prose-gray prose-sm md:prose-base">
                    <h2>Acceptance of Terms</h2>
                    <p>
                        By accessing or using the BrightPath Eduvora platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site. These terms apply to all visitors, users, and others who access or use the Service.
                    </p>

                    <h2>Services Provided</h2>
                    <p>
                        BrightPath provides individualized online tutoring services. While we strive for academic excellence, results depend significantly on the student&apos;s cooperation and consistency. We reserve the right to modify or discontinue any aspect of our services without prior notice.
                    </p>

                    <h2>User Responsibilities</h2>
                    <p>
                        Users are responsible for maintaining a stable internet connection for sessions and ensuring a quiet learning environment. Tutors deserve a respectful workspace; any form of harassment or inappropriate behavior will lead to immediate termination of services without refund.
                    </p>

                    <h2>Limitation of Liability</h2>
                    <p>
                        In no event shall BrightPath or its mentors be liable for any indirect, incidental, or consequential damages arising out of your use or inability to use our services. Our maximum liability shall not exceed the fees paid by you for the specific session in question.
                    </p>

                    <h2>Questions?</h2>
                    <p>
                        For detailed institutional contracts or partnership terms, please contact us at{' '}
                        <a href="mailto:legal@brightpatheduvora.com" className="text-primary hover:underline">legal@brightpatheduvora.com</a>.
                    </p>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
