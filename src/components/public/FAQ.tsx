'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqData = [
    {
        question: "What academic boards do you support?",
        answer: "We provide specialized coaching for CBSE, ICSE, IGCSE, and Kerala State Board students from KG to 12th Grade.",
        id: 1
    },
    {
        question: "Is the mentorship entirely 1:1?",
        answer: "Yes, every session at Brightpath is strictly 1:1. This ensures that the mentor can focus entirely on your child's specific learning speed and needs.",
        id: 2
    },
    {
        question: "How flexible are the class timings?",
        answer: "Highly flexible. You can schedule sessions anywhere between 5:00 AM and 11:00 PM to suit your child's daily routine.",
        id: 3
    },
    {
        question: "How do parents track their child's progress?",
        answer: "We provide detailed monthly progress analytical reports and hold regular parent-mentor meetings to discuss improvements and focus areas.",
        id: 4
    },
    {
        question: "Can I choose my preferred language of instruction?",
        answer: "Absolutely. We offer instruction in English and Malayalam, allowing students to learn concepts in the language they are most comfortable with.",
        id: 5
    }
];

export default function PublicFAQ() {
    const [openId, setOpenId] = useState<number | null>(1);

    return (
        <section className="py-24 bg-gray-50/30">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/10 mb-4">
                        Got Questions?
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                        Frequently Asked <span className="text-primary border-b-4 border-secondary/30">Questions.</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqData.map((faq) => (
                        <div 
                            key={faq.id} 
                            onMouseEnter={() => setOpenId(faq.id)}
                            onMouseLeave={() => setOpenId(null)}
                            className={`rounded-2xl border transition-all duration-300 ${
                                openId === faq.id 
                                ? 'bg-white border-primary/20 shadow-xl shadow-gray-200/50' 
                                : 'bg-white/50 border-gray-100'
                            }`}
                        >
                            <div className="w-full px-8 py-6 flex items-center justify-between text-left cursor-default">
                                <div className="flex items-center gap-4">
                                    <HelpCircle className={`w-5 h-5 transition-colors ${openId === faq.id ? 'text-primary' : 'text-gray-300'}`} />
                                    <span className={`text-sm md:text-base font-black uppercase italic tracking-tight transition-colors ${openId === faq.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {faq.question}
                                    </span>
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openId === faq.id ? 'rotate-180 text-primary' : 'text-gray-400'}`} />
                            </div>
                            
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-8 pb-8 pl-16">
                                    <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed italic">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 rounded-3xl bg-primary text-white text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Still have questions?</h3>
                        <p className="text-sm font-bold opacity-80 mb-6">Our academic counsellors are here to help you choose the right path.</p>
                        <button 
                            onClick={() => window.open('https://wa.me/918590878148?text=Hi%20Brightpath%2C%20I%20need%20support%20regarding%20your%20academic%20programs.', '_blank')}
                            className="px-8 py-3 bg-secondary text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
