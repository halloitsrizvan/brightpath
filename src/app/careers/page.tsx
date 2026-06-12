import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Briefcase, Users, Zap, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Careers",
    description: "Explore career opportunities at BrightPath. Join our talent pool of passionate educators and academic consultants in Kerala.",
    alternates: {
        canonical: '/careers',
    },
};

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
            <PublicNavbar />

            <header className="relative pt-48 pb-40 flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 mb-8 backdrop-blur-sm">
                        Join Our Academic Core
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-tight mb-8">
                        Careers at <br />
                        <span className="text-primary italic">BrightPath.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-400 font-bold italic leading-relaxed">
                        We are always looking for passionate educators and innovators to join Kerala's most advanced 1:1 tuition ecosystem.
                    </p>
                </div>
            </header>

            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/5 rounded-3xl text-primary mb-6">
                            <Briefcase className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                            Future <span className="text-primary">Opportunities.</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-bold italic leading-relaxed">
                            Our team is currently expanding. While we don't have active listings right now, we are always eager to meet talented tutors and academic consultants.
                        </p>
                        
                        <div className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100 mt-16 group hover:shadow-2xl transition-all duration-500">
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Send Your Resume</h3>
                            <p className="text-gray-500 font-bold italic mb-8">Join our talent pool for upcoming roles in teaching, sales, and operations.</p>
                            <a 
                                href="mailto:careers@brightpatheduvora.com" 
                                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all"
                            >
                                Contact Careers <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
