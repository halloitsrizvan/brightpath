'use client';
import { useSearchParams, useParams } from 'next/navigation';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import Testimonials from '@/components/public/Testimonials';
import PublicFAQ from '@/components/public/FAQ';
import FloatingContact from '@/components/public/FloatingContact';
import { CheckCircle2, ShieldCheck, Star, Users, Clock, BookOpen, ArrowRight, Video, Target, HelpCircle, Trophy, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import api from '@/utils/api';

export default function TuitionClassPage() {
    const params = useParams();
    const category = (params?.category as string) || '';
    const slug = (params?.slug as string) || '';
    
    // Clean up the name for display (e.g., class-10 -> Class 10, class-1-5 -> Class 1-5)
    const displayName = slug 
        ? slug
            .replace(/(\d)-(\d)/g, '$1_RANGE_$2') 
            .replace(/-/g, ' ')
            .replace(/_RANGE_/g, '-')
            .replace(/\b\w/g, l => l.toUpperCase()) 
        : 'Academic';
    const isClassPage = category.includes('class');
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
        <div suppressHydrationWarning className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary relative">
             {/* Premium Background Blooms */}
             <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#45308D]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-[#FDC70B]/5 rounded-full blur-[120px]" />
            </div>

            <PublicNavbar />

            {isLocationPage ? (
                <>
                    {/* Location Hero Banner */}
                    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                        <Image src="/loc-banner.png" alt="Education" fill className="object-cover brightness-50" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                        <div className="container mx-auto px-6 relative z-10 text-center">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white uppercase italic tracking-tighter leading-tight drop-shadow-2xl max-w-5xl mx-auto">
                                Best Online Tuition in <span className="text-secondary">{displayName}</span> – <br />
                                <span className="text-primary-light">One-on-One Classes</span> for CBSE, ICSE & State Boards
                            </h1>
                            <div className="mt-10 flex justify-center">
                               <button onClick={() => {document.getElementById('enquiry-form')?.scrollIntoView({behavior: 'smooth'})}} className="px-6 py-3 bg-primary text-white font-bold  uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">Book Free Demo</button>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Best Services Grid (From Image) */}
                    <section id="enquiry-form" className="py-24 bg-white relative overflow-hidden">
                        <div className="container mx-auto px-6 max-w-7xl">
                            <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
                                <div className="lg:w-1/2">
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                        We Provide The <br />
                                        <span className="text-primary">Best Online Tuition</span> services
                                    </h2>
                                    <div className="w-24 h-2 bg-secondary mt-4 rounded-full" />
                                </div>
                                <div className="lg:w-1/2 border-l-2 border-gray-100 pl-8">
                                    <p className="text-gray-500 font-bold italic leading-relaxed">
                                        Brightpath Learning offers personalised one-to-one online tuition in {displayName} for classes 1-12 under CBSE, State & ICSE boards. Build a rock-solid foundation with our expert mentors.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <BenefitCard 
                                    icon={<GraduationCap className="w-8 h-8" />} 
                                    color="bg-purple-600" 
                                    title="High Quality Courses" 
                                    desc="Comprehensive and expertly designed courses that deliver deep, practical knowledge, ensuring students excel in their chosen subjects." 
                                />
                                <BenefitCard 
                                    icon={<Users className="w-8 h-8" />} 
                                    color="bg-rose-500" 
                                    title="Individualized online class" 
                                    desc="Personalized online lessons tailored to each student's unique learning style and pace, providing focused attention and customized support." 
                                />
                                <BenefitCard 
                                    icon={<Video className="w-8 h-8" />} 
                                    color="bg-blue-600" 
                                    title="Blended model of online tutoring" 
                                    desc="A flexible learning approach combining live online tutoring with self-paced digital resources, offering the best of both virtual and independent learning experiences." 
                                />
                            </div>
                        </div>
                    </section>

                    {/* Floating Enquiry Form Section (Embedded for Location Page) */}
                    {/* <section className="py-20 bg-gray-50/50">
                        <div className="container mx-auto px-6 max-w-4xl">
                            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
                                <div className="text-center mb-10">
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900 mb-2">Request a Free Callback</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Start your child's success journey in {displayName} today</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Student Name</label>
                                            <input required value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Enter name" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">WhatsApp Number</label>
                                            <input required type="tel" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none" placeholder="+XX XXXXXXXX" />
                                        </div>
                                    </div>
                                    <button disabled={formStatus === 'submitting'} className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
                                        {formStatus === 'submitting' ? 'Submitting...' : 'Register for Free Demo Session'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section> */}

                    {/* Section 3: Truly Works */}
                    <section className="py-24 bg-white">
                        <div className="container mx-auto px-6 max-w-5xl text-center space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest">Our Promise</div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">
                                Online Tuition in <span className="text-secondary">{displayName}</span> <br />
                                That Truly Works for Every Student
                            </h2>
                            <p className="text-lg text-gray-500 font-bold italic leading-relaxed max-w-3xl mx-auto">
                                We bridge the gap between classroom teaching and individual learning needs. Our methodology is designed to ensure that no student in {displayName} is left behind, focusing on conceptual clarity and confidence building.
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Popularity */}
                    <section className="py-24 bg-gray-50">
                        <div className="container mx-auto px-6 max-w-7xl">
                            <div className="flex flex-col lg:flex-row gap-16 items-center">
                                <div className="lg:w-1/2 space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Shifting Patterns</div>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                        Why Online Tuition is <br />
                                        Becoming Popular in <span className="text-primary">{displayName}.</span>
                                    </h2>
                                    <p className="text-base text-gray-500 font-bold italic leading-relaxed">
                                        Parents in {displayName} are increasingly choosing online tuition over traditional formats for its efficiency and results.
                                    </p>
                                </div>
                                <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "No travel; learn from home",
                                        "Flexible timing (morning or evening)",
                                        "One-on-one attention improves performance",
                                        "Access to better teachers across India",
                                        "Saves time and energy"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                            <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Detailed Why Brightpath (7 Points) */}
                    <section className="py-24 bg-white overflow-hidden relative">
                        <div className="container mx-auto px-6 max-w-7xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Expert Advantage</div>
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight mb-20 max-w-4xl">
                                What Makes Brightpath Learning the <br />
                                <span className="text-secondary">Best Online Tuition in {displayName}:-</span>
                            </h2>

                            <div className="space-y-12">
                                <PointCard 
                                    num="01" 
                                    title="One-on-One Personal Attention"
                                    desc={`Every student in ${displayName} learns differently, and that’s why our online tuition in ${displayName} is built around each child’s unique needs. Our expert tutors work one-on-one with students across ${displayName} in their subject areas. They begin with a quick skill check to understand the student’s strengths and areas that need improvement.`}
                                />
                                <PointCard 
                                    num="02" 
                                    title="Customized Learning Plan"
                                    desc="We identify: Weak areas, Learning pace, and Exam goals. Based on this, we create a focused study plan that helps the student grow stronger where they’re weak and make the most of their time in class."
                                />
                                <PointCard 
                                    num="03" 
                                    title="Building Confidence and Academic Growth"
                                    desc={`Our one-on-one sessions don’t just help students learn better, they also help build their confidence. When students understand topics clearly and feel supported, they start believing in themselves more. It’s especially helpful for students preparing for competitive exams in ${displayName}.`}
                                />
                                <PointCard 
                                    num="04" 
                                    title="Covers All Syllabus"
                                    desc="We support all major formats including CBSE, State Board, ICSE, and IGCSE. We ensure the teaching is strictly aligned with the school curriculum while pushing for advanced understanding."
                                />
                                <PointCard 
                                    num="05" 
                                    title="Flexible Timings"
                                    desc={`Classes scheduled based on your convenience, perfect for busy school routines. With our online tuition in ${displayName}, students can learn from home without the stress of travel or busy classrooms, helping them stay focused and relaxed.`}
                                />
                                <PointCard 
                                    num="06" 
                                    title="Regular Tests & Progress Tracking"
                                    desc="Continuous evaluation through weekly assessments, detailed performance reports, and regular parent-teacher updates to ensure measurable progress."
                                />
                                <PointCard 
                                    num="07" 
                                    title="Complete Study Materials"
                                    desc="Our tutors provide well-planned study materials covering school syllabus and exam requirements in detail, helping students revise better and prepare smarter."
                                />
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* Standard Hero Section with Form (For Classes/Subjects) */}
                    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden border-b border-gray-100/50">
                        <div className="container mx-auto px-6 max-w-7xl">
                            {/* ... existing hero code ... */}
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

                    {/* Section: Success Card Container */}
                    <section className="py-24 bg-white">
                        <div className="container mx-auto px-6 max-w-7xl">
                            {/* ... original success grid ... */}
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
                </>
            )}

            {/* Section: Why Choose Brightpath */}
            <section className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 relative">
                             <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden aspect-[4/3]">
                                <Image src="/why-choose.png" alt="Excellence" fill className="object-cover" />
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

function BenefitCard({ icon, color, title, desc }: { icon: any, color: string, title: string, desc: string }) {
    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl group-hover:shadow-2xl transition-all duration-500" />
            <div className="relative p-10 pt-16 text-center space-y-4 border border-gray-100 rounded-[2rem] overflow-visible h-full bg-white">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 ${color} text-white rounded-full flex items-center justify-center shadow-xl z-10`}>
                    {icon}
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter leading-tight">{title}</h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function PointCard({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="flex flex-col md:flex-row gap-8 items-start group">
            <div className="text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors italic leading-none">{num}</div>
            <div className="space-y-3">
                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter border-l-4 border-secondary pl-4">{title}</h3>
                <p className="text-sm text-gray-500 font-bold italic leading-relaxed pl-5">{desc}</p>
            </div>
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
