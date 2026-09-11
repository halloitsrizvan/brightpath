'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import Testimonials from '@/components/public/Testimonials';
import SubjectsGrid from '@/components/public/SubjectsGrid';
import PublicFAQ from '@/components/public/FAQ';
import PublicFeatures from '@/components/public/Features';
import FloatingContact from '@/components/public/FloatingContact';
import ScrollReveal from '@/components/public/ScrollReveal';
import Image from 'next/image';
import { Star, ArrowRight, Clock, Users, ShieldCheck, BookOpen, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import DemoModal from '@/components/modals/DemoModal';
import api from '@/utils/api';

export default function HomeClient() {
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [heroIndex, setHeroIndex] = useState(0);
    const heroImages = ['/banner1.png', '/banner2.png', '/banner3.png'];

    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    return (
        <div className="min-h-screen bg-white relative">
            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EducationalOrganization",
                        "name": "BrightPath Eduvora",
                        "url": "https://www.brightpatheduvora.com",
                        "logo": "https://www.brightpatheduvora.com/icon.png",
                        "description": "High-quality 1:1 personalized online tuition for KG to 12th grade. Learn Right. Grow Bright.",
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "IN"
                        },
                        "sameAs": [
                            "https://www.facebook.com/brightpatheduvora",
                            "https://www.instagram.com/brightpatheduvora"
                        ]
                    })
                }}
            />

            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <ScrollReveal direction="left">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-medium border border-primary/10">
                                <Star className="w-3 h-3 fill-primary" /> Kerala&apos;s #1 Online Tuition Academy
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] font-display">
                                Learn <span className="text-primary">Right.</span><br />
                                Grow <span className="text-secondary">Bright.</span>
                            </h1>
                            <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                                Premium 1:1 online mentorship for students from KG to 12th Grade. Personalized education with Kerala&apos;s most trusted tutors.
                            </p>

                            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                                <button
                                    onClick={() => setIsDemoModalOpen(true)}
                                    suppressHydrationWarning
                                    className="px-7 py-4 bg-primary text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center gap-2 group"
                                >
                                    Book Free Demo
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex -space-x-2">
                                    {['/testimonial1.png', '/testimonial2.png', '/testimonial3.png'].map((src, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                                            <Image src={src} alt="" fill className="object-cover" unoptimized />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span className="font-semibold text-gray-700">5000+</span> happy families
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right">
                        <div className="relative rounded-2xl overflow-hidden aspect-square max-w-[480px] w-full mx-auto">
                            <div className="absolute inset-0 flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${heroIndex * 100}%)` }}>
                                {heroImages.map((src, idx) => (
                                    <div key={idx} className="relative min-w-full h-full">
                                        <Image src={src} alt="Students learning" fill className="object-cover" priority={idx === 0} />
                                    </div>
                                ))}
                            </div>

                            {/* Slide indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {heroImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setHeroIndex(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${heroIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <BannerCarousel />

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                    <ScrollReveal>
                        <div className="grid grid-cols-2 gap-4">
                            <FeatureCard icon={<Clock className="w-5 h-5" />} title="Flexible Timing" desc="Classes from 5 AM to 11 PM" color="bg-violet-50 text-violet-600" />
                            <FeatureCard icon={<Users className="w-5 h-5" />} title="1:1 Mentorship" desc="Personalized attention" color="bg-primary/10 text-primary" />
                            <FeatureCard icon={<ShieldCheck className="w-5 h-5" />} title="Trusted Tutors" desc="Verified expertise" color="bg-teal-50 text-teal-600" />
                            <FeatureCard icon={<BookOpen className="w-5 h-5" />} title="KG - 12 Coverage" desc="All boards supported" color="bg-amber-50 text-amber-600" />
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={0.15}>
                        <div className="space-y-5">
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Why Choose Us</p>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                                Personalized education that <span className="text-primary">actually works</span>
                            </h2>
                            <p className="text-gray-500 leading-relaxed">
                                At BrightPath, we build strong academic foundations through personalized methodology tailored to each child&apos;s learning style.
                            </p>
                            <div className="space-y-3 pt-2">
                                <ImpactPoint text="Instruction in Malayalam & English" />
                                <ImpactPoint text="Monthly progress reports for parents" />
                                <ImpactPoint text="Flexible scheduling that fits your routine" />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <SubjectsGrid />
            <Testimonials />
            <PublicFAQ />
            <PublicFeatures />
            <FloatingContact />
            <PublicFooter />
            <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
        </div>
    );
}

function BannerCarousel() {
    const images = ['/bn2.png', '/bn3.png'];
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <section className="relative w-full overflow-hidden py-4">
            <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-38">
                <div className="relative h-[220px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden group">
                    <div
                        className="flex h-full transition-transform duration-700 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((src, idx) => (
                            <div key={idx} className="relative min-w-full h-full">
                                <Image src={src} alt={`Banner ${idx + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
    return (
        <div className="p-5 rounded-xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 group">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-400">{desc}</p>
        </div>
    );
}

function ImpactPoint({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-medium text-gray-700">{text}</span>
        </div>
    );
}
