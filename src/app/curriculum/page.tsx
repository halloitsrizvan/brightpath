'use client';
import Link from 'next/link';
import { 
    ArrowLeft, 
    BookOpen, 
    CheckCircle2, 
    GraduationCap, 
    Atom, 
    Calculator, 
    Microscope, 
    PenTool
} from 'lucide-react';

export default function CurriculumPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
            {/* Simple Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-tighter text-gray-900 leading-none">BRIGHTPATH</span>
                            <span className="text-[8px] font-bold text-primary tracking-[0.3em] leading-none mt-1 uppercase">Back to Home</span>
                        </div>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-20 bg-[#45308D] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <p className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Academic Architecture</p>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-8">
                        The Curriculum <br /><span className="text-secondary">Spectrum.</span>
                    </h1>
                    <p className="text-xl text-white/60 font-bold italic leading-relaxed">
                        Precision-engineered learning tracks for Kerala State, CBSE, and ICSE boards, covering foundational years through entrance specialization.
                    </p>
                </div>
            </header>

            {/* Board Selection / Tabs Placeholder */}
            <section className="py-20 bg-gray-50/50">
                <div className="container mx-auto px-6 flex flex-wrap justify-center gap-4">
                    {['Kerala State Board', 'CBSE Portfolio', 'ICSE Certification'].map(board => (
                        <div key={board} className="px-8 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm font-black text-[10px] uppercase tracking-widest text-primary hover:scale-[1.05] transition-all cursor-pointer">
                            {board}
                        </div>
                    ))}
                </div>
            </section>

            {/* Level Breakdown */}
            <section className="py-32">
                <div className="container mx-auto px-6 space-y-32">
                    <LevelSection 
                        badge="KG - 5" 
                        title="Foundational Nucleus" 
                        desc="Where curiosity meets guidance. We focus on phonetics, basic logic, and creative expression through 1:1 interaction."
                        items={['Creative Storytelling', 'Mathematical Logic Base', 'Language Fluency', 'EVS Exploration']}
                        icon={<PenTool className="w-8 h-8" />}
                    />
                    <LevelSection 
                        badge="6 - 10" 
                        title="Core Analytical Hub" 
                        desc="Strategic mentorship for competitive state and national curriculums. Deep-diving into STEM and Humanities."
                        items={['Advanced Mathematics', 'Physical Sciences', 'Biological Inquiries', 'Social Dynamics']}
                        icon={<Atom className="w-8 h-8" />}
                        reversed
                    />
                    <LevelSection 
                        badge="11 - 12" 
                        title="Higher Specialization" 
                        desc="Intensive training for entrance corridors including NEET and JEE, alongside board exam excellence."
                        items={['Physics Analytics', 'Chemical Synthesis', 'Advanced Calculus', 'Economic Frameworks']}
                        icon={<Calculator className="w-8 h-8" />}
                    />
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-16 border-t border-gray-100 text-center">
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">© 2026 BRIGHTPATH KERALA | ACADEMIC SPECTRUM</p>
            </footer>
        </div>
    );
}

function LevelSection({ badge, title, desc, items, icon, reversed = false }: { badge: string, title: string, desc: string, items: string[], icon: any, reversed?: boolean }) {
    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`space-y-8 ${reversed ? 'lg:order-2' : ''}`}>
                <div className="w-16 h-16 rounded-[2rem] bg-primary text-white flex items-center justify-center shadow-xl shadow-gray-200">
                    {icon}
                </div>
                <div>
                   <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-2 block leading-none">{badge} Excellence</span>
                   <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">{title}</h2>
                </div>
                <p className="text-gray-500 font-bold leading-relaxed italic text-lg">{desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map(item => (
                        <div key={item} className="flex items-center gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`aspect-[4/3] bg-gray-100 rounded-[4rem] relative overflow-hidden flex items-center justify-center group ${reversed ? 'lg:order-1' : ''}`}>
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <BookOpen className="w-32 h-32 text-gray-200 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-10 left-10 p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pedagogical Mode</p>
                    <p className="text-sm font-black text-gray-800 uppercase italic tracking-tighter leading-none">1:1 Focused Mentorship</p>
                </div>
            </div>
        </div>
    );
}
