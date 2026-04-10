'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import { Target, Zap, ShieldCheck, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Hero Section */}
            <header className="pt-40 pb-32 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="container mx-auto px-6 max-w-4xl">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Our Institutional Core</p>
                    <h1 className="text-5xl md:text-8xl font-black text-gray-900 italic uppercase tracking-tighter leading-none mb-8">
                        The Mentorship <br /><span className="text-primary">Manifesto.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-bold italic leading-relaxed">
                        Brightpath Kerala was founded on a singular premise: every student possesses a unique cognitive blueprint that deserves personalized nurturing.
                    </p>
                </div>
            </header>

            {/* Mission & Vision */}
            <section className="py-32">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">Our Mission Pulse</h2>
                            <p className="text-gray-500 font-bold leading-relaxed italic">
                                To democratize elite 1:1 mentorship across Kerala, ensuring that geography never limits a child's academic potential. We bridge the gap between curriculum and comprehension through digital innovation.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">Our Visionary Orbit</h2>
                            <p className="text-gray-500 font-bold leading-relaxed italic">
                                Setting the gold standard for personalized online education by creating a secure, high-transparency ecosystem where growth is measured beyond marks.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[3rem] p-12 md:p-16 relative overflow-hidden flex flex-col justify-center shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                        <div className="relative z-10 space-y-10">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">The Academy <br /><span className="text-primary uppercase tracking-tighter px-4 py-1 bg-white inline-block mt-4 rounded-xl">Statistics</span></h3>
                            <div className="grid grid-cols-1 gap-10 pt-6">
                                <StatItem label="Years of Academic Excellence" value="12+" />
                                <StatItem label="Successful Alumni" value="5000+" />
                                <StatItem label="Faculty Retention" value="95%" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-32 bg-gray-50/50">
                <div className="container mx-auto px-6 text-center mb-20 text-center">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 text-center">Integrity Registry</p>
                    <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter text-center">Institutional <span className="text-primary">Values.</span></h2>
                </div>

                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ValueCard icon={<ShieldCheck className="w-6 h-6" />} title="Radical Transparency" desc="Detailed monthly analytical reports visible to parents in real-time." />
                    <ValueCard icon={<Users className="w-6 h-6" />} title="Student Safety" desc="A strictly audited digital ecosystem with verified professional mentors." />
                    <ValueCard icon={<BookOpen className="w-6 h-6" />} title="Adaptive Pedagogy" desc="Teaching methods that evolve with the student's personal growth." />
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="border-l-4 border-primary pl-8">
            <p className="text-5xl font-black text-white italic leading-none">{value}</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-3 italic">{label}</p>
        </div>
    );
}

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 text-center group hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/20">{icon}</div>
            <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter mb-4 leading-none">{title}</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed italic">{desc}</p>
        </div>
    );
}
