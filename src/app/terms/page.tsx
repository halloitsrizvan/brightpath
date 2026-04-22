'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { FileWarning, ScrollText, Scale, Handshake, ChevronRight } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-secondary/10 selection:text-secondary">
            <PublicNavbar />

            {/* Header Section */}
            <section className="relative pt-40 pb-20 bg-gray-900 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/10 -skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 mb-6">
                        Governance Framework
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight mb-4">
                        Usage <span className="text-secondary">Terms.</span>
                    </h1>
                    <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">Last Updated: April 2026 | Academic Standards</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="space-y-16">
                        <TermsSection 
                            icon={<Scale className="w-6 h-6" />}
                            title="Acceptance of Terms"
                            content="By accessing or using the Brightpath Eduvora platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site. These terms apply to all visitors, users, and others who access or use the Service."
                        />

                        <TermsSection 
                            icon={<ScrollText className="w-6 h-6" />}
                            title="Services Provided"
                            content="Brightpath provides individualized online tutoring services. While we strive for academic excellence, results depend significantly on the student's cooperation and consistency. We reserve the right to modify or discontinue any aspect of our services without prior notice."
                        />

                        <TermsSection 
                            icon={<Handshake className="w-6 h-6" />}
                            title="User Responsibilities"
                            content="Users are responsible for maintaining a stable internet connection for sessions and ensuring a quiet learning environment. Tutors deserve a respectful workspace; any form of harassment or inappropriate behavior will lead to immediate termination of services without refund."
                        />

                        <TermsSection 
                            icon={<FileWarning className="w-6 h-6" />}
                            title="Limitation of Liability"
                            content="In no event shall Brightpath or its mentors be liable for any indirect, incidental, or consequential damages arising out of your use or inability to use our services. Our maximum liability shall not exceed the fees paid by you for the specific session in question."
                        />

                        <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 italic text-center">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4">Standard Institutional Agreement</h3>
                            <p className="text-gray-500 font-medium mb-6">For detailed institutional contracts or B2B partnership terms, please request our Governance PDF.</p>
                            <div className="flex justify-center">
                                <button className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-xs border-b-2 border-secondary/20 hover:border-secondary transition-all pb-1">
                                    Download Full Framework <ChevronRight className="w-4 h-4" />
                                </button>
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

function TermsSection({ icon, title, content }: { icon: any, title: string, content: string }) {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-14 h-14 bg-secondary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                {icon}
            </div>
            <div className="space-y-4 text-left">
                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{title}</h2>
                <p className="text-gray-500 font-bold italic leading-relaxed text-sm md:text-base">
                    {content}
                </p>
            </div>
        </div>
    );
}
