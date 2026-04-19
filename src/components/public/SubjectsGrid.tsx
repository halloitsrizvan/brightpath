'use client';
import { Atom, Calculator, Microscope, PenTool, Globe, Music, FlaskConical, Languages } from 'lucide-react';
import Image from 'next/image';

const subjects = [
    { name: "Mathematics", icon: <Calculator />, color: "bg-primary", focus: "Algebra, Calculus, Geometry", id: 1, img: "/sub-2.png" },
    { name: "Physics", icon: <Atom />, color: "bg-violet-600", focus: "Mechanics, Optics, Nuclear", id: 2, img: "/sub-3.png" },
    { name: "Chemistry", icon: <FlaskConical />, color: "bg-teal-600", focus: "Organic, Inorganic, Physical", id: 3, img: "/sub-4.png" },
    { name: "Biology", icon: <Microscope />, color: "bg-green-600", focus: "Botany, Zoology, Genetics", id: 4, img: "/sub-5.png" },
    { name: "English", icon: <Languages />, color: "bg-secondary", focus: "Literature, Grammar, Communication", id: 5, img: "/sub-6.png" },
    { name: "Social Studies", icon: <Globe />, color: "bg-amber-600", focus: "History, Civics, Geography", id: 6, img: "/sub-7.png" },
];

export default function SubjectsGrid() {
    return (
        <section className="py-24 bg-gray-50/30">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-widest border border-secondary/20 mb-4">
                        Academic Modules
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                        The Subjects <span className="text-secondary border-b-4 border-primary/20">Spectrum.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((s) => (
                        <div key={s.id} className="relative p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-500 group overflow-hidden flex flex-col justify-between min-h-[200px]">
                            {/* Graphic Background */}
                            <div className="absolute top-0 right-0 w-2/5 h-full opacity-[0.15] group-hover:opacity-30 transition-all duration-700 pointer-events-none">
                                <Image src={s.img} alt={s.name} fill className="object-cover scale-110 group-hover:scale-125 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-l from-white via-white/40 to-transparent" />
                            </div>

                            <div className="relative z-10">
                                <div className={`w-12 h-12 ${s.color} text-white rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-gray-200 rotate-3 group-hover:rotate-6 transition-transform`}>
                                    {s.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter mb-2 leading-none">{s.name}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] leading-relaxed max-w-[75%]">{s.focus}</p>
                            </div>

                            <div className="mt-6 flex items-center gap-2 relative z-10 pt-4 border-t border-gray-50">
                                <span className="w-8 h-[2px] bg-primary/20 rounded-full" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">1:1 Specialized Track</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
