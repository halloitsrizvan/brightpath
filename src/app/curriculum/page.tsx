import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { BookOpen, CheckCircle2, PenTool, Atom, Calculator } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Curriculum",
    description: "Structured academic programs for KG to 12th grade across CBSE, ICSE, and Kerala State boards. Personalized learning paths for every level.",
    alternates: {
        canonical: '/curriculum',
    },
};

export default function CurriculumPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <header className="pt-32 pb-16 bg-primary text-white">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">Curriculum</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight mb-6">
                        What We <span className="text-secondary">Teach</span>
                    </h1>
                    <p className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
                        Structured learning tracks for Kerala State, CBSE, and ICSE boards — from foundational years through entrance preparation.
                    </p>
                </div>
            </header>

            {/* Board Selection */}
            <section className="py-10 bg-surface border-b border-gray-100">
                <div className="container mx-auto px-6 flex flex-wrap justify-center gap-3">
                    {['Kerala State Board', 'CBSE', 'ICSE'].map(board => (
                        <div key={board} className="px-5 py-2.5 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
                            {board}
                        </div>
                    ))}
                </div>
            </section>

            {/* Level Breakdown */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-5xl space-y-16">
                    <LevelSection 
                        badge="KG – Class 5" 
                        title="Foundation Years" 
                        desc="Building curiosity and strong basics. We focus on phonetics, basic logic, and creative expression through 1:1 interaction."
                        items={['Creative Storytelling', 'Math Foundations', 'Language Fluency', 'Environmental Science']}
                        icon={<PenTool className="w-5 h-5" />}
                    />
                    <LevelSection 
                        badge="Class 6 – 10" 
                        title="Core Academic Years" 
                        desc="Deepening understanding across STEM and Humanities. Strategic mentorship aligned with board requirements."
                        items={['Advanced Mathematics', 'Physical Sciences', 'Life Sciences', 'Social Studies']}
                        icon={<Atom className="w-5 h-5" />}
                    />
                    <LevelSection 
                        badge="Class 11 – 12" 
                        title="Higher Secondary" 
                        desc="Intensive preparation for board exams and entrance tests including NEET and JEE."
                        items={['Physics', 'Chemistry', 'Advanced Mathematics', 'Biology / Economics']}
                        icon={<Calculator className="w-5 h-5" />}
                    />
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function LevelSection({ badge, title, desc, items, icon }: { badge: string, title: string, desc: string, items: string[], icon: React.ReactNode }) {
    return (
        <div className="p-8 rounded-2xl bg-surface border border-gray-100/80">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-semibold text-primary">{badge}</p>
                    <h2 className="text-xl font-bold text-gray-900 font-display">{title}</h2>
                </div>
            </div>
            <p className="text-gray-500 leading-relaxed mb-5">{desc}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {items.map(item => (
                    <div key={item} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-100/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
