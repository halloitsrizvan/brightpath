'use client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="relative bg-[#0F1115] text-white pt-24 pb-12 overflow-hidden selection:bg-primary/30">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -ml-48 -mb-48" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="relative w-12 h-12 bg-white rounded-xl p-2.5 shadow-2xl flex items-center justify-center">
                                <Image src="/logo.png" alt="BrightPath" width={50} height={50} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter leading-none italic uppercase">BRIGHTPATH</span>
                                <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mt-1">EDUVORA</span>
                            </div>
                        </Link>
                        
                        <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-sm">
                            Kerala's leading one-on-one online tuition academy. Empowering students with personalized academic guidance from local mentors who understand global standards.
                        </p>

                        <div className="flex gap-4">
                            <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Academic Programs</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/tuition/tuition-by-class/class-1-5">Primary (1-5)</FooterLink>
                                <FooterLink href="/tuition/tuition-by-class/class-6-10">Secondary (6-10)</FooterLink>
                                <FooterLink href="/tuition/tuition-by-class/class-11-12">Higher Secondary</FooterLink>
                                <FooterLink href="/tuition/tuition-by-category/subject-specific">Subject Specialists</FooterLink>
                                <FooterLink href="/tuition/tuition-by-category/competitive-exams">Competitive Exams</FooterLink>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Academy</h4>
                            <ul className="space-y-4">
                                <FooterLink href="/about">Our Philosophy</FooterLink>
                                <FooterLink href="/teachers">Expert Mentors</FooterLink>
                                <FooterLink href="/testimonials">Success Stories</FooterLink>
                                <FooterLink href="/blog">Academy Blog</FooterLink>
                                <FooterLink href="/contact">Support Center</FooterLink>
                            </ul>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Headquarters</h4>
                            <ul className="space-y-5">
                                <li className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
                                        Calicut, Kerala<br />
                                        India - 673001
                                    </div>
                                </li>
                                <li className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
                                        +91 9000 000 000<br />
                                        +91 8000 000 000
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p className="text-[10px] font-black italic text-gray-500 uppercase tracking-[0.3em]">
                            © 2026 BRIGHTPATH KERALA | ACADEMIC CORE
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-[9px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-[0.2em]">Privacy Polices</Link>
                            <Link href="/terms" className="text-[9px] font-black text-gray-600 hover:text-white transition-colors uppercase tracking-[0.2em]">Usage Terms</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/5">
                        <Award className="w-4 h-4 text-secondary" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Kerala's #1 Rated Online Academy ★ 4.9/5</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: any, href: string }) {
    return (
        <a href={href} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
            {icon}
        </a>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold italic uppercase tracking-widest">
                <ArrowRight className="w-3 h-3 text-primary opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                {children}
            </Link>
        </li>
    );
}
