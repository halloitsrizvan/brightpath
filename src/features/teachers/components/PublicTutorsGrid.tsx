import { Award, GraduationCap, Star } from 'lucide-react';
import Image from 'next/image';

export default function PublicTutorsGrid({ tutors, limited = false }: { tutors: any[], limited?: boolean }) {
    const displayTutors = limited ? tutors?.slice(0, 3) : tutors;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayTutors.map((t) => (
                        <div key={t._id} className="bg-white p-6 rounded-xl border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 mb-4 overflow-hidden border-2 border-white shadow-sm relative">
                                <Image src={t.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} alt={t.name} fill unoptimized />
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />
                                ))}
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">{t.name}</h3>
                            <p className="text-xs text-primary font-medium mb-4">{Array.isArray(t.subjects) ? t.subjects.map((s: any) => s.subjectName || s).join(' & ') : t.subject}</p>
                            
                            <div className="w-full h-px bg-gray-100 mb-4" />
                            
                            <div className="grid grid-cols-2 gap-4 w-full text-left">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <Award className="w-3 h-3 text-primary" />
                                        <span className="text-[10px] text-gray-400">Experience</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-700">{t.experience || '10+ Years'}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <GraduationCap className="w-3 h-3 text-amber-500" />
                                        <span className="text-[10px] text-gray-400">Qualifications</span>
                                    </div>
                                    <p className="text-xs font-medium text-gray-700">{t.qualifications || 'M.Sc. B.Ed'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
