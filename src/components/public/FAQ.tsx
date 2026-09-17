'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export const faqData = [
    {
        id: 1,
        question: "What academic boards and classes do BrightPath online tutors cover?",
        answer: "BrightPath Eduvora provides personalized 1:1 online tuition for students from Kindergarten (KG) to 12th Grade across CBSE, ICSE / ISC, Kerala State Board (SCERT), and IGCSE curriculums. We offer specialized coaching for all core subjects including Mathematics, Physics, Chemistry, Biology, English, and Social Science."
    },
    {
        id: 2,
        question: "How does 1:1 personalized online tuition differ from group tuition centers?",
        answer: "In conventional group tuition, teachers progress at an average pace, often leaving struggling students behind or failing to challenge advanced learners. At BrightPath, every single class is strictly 1-on-1. The expert tutor designs every lesson around your child's specific learning pace, addresses doubts immediately, and builds deep conceptual mastery."
    },
    {
        id: 3,
        question: "How qualified and verified are the online tutors at BrightPath?",
        answer: "Every BrightPath tutor undergoes a stringent multi-tier vetting process: comprehensive background and credential checks, subject-matter knowledge evaluations, and digital pedagogy training. Over 85% of our faculty hold postgraduate degrees or higher, with extensive experience in board exam preparation."
    },
    {
        id: 4,
        question: "How flexible are class timings and scheduling for students?",
        answer: "We offer maximum schedule flexibility. Sessions can be scheduled between 5:00 AM and 11:00 PM IST to fit your child's school routine, extracurricular activities, and time zones. If an unforeseen event arises, classes can be easily rescheduled with prior notice."
    },
    {
        id: 5,
        question: "How do parents monitor their child's academic progress?",
        answer: "Transparency is fundamental to our system. Parents receive comprehensive monthly analytical progress reports highlighting attendance, chapter completion, quiz scores, and conceptual strengths. We also conduct scheduled parent-tutor review meetings to align on upcoming academic goals."
    },
    {
        id: 6,
        question: "Can students choose their preferred language of instruction?",
        answer: "Yes. Mentors can teach in English, Malayalam, or a bilingual blend based on what helps the student grasp concepts most comfortably. This removes language barriers and helps students build genuine academic confidence."
    },
    {
        id: 7,
        question: "What digital tools and interactive whiteboards are used during sessions?",
        answer: "Our virtual classrooms feature high-definition interactive digital whiteboards, real-time screen and document sharing, mathematical formula editors, and instant doubt-clearing tools. Students and tutors can write, solve problems, and annotate together just like an in-person desk session."
    },
    {
        id: 8,
        question: "Is there a free trial or assessment session before enrollment?",
        answer: "Yes, we offer a 100% free, no-obligation 1:1 diagnostic demo session. During this session, an expert tutor assesses your child's foundational strengths, identifies key growth areas, and shares a customized learning roadmap tailored to their academic goals."
    }
];

export default function PublicFAQ() {
    const [openId, setOpenId] = useState<number | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = (id: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setOpenId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setOpenId(null);
        }, 150);
    };

    const handleClick = (id: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setOpenId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

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
                    {faqData.map((faq, i) => {
                        const isOpen = openId === faq.id;
                        return (
                            <ScrollReveal key={faq.id} delay={i * 0.05}>
                                <div 
                                    className={`rounded-xl border transition-all duration-300 cursor-pointer ${
                                        isOpen 
                                        ? 'bg-white border-primary/20 shadow-md shadow-primary/5 ring-1 ring-primary/10' 
                                        : 'bg-white/70 border-gray-100 hover:bg-white hover:border-gray-200'
                                    }`}
                                    onMouseEnter={() => handleMouseEnter(faq.id)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => handleClick(faq.id)}
                                >
                                    <div className="w-full px-6 py-5 flex items-center justify-between text-left">
                                        <h3 className={`text-sm md:text-[15px] font-semibold transition-colors duration-200 m-0 ${
                                            isOpen ? 'text-primary font-bold' : 'text-gray-800'
                                        }`}>
                                            {faq.question}
                                        </h3>
                                        <ChevronDown className={`w-4 h-4 shrink-0 ml-4 transition-transform duration-300 ${
                                            isOpen ? 'rotate-180 text-primary' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                        <div className="px-6 pb-5">
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

