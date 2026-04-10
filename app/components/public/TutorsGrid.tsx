'use client';
import { Award, GraduationCap, Star } from 'lucide-react';
import Image from 'next/image';

const tutors = [
    {
        name: "Dr. Vinod Kumar",
        subject: "Physics & Mathematics",
        exp: "15+ Years",
        qual: "Ph.D. in Applied Physics",
        id: 1
    },
    {
        name: "Ms. Reshma Nair",
        subject: "Biological Sciences",
        exp: "10+ Years",
        qual: "M.Sc. B.Ed",
        id: 2
    },
    {
        name: "Mr. Abraham John",
        subject: "Chemistry & NEET Prep",
        exp: "12+ Years",
        qual: "M.Sc. Chemistry",
        id: 3
    }
];

export default function TutorsGrid({ limited = false }: { limited?: boolean }) {
    const displayTutors = limited ? tutors.slice(0, 3) : tutors;

    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6 text-center mb-20">
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Elite Mentors</p>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">The Academy <span className="text-primary">Faculty.</span></h2>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {displayTutors.map((t) => (
                    <div key={t.id} className="group relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-[3.5rem] rotate-3 group-hover:rotate-6 transition-all duration-500" />
                        <div className="relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-[2rem] bg-gray-100 mb-6 overflow-hidden border-4 border-white shadow-lg relative">
                                <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.id + 100}`} alt={t.name} fill unoptimized />
                            </div>
                            <div className="flex gap-1 mb-4">
                                <Star className="w-3 h-3 fill-secondary text-secondary" />
                                <Star className="w-3 h-3 fill-secondary text-secondary" />
                                <Star className="w-3 h-3 fill-secondary text-secondary" />
                                <Star className="w-3 h-3 fill-secondary text-secondary" />
                                <Star className="w-3 h-3 fill-secondary text-secondary" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter leading-none mb-2">{t.name}</h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-6">{t.subject}</p>
                            
                            <div className="w-full h-px bg-gray-50 mb-6" />
                            
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="text-left">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Award className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Experience</span>
                                    </div>
                                    <p className="text-xs font-black text-gray-700 italic">{t.exp}</p>
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Credentials</span>
                                    </div>
                                    <p className="text-xs font-black text-gray-700 italic">{t.qual}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
