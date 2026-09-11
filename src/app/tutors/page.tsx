import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import PublicTutorsGrid from '@/features/teachers/components/PublicTutorsGrid';
import { ShieldCheck, Star, GraduationCap } from 'lucide-react';
import { PublicService } from '@/lib/services/publicService';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Expert Tutors",
    description: "Meet our verified team of professional 1:1 tutors, including postgraduate and PhD subject-matter experts across Kerala.",
    alternates: {
        canonical: '/tutors',
    },
};

export const revalidate = 3600;

export default async function TutorsPage() {
    const rawTutors = await PublicService.getEliteTutors();
    const tutors = JSON.parse(JSON.stringify(rawTutors));

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            
            <header className="pt-32 pb-16 bg-primary text-white">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">Our Team</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight mb-6">
                        Meet Our <span className="text-secondary">Tutors</span>
                    </h1>
                    <p className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
                        Every tutor is carefully selected and verified to ensure the best learning experience for your child.
                    </p>
                </div>
            </header>

            {/* Standards Bar */}
            <section className="py-12 bg-surface border-b border-gray-100">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">Background Verified</h4>
                            <p className="text-xs text-gray-400">100% verified faculty</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center"><Star className="w-5 h-5" /></div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">Subject Experts</h4>
                            <p className="text-xs text-gray-400">Deep subject specialization</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center"><GraduationCap className="w-5 h-5" /></div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">Advanced Degrees</h4>
                            <p className="text-xs text-gray-400">Post-graduate & PhD holders</p>
                        </div>
                    </div>
                </div>
            </section>

            <PublicTutorsGrid tutors={tutors} />

            {/* Join CTA */}
            <section className="py-20 bg-[#1a1a2e] text-white text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight mb-4">
                        Want to teach with us?
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">We&apos;re always looking for passionate educators to join Kerala&apos;s most trusted online tuition platform.</p>
                    <Link href="/become-tutor" className="inline-block px-8 py-4 bg-white text-primary font-semibold text-sm rounded-xl shadow-lg hover:bg-gray-50 active:scale-[0.98] transition-all">
                        Apply as a Tutor
                    </Link>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
