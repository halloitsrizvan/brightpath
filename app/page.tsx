'use client';
import PublicNavbar from './components/public/Navbar';
import PublicFooter from './components/public/Footer';
import Testimonials from './components/public/Testimonials';
import TutorsGrid from './components/public/TutorsGrid';
import SubjectsGrid from './components/public/SubjectsGrid';
import Image from 'next/image';
import { Star, ArrowRight, Video, Clock, Users, ShieldCheck, BookOpen, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOrganization",
                        "name": "Brightpath Kerala",
                        "url": "https://brightpath-kerala.eduvora.com",
                        "logo": "https://brightpath-kerala.eduvora.com/favicon.ico",
                        "description": "High-quality 1:1 personalized online tuition for KG to 12th grade in Kerala.",
                    })
                }}
            />

            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32 -z-10" />
                
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                            <Star className="w-3 h-3 fill-primary" /> Kerala's #1 Mentorship Academy
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-none tracking-tighter italic uppercase">
                            Learn <span className="text-primary">Right.</span><br />
                            Grow <span className="text-secondary">Bright.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 font-bold max-w-xl leading-relaxed italic">
                            Premium 1:1 online mentorship for students from KG to 12th Grade. Experience the future of personalized education with Kerala's most trusted tutors.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button 
                                suppressHydrationWarning
                                className="w-full sm:w-auto px-8 py-5 bg-primary text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                Book Free Assessment
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="flex -space-x-3 items-center">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                                        <Image 
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                                            alt="Student" 
                                            fill 
                                            unoptimized
                                        />
                                    </div>
                                ))}
                                <div className="pl-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                    <span className="text-gray-900">500+</span> Active Students
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 text-center flex justify-center">
                        <div className="absolute inset-0 bg-primary/10 rounded-[4rem] rotate-3 scale-105" />
                        <div className="relative bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-4 border-white aspect-[4/5] md:aspect-square flex items-center justify-center max-w-[500px] w-full">
                             <div className="absolute inset-0 group">
                                <Image src="/brightpath-hero.png" alt="Learning" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" priority />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60" />
                             </div>
                             <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center"><Video className="w-6 h-6" /></div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1 leading-none">Live Now</p>
                                        <p className="text-sm font-black text-gray-800 uppercase italic tracking-tighter leading-none">1:1 Mentorship Session</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Sections */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FeatureCard icon={<Clock className="w-6 h-6" />} title="Flexible Timing" desc="Classes from 5 AM to 11 PM." color="bg-violet-500" />
                        <FeatureCard icon={<Users className="w-6 h-6" />} title="1:1 Mentorship" desc="Personalized focus." color="bg-primary" />
                        <FeatureCard icon={<ShieldCheck className="w-6 h-6" />} title="Trusted Tutors" desc="Verified expertise." color="bg-teal-500" />
                        <FeatureCard icon={<BookOpen className="w-6 h-6" />} title="KG - 12 Coverage" desc="All boards supported." color="bg-secondary" />
                    </div>
                    <div className="space-y-8">
                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2 leading-none">The Academy Edge</p>
                        <h2 className="text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">Educational Clarity <br /><span className="text-primary">Redefined.</span></h2>
                        <p className="text-lg text-gray-500 font-bold leading-relaxed italic">At Brightpath Kerala, we build cognitive foundations through personalized methodology.</p>
                        <div className="space-y-4 pt-4">
                            <ImpactPoint text="Localized instruction in Malayalam & English" />
                            <ImpactPoint text="Monthly progress analytical reports" />
                        </div>
                    </div>
                </div>
            </section>

            <SubjectsGrid />
            <TutorsGrid limited />
            <Testimonials />

            <PublicFooter />
        </div>
    );
}

function FeatureCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 group">
            <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-all`}>{icon}</div>
            <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-none mb-3">{title}</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function ImpactPoint({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary"><CheckCircle2 className="w-3.5 h-3.5" /></div>
            <span className="text-sm font-black text-gray-700 uppercase tracking-tighter italic">{text}</span>
        </div>
    );
}
