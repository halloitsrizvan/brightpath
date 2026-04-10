'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import ServicesSection from '@/components/public/ServicesSection';
import { ShieldCheck, Video, Clock, TrendingUp } from 'lucide-react';

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            
            <header className="pt-40 pb-32 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Operational Excellence</p>
                    <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
                        The Mentorship <br /><span className="text-primary italic-glow">Solution.</span>
                    </h1>
                    <p className="text-xl text-white/40 font-bold max-w-2xl mx-auto italic leading-relaxed">
                        Precision-engineered educational services designed for the modern KG-12 student in Kerala.
                    </p>
                </div>
            </header>

            <section className="py-20 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                    <Benefit icon={<Video />} text="Live 1:1 Sessions" />
                    <Benefit icon={<Clock />} text="Flexible Node" />
                    <Benefit icon={<ShieldCheck />} text="Secure Digital Hub" />
                    <Benefit icon={<TrendingUp />} text="Growth Analytics" />
                </div>
            </section>

            <ServicesSection />

            <section className="py-32 bg-primary text-white text-center relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-3xl relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-8">Ready to Elevate Your <br /><span className="text-white/40 italic">Learning Velocity?</span></h2>
                    <button className="px-10 py-5 bg-white text-primary font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition-all">Request Enrollment Flight</button>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}

function Benefit({ icon, text }: { icon: any, text: string }) {
    return (
        <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">{icon}</div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">{text}</h4>
        </div>
    );
}
