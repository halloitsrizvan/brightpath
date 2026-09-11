'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, ChevronRight, GraduationCap, MapPin, BookOpen, Layout } from 'lucide-react';
import DemoModal from '../modals/DemoModal';

interface PublicNavbarProps {
    showMarquee?: boolean;
    onApplyNow?: () => void;
}

export default function PublicNavbar({ showMarquee = false, onApplyNow }: PublicNavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const tuitionData = {
        classes: [
            { name: 'Class 1-5', items: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'] },
            'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
        ],
        locations: ['Kerala', 'Dubai(UAE)', 'Qatar', 'Chennai', 'Bangalore', 'Coimbatore', 'Hyderabad'],
        subjects: ['English', 'Maths', 'Science', 'Social Science', 'Malayalam', 'Hindi', 'Physics', 'Chemistry', 'Biology'],
        boards: ['CBSE', 'ICSE', 'State', 'IGCSE']
    };

    const moreLinks = [
        { name: 'Our System', href: '/our-system' },
        { name: 'Testimonials', href: '/testimonials' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/80' 
                    : showMarquee ? 'bg-white border-b border-gray-100' : 'lg:bg-transparent bg-white'
            }`}>
                <div className={`container mx-auto px-6 flex justify-between items-center transition-all duration-200 ${scrolled ? 'py-2.5' : 'py-3.5'}`}>
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white">
                            <Image src="/logo.png" alt="BrightPath Logo" width={36} height={36} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-base font-bold tracking-tight leading-none font-display ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>BrightPath</span>
                            <span className={`text-[9px] font-semibold tracking-[0.2em] leading-none mt-0.5 uppercase ${scrolled ? 'text-primary' : 'text-primary'}`}>Eduvora</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex gap-7 items-center h-[40px]">
                        <Link href="/" className="text-[13px] font-medium text-gray-600 hover:text-primary transition-colors">Home</Link>

                        {/* Online Tuition Dropdown */}
                        <div className="relative h-full flex items-center group/main">
                            <div className="flex items-center gap-1 text-[13px] font-medium cursor-pointer text-gray-600 group-hover/main:text-primary transition-colors">
                                Online Tuition
                                <ChevronDown className="w-3.5 h-3.5 group-hover/main:rotate-180 transition-transform duration-300" />
                            </div>

                            <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover/main:opacity-100 group-hover/main:visible transition-all duration-200 transform translate-y-1 group-hover/main:translate-y-0 z-[60]">
                                <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 min-w-[240px] py-2 overflow-visible">
                                    <DesktopNestedItem name="Tuition By Classes" subItems={tuitionData.classes} icon={GraduationCap} />
                                    <DesktopNestedItem name="Tuition By Location" subItems={tuitionData.locations} icon={MapPin} />
                                    <DesktopNestedItem name="Tuition By Subject" subItems={tuitionData.subjects} icon={BookOpen} />
                                    <DesktopNestedItem name="Tuition By Board" subItems={tuitionData.boards} icon={Layout} />
                                </div>
                            </div>
                        </div>

                        <Link href="/become-tutor" className="text-[13px] font-medium text-gray-600 hover:text-primary transition-colors">Become a Tutor</Link>
                        <Link href="/about" className="text-[13px] font-medium text-gray-600 hover:text-primary transition-colors">About</Link>

                        {/* More Dropdown */}
                        <div className="relative h-full flex items-center group/more">
                            <div className="flex items-center gap-1 text-[13px] font-medium cursor-pointer text-gray-600 group-hover/more:text-primary transition-colors">
                                More
                                <ChevronDown className="w-3.5 h-3.5 group-hover/more:rotate-180 transition-transform duration-300" />
                            </div>

                            <div className="absolute top-full right-0 pt-3 opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all duration-200 transform translate-y-1 group-hover/more:translate-y-0 z-[60]">
                                <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 min-w-[180px] py-2">
                                    {moreLinks.map(link => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="block px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsDemoModalOpen(true)}
                            suppressHydrationWarning
                            className="px-5 py-2.5 bg-primary text-white font-semibold text-[13px] rounded-lg shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all ml-3"
                        >
                            Book a Demo
                        </button>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Alert Marquee Bar on the bottom of header */}
                {showMarquee && (
                    <div className="w-full bg-[#FDC70B] text-gray-950 border-t border-amber-300/80 shadow-xs py-1.5 md:py-2 overflow-hidden select-none">
                        <div className="container mx-auto px-4 md:px-6 flex items-center">
                            <div className="shrink-0 z-10 pr-3 md:pr-4 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                </span>
                                <button
                                    onClick={onApplyNow || (() => setIsDemoModalOpen(true))}
                                    className="text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-950 bg-white/95 hover:bg-white hover:shadow-xs px-2.5 py-0.5 md:py-1 rounded-full border border-amber-400/80 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                >
                                    <span>Apply Now</span>
                                    <ChevronRight className="w-3 h-3 text-gray-700" />
                                </button>
                            </div>
                            <div className="overflow-hidden relative flex-1">
                                <div
                                    className="animate-marquee flex items-center gap-8 text-xs md:text-[13px] font-bold text-gray-900 cursor-pointer"
                                    onClick={onApplyNow || (() => setIsDemoModalOpen(true))}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span>✨ Admissions Open for Academic Year 2026-27!</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <span>🎯 Personalized 1:1 Online Tuition KG to 12th Grade (CBSE, ICSE, State & IGCSE)</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <span>🌟 Book Your Free 1-on-1 Trial Class Today</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <span>⚡ Up to 20% Early Bird Scholarship</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <span>⏰ Flexible Timings (5:00 AM – 11:00 PM)</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <span>💬 Direct WhatsApp Mentorship Support</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    {/* Duplicate block for smooth continuous loop */}
                                    <span className="flex items-center gap-1.5">
                                        <span>✨ Admissions Open for Academic Year 2026-27!</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <span>🎯 Personalized 1:1 Online Tuition KG to 12th Grade</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <span>🌟 Book Your Free 1-on-1 Trial Class Today</span>
                                    </span>
                                    <span className="text-amber-800/40">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <span>⚡ Up to 20% Early Bird Scholarship</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full min-h-[110vh] bg-white z-[100] overflow-y-auto shadow-lg border-t border-gray-100 pb-40">
                        <div className="p-6 space-y-1">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-3 text-sm font-semibold text-gray-800 rounded-lg hover:bg-gray-50">Home</Link>

                            {/* Online Tuition Mobile */}
                            <div className="py-3 px-3">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Online Tuition</p>
                                <div className="space-y-3 pl-3">
                                    <MobileCollapsible name="By Classes" items={tuitionData.classes} onItemClick={() => setMobileMenuOpen(false)} />
                                    <MobileCollapsible name="By Location" items={tuitionData.locations} onItemClick={() => setMobileMenuOpen(false)} />
                                    <MobileCollapsible name="By Subject" items={tuitionData.subjects} onItemClick={() => setMobileMenuOpen(false)} />
                                    <MobileCollapsible name="By Board" items={tuitionData.boards} onItemClick={() => setMobileMenuOpen(false)} />
                                </div>
                            </div>

                            <Link href="/become-tutor" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-3 text-sm font-semibold text-gray-800 rounded-lg hover:bg-gray-50">Become a Tutor</Link>
                            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-3 text-sm font-semibold text-gray-800 rounded-lg hover:bg-gray-50">About</Link>

                            <div className="py-3 px-3">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Quick Links</p>
                                <div className="grid grid-cols-2 gap-1">
                                    {moreLinks.map(link => (
                                        <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="py-2 px-2 text-sm font-medium text-gray-500 hover:text-primary rounded-lg">{link.name}</Link>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => { setIsDemoModalOpen(true); setMobileMenuOpen(false); }}
                                className="w-full mt-4 py-4 bg-primary text-white font-semibold text-center rounded-xl shadow-md shadow-primary/15"
                            >
                                Book a Free Demo
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
        </>
    );
}

function DesktopNestedItem({ name, subItems, icon: Icon }: { name: string, subItems: (string | { name: string, items: string[] })[], icon: any }) {
    return (
        <div className="relative group/nested px-1">
            <div className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group/item transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-primary/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-medium text-gray-700 group-hover/item:text-primary">{name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/item:translate-x-0.5 transition-transform" />
            </div>

            {/* The Nested Dropdown */}
            <div className="absolute top-0 left-full pl-1 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-200 transform translate-x-1 group-hover/nested:translate-x-0 z-[70]">
                <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 min-w-[180px] py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {subItems.map((item, idx) => {
                        if (typeof item === 'string') {
                            return (
                                <Link
                                    key={item}
                                    href={`/tuition/${name.toLowerCase().replace(/ /g, '-')}/${item.toLowerCase().replace(/ /g, '-')}`}
                                    className="block px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                                >
                                    {item}
                                </Link>
                            );
                        } else {
                            return (
                                <div key={idx} className="relative group/level3 px-1">
                                    <Link 
                                        href={`/tuition/${name.toLowerCase().replace(/ /g, '-')}/${item.name.toLowerCase().replace(/ /g, '-')}`}
                                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer group/level3item transition-colors"
                                    >
                                        <span className="text-[13px] font-medium text-gray-600 group-hover/level3item:text-primary">{item.name}</span>
                                        <ChevronRight className="w-3 h-3 text-gray-400 group-hover/level3item:translate-x-0.5 transition-transform" />
                                    </Link>
                                    {/* Level 3 Dropdown */}
                                    <div className="absolute top-0 left-full pl-1 opacity-0 invisible group-hover/level3:opacity-100 group-hover/level3:visible transition-all duration-200 transform translate-x-1 group-hover/level3:translate-x-0 z-[80]">
                                        <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 min-w-[130px] py-2">
                                            {item.items.map(sub => (
                                                <Link
                                                    key={sub}
                                                    href={`/tuition/${name.toLowerCase().replace(/ /g, '-')}/${sub.toLowerCase().replace(/ /g, '-')}`}
                                                    className="block px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                                                >
                                                    {sub}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}

function MobileCollapsible({ name, items, onItemClick }: { name: string, items: (string | { name: string, items: string[] })[], onItemClick: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="space-y-1">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-sm font-medium text-gray-600 py-1">
                {name}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="space-y-1 pl-3 border-l-2 border-primary/10 py-1">
                    {items.map((item, idx) => {
                        const baseUrl = `/tuition/${name.toLowerCase().replace(/ /g, '-')}`;
                        if (typeof item === 'string') {
                            const slug = item.toLowerCase().replace(/ /g, '-');
                            return (
                                <Link 
                                    key={item} 
                                    href={`${baseUrl}/${slug}`} 
                                    onClick={onItemClick}
                                    className="block text-sm font-medium text-gray-500 py-1.5 hover:text-primary"
                                >
                                    {item}
                                </Link>
                            );
                        } else {
                            const rangeUrl = `/tuition/${name.toLowerCase().replace(/ /g, '-')}/${item.name.toLowerCase().replace(/ /g, '-')}`;
                            return (
                                <div key={idx} className="space-y-1 py-1">
                                    <Link 
                                        href={rangeUrl}
                                        onClick={onItemClick}
                                        className="text-xs font-semibold text-primary/60 uppercase tracking-wider hover:text-primary transition-colors block"
                                    >
                                        {item.name}
                                    </Link>
                                    <div className="grid grid-cols-2 gap-1 pl-3">
                                        {item.items.map(sub => {
                                            const subSlug = sub.toLowerCase().replace(/ /g, '-');
                                            return (
                                                <Link 
                                                    key={sub} 
                                                    href={`${baseUrl}/${subSlug}`}
                                                    onClick={onItemClick}
                                                    className="text-sm text-gray-400 font-medium hover:text-primary py-1"
                                                >
                                                    {sub}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
}
