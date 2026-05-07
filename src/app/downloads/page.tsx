'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Download, FileText, Lock, ArrowRight } from 'lucide-react';

export default function DownloadsPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
            <PublicNavbar />

            <header className="relative pt-48 pb-40 flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 mb-8 backdrop-blur-sm">
                        Resources & Material
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-tight mb-8">
                        Academic <br />
                        <span className="text-primary italic">Downloads.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-400 font-bold italic leading-relaxed">
                        Access study materials, brochures, and curriculum guides from our academic repository.
                    </p>
                </div>
            </header>

            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-50 rounded-[4rem] p-16 border border-gray-100 text-center space-y-8">
                            <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-12 h-12" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                                Secure <span className="text-primary">Repository.</span>
                            </h2>
                            <p className="text-xl text-gray-500 font-bold italic leading-relaxed">
                                Our academic downloads are exclusive to registered students and mentors. Please login to access your personalized study material and question banks.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                                <a 
                                    href="/student-dashboard" 
                                    className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all w-full sm:w-auto"
                                >
                                    Student Login
                                </a>
                                <a 
                                    href="/contact" 
                                    className="px-8 py-4 bg-white text-primary border-2 border-primary/20 font-black uppercase tracking-widest rounded-2xl hover:bg-primary/5 transition-all w-full sm:w-auto text-center"
                                >
                                    Request Brochure
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
