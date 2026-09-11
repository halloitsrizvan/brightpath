import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Careers",
    description: "Explore career opportunities at BrightPath. Join our team of passionate educators and academic consultants.",
    alternates: {
        canonical: '/careers',
    },
};

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <header className="pt-32 pb-16 bg-[#1a1a2e] text-white">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-4">Careers</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight mb-6">
                        Work with <span className="text-primary">BrightPath</span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
                        We&apos;re always looking for passionate educators and innovators to join our team.
                    </p>
                </div>
            </header>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-2xl text-center">
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 font-display mb-3">
                        Upcoming Opportunities
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-8">
                        Our team is expanding. While we don&apos;t have active listings right now, we&apos;re always eager to meet talented tutors and academic consultants.
                    </p>
                    
                    <div className="p-8 bg-surface rounded-2xl border border-gray-100/80">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Send Your Resume</h3>
                        <p className="text-sm text-gray-500 mb-6">Join our talent pool for upcoming roles in teaching, sales, and operations.</p>
                        <a 
                            href="mailto:careers@brightpatheduvora.com" 
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-semibold text-sm rounded-xl shadow-md shadow-primary/15 hover:bg-primary/90 active:scale-[0.98] transition-all"
                        >
                            Email Us <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
