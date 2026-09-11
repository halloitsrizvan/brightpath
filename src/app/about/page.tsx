import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Target, Zap, ShieldCheck, Heart, Eye, Award } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About Us",
    description: "Kerala's premier 1:1 online tuition academy. Learn about our vision, mission, core values, and dedicated academic mentorship.",
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Hero */}
            <header className="relative pt-32 pb-20 bg-[#1a1a2e]">
                <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-4">About BrightPath</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white font-display leading-tight mb-6">
                        Learn Right. <span className="text-primary">Grow Bright.</span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
                        BrightPath is more than an academy — it&apos;s a commitment to helping every child reach their full potential through personalized mentorship.
                    </p>
                </div>
            </header>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-8 md:p-10 bg-surface rounded-2xl border border-gray-100/80">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5">
                                <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 font-display mb-3">Our Mission</h2>
                            <p className="text-gray-500 leading-relaxed">
                                To make quality 1:1 mentorship accessible to every child in Kerala and beyond, ensuring that geography never limits academic potential.
                            </p>
                        </div>

                        <div className="p-8 md:p-10 bg-[#1a1a2e] rounded-2xl">
                            <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-xl flex items-center justify-center mb-5">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-white font-display mb-3">Our Vision</h2>
                            <p className="text-gray-400 leading-relaxed">
                                To set the standard for personalized online education by building a transparent ecosystem where every child&apos;s growth is measurable and meaningful.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-surface">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">What We Stand For</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">Our Core Values</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <ValueCard icon={<ShieldCheck className="w-5 h-5" />} title="Integrity" desc="Honest reporting and transparent academic assessments for every parent." />
                        <ValueCard icon={<Heart className="w-5 h-5" />} title="Empathy" desc="Understanding each student's unique pace and emotional learning needs." />
                        <ValueCard icon={<Zap className="w-5 h-5" />} title="Innovation" desc="Continuously improving our tools to keep learning interactive and effective." />
                        <ValueCard icon={<Award className="w-5 h-5" />} title="Excellence" desc="A relentless pursuit of academic mastery for every student in our care." />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">Our Impact in Numbers</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatItem label="Years of Excellence" value="12+" />
                        <StatItem label="Happy Families" value="5000+" />
                        <StatItem label="Expert Tutors" value="500+" />
                        <StatItem label="Satisfaction Rate" value="99%" />
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="text-center p-6 rounded-xl bg-surface border border-gray-100/80">
            <p className="text-4xl md:text-5xl font-extrabold text-primary font-display leading-none mb-2">{value}</p>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
        </div>
    );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-xl bg-white border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {icon}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}
