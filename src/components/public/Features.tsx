'use client';
import { Target, Banknote, ShieldAlert, BookOpenCheck, Headset, LineChart } from 'lucide-react';

const featureList = [
    {
        title: "Individualized Plans",
        desc: "We design personalized learning paths that focus on your child's specific needs, ensuring they get the absolute best foundation.",
        icon: <Target className="w-6 h-6" />,
        color: "bg-primary"
    },
    {
        title: "Transparent Pricing",
        desc: "Affordable mentor-led sessions with clear, flexible plans and absolutely zero hidden administrative fees.",
        icon: <Banknote className="w-6 h-6" />,
        color: "bg-secondary"
    },
    {
        title: "Weak Area Focus",
        desc: "From the first session, we identify and bridge conceptual gaps to turn difficult subjects into your child's strengths.",
        icon: <ShieldAlert className="w-6 h-6" />,
        color: "bg-red-500"
    },
    {
        title: "Board-Specific Support",
        desc: "Specialized guidance for CBSE, ICSE, and State boards with curriculum-aligned practice sets and exam strategies.",
        icon: <BookOpenCheck className="w-6 h-6" />,
        color: "bg-teal-500"
    },
    {
        title: "Anytime Mentor Support",
        desc: "Our mentors are always available to clear doubts, help with homework, and provide emotional support during exams.",
        icon: <Headset className="w-6 h-6" />,
        color: "bg-violet-500"
    },
    {
        title: "Holistic Monitoring",
        desc: "After every session, we map progress. Parents receive detailed monthly reports tracking every step of improvement.",
        icon: <LineChart className="w-6 h-6" />,
        color: "bg-amber-600"
    }
];

export default function PublicFeatures() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-12 items-end mb-20">
                    <div className="lg:w-1/2 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-[0.9] transition-all">
                            Personalized <span className="text-primary">Education</span><br />
                            That Fits Every Child's Needs.
                        </h2>
                        <div className="w-24 h-2 bg-secondary/30 rounded-full" />
                    </div>
                    <div className="lg:w-1/2">
                        <p className="text-base text-gray-500 font-medium leading-relaxed italic border-l-4 border-primary/10 pl-6">
                            Personalized online education goes beyond virtual classes. We believe in bridging the gap between knowledge and accessibility through customized methodology tailored to your child's unique pace.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featureList.map((f, i) => (
                        <div key={i} className="relative pt-12">
                            <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100/50 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group min-h-[280px] flex flex-col items-center text-center">
                                {/* Icon Header */}
                                <div className={`absolute -top-0 left-1/2 -translate-x-1/2 w-16 h-16 ${f.color} text-white rounded-full flex items-center justify-center shadow-xl shadow-gray-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-10`}>
                                    {f.icon}
                                </div>
                                
                                <div className="mt-8 space-y-4">
                                    <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                        {f.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-1 bg-primary/20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
