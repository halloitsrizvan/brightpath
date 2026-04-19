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
        <section className="py-32 bg-gray-50/50">
            <div className="container mx-auto px-6 text-center mb-20">
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Voice of Excellence</p>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">Institutional <span className="text-primary">Impact.</span></h2>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 relative group hover:-translate-y-2 transition-all">
                        <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
                        <div className="flex gap-1 mb-6">
                            {[...Array(t.stars)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                            ))}
                        </div>
                        <p className="text-gray-600 font-bold italic leading-relaxed mb-8 italic">"{t.content}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center overflow-hidden">
                                <Image src={t.img} alt={t.name} width={48} height={48} unoptimized />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">{t.name}</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
