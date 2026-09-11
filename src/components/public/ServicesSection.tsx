'use client';
import { Video, LineChart, Tablet, ShieldCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const services = [
    {
        title: "1:1 Online Classes",
        desc: "Personalized sessions focused entirely on your child's learning pace and style.",
        icon: <Video className="w-5 h-5" />,
        id: 1
    },
    {
        title: "Progress Reports",
        desc: "Regular assessments and detailed monthly reports to track understanding and growth.",
        icon: <LineChart className="w-5 h-5" />,
        id: 2
    },
    {
        title: "Exam Preparation",
        desc: "Focused coaching for SSLC, CBSE, ICSE boards and competitive entrance exams.",
        icon: <Tablet className="w-5 h-5" />,
        id: 3
    },
    {
        title: "Verified Tutors",
        desc: "Every tutor is background-verified and trained in our personalized teaching methodology.",
        icon: <ShieldCheck className="w-5 h-5" />,
        id: 4
    }
];

export default function ServicesSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-6xl">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">What We Offer</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                            Our Services
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {services.map((s, i) => (
                        <ScrollReveal key={s.id} delay={i * 0.1}>
                            <div className="p-6 md:p-8 rounded-xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 flex gap-5 items-start group">
                                <div className="w-11 h-11 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    {s.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1.5">{s.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
