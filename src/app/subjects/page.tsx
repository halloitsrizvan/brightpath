import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import SubjectsGrid from '@/components/public/SubjectsGrid';
import { BookOpen, GraduationCap, Globe, Zap } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Subjects We Teach",
    description: "Specialized 1:1 tutoring across Mathematics, Physics, Chemistry, Biology, English, Malayalam, and more for KG-12 students.",
    alternates: {
        canonical: '/subjects',
    },
};

export default function SubjectsPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            
            <header className="pt-32 pb-16 bg-surface">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Subjects</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-display leading-tight mb-4">
                        Subjects We Teach
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Comprehensive subject coverage from Grade 1 foundations to Grade 12 board specializations.
                    </p>
                </div>
            </header>

            {/* Feature Chips */}
            <section className="py-10 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 flex flex-wrap justify-center gap-3 max-w-4xl">
                    <FeatureChip icon={<BookOpen className="w-4 h-4" />} text="Kerala State Syllabus" />
                    <FeatureChip icon={<GraduationCap className="w-4 h-4" />} text="CBSE / ICSE" />
                    <FeatureChip icon={<Globe className="w-4 h-4" />} text="English & Malayalam" />
                    <FeatureChip icon={<Zap className="w-4 h-4" />} text="Entrance Prep" />
                </div>
            </section>

            <SubjectsGrid />

            {/* CTA */}
            <section className="py-20 bg-primary text-white text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight mb-4">
                        Not sure which subjects to focus on?
                    </h2>
                    <p className="text-white/60 mb-8">Book a free assessment and we&apos;ll help identify your child&apos;s strengths and areas for improvement.</p>
                    <Link href="/contact" className="inline-block px-8 py-4 bg-white text-primary font-semibold text-sm rounded-xl shadow-lg hover:bg-gray-50 active:scale-[0.98] transition-all">
                        Book Free Assessment
                    </Link>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function FeatureChip({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-100 rounded-lg">
            <span className="text-primary">{icon}</span>
            <span className="text-sm font-medium text-gray-600">{text}</span>
        </div>
    );
}
