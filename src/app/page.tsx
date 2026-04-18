'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import Testimonials from '@/components/public/Testimonials';
import PublicTutorsGrid from '@/features/teachers/components/PublicTutorsGrid';
import SubjectsGrid from '@/components/public/SubjectsGrid';
import Image from 'next/image';
import { Star, ArrowRight, Video, Clock, Users, ShieldCheck, BookOpen, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import DemoModal from '@/components/modals/DemoModal';

import api from '@/utils/api';

export default function LandingPage() {
    const [tutors, setTutors] = useState([]);
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [heroIndex, setHeroIndex] = useState(0);

    const heroImages = ['/banner1.jpg', '/banner2.jpg', '/banner3.jpg', '/brightpath-hero.png'];

    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        api.get('/teachers').then(res => {
            // Only show active tutors with completed profiles
            setTutors(res.data.filter((t: any) => t.status === 'active').slice(0, 3));
        }).catch(err => console.error("Elite Tutors Fetch failed", err));
    }, []);

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
            <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32 -z-10" />

                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                            <Star className="w-3 h-3 fill-primary" /> Kerala's #1 Mentorship Academy
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter italic uppercase">
                            Learn <span className="text-primary">Right.</span><br />
                            Grow <span className="text-secondary">Bright.</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-500 font-bold max-w-xl leading-relaxed italic">
                            Premium 1:1 online mentorship for students from KG to 12th Grade. Experience the future of personalized education with Kerala's most trusted tutors.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button
                                onClick={() => setIsDemoModalOpen(true)}
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

                        <div className="relative bg-white rounded-[1.5rem] shadow-2xl overflow-hidden border-4 border-white aspect-[4/5] md:aspect-square flex items-center justify-center max-w-[450px] w-full group">
                            <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${heroIndex * 100}%)` }}>
                                {heroImages.map((src, idx) => (
                                    <div key={idx} className="relative min-w-full h-full">
                                        <Image src={src} alt="Learning" fill className="object-cover" priority={idx === 0} />
                                    </div>
                                ))}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-40 pointer-events-none" />

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

            {/* Banner Slider Section */}
            <BannerCarousel />

            {/* Why Sections */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FeatureCard icon={<Clock className="w-6 h-6" />} title="Flexible Timing" desc="Classes from 5 AM to 11 PM." color="bg-violet-500" />
                        <FeatureCard icon={<Users className="w-6 h-6" />} title="1:1 Mentorship" desc="Personalized focus." color="bg-primary" />
                        <FeatureCard icon={<ShieldCheck className="w-6 h-6" />} title="Trusted Tutors" desc="Verified expertise." color="bg-teal-500" />
                        <FeatureCard icon={<BookOpen className="w-6 h-6" />} title="KG - 12 Coverage" desc="All boards supported." color="bg-secondary" />
                    </div>
                    <div className="space-y-8">
                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2 leading-none">The Academy Edge</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-tight">Educational Clarity <br /><span className="text-primary">Redefined.</span></h2>
                        <p className="text-base text-gray-500 font-bold leading-relaxed italic">At Brightpath Kerala, we build cognitive foundations through personalized methodology.</p>
                        <div className="space-y-4 pt-4">
                            <ImpactPoint text="Localized instruction in Malayalam & English" />
                            <ImpactPoint text="Monthly progress analytical reports" />
                        </div>
                    </div>
                </div>
            </section>

            <SubjectsGrid />
            <PublicTutorsGrid limited={true} tutors={tutors} />
            <Testimonials />

            <PublicFooter />
            <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
        </div>
    );
}

function BannerCarousel() {
    const images = ['/banner1.jpg', '/banner2.jpg', '/banner3.jpg'];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-gray-50 py-10">
            <div className="container mx-auto px-6">
                <div className="relative h-[250px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white group">
                    <div
                        className="flex h-full transition-transform duration-1000 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((src, idx) => (
                            <div key={idx} className="relative min-w-full h-full">
                                <Image
                                    src={src}
                                    alt={`Banner ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 group text-center sm:text-left">
            <div className={`w-12 h-12 ${color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto sm:mx-0 rotate-3 group-hover:rotate-6 transition-all`}>{icon}</div>
            <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter leading-none mb-2">{title}</h3>
            <p className="text-gray-500 font-bold text-xs leading-relaxed">{desc}</p>
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
