'use client';
import { Atom, Calculator, Microscope, PenTool, Globe, Music, FlaskConical, Languages } from 'lucide-react';

const subjects = [
    { name: "Mathematics", icon: <Calculator />, color: "bg-primary", focus: "Algebra, Calculus, Geometry", id: 1 },
    { name: "Physics", icon: <Atom />, color: "bg-violet-600", focus: "Mechanics, Optics, Nuclear", id: 2 },
    { name: "Chemistry", icon: <FlaskConical />, color: "bg-teal-600", focus: "Organic, Inorganic, Physical", id: 3 },
    { name: "Biology", icon: <Microscope />, color: "bg-green-600", focus: "Botany, Zoology, Genetics", id: 4 },
    { name: "English", icon: <Languages />, color: "bg-secondary", focus: "Literature, Grammar, Communication", id: 5 },
    { name: "Social Studies", icon: <Globe />, color: "bg-amber-600", focus: "History, Civics, Geography", id: 6 },
];

export default function SubjectsGrid() {
    return (
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-6 text-center mb-12">
                <p className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Academic Modules</p>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">The Subjects <span className="text-secondary">Spectrum.</span></h2>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((s) => (
                    <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-primary/10 transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${s.color} opacity-5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform`} />
                        <div className={`w-12 h-12 ${s.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg rotate-3 group-hover:rotate-6 transition-all`}>
                            {s.icon}
                        </div>
                        <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter mb-2 leading-none">{s.name}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">{s.focus}</p>
                        
                        <div className="mt-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-gray-100 rounded-full" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">1:1 Specialized Track</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
