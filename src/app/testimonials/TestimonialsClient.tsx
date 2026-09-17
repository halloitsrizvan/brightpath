'use client';
import { useState } from 'react';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import DemoModal from '@/components/modals/DemoModal';
import { Quote, Star, Users, Heart, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        name: "Hashim",
        role: "Parent",
        content: "Hi, റെഗുലർ ക്ലാസ്സിൽ ചേർന്നതിന് ശേഷം മോൾക്ക് നല്ല മാറ്റം ഉണ്ട് ട്ടോ . ഇംഗ്ലീഷ് ഒക്കെ വായിക്കാൻ അവൾക്ക് ഇപ്പോൾ ഈസി ആണ്. Brightpath ലെ ടീച്ചേർസ് നല്ല ഫ്രണ്ട്ലി ആയിരുന്നു. ക്ലാസ്സിൽ നല്ല മാറ്റം ഉണ്ടെന്ന് അവളുടെ ക്ലാസ്സ് ടീച്ചർ പറഞ്ഞിരുന്നു. അവൾ ഹാപ്പി ആണ്.താങ്ക്സ് Brightpath ",
        stars: 5,
        img: "/testimonial1.png",
        id: 1
    },
    {
        name: "Abdul Salam",
        role: "Parent",
        content: "ലിബക്ക് brightpath ൽ ജോയിൻ ചെയ്‌തതിന് ശേഷം ഒരുപാട് മാറ്റം കാണുന്നുണ്ട്.... UKG base ഇല്ലാതിരുന്ന അവൾക് ഒരു base കിട്ടിയത് brightpath കാരണം ആണ്, ഇംഗ്ലീഷ് സ്റ്റോറീസ് ഒക്കെ ഇപ്പൊ ശെരിക്കും വായിക്കാൻ കയ്യുന്നുണ്... പിന്നെ എടുത്തു പറയേണ്ട ഒരു കാര്യം എന്തെന്ന് വെച്ചാൽ, ടീച്ചർ വളരെ ഫ്രണ്ട്ലി ആയിരുന്നു. താങ്ക്യൂ brightpath",
        stars: 5,
        img: "/testimonial2.png",
        id: 2
    },
    {
        name: "Shameer",
        role: "Parent",
        content: "ഇത് എന്റെ മോൻ്റെ രണ്ടാമത്തെ ഫൌണ്ടേഷൻ കോഴ്സ് ആണ് brightpath ടീമിൻ്റെ കൂടെ, ഇപ്പോ ചെയ്‌തത്‌ മലയാളം ഫൌണ്ടേഷൻ കോഴ്‌സ് ആണ്, എന്ത് പറയണം എന്ന് അറിയില്ല 20 ദിവസം കൊണ്ട് മലയാളം പറയാൻ മാത്രം അറിയുന്ന അവനെ എഴുതാനും, വായിക്കാനും പഠിപ്പിച്ചു. Brightpath നോടും അൻഷിദ മാമിനോടും ഒരു പാട് നന്ദി",
        stars: 5,
        img: "/testimonial3.png",
        id: 3
    },
];

export default function TestimonialsClient() {
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <section className="pt-32 pb-16 bg-surface border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-display leading-tight mb-4">
                        What Parents Say
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Join thousands of families across Kerala and the GCC who trust BrightPath for their children&apos;s education.
                    </p>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.id} className="p-6 rounded-xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 relative flex flex-col justify-between">
                                <Quote className="absolute top-5 right-5 w-6 h-6 text-primary/8" />
                                
                                <div>
                                    <div className="flex gap-0.5 mb-4">
                                        {[...Array(t.stars)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                        &ldquo;{t.content}&rdquo;
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100/60">
                                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                        <Image src={t.img} alt={t.name} fill className="object-cover" unoptimized />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">{t.name}</h3>
                                        <p className="text-xs text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-20 bg-[#1a1a2e] text-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight mb-4">
                                Delivering <span className="text-primary">excellence</span> in every session
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                Our commitment to personalized learning has resulted in measurable academic growth for 99% of our students.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard icon={<Users className="w-4 h-4" />} value="5000+" label="Happy Families" />
                            <MetricCard icon={<Heart className="w-4 h-4" />} value="99%" label="Success Rate" />
                            <MetricCard icon={<ShieldCheck className="w-4 h-4" />} value="100%" label="Verified Tutors" />
                            <MetricCard icon={<Star className="w-4 h-4" />} value="4.9/5" label="Average Rating" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-white text-center">
                <div className="container mx-auto px-6 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight mb-4">
                        Ready to be our next success story?
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Experience the BrightPath difference with a free trial session.
                    </p>
                    <button 
                        onClick={() => setIsDemoModalOpen(true)}
                        className="px-8 py-4 bg-primary text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
                    >
                        Book a Free Demo
                    </button>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
            <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
        </div>
    );
}

function MetricCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
    return (
        <div className="p-5 bg-white/5 rounded-xl border border-white/5">
            <div className="text-primary mb-2">{icon}</div>
            <h3 className="text-2xl font-extrabold font-display">{value}</h3>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
    );
}
