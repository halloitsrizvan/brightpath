'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, ChevronRight, GraduationCap, MapPin, BookOpen, Layout, MoreHorizontal } from 'lucide-react';
import DemoModal from '../modals/DemoModal';

export default function PublicNavbar() {
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
            ...[1, 2, 3, 4, 5].map(i => `Class ${i}`),
            'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'
        ],
        locations: ['Kerala', 'Dubai(UAE)', 'Qatar', 'Chennai', 'Bangalore', 'Coimbatore', 'Hyderabad'],
        subjects: ['English', 'Maths', 'Science', 'Social Science', 'Malayalam', 'Hindi', 'Physics', 'Chemistry', 'Biology'],
        boards: ['CBSE', 'ICSE', 'State', 'IGCSE']
    };

    const moreLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Testimonials', href: '/testimonials' },
        { name: 'Blogs', href: '/blog' },
        { name: 'News & Events', href: '/news' },
        { name: 'Countries', href: '/countries' },
        { name: 'Boards', href: '/boards' },
        { name: 'Mock Test', href: '/mock-test' },
        { name: 'Downloads', href: '/downloads' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-xl py-2' : 'bg-transparent py-4'
                }`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className={`relative w-10 h-10 rounded-xl p-2 shadow-xl shadow-black/5 group-hover:scale-110 transition-transform flex items-center justify-center ${scrolled ? 'bg-white' : 'bg-white/90 backdrop-blur-sm'}`}>
                            <Image src="/logo.png" alt="BrightPath Logo" width={40} height={40} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-lg font-black tracking-tighter leading-none italic ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>BRIGHTPATH</span>
                            <span className={`text-[9px] font-black tracking-[0.3em] leading-none mt-1 ${scrolled ? 'text-primary' : 'text-primary'}`}>EDUVORA</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex gap-6 items-center h-[40px]">
                        <Link href="/" className="text-[10px] font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-widest">Home</Link>

                        {/* Online Tuition Dropdown */}
                        <div className="relative h-full flex items-center group/main">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest cursor-pointer text-gray-600 group-hover/main:text-primary transition-colors">
                                Online Tuition
                                <ChevronDown className="w-3 h-3 group-hover/main:rotate-180 transition-transform duration-300" />
                            </div>

                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/main:opacity-100 group-hover/main:visible transition-all duration-300 transform translate-y-2 group-hover/main:translate-y-0 z-[60]">
                                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 min-w-[260px] py-3 overflow-visible">
                                    <DesktopNestedItem name="Tuition By Classes" subItems={tuitionData.classes} icon={GraduationCap} />
                                    <DesktopNestedItem name="Tuition By Location" subItems={tuitionData.locations} icon={MapPin} />
                                    <DesktopNestedItem name="Tuition By Subject" subItems={tuitionData.subjects} icon={BookOpen} />
                                    <DesktopNestedItem name="Tuition By Board" subItems={tuitionData.boards} icon={Layout} />
                                </div>
                            </div>
                        </div>

                        <Link href="/become-tutor" className="text-[10px] font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-widest">Become a Tutor</Link>
                        <Link href="/careers" className="text-[10px] font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-widest">Careers</Link>

                        {/* More Dropdown */}
                        <div className="relative h-full flex items-center group/more">
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest cursor-pointer text-gray-600 group-hover/more:text-primary transition-colors">
                                More
                                <ChevronDown className="w-3 h-3 group-hover/more:rotate-180 transition-transform duration-300" />
                            </div>

                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all duration-300 transform translate-y-2 group-hover/more:translate-y-0 z-[60]">
                                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 min-w-[200px] py-3">
                                    {moreLinks.map(link => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="block px-6 py-2.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors uppercase tracking-wider"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsDemoModalOpen(true)}
                            className="px-6 py-2.5 bg-primary text-white font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all ml-4"
                        >
                            Book a Demo
                        </button>
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`lg:hidden p-2 rounded-xl transition-colors ${scrolled ? 'text-primary hover:bg-primary/5' : 'text-primary hover:bg-white/10'}`}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 top-[78px] bg-white z-[60] overflow-y-auto overflow-x-hidden animate-slide-in-right">
                        <div className="p-6 space-y-2">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block p-4 text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-50">Home</Link>

                            {/* Online Tuition Mobile */}
                            <div className="p-4 space-y-4">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Online Tuition</p>
                                <div className="grid grid-cols-1 gap-4 pl-4">
                                    <MobileCollapsible name="By Classes" items={tuitionData.classes} />
                                    <MobileCollapsible name="By Location" items={tuitionData.locations} />
                                    <MobileCollapsible name="By Subject" items={tuitionData.subjects} />
                                    <MobileCollapsible name="By Board" items={tuitionData.boards} />
                                </div>
                            </div>

                            <Link href="/become-tutor" onClick={() => setMobileMenuOpen(false)} className="block p-4 text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-50">Become a Tutor</Link>
                            <Link href="/careers" onClick={() => setMobileMenuOpen(false)} className="block p-4 text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-50">Careers</Link>

                            <div className="p-4 space-y-4">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Quick Links</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {moreLinks.map(link => (
                                        <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="p-2 text-xs font-bold text-gray-600 uppercase tracking-wider">{link.name}</Link>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => { setIsDemoModalOpen(true); setMobileMenuOpen(false); }}
                                className="w-full mt-6 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-center rounded-2xl shadow-xl shadow-primary/20"
                            >
                                Book a Demo
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
        </>
    );
}

function DesktopNestedItem({ name, subItems, icon: Icon }: { name: string, subItems: string[], icon: any }) {
    return (
        <div className="relative group/nested px-1">
            <div className="flex items-center justify-between w-full px-4 py-3 hover:bg-primary/5 rounded-xl cursor-pointer group/item transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 group-hover/item:text-primary uppercase tracking-wider">{name}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400 group-hover/item:translate-x-1 transition-transform" />
            </div>

            {/* The Nested Dropdown */}
            <div className="absolute top-0 left-full pl-1 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-300 transform translate-x-2 group-hover/nested:translate-x-0 z-[70]">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 min-w-[200px] py-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {subItems.map((item) => (
                        <Link
                            key={item}
                            href={`/tuition/${name.toLowerCase().replace(/ /g, '-')}/${item.toLowerCase().replace(/ /g, '-')}`}
                            className="block px-6 py-2.5 text-[10px] font-black text-gray-600 hover:text-primary hover:bg-gray-50 uppercase tracking-[0.1em] transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MobileCollapsible({ name, items }: { name: string, items: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="space-y-2">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-xs font-bold text-gray-700 uppercase tracking-wider">
                {name}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-primary/10 py-2 animate-fade-in">
                    {items.map(item => (
                        <Link key={item} href="#" className="text-xs font-bold text-gray-500 py-1">{item}</Link>
                    ))}
                </div>
            )}
        </div>
    );
}
