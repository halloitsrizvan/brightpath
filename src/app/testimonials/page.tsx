'use client';
import { useState } from 'react';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import DemoModal from '@/components/modals/DemoModal';
import { Quote, Star, MessageCircle, Heart, Users, ShieldCheck } from 'lucide-react';
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
        name: "Adbul Salam",
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

export default function TestimonialsPage() {
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white selection:bg-primary/10">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="pt-44 pb-20 bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        Voices of Success
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 italic uppercase tracking-tighter leading-none mb-6">
                        Success <span className="text-primary italic">Stories.</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-bold italic leading-relaxed">
                        Join thousands of families across Kerala and the GCC who have transformed their academic journey with Brightpath.
                    </p>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((t) => (
                            <div key={t.id} className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 group relative flex flex-col justify-between">
                                <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/5 group-hover:scale-110 transition-transform" />
                                
                                <div>
                                    <div className="flex gap-1 mb-8">
                                        {[...Array(t.stars)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                                        ))}
                                    </div>

                                    <p className="text-sm font-bold text-gray-600 leading-relaxed italic mb-10">
                                        "{t.content}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-8 border-t border-gray-50">
                                    <div className="relative w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                        <Image src={t.img} alt={t.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{t.name}</h4>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/4" />
                <div className="container mx-auto px-6 relative z-10 text-center lg:text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight">
                                Delivering <span className="text-primary">Excellence</span> <br /> In Every Session.
                            </h2>
                            <p className="text-gray-400 font-bold italic leading-relaxed text-lg max-w-xl">
                                Our commitment to personalized learning has resulted in measurable academic growth for 99% of our students.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <MetricCard icon={<Users />} value="5000+" label="Happy Families" />
                            <MetricCard icon={<Heart />} value="99%" label="Success Rate" />
                            <MetricCard icon={<ShieldCheck />} value="100%" label="Verified Tutors" />
                            <MetricCard icon={<Star />} value="4.9/5" label="Average Rating" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-32 bg-white text-center">
                <div className="container mx-auto px-6 max-w-3xl space-y-10">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic uppercase tracking-tighter">Ready To Be Our <br /><span className="text-primary italic">Next Success Story?</span></h2>
                    <p className="text-gray-500 font-bold italic text-lg leading-relaxed">
                        Experience the Brightpath difference with a free trial session in your favorite subject.
                    </p>
                    <div className="flex justify-center pt-4">
                        <button 
                            onClick={() => setIsDemoModalOpen(true)}
                            className="px-12 py-5 bg-gray-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-primary transition-colors"
                        >
                            Book A Free Demo
                        </button>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
            <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
        </div>
    );
}

function MetricCard({ icon, value, label }: { icon: any, value: string, label: string }) {
    return (
        <div className="space-y-2 p-6 bg-white/5 rounded-[2rem] border border-white/5">
            <div className="text-primary">{icon}</div>
            <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
        </div>
    );
}
