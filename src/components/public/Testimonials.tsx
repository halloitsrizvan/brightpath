'use client';
import { Quote, Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        name: "Rahul S.",
        role: "Grade 10 Student",
        content: "The 1:1 focus changed how I view Mathematics. My concept clarity is at an all-time high thanks to Brightpath's mentors.",
        stars: 5,
        id: 1
    },
    {
        name: "Meera Nair",
        role: "Parent",
        content: "Transparent reporting and flexible timing made it easy to balance school and tuition. The tutors are truly professionals.",
        stars: 5,
        id: 2
    },
    {
        name: "Anjali K.",
        role: "Grade 12 Student",
        content: "Intensive NEET preparation with 1:1 doubt clearing. I feel significantly more confident about the competitive exams now.",
        stars: 5,
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
                                <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.id + 50}`} alt={t.name} width={48} height={48} unoptimized />
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
