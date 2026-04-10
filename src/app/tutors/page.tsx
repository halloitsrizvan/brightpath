'use client';
import PublicNavbar from '../components/public/Navbar';
import PublicFooter from '../components/public/Footer';
import TutorsGrid from '../components/public/TutorsGrid';
import { Star, ShieldCheck, GraduationCap } from 'lucide-react';

export default function TutorsPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            
            <header className="pt-40 pb-20 bg-[#45308D] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <p className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-4">The Faculty Hub</p>
                    <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
                        Our Expert <br /><span className="text-secondary text-primary-glow">Mentors.</span>
                    </h1>
                    <p className="text-xl text-white/60 font-bold italic max-w-2xl mx-auto leading-relaxed">
                        A strictly audited roster of professional educators dedicated to your child's 1:1 academic trajectory.
                    </p>
                </div>
            </header>

            <section className="py-20 bg-gray-50/50 border-b border-gray-100">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><ShieldCheck /></div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Strict Verification</h4>
                        <p className="text-gray-500 font-bold text-sm italic italic">100% background verified faculty</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-secondary/10 text-[#fdc70b] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Star /></div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#fdc70b]">Expertise Led</h4>
                        <p className="text-gray-500 font-bold text-sm italic italic">Subject-matter specialization only</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"><GraduationCap /></div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Advanced Credentials</h4>
                        <p className="text-gray-500 font-bold text-sm italic italic">Post-graduate & PhD profile focus</p>
                    </div>
                </div>
            </section>

            <TutorsGrid />

            <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-10">Join Our <span className="text-primary italic">Faculty Network?</span></h2>
                    <p className="text-white/40 font-bold mb-12 max-w-xl mx-auto italic">We are always looking for passionate 1:1 mentors to join Kerala's most trusted recruitment portal.</p>
                    <button className="px-10 py-5 bg-white text-primary font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-[1.05] transition-all">Submit Portfolio</button>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
