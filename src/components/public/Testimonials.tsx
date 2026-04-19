'use client';
import { Quote, Star } from 'lucide-react';
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
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/10 mb-4">
                        Success Stories
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                        Institutional <span className="text-primary border-b-4 border-secondary/30">Impact.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.id} className="relative p-8 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group">
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                            
                            <div className="flex gap-0.5 mb-6">
                                {[...Array(t.stars)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />
                                ))}
                            </div>

                            <div className="relative mb-8">
                                <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                                    "{t.content}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-6 border-t border-gray-100/50">
                                <div className="relative w-10 h-10 rounded-full bg-white shadow-md border-2 border-white overflow-hidden shrink-0">
                                    <Image src={t.img} alt={t.name} fill className="object-cover" unoptimized />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{t.name}</h4>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
