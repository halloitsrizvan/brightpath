'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

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
        answer: "We provide detailed monthly progress reports and hold regular parent-mentor meetings to discuss improvements and focus areas.",
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
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-6 max-w-3xl">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Got Questions?</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                            Frequently Asked Questions
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="space-y-3">
                    {faqData.map((faq, i) => (
                        <ScrollReveal key={faq.id} delay={i * 0.06}>
                            <div 
                                className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                                    openId === faq.id 
                                    ? 'bg-white border-primary/15 shadow-md shadow-gray-100/60' 
                                    : 'bg-white/60 border-gray-100 hover:bg-white'
                                }`}
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                            >
                                <div className="w-full px-6 py-5 flex items-center justify-between text-left">
                                    <span className={`text-sm md:text-[15px] font-semibold transition-colors ${
                                        openId === faq.id ? 'text-gray-900' : 'text-gray-700'
                                    }`}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 shrink-0 ml-4 transition-transform duration-200 ${
                                        openId === faq.id ? 'rotate-180 text-primary' : 'text-gray-400'
                                    }`} />
                                </div>
                                
                                <div className={`overflow-hidden transition-all duration-200 ease-in-out ${
                                    openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="px-6 pb-5">
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {faq.answer}
                                        </p>
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
