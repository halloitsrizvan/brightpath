'use client';
import { Quote, Star } from 'lucide-react';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

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
    }
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-6xl">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                            What Parents Say
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <ScrollReveal key={t.id} delay={i * 0.1}>
                            <div className="relative p-6 rounded-xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300">
                                <Quote className="absolute top-5 right-5 w-6 h-6 text-primary/8" />
                                
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(t.stars)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                                    ))}
                                </div>

                                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                    &ldquo;{t.content}&rdquo;
                                </p>

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
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
