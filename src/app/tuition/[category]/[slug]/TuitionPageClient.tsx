'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import Testimonials from '@/components/public/Testimonials';
import PublicFAQ from '@/components/public/FAQ';
import FloatingContact from '@/components/public/FloatingContact';
import ScrollReveal from '@/components/public/ScrollReveal';
import { CheckCircle2, Star, Users, Clock, BookOpen, Video, Trophy, GraduationCap, Target, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import api from '@/utils/api';

interface TuitionPageClientProps {
    category: string;
    slug: string;
}

export default function TuitionPageClient({ category, slug }: TuitionPageClientProps) {
    const displayName = slug 
        ? slug
            .replace(/(\d)-(\d)/g, '$1_RANGE_$2') 
            .replace(/-/g, ' ')
            .replace(/_RANGE_/g, '-')
            .replace(/\b\w/g, l => l.toUpperCase()) 
        : 'Academic';
    const isLocationPage = category === 'tuition-by-location';

    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        userType: 'parent',
        studentName: '',
        parentName: '',
        email: '',
        country: 'India',
        phone: '',
        whatsapp: '',
        class: slug.replace(/(\d)-(\d)/g, '$1_RANGE_$2').replace(/-/g, ' ').replace(/_RANGE_/g, '-'),
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
        <div suppressHydrationWarning className="min-h-screen bg-white relative">
            <PublicNavbar />

            {isLocationPage ? (
                <>
                    {/* Location Hero Banner */}
                    <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                        <Image src="/loc-banner.png" alt="Education" fill className="object-cover brightness-[0.35]" priority />
                        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white font-display leading-tight mb-6">
                                Best Online Tuition in <span className="text-secondary">{displayName}</span> – One-on-One Classes for CBSE, ICSE & State Boards
                            </h1>
                            <button onClick={() => {document.getElementById('enquiry-form')?.scrollIntoView({behavior: 'smooth'})}} className="px-7 py-4 bg-primary text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all">
                                Book Free Demo
                            </button>
                        </div>
                    </section>

                    {/* Services Grid */}
                    <section id="enquiry-form" className="py-20 bg-white">
                        <div className="container mx-auto px-6 max-w-5xl">
                            <ScrollReveal>
                                <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-6">
                                    <div className="lg:w-1/2">
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                                            The best <span className="text-primary">online tuition</span> services
                                        </h2>
                                    </div>
                                    <div className="lg:w-1/2">
                                        <p className="text-gray-500 leading-relaxed">
                                            BrightPath offers personalized one-to-one online tuition in {displayName} for classes 1-12 across CBSE, State & ICSE boards. Build a strong foundation with our expert tutors.
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <BenefitCard icon={<GraduationCap className="w-5 h-5" />} color="bg-violet-50 text-violet-600" title="Quality Courses" desc="Expertly designed courses ensuring deep, practical understanding of every subject." />
                                <BenefitCard icon={<Users className="w-5 h-5" />} color="bg-primary/10 text-primary" title="Individual Attention" desc="Personalized lessons tailored to each student's unique learning style and pace." />
                                <BenefitCard icon={<Video className="w-5 h-5" />} color="bg-blue-50 text-blue-600" title="Blended Learning" desc="Live online tutoring combined with self-paced resources for flexible learning." />
                            </div>
                        </div>
                    </section>

                    {/* Truly Works */}
                    <section className="py-20 bg-surface">
                        <ScrollReveal>
                            <div className="container mx-auto px-6 max-w-3xl text-center">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight mb-4">
                                    Online tuition in <span className="text-primary">{displayName}</span> that actually works
                                </h2>
                                <p className="text-gray-500 leading-relaxed">
                                    We bridge the gap between classroom teaching and individual needs. Our approach ensures no student is left behind, focusing on conceptual clarity and confidence building.
                                </p>
                            </div>
                        </ScrollReveal>
                    </section>

                    {/* Why Popular */}
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-6 max-w-5xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <ScrollReveal direction="left">
                                    <div>
                                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Growing Trend</p>
                                        <h2 className="text-3xl font-extrabold text-gray-900 font-display leading-tight mb-4">
                                            Why online tuition is popular in <span className="text-primary">{displayName}</span>
                                        </h2>
                                        <p className="text-gray-500 leading-relaxed">
                                            Parents in {displayName} are choosing online tuition for its convenience and proven results.
                                        </p>
                                    </div>
                                </ScrollReveal>
                                <ScrollReveal direction="right">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            "No travel; learn from home",
                                            "Flexible timing",
                                            "One-on-one attention",
                                            "Access better teachers",
                                            "Saves time and energy"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-gray-100/80">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                                <span className="text-sm font-medium text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </section>

                    {/* 7 Points */}
                    <section className="py-20 bg-surface">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <ScrollReveal>
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Why BrightPath</p>
                                <h2 className="text-3xl font-extrabold text-gray-900 font-display leading-tight mb-10">
                                    What makes BrightPath the best online tuition in <span className="text-primary">{displayName}</span>
                                </h2>
                            </ScrollReveal>

                            <div className="space-y-6">
                                <PointCard num="01" title="One-on-One Personal Attention" desc={`Every student learns differently. Our tutors work one-on-one with students in ${displayName}, starting with a skill check to understand strengths and areas for improvement.`} />
                                <PointCard num="02" title="Customized Learning Plan" desc="We identify weak areas, learning pace, and exam goals. Based on this, we create a focused study plan for maximum growth." />
                                <PointCard num="03" title="Building Confidence" desc={`Our sessions don't just help students learn — they build confidence. When students understand clearly and feel supported, they believe in themselves more.`} />
                                <PointCard num="04" title="All Boards Covered" desc="We support CBSE, State Board, ICSE, and IGCSE. Teaching is strictly aligned with school curriculum while pushing for deeper understanding." />
                                <PointCard num="05" title="Flexible Timings" desc={`Classes scheduled at your convenience. Students in ${displayName} can learn from home without the stress of travel.`} />
                                <PointCard num="06" title="Regular Progress Tracking" desc="Weekly assessments, detailed performance reports, and regular parent-teacher updates ensure measurable progress." />
                                <PointCard num="07" title="Complete Study Materials" desc="Well-planned materials covering school syllabus and exam requirements, helping students revise better and prepare smarter." />
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* Standard Hero with Form */}
                    <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-24 border-b border-gray-100">
                        <div className="container mx-auto px-6 max-w-6xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                <ScrollReveal direction="left">
                                    <div className="space-y-6 pt-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-medium border border-primary/10">
                                            <Trophy className="w-3 h-3 fill-primary" /> {displayName} Tuition
                                        </div>
                                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 font-display leading-tight">
                                            Master <span className="text-primary">{displayName}</span> with Kerala&apos;s best tutors
                                        </h1>
                                        <p className="text-gray-500 leading-relaxed max-w-lg">
                                            Tailored 1:1 online tuition designed specifically for {displayName} curriculum. Build a strong foundation with our most trusted mentors.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-gray-100/80">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-xs font-medium text-gray-600">100% 1:1 Focus</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-gray-100/80">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-xs font-medium text-gray-600">Personal Roadmap</span>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>

                                {/* Enquiry Form */}
                                <div className="bg-white p-7 rounded-2xl shadow-lg shadow-gray-100/60 border border-gray-100/80">
                                    {formStatus === 'success' ? (
                                        <div className="py-10 text-center space-y-3">
                                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center mx-auto">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 font-display">Request Received!</h3>
                                            <p className="text-sm text-gray-500">Our team will contact you shortly.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-6">
                                                <h3 className="text-xl font-bold text-gray-900 font-display mb-1">Book a Free Session</h3>
                                                <p className="text-xs text-gray-400">Experience the BrightPath difference</p>
                                            </div>
                                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-500">I am a</label>
                                                        <select required value={formData.userType} onChange={(e) => setFormData({...formData, userType: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary/40 focus:bg-white text-gray-800 outline-none">
                                                            <option value="parent">Parent</option>
                                                            <option value="student">Student</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-500">Board</label>
                                                        <select required value={formData.board} onChange={(e) => setFormData({...formData, board: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary/40 focus:bg-white text-gray-800 outline-none">
                                                            <option value="">Select Board</option>
                                                            <option>CBSE</option>
                                                            <option>ICSE</option>
                                                            <option>State</option>
                                                            <option>IGCSE</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <input required value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary/40 focus:bg-white" placeholder="Student Name" />
                                                    <input required value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary/40 focus:bg-white" placeholder="Parent Name" />
                                                </div>

                                                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary/40 focus:bg-white" placeholder="Email Address" />

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-500">Phone</label>
                                                        <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary/40 focus:bg-white" placeholder="+91 Number" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-500">WhatsApp</label>
                                                        <input required type="tel" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-primary/40 focus:bg-white" placeholder="Number" />
                                                    </div>
                                                </div>

                                                <button disabled={formStatus === 'submitting'} className="w-full py-3.5 bg-primary text-white font-semibold text-sm rounded-lg shadow-md shadow-primary/15 hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-50">
                                                    {formStatus === 'submitting' ? 'Submitting...' : 'Book Free Demo'}
                                                </button>
                                                <p className="text-xs text-center text-gray-400">No credit card required. Completely free.</p>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Success Cards */}
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-6 max-w-5xl">
                            <ScrollReveal>
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                                        Improve your child&apos;s success with <span className="text-primary">personalized tuition</span>
                                    </h2>
                                </div>
                            </ScrollReveal>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SuccessCard icon={<Target className="w-5 h-5" />} title="Goal Oriented" desc="Every session aligned with specific academic milestones." />
                                <SuccessCard icon={<Video className="w-5 h-5" />} title="Live Interaction" desc="Real-time, face-to-face mentorship that feels personal." />
                                <SuccessCard icon={<Star className="w-5 h-5" />} title="Proven Methods" desc="Research-backed teaching methods that deliver results." />
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Why Choose BrightPath (shared) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal direction="left">
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                                <Image src="/why-choose.png" alt="Why choose BrightPath" fill className="object-cover" />
                            </div>
                        </ScrollReveal>
                        <ScrollReveal direction="right">
                            <div className="space-y-5">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Why BrightPath</p>
                                <h2 className="text-3xl font-extrabold text-gray-900 font-display leading-tight">
                                    Why choose BrightPath for <span className="text-primary">{displayName}</span>
                                </h2>
                                <p className="text-gray-500 leading-relaxed">We don&apos;t just teach subjects — we build understanding, confidence, and a love for learning through our 1:1 approach.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <WhyPoint icon={<Users className="w-4 h-4" />} title="1:1 Sessions" />
                                    <WhyPoint icon={<ShieldCheck className="w-4 h-4" />} title="Verified Tutors" />
                                    <WhyPoint icon={<Clock className="w-4 h-4" />} title="Flexible Timing" />
                                    <WhyPoint icon={<BookOpen className="w-4 h-4" />} title="Custom Curriculum" />
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Problems We Solve */}
            <section className="py-20 bg-surface">
                <div className="container mx-auto px-6 max-w-5xl">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight">
                                Challenges we help <span className="text-primary">{displayName}</span> students overcome
                            </h2>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <ProblemCard title="Learning Anxiety" desc="We remove the fear of difficult subjects through patient, one-on-one guidance." />
                        <ProblemCard title="Weak Foundation" desc="We rebuild missing basics so advanced concepts make complete sense." />
                        <ProblemCard title="Exam Strategy" desc="Time management and analytical thinking skills for top grades." />
                        <ProblemCard title="Parental Worry" desc="Real-time updates and monthly progress reports for full transparency." />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-[#1a1a2e] text-white">
                <div className="container mx-auto px-6 max-w-5xl">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight">
                                How our {displayName} tuition works
                            </h2>
                        </div>
                    </ScrollReveal>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard number="01" title="Free Assessment" desc="We evaluate your child's current level and learning needs." />
                        <StepCard number="02" title="Tutor Matching" desc="We match them with the perfect subject specialist." />
                        <StepCard number="03" title="Custom Plan" desc="A personalized curriculum targeting weak areas and goals." />
                        <StepCard number="04" title="Learn & Grow" desc="Regular 1:1 sessions with continuous monitoring and reports." />
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

function BenefitCard({ icon, color, title, desc }: { icon: React.ReactNode, color: string, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 group">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-4`}>{icon}</div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function PointCard({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex gap-4 items-start p-5 rounded-xl bg-white border border-gray-100/80 hover:shadow-md transition-all">
            <span className="text-2xl font-extrabold text-primary/20 font-display shrink-0">{num}</span>
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function SuccessCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-xl bg-surface border border-gray-100/80 hover:bg-white hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 text-center group">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">{icon}</div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function WhyPoint({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-gray-100/80">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">{icon}</div>
            <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
    );
}

function ProblemCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-5 rounded-xl bg-white border border-gray-100/80 hover:shadow-md transition-all">
            <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function StepCard({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="text-center md:text-left">
            <span className="text-3xl font-extrabold text-white/10 font-display block mb-2">{number}</span>
            <h3 className="text-base font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}
