'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import SubjectsGrid from '@/components/public/SubjectsGrid';
import { BookOpen, GraduationCap, Globe, Zap } from 'lucide-react';

export default function SubjectsPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            
            <header className="pt-40 pb-32 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/4 -z-10" />
                <div className="container mx-auto px-6 max-w-4xl">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Academic Depth</p>
                    <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
                        The Curriculum <br /><span className="text-primary">Spectrum.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-bold italic leading-relaxed max-w-2xl">
                        Comprehensive subject coverage ranging from foundational literacy in Grade 1 to advanced board specializations in Grade 12.
                    </p>
                </div>
            </header>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <FeatureChip icon={<BookOpen className="w-4 h-4" />} text="Kerala State Syllabus" />
                    <FeatureChip icon={<GraduationCap className="w-4 h-4" />} text="CBSE / ICSE Mastery" />
                    <FeatureChip icon={<Globe className="w-4 h-4" />} text="English & Malayalam Tracks" />
                    <FeatureChip icon={<Zap className="w-4 h-4" />} text="Entrance Integration" />
                </div>
            </section>

            <SubjectsGrid />

            <section className="py-32 bg-[#fdc70b] text-primary relative overflow-hidden">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Diagnostic <br /><span className="text-white px-3 py-1 bg-primary inline-block mt-3 rounded-xl italic">Mapping</span></h2>
                        <p className="text-primary/70 font-bold italic text-lg leading-relaxed">Not sure which subject focus is right for your child? Our institutional diagnostic mapping helps identify core cognitive gaps before enrollment.</p>
                        <button className="px-8 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Start Mapping Free</button>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}

function FeatureChip({ icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-gray-200/40 transition-all">
            <div className="text-primary">{icon}</div>
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{text}</span>
        </div>
    );
}
