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
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-6 text-center mb-12">
                <p className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Academic Modules</p>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">The Subjects <span className="text-secondary">Spectrum.</span></h2>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((s) => (
                    <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-primary/10 transition-all group overflow-hidden relative flex flex-col justify-between min-h-[180px]">
                        <div className="absolute top-0 right-0 w-1/3 h-full transition-opacity">
                             <div className="relative w-full h-full">
                                <Image src={s.img} alt={s.name} fill className="object-cover transition-all duration-700" />
                             </div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className={`w-12 h-12 ${s.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg rotate-3 group-hover:rotate-6 transition-all`}>
                                {s.icon}
                            </div>
                            <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter mb-2 leading-none">{s.name}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed max-w-[70%]">{s.focus}</p>
                        </div>
                        
                        <div className="mt-6 flex items-center gap-2 relative z-10">
                            <span className="w-8 h-1 bg-gray-100 rounded-full" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">1:1 Specialized Track</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
