import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { GraduationCap, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Academic Boards",
    description: "Personalized 1:1 tuition for CBSE, ICSE, ISC, IGCSE, and Kerala State Board curriculums. Tailored preparation for every syllabus.",
    alternates: {
        canonical: '/boards',
    },
};

export default function BoardsPage() {
    const boards = [
        { name: 'CBSE', desc: 'Comprehensive NCERT curriculum coverage with focus on conceptual clarity and competitive exam foundation.' },
        { name: 'ICSE / ISC', desc: 'Detailed approach focusing on language proficiency, analytical skills, and practical understanding.' },
        { name: 'Kerala State', desc: 'Specialized support for SCERT syllabus, helping students excel in board exams with local expertise.' },
        { name: 'IGCSE', desc: 'International standards of learning with focus on global perspective and practical application.' }
    ];

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <header className="pt-32 pb-16 bg-[#1a1a2e] text-white">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-4">Boards We Cover</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight mb-6">
                        Academic <span className="text-primary">Boards</span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
                        Specialized mentorship for every major national and international board curriculum.
                    </p>
                </div>
            </header>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                            Supported Educational Boards & Syllabus Overview
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">Comprehensive curriculum mapping for primary, secondary, and higher secondary students</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {boards.map((board) => (
                            <div key={board.name} className="p-7 rounded-2xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 group">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 font-display mb-2">{board.name}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">{board.desc}</p>
                                <div className="flex items-center gap-2 text-xs text-primary font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Specialized tutors available
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
