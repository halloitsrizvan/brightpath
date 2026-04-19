'use client';
import { useSearchParams, useParams } from 'next/navigation';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import Testimonials from '@/components/public/Testimonials';
import PublicFAQ from '@/components/public/FAQ';
import FloatingContact from '@/components/public/FloatingContact';
import { CheckCircle2, ShieldCheck, Star, Users, Clock, BookOpen, ArrowRight, Video, Target, HelpCircle, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import api from '@/utils/api';

export default function TuitionClassPage() {
    const params = useParams();
    const category = (params?.category as string) || '';
    const slug = (params?.slug as string) || '';
    
    // Clean up the name for display (e.g., class-10 -> Class 10)
    const displayName = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Academic';
    const isClassPage = category.includes('class');

    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        userType: 'parent',
        studentName: '',
        parentName: '',
        email: '',
        country: 'India',
        phone: '',
        whatsapp: '',
        class: slug.replace(/-/g, ' '),
        board: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        try {
            await api.post('/public-enquiries', {
                ...formData,
                source: `Tuition Page: ${displayName}`,
                category: category
            });
            setFormStatus('success');
        } catch (error) {
            console.error("Form submission failed", error);
            setFormStatus('idle');
            alert("Submission failed. Please try again or contact us via WhatsApp.");
        }
    };

    return (
        <div suppressHydrationWarning className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary relative">
             {/* Premium Background Blooms */}
             <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#45308D]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-[#FDC70B]/5 rounded-full blur-[120px]" />
            </div>

            <PublicNavbar />

            {/* Hero Section with Form */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden border-b border-gray-100/50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                <Trophy className="w-3 h-3 fill-primary" /> Specialized {displayName} Mentorship
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter uppercase italic">
                                Master <span className="text-primary">{displayName}</span><br />
                                with Kerala's <span className="text-secondary">Elite.</span>
                            </h1>
                            <p className="text-base md:text-lg text-gray-500 font-bold max-w-xl leading-relaxed italic">
                                Tailored 1:1 online tuition designed specifically for {displayName} curriculum. Build a rock-solid foundation and achieve academic excellence with Kerala's most trusted mentors.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">100% 1:1 Focus</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Individual Roadmap</span>
                                </div>
                            </div>
                        </div>

                        {/* Enquiry Form */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] rotate-3 scale-105" />
                            <div className="relative bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100">
                                {formStatus === 'success' ? (
                                    <div className="py-12 text-center space-y-4">
                                        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Request Received!</h3>
                                        <p className="text-gray-500 font-bold italic">Our academic counselor will contact you shortly.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 mb-1">Book a Free Session</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience the Brightpath difference today</p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">I am a</label>
                                                    <select 
                                                        required 
                                                        value={formData.userType}
                                                        onChange={(e) => setFormData({...formData, userType: e.target.value})}
                                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 text-gray-800"
                                                    >
                                                        <option value="parent">Parent</option>
                                                        <option value="student">Student</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Board</label>
                                                    <select 
                                                        required 
                                                        value={formData.board}
                                                        onChange={(e) => setFormData({...formData, board: e.target.value})}
                                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 text-gray-800"
                                                    >
                                                        <option value="">Select Board</option>
                                                        <option>CBSE</option>
                                                        <option>ICSE</option>
                                                        <option>State</option>
                                                        <option>IGCSE</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <input 
                                                    required 
                                                    value={formData.studentName}
                                                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-800" 
                                                    placeholder="Student Name" 
                                                />
                                                <input 
                                                    required 
                                                    value={formData.parentName}
                                                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-800" 
                                                    placeholder="Parent Name" 
                                                />
                                            </div>

                                            <input 
                                                required 
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-800" 
                                                placeholder="Email Address" 
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Phone</label>
                                                    <input 
                                                        required 
                                                        type="tel" 
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 text-gray-800" 
                                                        placeholder="+91 Number" 
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">WhatsApp</label>
                                                    <input 
                                                        required 
                                                        type="tel" 
                                                        value={formData.whatsapp}
                                                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 text-gray-800" 
                                                        placeholder="Number" 
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                disabled={formStatus === 'submitting'}
                                                className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                            >
                                                {formStatus === 'submitting' ? 'Processing...' : 'Secure My Free Demo'}
                                            </button>
                                            <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">No credit card required. 100% Free commitment.</p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Success with Online Tuition */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/10">The Success Formula</div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                            Improve Your Child's Success <br /><span className="text-primary border-b-4 border-secondary/30">with Our Online Tuition.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <SuccessCard icon={<Target className="w-6 h-6" />} title="Goal Oriented" desc="We align every session with specific academic milestones for your child." />
                        <SuccessCard icon={<Video className="w-6 h-6" />} title="Live Interaction" desc="Real-time, face-to-face mentorship that feels just like a physical classroom." />
                        <SuccessCard icon={<Star className="w-6 h-6" />} title="Elite Pedagogy" desc="Our teaching methods are research-backed and result-driven." />
                    </div>
                </div>
            </section>

            {/* Section: Why Choose Brightpath */}
            <section className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 relative">
                             <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden aspect-[4/3]">
                                <Image src="/banner1.jpg" alt="Excellence" fill className="object-cover" />
                             </div>
                        </div>
                        <div className="lg:w-1/2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-widest border border-secondary/20">The Academy Distinction</div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                                Why Choose Brightpath <br /><span className="text-secondary">for {displayName}.</span>
                            </h2>
                            <p className="text-base text-gray-500 font-medium leading-relaxed italic">We don't just teach subjects; we build cognitive resilience and passion for learning through a unique 1:1 framework.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                <WhyPoint icon={<Users />} title="1:1 Exclusivity" />
                                <WhyPoint icon={<ShieldCheck />} title="Verified Experts" />
                                <WhyPoint icon={<Clock />} title="Extreme Flexibility" />
                                <WhyPoint icon={<BookOpen />} title="Custom Curriculum" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Problems We Solve */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-7xl text-center">
                    <div className="mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/10">Bridging the Gaps</div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                            Problems We Solve for <br /><span className="text-primary border-b-4 border-secondary/30">{displayName} Students.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ProblemCard title="Learning Anxiety" desc="We remove the fear of difficult subjects through patient, one-on-one guidance." />
                        <ProblemCard title="Lack of Foundation" desc="We reconstruct missing basics to ensure advanced concepts are fully understood." />
                        <ProblemCard title="Exam Strategy" desc="We teach time management and analytical thinking skills for top grades." />
                        <ProblemCard title="Parental Worry" desc="We provide total transparency through real-time communication and monthly reports." />
                    </div>
                </div>
            </section>

            {/* Section: How It Works */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 skew-x-12 translate-x-1/4" />
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">The Workflow</div>
                        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                            How Our {displayName} <br /><span className="text-secondary">Tuition Works.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <StepCard number="01" title="Free Assessment" desc="We evaluate your child's current level and specific learning requirements." />
                        <StepCard number="02" title="Mentor Pairing" desc="We match them with the perfect subject specialist for their personality." />
                        <StepCard number="03" title="Custom Roadmap" desc="A personalized curriculum is created targeting weak areas and goals." />
                        <StepCard number="04" title="Mastery & Growth" desc="Regular 1:1 sessions begin with continuous monitoring and reports." />
                    </div>
                </div>
            </section>

            <Testimonials />
            <PublicFAQ />
            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function SuccessCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 text-center space-y-4">
            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">{icon}</div>
            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">{title}</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-relaxed">{desc}</p>
        </div>
    );
}

function WhyPoint({ icon, title }: { icon: any, title: string }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm">
            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">{icon}</div>
            <span className="text-[11px] font-black text-gray-800 uppercase tracking-widest">{title}</span>
        </div>
    );
}

function ProblemCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300 text-left space-y-3">
            <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">{title}</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-relaxed italic">{desc}</p>
        </div>
    );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="relative space-y-4 text-center md:text-left">
            <div className="text-6xl font-black text-white/10 italic leading-none absolute -top-4 -left-4 md:-left-8">{number}</div>
            <h3 className="relative z-10 text-xl font-black uppercase italic tracking-tighter text-white">{title}</h3>
            <p className="text-sm text-white/50 font-medium italic leading-relaxed">{desc}</p>
        </div>
    );
}
