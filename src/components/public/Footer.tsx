'use client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  MapPin, 
  Phone, 
  ArrowUpRight,
  Star
} from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="relative bg-[#1a1a2e] text-white pt-20 pb-10 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <div className="relative w-10 h-10 bg-white rounded-lg p-2 flex items-center justify-center">
                                <Image src="/logo.png" alt="BrightPath" width={36} height={36} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-tight leading-none font-display">BrightPath</span>
                                <span className="text-[9px] font-semibold tracking-[0.2em] text-primary/80 uppercase mt-0.5">Eduvora</span>
                            </div>
                        </Link>
                        
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Kerala&apos;s leading one-on-one online tuition academy. Personalized academic guidance from expert tutors who understand your child&apos;s needs.
                        </p>

                        <div className="flex gap-3">
                            <SocialIcon icon={<Instagram className="w-4 h-4" />} href="#" />
                            <SocialIcon icon={<Linkedin className="w-4 h-4" />} href="#" />
                            <SocialIcon icon={<Twitter className="w-4 h-4" />} href="#" />
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
                        <div>
                            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-6">Programs</h4>
                            <ul className="space-y-3">
                                <FooterLink href="/tuition/tuition-by-classes/class-1-5">Primary (1-5)</FooterLink>
                                <FooterLink href="/tuition/tuition-by-classes/class-6">Secondary (6-10)</FooterLink>
                                <FooterLink href="/tuition/tuition-by-classes/class-11">Higher Secondary</FooterLink>
                                <FooterLink href="/subjects">All Subjects</FooterLink>
                                <FooterLink href="/boards">Academic Boards</FooterLink>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-6">Academy</h4>
                            <ul className="space-y-3">
                                <FooterLink href="/about">About Us</FooterLink>
                                <FooterLink href="/tutors">Our Tutors</FooterLink>
                                <FooterLink href="/testimonials">Testimonials</FooterLink>
                                <FooterLink href="/blog">Blog</FooterLink>
                                <FooterLink href="/contact">Contact</FooterLink>
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-6">Reach Us</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <MapPin className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-400 leading-relaxed">
                                        Calicut, Kerala<br />
                                        India - 673001
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <Phone className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-400 leading-relaxed">
                                        +91 85908 78148
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-sm text-gray-500">
                            © 2026 BrightPath Eduvora. All rights reserved.
                        </p>
                        <div className="flex gap-5">
                            <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                        <span>4.9/5 rated by parents across Kerala</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a href={href} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                {children}
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
        </li>
    );
}
