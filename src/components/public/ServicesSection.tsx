'use client';
import { Tablet, Video, LineChart, ShieldCheck } from 'lucide-react';

const services = [
    {
        title: "1:1 Digital Mentorship",
        desc: "Personalized online classes focused purely on the individual student's learning trajectory.",
        icon: <Video />,
        id: 1
    },
    {
        title: "Academic Analysis",
        desc: "Regular diagnostic testing and monthly analytical reports to track core comprehension.",
        icon: <LineChart />,
        id: 2
    },
    {
        title: "Entrance Specialization",
        desc: "Focused coaching for SSLC, CBSE, ICSE boards and medical/engineering entry corridors.",
        icon: <Tablet />,
        id: 3
    },
    {
        title: "Security Verified",
        desc: "A strictly audited digital learning ecosystem with background-verified professional tutors.",
        icon: <ShieldCheck />,
        id: 4
    }
];

export default function ServicesSection() {
    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6 text-center mb-20">
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Core Deliverables</p>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">The Academy <span className="text-primary">Services.</span></h2>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                {services.map((s) => (
                    <div key={s.id} className="bg-gray-50/50 p-12 rounded-[4rem] border border-gray-100 group hover:bg-white hover:shadow-2xl hover:shadow-gray-200/40 transition-all flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="w-16 h-16 bg-primary text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-6 transition-all">
                            {s.icon}
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">{s.title}</h3>
                            <p className="text-gray-500 font-bold leading-relaxed italic">{s.desc}</p>
                            <div className="pt-2">
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10 italic">Premium Enrollment Track</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
