'use client';
import { Calculator, Atom, FlaskConical, Microscope, Languages, Globe } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const subjects = [
    { name: "Mathematics", icon: <Calculator className="w-5 h-5" />, focus: "Algebra, Calculus, Geometry", color: "bg-primary/10 text-primary", id: 1 },
    { name: "Physics", icon: <Atom className="w-5 h-5" />, focus: "Mechanics, Optics, Nuclear", color: "bg-violet-50 text-violet-600", id: 2 },
    { name: "Chemistry", icon: <FlaskConical className="w-5 h-5" />, focus: "Organic, Inorganic, Physical", color: "bg-teal-50 text-teal-600", id: 3 },
    { name: "Biology", icon: <Microscope className="w-5 h-5" />, focus: "Botany, Zoology, Genetics", color: "bg-green-50 text-green-600", id: 4 },
    { name: "English", icon: <Languages className="w-5 h-5" />, focus: "Literature, Grammar, Communication", color: "bg-amber-50 text-amber-600", id: 5 },
    { name: "Social Studies", icon: <Globe className="w-5 h-5" />, focus: "History, Civics, Geography", color: "bg-rose-50 text-rose-600", id: 6 },
];

export default function SubjectsGrid() {
    return (
        <section className="py-20 bg-surface">
            <div className="container mx-auto px-6 max-w-6xl">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Our Core Subjects</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                            Core Disciplines & Specialized Mentorship
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((s, i) => (
                        <ScrollReveal key={s.id} delay={i * 0.08}>
                            <div className="p-5 rounded-xl bg-white border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 flex items-start gap-4 group">
                                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center shrink-0`}>
                                    {s.icon}
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-bold text-gray-900 mb-0.5">{s.name}</h3>
                                    <p className="text-xs text-gray-400">{s.focus}</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
