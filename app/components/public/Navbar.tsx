'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Star } from 'lucide-react';

export default function PublicNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', href: '/about' },
        { name: 'Tutors', href: '/tutors' },
        { name: 'Subjects', href: '/subjects' },
        { name: 'Services', href: '/services' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100 py-3' : 'bg-transparent py-5'
        }`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-6 transition-all">
                        B
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-gray-900 leading-none">BRIGHTPATH</span>
                        <span className="text-[10px] font-bold text-primary tracking-[0.3em] leading-none mt-1">KERALA</span>
                    </div>
                </Link>

                <div className="hidden lg:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href} 
                            className="text-sm font-bold text-gray-600 hover:text-primary transition-colors uppercase tracking-widest"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link 
                        href="/contact" 
                        className="px-6 py-2.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all"
                    >
                        Book Free Demo
                    </Link>
                </div>

                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-primary"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-b border-gray-100 py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href} 
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm font-black text-gray-800 uppercase tracking-widest p-2"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link 
                        href="/contact" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-4 py-4 bg-primary text-white font-black uppercase tracking-widest text-center rounded-2xl shadow-lg"
                    >
                        Enroll Now
                    </Link>
                </div>
            )}
        </nav>
    );
}
