'use client';
import { Target, Banknote, ShieldAlert, BookOpenCheck, Headset, LineChart } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const featureList = [
    {
        title: "Personalized Plans",
        desc: "Learning paths designed around your child's specific needs, pace, and goals.",
        icon: <Target className="w-5 h-5" />,
        color: "bg-primary/10 text-primary"
    },
    {
        title: "Transparent Pricing",
        desc: "Affordable sessions with clear, flexible plans. No hidden fees, ever.",
        icon: <Banknote className="w-5 h-5" />,
        color: "bg-amber-50 text-amber-600"
    },
    {
        title: "Weak Area Focus",
        desc: "We identify and bridge conceptual gaps from the very first session.",
        icon: <ShieldAlert className="w-5 h-5" />,
        color: "bg-red-50 text-red-500"
    },
    {
        title: "Board-Specific Support",
        desc: "Specialized guidance for CBSE, ICSE, and State boards with exam strategies.",
        icon: <BookOpenCheck className="w-5 h-5" />,
        color: "bg-teal-50 text-teal-600"
    },
    {
        title: "Mentor Support Anytime",
        desc: "Doubt clearing, homework help, and emotional support during exams.",
        icon: <Headset className="w-5 h-5" />,
        color: "bg-violet-50 text-violet-600"
    },
    {
        title: "Progress Tracking",
        desc: "Detailed monthly reports so parents can see every step of improvement.",
        icon: <LineChart className="w-5 h-5" />,
        color: "bg-emerald-50 text-emerald-600"
    }
];

export default function PublicFeatures() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-6xl">
                <ScrollReveal>
                    <div className="flex flex-col lg:flex-row gap-8 items-start mb-14">
                        <div className="lg:w-1/2 space-y-3">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                                Education that fits <span className="text-primary">every child</span>
                            </h2>
                        </div>
                        <div className="lg:w-1/2">
                            <p className="text-gray-500 leading-relaxed">
                                Personalized online education goes beyond virtual classes. We bridge the gap between knowledge and accessibility through methodology tailored to your child&apos;s unique pace.
                            </p>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featureList.map((f, i) => (
                        <ScrollReveal key={i} delay={i * 0.08}>
                            <div className="p-6 rounded-xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 group">
                                <div className={`w-10 h-10 ${f.color} rounded-lg flex items-center justify-center mb-4`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
