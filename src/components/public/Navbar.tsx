'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Menu, X, ChevronDown, ChevronRight, GraduationCap, MapPin, 
    BookOpen, Layout, Home, Users, ArrowRight, UserCheck, 
    Layers, Star, FileText, Phone, MessageCircle 
} from 'lucide-react';
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

    // Prevent body scroll when mobile drawer is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

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

            </nav>

            {/* Mobile Drawer Backdrop */}
            <div 
                className={`fixed inset-0 bg-gray-950/40 backdrop-blur-xs z-[100] lg:hidden transition-opacity duration-300 ${
                    mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Drawer Panel (Slides in from the right) */}
            <div 
                className={`fixed top-0 right-0 bottom-0 w-[84%] max-w-[340px] bg-white z-[101] lg:hidden shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white">
                            <Image src="/logo.png" alt="BrightPath Logo" width={32} height={32} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-gray-900 font-display">BrightPath</span>
                            <span className="text-[9px] font-semibold tracking-widest text-primary uppercase">Eduvora</span>
                        </div>
                    </Link>
                    <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                        aria-label="Close menu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Primary Action Button */}
                    <button
                        onClick={() => { setIsDemoModalOpen(true); setMobileMenuOpen(false); }}
                        className="w-full py-3 px-4 bg-[#FDC70B] hover:bg-[#eab308] text-gray-950 font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                    >
                        <span>Book a Free Demo</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Navigation Items */}
                    <div className="space-y-1">
                        <Link 
                            href="/" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <Home className="w-4 h-4 text-gray-400" />
                            <span>Home</span>
                        </Link>

                        {/* Online Tuition Mobile Dropdown */}
                        <MobileTuitionDrawer 
                            tuitionData={tuitionData} 
                            onItemClick={() => setMobileMenuOpen(false)} 
                        />

                        <Link 
                            href="/become-tutor" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <UserCheck className="w-4 h-4 text-gray-400" />
                            <span>Become a Tutor</span>
                        </Link>

                        <Link 
                            href="/about" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>About Us</span>
                        </Link>

                        <Link 
                            href="/our-system" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <Layers className="w-4 h-4 text-gray-400" />
                            <span>Our System</span>
                        </Link>

                        <Link 
                            href="/testimonials" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <Star className="w-4 h-4 text-gray-400" />
                            <span>Testimonials</span>
                        </Link>

                        <Link 
                            href="/blog" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>Blog</span>
                        </Link>

                        <Link 
                            href="/contact" 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>Contact Us</span>
                        </Link>
                    </div>

                    {/* Quick Support / Contact Box */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                        <p className="text-xs font-bold text-gray-700">Need Immediate Help?</p>
                        <a 
                            href="https://wa.me/919072618007?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20BrightPath%20tuition"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Support</span>
                        </a>
                        <a 
                            href="tel:+919072618007"
                            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors"
                        >
                            <Phone className="w-3.5 h-3.5 text-primary" />
                            <span>+91 90726 18007</span>
                        </a>
                    </div>
                </div>

                {/* Drawer Footer with Portal Logins */}
                <div className="p-3 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between text-xs font-semibold text-gray-600 shrink-0">
                    <Link href="/student" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary py-1 px-2">
                        Student Login &rarr;
                    </Link>
                    <Link href="/teacher" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary py-1 px-2">
                        Teacher Login &rarr;
                    </Link>
                </div>
            </div>

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

function MobileTuitionDrawer({ tuitionData, onItemClick }: { tuitionData: any, onItemClick: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState<'classes' | 'subjects' | 'boards' | 'locations'>('classes');

    return (
        <div className="rounded-lg overflow-hidden border border-gray-100/80 bg-gray-50/50">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-gray-800 hover:text-primary transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>Online Tuition</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {isExpanded && (
                <div className="p-3 pt-1 border-t border-gray-100 bg-white space-y-3">
                    {/* Category Tabs: Classes, Subjects, Boards, Locations */}
                    <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setActiveSubTab('classes')}
                            className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                activeSubTab === 'classes' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Classes
                        </button>
                        <button
                            onClick={() => setActiveSubTab('subjects')}
                            className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                activeSubTab === 'subjects' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Subjects
                        </button>
                        <button
                            onClick={() => setActiveSubTab('boards')}
                            className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                activeSubTab === 'boards' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Boards
                        </button>
                        <button
                            onClick={() => setActiveSubTab('locations')}
                            className={`py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                activeSubTab === 'locations' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Locations
                        </button>
                    </div>

                    {/* Classes Grid */}
                    {activeSubTab === 'classes' && (
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                            {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
                                <Link
                                    key={cls}
                                    href={`/tuition/tuition-by-classes/${cls.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={onItemClick}
                                    className="py-1.5 px-2 text-center text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-md border border-gray-100 transition-colors truncate"
                                >
                                    {cls}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Subjects Grid */}
                    {activeSubTab === 'subjects' && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {tuitionData.subjects.map((sub: string) => (
                                <Link
                                    key={sub}
                                    href={`/tuition/tuition-by-subject/${sub.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={onItemClick}
                                    className="py-1.5 px-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-md border border-gray-100 transition-colors truncate"
                                >
                                    {sub}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Boards Grid */}
                    {activeSubTab === 'boards' && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {tuitionData.boards.map((board: string) => (
                                <Link
                                    key={board}
                                    href={`/tuition/tuition-by-board/${board.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={onItemClick}
                                    className="py-2 px-2 text-center text-xs font-bold text-gray-700 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-md border border-gray-100 transition-colors"
                                >
                                    {board}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Locations Grid */}
                    {activeSubTab === 'locations' && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {tuitionData.locations.map((loc: string) => (
                                <Link
                                    key={loc}
                                    href={`/tuition/tuition-by-location/${loc.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={onItemClick}
                                    className="py-1.5 px-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-md border border-gray-100 transition-colors truncate"
                                >
                                    {loc}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
