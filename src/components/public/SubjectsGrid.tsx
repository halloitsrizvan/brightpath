'use client';
import { Calculator, Atom, FlaskConical, Microscope, Languages, Globe, BookOpen } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

const subjects = [
    { name: "Mathematics", slug: "maths", icon: <Calculator className="w-5 h-5" />, focus: "Algebra, Calculus, Geometry, Trigonometry", color: "bg-primary/10 text-primary", id: 1 },
    { name: "Physics", slug: "physics", icon: <Atom className="w-5 h-5" />, focus: "Mechanics, Optics, Electricity, Derivations", color: "bg-violet-50 text-violet-600", id: 2 },
    { name: "Chemistry", slug: "chemistry", icon: <FlaskConical className="w-5 h-5" />, focus: "Organic, Inorganic, Physical, Equations", color: "bg-teal-50 text-teal-600", id: 3 },
    { name: "Biology", slug: "biology", icon: <Microscope className="w-5 h-5" />, focus: "Botany, Zoology, Genetics, Diagrams", color: "bg-green-50 text-green-600", id: 4 },
    { name: "General Science", slug: "science", icon: <Atom className="w-5 h-5" />, focus: "Primary & Middle School Foundations", color: "bg-sky-50 text-sky-600", id: 5 },
    { name: "English", slug: "english", icon: <Languages className="w-5 h-5" />, focus: "Grammar, Reading Fluency, Writing, Literature", color: "bg-amber-50 text-amber-600", id: 6 },
    { name: "Social Science", slug: "social-science", icon: <Globe className="w-5 h-5" />, focus: "History, Civics, Geography, Map Practice", color: "bg-rose-50 text-rose-600", id: 7 },
    { name: "Malayalam", slug: "malayalam", icon: <BookOpen className="w-5 h-5" />, focus: "Basic Reading, Writing, Grammar, SCERT Support", color: "bg-purple-50 text-purple-600", id: 8 },
    { name: "Hindi", slug: "hindi", icon: <Languages className="w-5 h-5" />, focus: "Varnamala, Grammar, Reading, Board Curriculum", color: "bg-orange-50 text-orange-600", id: 9 },
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
                        <ScrollReveal key={s.id} delay={i * 0.05}>
                            <Link 
                                href={`/tuition/tuition-by-subject/${s.slug}`}
                                className="p-5 rounded-xl bg-white border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100/60 hover:border-primary/30 transition-all duration-300 flex items-start gap-4 group cursor-pointer"
                            >
                                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                                    {s.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-primary transition-colors mb-0.5">
                                        {s.name} Tuition
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{s.focus}</p>
                                    <span className="text-[11px] text-primary font-semibold mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                                        Explore 1:1 classes &rarr;
                                    </span>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
