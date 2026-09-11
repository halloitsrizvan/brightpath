import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Lock } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Downloads",
    description: "Access BrightPath study materials, brochures, and curriculum guidelines. Available for registered students and tutors.",
    alternates: {
        canonical: '/downloads',
    },
};

export default function DownloadsPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <header className="pt-32 pb-16 bg-[#1a1a2e] text-white">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-4">Resources</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight mb-6">
                        Downloads
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
                        Access study materials, brochures, and curriculum guides.
                    </p>
                </div>
            </header>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-xl">
                    <div className="p-8 bg-surface rounded-2xl border border-gray-100/80 text-center">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-5">
                            <Lock className="w-7 h-7" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 font-display mb-2">
                            Login Required
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Study materials and downloads are available to registered students and tutors. Please log in to access your resources.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link 
                                href="/student-dashboard" 
                                className="px-6 py-3.5 bg-primary text-white font-semibold text-sm rounded-xl shadow-md shadow-primary/15 hover:bg-primary/90 active:scale-[0.98] transition-all"
                            >
                                Student Login
                            </Link>
                            <Link 
                                href="/contact" 
                                className="px-6 py-3.5 bg-white text-primary border border-primary/20 font-semibold text-sm rounded-xl hover:bg-primary/5 transition-all"
                            >
                                Request Brochure
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
