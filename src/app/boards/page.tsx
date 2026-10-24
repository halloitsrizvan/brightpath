import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Tuition for CBSE, ICSE, Kerala State & IGCSE Boards | BrightPath",
    description: "Curriculum-aligned 1:1 online tuition for CBSE (NCERT), ICSE / ISC, Kerala State Syllabus (SCERT), and Cambridge IGCSE. Build conceptual clarity and score top marks.",
    alternates: {
        canonical: 'https://www.brightpatheduvora.com/boards',
    },
    openGraph: {
        title: "Tuition for CBSE, ICSE, Kerala State & IGCSE Boards | BrightPath",
        description: "Curriculum-aligned 1:1 online tuition for CBSE (NCERT), ICSE / ISC, Kerala State Syllabus (SCERT), and Cambridge IGCSE.",
        url: "https://www.brightpatheduvora.com/boards",
        siteName: "BrightPath Eduvora",
        locale: "en_IN",
        type: "website",
    }
};

export default function BoardsPage() {
    const boards = [
        { 
            name: 'CBSE', 
            slug: 'cbse',
            desc: 'Comprehensive NCERT curriculum coverage with focus on conceptual clarity, chapter-by-chapter problem solving, and competitive exam foundation.',
            tag: 'NCERT & Exemplar Aligned'
        },
        { 
            name: 'ICSE / ISC', 
            slug: 'icse',
            desc: 'Detailed approach focusing on language proficiency, analytical thinking, detailed science derivations, and practical mathematical problem solving.',
            tag: 'CISCE Aligned'
        },
        { 
            name: 'Kerala State Board', 
            slug: 'state',
            desc: 'Specialized support for SCERT syllabus in English and Malayalam mediums. Master SSLC and Plus Two model exams with dedicated Kerala faculty.',
            tag: 'SCERT & SSLC Specialization'
        },
        { 
            name: 'Cambridge IGCSE', 
            slug: 'igcse',
            desc: 'International standards of learning with focus on global perspective, inquiry-based problem solving, and progressive grading criteria.',
            tag: 'Global Standard'
        }
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
                        Curriculum-aligned 1:1 mentorship for state, national, and international boards across Kerala, India, and the GCC.
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
                            <Link 
                                key={board.name} 
                                href={`/tuition/tuition-by-board/${board.slug}`}
                                className="p-7 rounded-2xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-xl hover:shadow-gray-100/60 hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                                            {board.tag}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 font-display mb-2 group-hover:text-primary transition-colors">
                                        {board.name} Tuition
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{board.desc}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-primary font-semibold">
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> 1:1 Mentors Available
                                    </span>
                                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        View Curriculum <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
