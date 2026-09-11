import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import ServicesSection from '@/components/public/ServicesSection';
import FloatingContact from '@/components/public/FloatingContact';
import { ShieldCheck, Video, Clock, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Our Services",
    description: "Premium 1:1 online tuition, entrance exam prep, language foundation courses, and personalized academic counseling for KG-12 students.",
    alternates: {
        canonical: '/services',
    },
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            
            <header className="pt-32 pb-16 bg-[#1a1a2e] text-white">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-4">Our Services</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight mb-6">
                        Personalized <span className="text-primary">Mentorship</span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
                        Quality educational services designed for students from KG to 12th grade across Kerala and beyond.
                    </p>
                </div>
            </header>

            {/* Benefits bar */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
                    <Benefit icon={<Video className="w-5 h-5" />} text="Live 1:1 Sessions" />
                    <Benefit icon={<Clock className="w-5 h-5" />} text="Flexible Timing" />
                    <Benefit icon={<ShieldCheck className="w-5 h-5" />} text="Safe Learning" />
                    <Benefit icon={<TrendingUp className="w-5 h-5" />} text="Progress Reports" />
                </div>
            </section>

            <ServicesSection />

            {/* CTA */}
            <section className="py-20 bg-primary text-white text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-white/60 mb-8">Book a free demo and see how personalized learning can help your child.</p>
                    <Link href="/contact" className="inline-block px-8 py-4 bg-white text-primary font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 active:scale-[0.98] transition-all">
                        Get in Touch
                    </Link>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function Benefit({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">{icon}</div>
            <span className="text-sm font-medium text-gray-600">{text}</span>
        </div>
    );
}
