import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Layout, CheckCircle, GraduationCap, ArrowRight } from 'lucide-react';
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
        { name: 'CBSE', desc: 'Comprehensive coverage of NCERT curriculum with focus on conceptual clarity and competitive exam foundation.' },
        { name: 'ICSE/ISC', desc: 'Detailed pedagogical approach focusing on language proficiency and analytical skills.' },
        { name: 'Kerala State', desc: 'Specialized support for SCERT syllabus, ensuring students excel in board examinations with local expertise.' },
        { name: 'IGCSE', desc: 'International standards of learning with focus on global perspective and practical application.' }
    ];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
            <PublicNavbar />

            <header className="relative pt-48 pb-40 flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 mb-8 backdrop-blur-sm">
                        Curriculum Expertise
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-tight mb-8">
                        Academic <br />
                        <span className="text-primary italic">Boards.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-400 font-bold italic leading-relaxed">
                        We specialize in all major national and international academic boards, providing tailored mentorship for every syllabus.
                    </p>
                </div>
            </header>

            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {boards.map((board) => (
                            <div key={board.name} className="group p-12 bg-gray-50 rounded-[3rem] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">{board.name}</h3>
                                <p className="text-lg text-gray-500 font-bold italic leading-relaxed mb-8">{board.desc}</p>
                                <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                                    <CheckCircle className="w-4 h-4" /> Specialized Mentors Available
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
