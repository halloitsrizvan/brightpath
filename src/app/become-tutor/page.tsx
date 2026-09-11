import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Clock, Heart, BookOpen, CheckCircle2, MessageCircle, Users } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Become a Tutor",
    description: "Join Kerala's fastest-growing 1:1 online mentorship network. Flexible hours, competitive pay, and teaching opportunities from home.",
    alternates: {
        canonical: '/become-tutor',
    },
};

export default function BecomeTutor() {
    const whatsappLink = "https://wa.me/918590878148?text=I'm%20interested%20in%20joining%20BrightPath%20as%20a%20tutor";

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-[#1a1a2e] text-white text-center">
                <div className="container mx-auto px-6 max-w-3xl">
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">We&apos;re Hiring</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight mb-6">
                        Teach Online with <span className="text-primary">BrightPath</span>
                    </h1>
                    <p className="text-gray-400 leading-relaxed max-w-xl mx-auto mb-8">
                        Transform lives from the comfort of your home. Join Kerala&apos;s most trusted 1:1 online mentorship network.
                    </p>
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
                    >
                        <MessageCircle className="w-4 h-4" /> Apply via WhatsApp
                    </a>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                            Why teach with us?
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <BenefitCard icon={<Clock className="w-5 h-5" />} title="Work from Home" desc="Teach from anywhere. Save hours of daily commute." />
                        <BenefitCard icon={<Heart className="w-5 h-5" />} title="Competitive Pay" desc="Fair compensation that values your expertise and dedication." />
                        <BenefitCard icon={<BookOpen className="w-5 h-5" />} title="Grow Your Reach" desc="Teach students from across India and the GCC countries." />
                    </div>
                </div>
            </section>

            {/* How to Join */}
            <section className="py-20 bg-surface">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">How It Works</p>
                            <h2 className="text-3xl font-extrabold text-gray-900 font-display leading-tight mb-6">
                                Your journey to teaching with BrightPath
                            </h2>
                            <div className="space-y-5">
                                <Step num="1" title="Connect on WhatsApp" desc="Start a conversation with our recruitment team." />
                                <Step num="2" title="Skill Assessment" desc="A brief evaluation of your subject knowledge and teaching style." />
                                <Step num="3" title="Training & Onboarding" desc="Get trained on our personalized 1:1 mentorship framework." />
                                <Step num="4" title="Start Teaching" desc="Get matched with students and begin your sessions." />
                            </div>
                        </div>

                        <div className="p-8 bg-white rounded-2xl shadow-lg shadow-gray-100/60 border border-gray-100/80 text-center">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Users className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 font-display mb-2">Join 500+ Tutors</h3>
                            <p className="text-sm text-gray-500 mb-6">BrightPath is home to Kerala&apos;s best teaching talent.</p>
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors">
                                Apply Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Requirements */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 font-display mb-6">Perks of Joining</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {['Flexible Timings', 'Mentorship Training', 'Creative Autonomy', 'Tech Support 24/7', 'Performance Bonuses', 'Professional Growth'].map(perk => (
                                    <div key={perk} className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-gray-100/80">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        <span className="text-sm font-medium text-gray-700">{perk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-7 bg-[#1a1a2e] rounded-2xl text-white">
                            <h2 className="text-xl font-bold font-display mb-5">What we look for</h2>
                            <div className="space-y-4">
                                <QualifyPoint title="Subject Mastery" desc="Strong knowledge of CBSE, ICSE or State board subjects." />
                                <QualifyPoint title="Communication" desc="Ability to explain concepts clearly in Malayalam & English." />
                                <QualifyPoint title="Digital Skills" desc="Comfortable with online meeting tools and digital whiteboards." />
                                <QualifyPoint title="Passion" desc="A genuine desire to help students succeed." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 bg-primary text-white text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight mb-4">
                        Ready to start teaching?
                    </h2>
                    <p className="text-white/60 mb-8">Your journey starts with one message.</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-white text-primary font-semibold text-sm rounded-xl shadow-lg hover:bg-gray-50 active:scale-[0.98] transition-all">
                        Apply via WhatsApp
                    </a>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 text-center group">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {icon}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function Step({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 text-sm font-bold">{num}</div>
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h4>
                <p className="text-xs text-gray-400">{desc}</p>
            </div>
        </div>
    );
}

function QualifyPoint({ title, desc }: { title: string, desc: string }) {
    return (
        <div>
            <h4 className="text-sm font-semibold text-primary mb-0.5">{title}</h4>
            <p className="text-xs text-gray-400">{desc}</p>
        </div>
    );
}
