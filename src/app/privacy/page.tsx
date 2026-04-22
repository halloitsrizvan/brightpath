'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { ShieldCheck, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
            <PublicNavbar />

            {/* Header Section */}
            <section className="relative pt-40 pb-20 bg-gray-900 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 mb-6">
                        Institutional Registry
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight mb-4">
                        Privacy <span className="text-primary">Policy.</span>
                    </h1>
                    <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">Last Updated: April 2026 | Brightpath Academy Core</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="space-y-16">
                        <PolicySection 
                            icon={<ShieldCheck className="w-6 h-6" />}
                            title="Introduction"
                            content="At Brightpath Learning (referred to as 'the Academy', 'we', 'us', or 'our'), we prioritize the privacy and safety of our students and parents. This Privacy Policy outlines how we collect, store, and utilize your personal information when you interact with our online tuition platform."
                        />

                        <PolicySection 
                            icon={<Lock className="w-6 h-6" />}
                            title="Information We Collect"
                            content="We collect essential data to provide high-quality mentorship, including: student names, parental contact details (Phone/WhatsApp), email addresses, academic boards, and current grade levels. This information is exclusively used for matching students with appropriate mentors and scheduling demo sessions."
                        />

                        <PolicySection 
                            icon={<Eye className="w-6 h-6" />}
                            title="Data Security"
                            content="Your personal data is protected by industry-standard encryption protocols. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Access to student records is strictly limited to authorized academic counselors and assigned tutors."
                        />

                        <PolicySection 
                            icon={<FileText className="w-6 h-6" />}
                            title="Usage of Data"
                            content="Collected information is utilized to: personalize the learning experience, process enquiries, send academic progress reports, and communicate regarding schedule changes or technical support requirements."
                        />

                        <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 italic">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4">Questions regarding policy?</h3>
                            <p className="text-gray-500 font-medium mb-6">If you have any concerns about how your data is handled, please contact our Legal Compliance Department at legal@brightpatheduvora.com</p>
                            <button className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                                Contact Privacy Officer <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function PolicySection({ icon, title, content }: { icon: any, title: string, content: string }) {
    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                {icon}
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{title}</h2>
                <p className="text-gray-500 font-bold italic leading-relaxed text-sm md:text-base">
                    {content}
                </p>
            </div>
        </div>
    );
}
