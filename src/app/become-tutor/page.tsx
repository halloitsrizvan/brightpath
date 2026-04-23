'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Users, BookOpen, Clock, Heart, CheckCircle2, ChevronRight, MessageCircle, Star, Target } from 'lucide-react';
import Image from 'next/image';

export default function BecomeTutor() {
    console.log("BecomeTutor Page Loaded");
    const whatsappLink = "https://wa.me/918590878148?text=I'm%20interested%20in%20joining%20BrightPath%20as%20a%20tutor";

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-12 pb-8 flex items-center justify-center overflow-hidden bg-gray-900 text-center">
                 <div className="absolute inset-0 bg-primary/5 -skew-x-12 translate-x-1/4" />
                 <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                            Recruitment Drive 2026
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                            Online Teaching Job <br /> In <span className="text-primary">Kerala!</span> Join BrightPath <br /> <span className="text-secondary">As A Tutor.</span>
                        </h1>
                        <p className="text-gray-400 font-bold italic leading-relaxed max-w-2xl mx-auto text-sm md:text-md">
                            Transform lives from the comfort of your home. We are looking for passionate educators to join India's fastest-growing 1:1 online mentorship network.
                        </p>
                        <div className="flex justify-center pt-4">
                            <a 
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-10 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm"
                            >
                                <MessageCircle className="w-5 h-5 fill-white/20" /> Apply via WhatsApp
                            </a>
                        </div>
                    </div>
                 </div>
            </section>

            {/* Why Teach With us */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-20 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">The Career Edge</div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                            Why Teach With <span className="text-primary">BrightPath.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <BenefitCard icon={<Clock />} title="Zero Travel" desc="Teach from your preferred workspace and save hours of commute time every day." />
                        <BenefitCard icon={<Heart />} title="Rewarding Pay" desc="Competitive compensation models that respect your academic expertise and dedication." />
                        <BenefitCard icon={<BookOpen />} title="Global Platform" desc="Expand your professional horizons by teaching students from across India and the GCC." />
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="py-24 bg-gray-50 overflow-hidden relative">
                 <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest">Start Today</div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                Apply For A Tutor And Start <br /> Your Teacher Journey <span className="text-secondary">With BrightPath.</span>
                            </h2>
                            <p className="text-base text-gray-500 font-bold italic leading-relaxed">
                                Our recruitment process is fast, transparent, and designed to find the best mentorship talent in Kerala.
                            </p>
                            <div className="space-y-4 pt-6">
                                <Step title="Instant WhatsApp Connect" desc="Start the conversation with our recruitment team via WhatsApp." />
                                <Step title="Skill Evaluation" desc="A brief assessment of your subject knowledge and teaching style." />
                                <Step title="Onboarding" desc="Get trained on our personalized 1:1 mentorship framework." />
                                <Step title="Start Mentoring" desc="Get matched with students and begin your professional session." />
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                             <div className="p-1 px-1 bg-gradient-to-tr from-primary to-secondary rounded-[3rem]">
                                <div className="bg-white p-8 md:p-12 rounded-[2.9rem] shadow-2xl relative overflow-hidden group">
                                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full group-hover:scale-150 transition-all duration-700" />
                                    <div className="relative z-10 space-y-6 text-center">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                            <Users className="w-10 h-10 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">Join 500+ <br /> Expert Tutors</h3>
                                        <p className="text-sm font-bold text-gray-400 italic">BrightPath is home to the most elite teaching talent in Kerala.</p>
                                        <a href={whatsappLink} className="block w-full py-5 bg-gray-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary transition-colors text-center">Apply to Join</a>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                 </div>
            </section>

            {/* Why Join Us & Qualifying */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter border-b-4 border-primary inline-block">Why Join Us?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <JoinPoint icon={<CheckCircle2 className="text-emerald-500" />} text="Flexible Timings" />
                                <JoinPoint icon={<CheckCircle2 className="text-emerald-500" />} text="Mentorship Training" />
                                <JoinPoint icon={<CheckCircle2 className="text-emerald-500" />} text="Creative Autonomy" />
                                <JoinPoint icon={<CheckCircle2 className="text-emerald-500" />} text="Tech Support 24/7" />
                                <JoinPoint icon={<CheckCircle2 className="text-emerald-500" />} text="Performance Bonuses" />
                                <JoinPoint icon={<CheckCircle2 className="text-emerald-500" />} text="Professional Growth" />
                            </div>
                        </div>

                        <div className="p-10 bg-gray-900 rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 blur-[100px]" />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter relative z-10">Qualifying As A <br /><span className="text-primary">Tutor.</span></h2>
                            <div className="space-y-6 relative z-10">
                                <QualifyPoint title="Academic Proficiency" desc="Strong mastery over CBSE, ICSE or State board subjects." />
                                <QualifyPoint title="Communication Skills" desc="Ability to explain complex concepts in Malayalam & English clearly." />
                                <QualifyPoint title="Digital Literacy" desc="Familiarity with online meeting tools and digital whiteboards." />
                                <QualifyPoint title="Passion" desc="A genuine desire to see students succeed and grow." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-primary text-white text-center rounded-t-[5rem] mt-24">
                <div className="container mx-auto px-6 max-w-4xl space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">Ready To Transform <br /><span className="text-white/40">The Next Generation?</span></h2>
                    <p className="text-white/60 font-medium italic uppercase tracking-widest text-xs">Don't wait. Your journey starts with one message.</p>
                    <div className="flex justify-center pt-4">
                        <a href={whatsappLink} className="px-12 py-5 bg-white text-primary font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all">Submit Application</a>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function BenefitCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 text-center space-y-4 group">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                {icon}
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">{title}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">{desc}</p>
        </div>
    );
}

function Step({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex gap-4 items-start group">
            <div className="w-2 h-10 bg-primary/20 shrink-0 group-hover:bg-primary transition-colors" />
            <div>
                <h4 className="text-sm font-black text-gray-900 uppercase italic tracking-widest">{title}</h4>
                <p className="text-xs text-gray-400 font-bold italic">{desc}</p>
            </div>
        </div>
    );
}

function JoinPoint({ icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            {icon}
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{text}</span>
        </div>
    );
}

function QualifyPoint({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="space-y-1">
            <h4 className="text-sm font-black uppercase italic tracking-widest text-primary">{title}</h4>
            <p className="text-xs text-white/50 font-medium italic">{desc}</p>
        </div>
    );
}
