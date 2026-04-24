'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Target, Zap, ShieldCheck, Users, BookOpen, Heart, Eye, Award } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
            <PublicNavbar />

            {/* Premium Hero Section */}
            <header className="relative pt-48 pb-40 flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/3" />
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 mb-8 backdrop-blur-sm">
                        Our Institutional DNA
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-tight mb-8">
                        Learn Right. <br />
                        <span className="text-primary italic">Grow Bright.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-400 font-bold italic leading-relaxed">
                        Brightpath Kerala is more than an academy—it’s a commitment to the cognitive evolution of every student who joins our ecosystem.
                    </p>
                </div>
            </header>

            {/* Vision & Mission: The Dynamic Duo */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                        {/* Mission Block */}
                        <div className="group relative p-12 bg-gray-50 rounded-[3rem] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                <Target className="w-48 h-48 text-primary" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                                    <Target className="w-8 h-8" />
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">Our <span className="text-primary">Mission.</span></h2>
                                <p className="text-lg text-gray-500 font-bold leading-relaxed italic max-w-md">
                                    To democratize elite 1:1 mentorship across Kerala, ensuring geography never limits a child's academic potential through digital innovation.
                                </p>
                            </div>
                        </div>

                        {/* Vision Block */}
                        <div className="group relative p-12 bg-gray-900 rounded-[3rem] border border-gray-800 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                <Eye className="w-48 h-48 text-secondary" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-secondary/20">
                                    <Eye className="w-8 h-8" />
                                </div>
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Our <span className="text-secondary">Vision.</span></h2>
                                <p className="text-lg text-gray-400 font-bold leading-relaxed italic max-w-md">
                                    Setting the global benchmark for personalized online pedagogy by creating a high-transparency ecosystem where growth is absolute.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values: Institutional Integrity */}
            <section className="py-32 bg-gray-50/50 relative">
                <div className="container mx-auto px-6 mb-24 text-center">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">The Ethical Registry</p>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">Institutional <span className="text-primary">Values.</span></h2>
                </div>

                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ValueCard 
                        icon={<ShieldCheck className="w-6 h-6" />} 
                        title="Integrity" 
                        desc="Radical honesty in every report and academic assessment delivered to parents." 
                    />
                    <ValueCard 
                        icon={<Heart className="w-6 h-6" />} 
                        title="Empathy" 
                        desc="Understanding the student's unique pace and emotional learning needs first." 
                    />
                    <ValueCard 
                        icon={<Zap className="w-6 h-6" />} 
                        title="Innovation" 
                        desc="Evolving our digital tools daily to keep learning interactive and fast-paced." 
                    />
                    <ValueCard 
                        icon={<Award className="w-6 h-6" />} 
                        title="Excellence" 
                        desc="A relentless pursuit of academic mastery for every student in our care." 
                    />
                </div>
            </section>

            {/* Statistics Milestone */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="bg-primary rounded-[4rem] p-16 md:p-24 relative overflow-hidden flex flex-col lg:flex-row gap-20 items-center">
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mb-48 -mr-48" />
                        <div className="lg:w-1/2 space-y-8 relative z-10 text-center lg:text-left">
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">The Academy <br /><span className="text-white/40">In Numbers.</span></h2>
                            <p className="text-white/60 font-bold italic leading-relaxed text-lg">Our growth is a testament to the trust thousands of parents place in our specialized mentorship model.</p>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-12 relative z-10 w-full">
                            <StatItem label="Years of Excellence" value="12+" />
                            <StatItem label="Successful Alumni" value="5000+" />
                            <StatItem label="Expert Mentors" value="500+" />
                            <StatItem label="Student Satisfaction" value="99%" />
                        </div>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="border-l-4 border-white/20 pl-8 group">
            <p className="text-6xl font-black text-white italic leading-none group-hover:scale-110 transition-transform origin-left duration-500">{value}</p>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-4 italic">{label}</p>
        </div>
    );
}

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-white p-12 rounded-[3.5rem] border border-transparent shadow-xl shadow-gray-200/20 text-center group hover:border-primary/20 hover:-translate-y-2 transition-all duration-500">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                {icon}
            </div>
            <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter mb-4 leading-none">{title}</h3>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed italic">{desc}</p>
        </div>
    );
}
