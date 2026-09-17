import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { 
    GraduationCap, 
    UserCircle, 
    BarChart3, 
    Calendar, 
    ClipboardCheck, 
    Wallet, 
    Monitor
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Our System",
    description: "Explore the Brightpath digital ecosystem. Real-time progress tracking, task management, and structured 1:1 online classrooms.",
    alternates: {
        canonical: '/our-system',
    },
};

export default function OurSystemPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Hero */}
            <section className="pt-32 pb-16 bg-surface border-b border-gray-100">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">How It Works</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-display leading-tight mb-4">
                        The BrightPath <span className="text-primary">Platform</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        A purpose-built digital platform providing complete transparency and tools for students, parents, and tutors.
                    </p>
                </div>
            </section>

            {/* Portal Cards */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Student & Parent Portal */}
                        <div className="p-8 bg-white rounded-2xl border border-gray-100/80 shadow-lg shadow-gray-100/40 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 font-display">Student & Parent Portal</h2>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Full visibility into your child&apos;s academic journey — from progress reports to class schedules.
                            </p>
                            <div className="space-y-4 pt-4 border-t border-gray-100/80">
                                <SystemPoint icon={<BarChart3 className="w-4 h-4" />} title="Progress Tracking" desc="View real-time academic growth and performance data." />
                                <SystemPoint icon={<ClipboardCheck className="w-4 h-4" />} title="Assignments & Tasks" desc="Access homework, assignments, and submitted work." />
                                <SystemPoint icon={<Calendar className="w-4 h-4" />} title="Smart Scheduling" desc="Interactive calendar with automated class reminders." />
                            </div>
                        </div>

                        {/* Teacher Portal */}
                        <div className="p-8 bg-white rounded-2xl border border-gray-100/80 shadow-lg shadow-gray-100/40 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-secondary/20 text-amber-600 rounded-lg flex items-center justify-center">
                                    <UserCircle className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 font-display">Teacher Portal</h2>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Professional tools for tutors to manage classes, track attendance, and deliver quality education.
                            </p>
                            <div className="space-y-4 pt-4 border-t border-gray-100/80">
                                <SystemPoint icon={<ClipboardCheck className="w-4 h-4" />} color="text-amber-600" title="Attendance Tracking" desc="One-click attendance for every session." />
                                <SystemPoint icon={<Wallet className="w-4 h-4" />} color="text-amber-600" title="Earnings Dashboard" desc="Transparent salary tracking and payment history." />
                                <SystemPoint icon={<Monitor className="w-4 h-4" />} color="text-amber-600" title="Digital Classroom" desc="Integrated tools for seamless online instruction." />
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

function SystemPoint({ icon, title, desc, color = "text-primary" }: { icon: React.ReactNode, title: string, desc: string, color?: string }) {
    return (
        <div className="flex gap-3 items-start">
            <div className={`${color} mt-0.5 shrink-0`}>{icon}</div>
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
