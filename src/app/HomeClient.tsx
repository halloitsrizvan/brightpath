'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import PublicFAQ from '@/components/public/FAQ';
import FloatingContact from '@/components/public/FloatingContact';
import ScrollReveal from '@/components/public/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import {
    Star, ArrowRight, Clock, Users, ShieldCheck, BookOpen,
    CheckCircle2, ChevronLeft, ChevronRight, Play, Video,
    Calendar, Sparkles, Monitor, GraduationCap, Laptop, Award,
    PhoneCall, Mic, MicOff, Camera, Globe2, Atom,
    Compass, Calculator, FlaskConical, Microscope, Languages
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoModal from '@/components/modals/DemoModal';

export default function HomeClient() {
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    const testimonials = [
        {
            id: 0,
            name: "Hashim",
            role: "Parent",
            avatar: "/testimonial1.png",
            rating: 5,
            quote: "Hi, റെഗുലർ ക്ലാസ്സിൽ ചേർന്നതിന് ശേഷം മോൾക്ക് നല്ല മാറ്റം ഉണ്ട് ട്ടോ . ഇംഗ്ലീഷ് ഒക്കെ വായിക്കാൻ അവൾക്ക് ഇപ്പോൾ ഈസി ആണ്. Brightpath ലെ ടീച്ചേർസ് നല്ല ഫ്രണ്ട്ലി ആയിരുന്നു. ക്ലാസ്സിൽ നല്ല മാറ്റം ഉണ്ടെന്ന് അവളുടെ ക്ലാസ്സ് ടീച്ചർ പറഞ്ഞിരുന്നു. അവൾ ഹാപ്പി ആണ്.താങ്ക്സ് Brightpath"
        },
        {
            id: 1,
            name: "Adbul Salam",
            role: "Parent ",
            avatar: "/testimonial2.png",
            rating: 5,
            quote: "ലിബക്ക് brightpath ൽ ജോയിൻ ചെയ്‌തതിന് ശേഷം ഒരുപാട് മാറ്റം കാണുന്നുണ്ട്.... UKG base ഇല്ലാതിരുന്ന അവൾക് ഒരു base കിട്ടിയത് brightpath കാരണം ആണ്, ഇംഗ്ലീഷ് സ്റ്റോറീസ് ഒക്കെ ഇപ്പൊ ശെരിക്കും വായിക്കാൻ കയ്യുന്നുണ്... പിന്നെ എടുത്തു പറയേണ്ട ഒരു കാര്യം എന്തെന്ന് വെച്ചാൽ, ടീച്ചർ വളരെ ഫ്രണ്ട്ലി ആയിരുന്നു. താങ്ക്യൂ brightpath"
        },
        {
            id: 2,
            name: "Shameer",
            role: "Parent ",
            avatar: "/testimonial3.png",
            rating: 5,
            quote: "ഇത് എന്റെ മോൻ്റെ രണ്ടാമത്തെ ഫൌണ്ടേഷൻ കോഴ്സ് ആണ് brightpath ടീമിൻ്റെ കൂടെ, ഇപ്പോ ചെയ്‌തത്‌ മലയാളം ഫൌണ്ടേഷൻ കോഴ്‌സ് ആണ്, എന്ത് പറയണം എന്ന് അറിയില്ല 20 ദിവസം കൊണ്ട് മലയാളം പറയാൻ മാത്രം അറിയുന്ന അവനെ എഴുതാനും, വായിക്കാനും പഠിപ്പിച്ചു. Brightpath നോടും അൻഷിദ മാമിനോടും ഒരു പാട് നന്ദി"
        }
    ];

    const currentReview = testimonials[activeTestimonial];

    // Automatic slide for Testimonials (slides every 4.5 seconds, pauses on mouse hover)
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [isPaused, testimonials.length]);

    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden">
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

            {/* Navbar with moving Apply Now Marquee */}
            <PublicNavbar showMarquee={true} onApplyNow={() => setIsDemoModalOpen(true)} />

            {/* HERO SECTION - Inspired by UI reference */}
            <section className="relative pt-36 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
                {/* Subtle decorative background shapes */}
                <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-amber-100/40 -z-10 blur-2xl pointer-events-none" />
                <div className="absolute top-40 left-10 w-64 h-64 rounded-full bg-sky-100/50 -z-10 blur-2xl pointer-events-none" />

                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

                        {/* Left Content */}
                        <div className="lg:col-span-6 space-y-6">
                            <ScrollReveal direction="left">
                                <div className="space-y-5">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-bold tracking-wider uppercase">
                                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                        <span>100% Satisfaction Guarantee</span>
                                    </div>

                                    <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-gray-950 tracking-tight font-display leading-[1.12]">
                                        Find Your <br />
                                        <span className="relative inline-block text-primary">
                                            Perfect Tutor
                                            {/* Decorative playful doodle accent next to Tutor */}
                                            <span className="absolute -top-3 -right-10 hidden sm:inline-block text-secondary">
                                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                                                </svg>
                                            </span>
                                        </span>
                                    </h1>

                                    <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                                        We help you find the perfect certified tutor for 1-on-1 lessons. It is completely personalized, private, and tailored for KG to 12th Grade academic excellence.
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <button
                                            onClick={() => setIsDemoModalOpen(true)}
                                            className="px-8 py-4 bg-[#FDC70B] hover:bg-[#eab308] text-gray-950 font-bold text-sm rounded-full shadow-lg shadow-amber-400/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                                        >
                                            Get Started
                                        </button>

                                        <button
                                            onClick={() => setIsDemoModalOpen(true)}
                                            className="inline-flex items-center gap-3 text-sm font-bold text-gray-800 hover:text-primary transition-all group py-2 px-3"
                                        >
                                            <span className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center group-hover:scale-110 shadow-md shadow-blue-500/25 transition-transform">
                                                <Play className="w-4 h-4 fill-current ml-0.5" />
                                            </span>
                                            <span>See how it works</span>
                                        </button>
                                    </div>

                                    {/* Trust Proof */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex -space-x-2">
                                            {['/testimonial1.png', '/testimonial2.png', '/testimonial3.png', '/hero/hero-1.jpg'].map((src, i) => (
                                                <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden relative shadow-xs">
                                                    <Image src={src} alt="Student" fill className="object-cover" unoptimized />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600">
                                            <div className="flex items-center gap-1 text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                                ))}
                                                <span className="font-bold text-gray-900 ml-1">4.9 / 5</span>
                                            </div>
                                            <span className="text-gray-500">Trusted by <strong className="text-gray-800">5,000+</strong> students & parents</span>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Right Content - 4 Playful Portrait Cards (As in UI Image) */}
                        <div className="lg:col-span-6 relative">
                            <ScrollReveal direction="right">
                                <div className="relative max-w-[460px] mx-auto">

                                    {/* Decorative floating doodle elements */}
                                    <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-amber-300/40 -z-10 blur-xs" />
                                    <div className="absolute -bottom-6 -left-6 -z-10">
                                        <svg width="60" height="24" viewBox="0 0 80 32" fill="none" className="text-sky-400 stroke-current stroke-[3]">
                                            <path d="M4 16 Q 14 4, 24 16 T 44 16 T 64 16 T 76 16" fill="none" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-1/2 -right-8 -z-10">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FDC70B" strokeWidth="2.5">
                                            <polygon points="12 2 22 20 2 20" />
                                        </svg>
                                    </div>

                                    {/* 2x2 Asymmetric Photo Grid */}
                                    <div className="grid grid-cols-2 gap-4 items-center">

                                        {/* Card 1: Top-Left (Arched Pill Card) */}
                                        <div className="relative aspect-[4/5] rounded-t-[90px] rounded-b-3xl overflow-hidden bg-sky-100 border-4 border-white shadow-xl shadow-sky-900/10 group transition-transform hover:-translate-y-1">
                                            <Image
                                                src="/hero/hero-1.jpg"
                                                alt="High school student"
                                                fill
                                                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                priority
                                            />
                                        </div>

                                        {/* Card 2: Top-Right (Sunny Warm Rounded Card) */}
                                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-amber-100 border-4 border-white shadow-xl shadow-amber-900/10 group transition-transform hover:-translate-y-1">
                                            <Image
                                                src="/hero/hero-2.jpg"
                                                alt="Cheerful student"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                priority
                                            />
                                        </div>

                                        {/* Card 3: Bottom-Left (Amber Rounded Card) */}
                                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-orange-100 border-4 border-white shadow-xl shadow-orange-900/10 group transition-transform hover:-translate-y-1">
                                            <Image
                                                src="/hero/hero-3.jpg"
                                                alt="Student with books"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Card 4: Bottom-Right (Inverted Arched Card) */}
                                        <div className="relative aspect-[4/5] rounded-t-3xl rounded-b-[90px] overflow-hidden bg-purple-100 border-4 border-white shadow-xl shadow-purple-900/10 group transition-transform hover:-translate-y-1">
                                            <Image
                                                src="/hero/hero-4.jpg"
                                                alt="Professional tutor mentor"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Floating 1:1 Live Status Badge */}
                                    <div className="absolute -bottom-4 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-bold text-gray-800">1:1 Live Interactive Class</span>
                                    </div>

                                </div>
                            </ScrollReveal>
                        </div>

                    </div>
                </div>
            </section>

            {/* FULL-WIDTH STATS BANNER - Exact Match to UI Image */}
            <section className="bg-primary text-white py-8 border-y border-primary/20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">

                        <div className="md:border-r border-white/15 pr-4">
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">870</p>
                            <p className="text-xs sm:text-sm font-medium text-white/80 mt-1">Expert Tutors</p>
                        </div>

                        <div className="md:border-r border-white/15 pr-4">
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">20,000+</p>
                            <p className="text-xs sm:text-sm font-medium text-white/80 mt-1">Hours Tutored</p>
                        </div>

                        <div className="md:border-r border-white/15 pr-4">
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">298</p>
                            <p className="text-xs sm:text-sm font-medium text-white/80 mt-1">Subjects & Courses</p>
                        </div>

                        <div>
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white">72,920</p>
                            <p className="text-xs sm:text-sm font-medium text-white/80 mt-1">Active Students</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION - Exact 4 Cards as in UI Image */}
            <section className="py-20 lg:py-28 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">

                    <div className="text-center max-w-xl mx-auto mb-14">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 font-display">Why Choose Us</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-display">
                            Benefits of online tutoring services with us
                        </h2>
                    </div>

                    {/* 4 Feature Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <BenefitCard
                            icon={<Users className="w-5 h-5 text-blue-600" />}
                            iconBg="bg-blue-50"
                            title="One-on-one Teaching"
                            desc="All our special education mentors hold verified degrees and proven track records."
                        />
                        <BenefitCard
                            icon={<Clock className="w-5 h-5 text-emerald-600" />}
                            iconBg="bg-emerald-50"
                            title="24/7 Tutor Availability"
                            desc="Our tutors are always available to assist as quick as possible for you."
                        />
                        <BenefitCard
                            icon={<Monitor className="w-5 h-5 text-orange-600" />}
                            iconBg="bg-orange-50"
                            title="Interactive Whiteboard"
                            desc="Our digital whiteboard is equipped with audio and video chat features."
                        />
                        <BenefitCard
                            icon={<Award className="w-5 h-5 text-pink-600" />}
                            iconBg="bg-pink-50"
                            title="Affordable Prices"
                            desc="Choose an expert tutor based on your budget and per hour requirement."
                        />
                    </div>

                    {/* TWO ALTERNATING SPOTLIGHT SECTIONS (Directly as in UI Image) */}
                    <div className="mt-24 space-y-24">

                        {/* Spotlight 1: Student Schedule (Image Left, Text Right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                            {/* Image Left */}
                            <div className="lg:col-span-5 relative">
                                <ScrollReveal direction="left">
                                    <div className="relative">
                                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-sky-200 shadow-xl">
                                            <Image
                                                src="/hero/student-study.jpg"
                                                alt="Student on schedule"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Floating Calendar Badge as in UI */}
                                        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-amber-400 p-2 shadow-xl flex items-center justify-center border-4 border-white">
                                            <div className="text-center text-gray-950">
                                                <Calendar className="w-8 h-8 mx-auto text-gray-950 mb-1" />
                                                <p className="text-[10px] font-black uppercase tracking-wider">Flexible</p>
                                                <p className="text-[9px] font-bold">Schedule</p>
                                            </div>
                                        </div>

                                        {/* Cyan wave doodle */}
                                        <div className="absolute -top-6 -left-6 text-sky-400 -z-10">
                                            <svg width="48" height="20" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path d="M2 12 Q 12 2, 22 12 T 42 12 T 58 12" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>

                            {/* Text Right */}
                            <div className="lg:col-span-7 space-y-5 lg:pl-6">
                                <ScrollReveal direction="right">
                                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest font-display">Customize with Your Schedule</p>
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 font-display leading-tight">
                                        Personalized Professional Online Tutor on Your Schedule
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                        Our scheduling system allows you to select classes based on your free time. Keep track of your student&apos;s class and tutoring schedules, and never miss your lectures. The best online class scheduling system with easy accessibility.
                                    </p>
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setIsDemoModalOpen(true)}
                                            className="px-7 py-3.5 bg-[#FDC70B] hover:bg-[#eab308] text-gray-950 font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                                        >
                                            Get started
                                        </button>
                                    </div>
                                </ScrollReveal>
                            </div>

                        </div>

                        {/* Spotlight 2: Qualified Tutors (Text Left, Image Right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                            {/* Text Left */}
                            <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
                                <ScrollReveal direction="left">
                                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest font-display">Customize with Your Schedule</p>
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 font-display leading-tight">
                                        Talented and Qualified Tutors to Serve You for Help
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                        Our scheduling system allows you to select based on your free time. Every tutor at BrightPath is thoroughly vetted, subject-certified, and trained in modern digital pedagogical tools to guide your child to top academic performance.
                                    </p>
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setIsDemoModalOpen(true)}
                                            className="px-7 py-3.5 bg-[#FDC70B] hover:bg-[#eab308] text-gray-950 font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                                        >
                                            Get started
                                        </button>
                                    </div>
                                </ScrollReveal>
                            </div>

                            {/* Image Right */}
                            <div className="lg:col-span-5 relative order-1 lg:order-2">
                                <ScrollReveal direction="right">
                                    <div className="relative">
                                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-amber-200 shadow-xl">
                                            <Image
                                                src="/hero/tutor-call.jpg"
                                                alt="Talented online tutor"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Floating Video Call Controls Badge as in UI */}
                                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gray-950/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-white border border-white/20">
                                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                                                <Mic className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                                                <Video className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">
                                                <PhoneCall className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        </div>

                                        {/* Cyan squiggle doodle */}
                                        <div className="absolute -top-6 -right-6 text-sky-400 -z-10">
                                            <svg width="48" height="20" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path d="M2 12 Q 12 2, 22 12 T 42 12 T 58 12" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* SUBJECTS CHIPS GRID - Matching Navbar Tuition by Subject Dropdown */}
            <section className="py-20 bg-gray-50/60 border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center max-w-xl mx-auto mb-12">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 font-display">Our Tutor Subjects</p>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-display">
                            Find Online Tutor in Any Subject
                        </h2>
                    </div>

                    {/* 9 Subjects from Navbar Dropdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                        <SubjectChip icon={<Languages className="w-4 h-4 text-blue-600" />} iconBg="bg-blue-50" label="English" href="/tuition/tuition-by-subject/english" />
                        <SubjectChip icon={<Calculator className="w-4 h-4 text-emerald-600" />} iconBg="bg-emerald-50" label="Maths" href="/tuition/tuition-by-subject/maths" />
                        <SubjectChip icon={<Atom className="w-4 h-4 text-indigo-600" />} iconBg="bg-indigo-50" label="Science" href="/tuition/tuition-by-subject/science" />
                        <SubjectChip icon={<Globe2 className="w-4 h-4 text-amber-600" />} iconBg="bg-amber-50" label="Social Science" href="/tuition/tuition-by-subject/social-science" />
                        <SubjectChip icon={<BookOpen className="w-4 h-4 text-purple-600" />} iconBg="bg-purple-50" label="Malayalam" href="/tuition/tuition-by-subject/malayalam" />
                        <SubjectChip icon={<Languages className="w-4 h-4 text-rose-600" />} iconBg="bg-rose-50" label="Hindi" href="/tuition/tuition-by-subject/hindi" />
                        <SubjectChip icon={<Compass className="w-4 h-4 text-cyan-600" />} iconBg="bg-cyan-50" label="Physics" href="/tuition/tuition-by-subject/physics" />
                        <SubjectChip icon={<FlaskConical className="w-4 h-4 text-teal-600" />} iconBg="bg-teal-50" label="Chemistry" href="/tuition/tuition-by-subject/chemistry" />
                        <SubjectChip icon={<Microscope className="w-4 h-4 text-green-600" />} iconBg="bg-green-50" label="Biology" href="/tuition/tuition-by-subject/biology" />
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION - Directly Inspired by UI Image with Automatic Sliding */}
            <section
                className="py-24 bg-white relative overflow-hidden select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Decorative Doodles as in UI image */}
                <div className="absolute top-12 left-10 text-amber-400 -z-10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="12 2 22 20 2 20" />
                    </svg>
                </div>
                <div className="absolute top-20 left-12 text-sky-400 -z-10">
                    <svg width="40" height="16" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M2 12 Q 12 2, 22 12 T 42 12 T 58 12" />
                    </svg>
                </div>
                <div className="absolute top-20 right-10 w-28 h-28 rounded-full bg-sky-100 -z-10 blur-xs" />
                <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-amber-300/40 -z-10 blur-xs" />
                <div className="absolute bottom-12 right-12 text-sky-400 -z-10">
                    <svg width="40" height="16" viewBox="0 0 60 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M2 12 Q 12 2, 22 12 T 42 12 T 58 12" />
                    </svg>
                </div>

                <div className="container mx-auto px-6 max-w-4xl text-center">

                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 font-display">Our Testimonials</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 font-display mb-10">
                        What Our Students Say About Us
                    </h2>

                    {/* Centered Avatars Row */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
                        {testimonials.map((t, idx) => {
                            const isActive = idx === activeTestimonial;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTestimonial(idx)}
                                    className={`relative transition-all duration-500 cursor-pointer rounded-full ${isActive
                                            ? 'w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-primary ring-offset-4 scale-110 shadow-xl'
                                            : 'w-10 h-10 sm:w-12 sm:h-12 opacity-40 hover:opacity-90 hover:scale-105'
                                        }`}
                                    aria-label={`Select review from ${t.name}`}
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden relative">
                                        <Image src={t.avatar} alt={t.name} fill className="object-cover" unoptimized />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Animated Testimonial Card */}
                    <div className="min-h-[220px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTestimonial}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="w-full space-y-6"
                            >
                                {/* Active Student Info */}
                                <div className="space-y-1">
                                    <h4 className="text-lg font-bold text-gray-950">{currentReview.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{currentReview.role}</p>

                                    {/* 5 Gold Stars */}
                                    <div className="flex items-center justify-center gap-1 text-amber-400 pt-1">
                                        {[...Array(currentReview.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                </div>

                                {/* Testimonial Quote with Big Decorative Quote Marks */}
                                <div className="relative max-w-2xl mx-auto px-6 sm:px-12 py-2">
                                    <span className="absolute -top-6 left-0 text-gray-200 text-6xl sm:text-7xl font-serif select-none pointer-events-none">
                                        &ldquo;
                                    </span>

                                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed italic relative z-10">
                                        {currentReview.quote}
                                    </p>

                                    <span className="absolute -bottom-10 right-0 text-gray-200 text-6xl sm:text-7xl font-serif select-none pointer-events-none">
                                        &rdquo;
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls & Slide Indicator Dots */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                            className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-primary transition-all shadow-xs cursor-pointer active:scale-95"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1.5 px-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTestimonial(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeTestimonial === i ? 'w-6 bg-primary' : 'w-2 bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    aria-label={`Slide to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                            className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-primary transition-all shadow-xs cursor-pointer active:scale-95"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </section>

            {/* Promotional Banner Carousel */}
            <BannerCarousel />

            {/* FAQ Section */}
            <PublicFAQ />

            {/* Floating Contact */}
            <FloatingContact />

            {/* Footer */}
            <PublicFooter />

            {/* Demo Modal */}
            <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
        </div>
    );
}

function BenefitCard({ icon, iconBg, title, desc }: { icon: React.ReactNode, iconBg: string, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group">
            <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function SubjectChip({ icon, label, href, iconBg = "bg-gray-50" }: { icon: React.ReactNode, label: string, href: string, iconBg?: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border border-gray-200/80 bg-white hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group text-gray-800"
        >
            <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary transition-colors block truncate">{label}</span>
                <span className="text-[11px] text-gray-400 block font-medium">1:1 Online Tuition</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>
    );
}

function BannerCarousel() {
    const images = ['/bn2.png', '/bn3.png'];
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <section className="relative w-full overflow-hidden py-12 bg-gray-50/50">
            <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-38">
                <div className="relative h-[220px] md:h-[460px] rounded-2xl overflow-hidden group shadow-lg">
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/50 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/50 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
