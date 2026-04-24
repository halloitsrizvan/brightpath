'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { 
    Layout, 
    UserCircle, 
    GraduationCap, 
    BarChart3, 
    Calendar, 
    ClipboardCheck, 
    Wallet, 
    ShieldCheck,
    Smartphone,
    Monitor,
    ChevronRight
} from 'lucide-react';

export default function OurSystemPage() {
    return (
        <div className="min-h-screen bg-white selection:bg-primary/10">
            <PublicNavbar />

            {/* Simple Hero Section */}
            <section className="pt-44 pb-20 bg-gray-50 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        System Overview
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 italic uppercase tracking-tighter leading-none mb-6">
                        Brightpath <span className="text-primary italic">Ecosystem.</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-bold italic leading-relaxed">
                        A specialized digital infrastructure providing complete transparency and efficiency for students, parents, and mentors.
                    </p>
                </div>
            </section>

            {/* Integrated Systems Grid */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Student & Parent Portal */}
                        <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Student & Parent Portal</h2>
                            </div>
                            <p className="text-sm text-gray-500 font-bold italic leading-relaxed">
                                Our student-facing system is built to provide maximum visibility into the academic journey.
                            </p>
                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <SystemPoint icon={<BarChart3 />} title="Progress Tracking" desc="View real-time academic growth and performance matrices." />
                                <SystemPoint icon={<ClipboardCheck />} title="Task Management" desc="Direct access to assignments and submitted projects." />
                                <SystemPoint icon={<Calendar />} title="Smart Scheduling" desc="Interactive calendar with automated class reminders." />
                            </div>
                        </div>

                        {/* Teacher Portal */}
                        <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                                    <UserCircle className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Professional Teacher Portal</h2>
                            </div>
                            <p className="text-sm text-gray-500 font-bold italic leading-relaxed">
                                Empowers mentors with specialized tools for administrative and academic management.
                            </p>
                            <div className="space-y-4 pt-4 border-t border-gray-50">
                                <SystemPoint icon={<ClipboardCheck />} color="text-secondary" title="Attendance Registry" desc="One-click attendance tracking for every academic session." />
                                <SystemPoint icon={<Wallet />} color="text-secondary" title="Salary Management" desc="Financial transparency with real-time earnings tracking." />
                                <SystemPoint icon={<Monitor />} color="text-secondary" title="Digital Classroom" desc="Integrated tools for seamless online instruction delivery." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

       
           
           
            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function SystemPoint({ icon, title, desc, color = "text-primary" }: { icon: any, title: string, desc: string, color?: string }) {
    return (
        <div className="flex gap-4 items-start group">
            <div className={`${color} mt-1 shrink-0`}>{icon}</div>
            <div className="space-y-1">
                <h4 className="text-sm font-black text-gray-900 uppercase italic tracking-widest">{title}</h4>
                <p className="text-[11px] text-gray-400 font-bold italic leading-none">{desc}</p>
            </div>
        </div>
    );
}
