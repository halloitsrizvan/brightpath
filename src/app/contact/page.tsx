'use client';
import { useState } from 'react';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import { Smartphone, Mail, MapPin, Send, Calendar } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        module: '',
        requirements: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Deep-link optimization: Structure data for institutional CRM/Advisor
        const now = new Date().toLocaleString();
        const message = encodeURIComponent(
            `🏛 *Brightpath Institutional Enquiry*\n` +
            `----------------------------------\n\n` +
            `👤 *Parent/Guardian:* ${formData.name}\n` +
            `📞 *Verified Contact:* ${formData.contact}\n` +
            `📚 *Target Module:* ${formData.module}\n` +
            `📝 *Specific Requirements:* ${formData.requirements}\n\n` +
            `----------------------------------\n` +
            `⏰ *Timestamp:* ${now}\n` +
            `🌐 *Source:* Online Portal (Academic Node)`
        );

        // Optimized for both iOS/Android and Desktop
        const whatsappUrl = `https://api.whatsapp.com/send?phone=918590878148&text=${message}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Hero Section */}
            <header className="pt-40 pb-20 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Lead Generation Hub</p>
                    <h1 className="text-5xl md:text-8xl font-black text-gray-900 italic uppercase tracking-tighter leading-none mb-8">
                        Enquiry <br /><span className="text-primary">Portal.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-bold italic leading-relaxed">
                        Ready to begin your academic transformation? Connect with our institutional advisors for a personalized diagnostic session.
                    </p>
                </div>
            </header>

            {/* Contact Content */}
            <section className="py-32">
                <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 gap-8">
                            <ContactCard icon={<Smartphone className="w-6 h-6" />} label="Institutional Hotline" value="+91 85908 78148" desc="Direct support for parents & partners" />
                            <ContactCard icon={<Mail className="w-6 h-6" />} label="Email Dispatch" value="enquiry@brightpath.eduvora" desc="For detailed academic proposals" />
                            <ContactCard icon={<MapPin className="w-6 h-6" />} label="Operational Node" value="Brightpath Kerala | Online Academy" desc="Serving students across the state" />
                        </div>

                        <div className="bg-[#45308D] p-12 rounded-[3.5rem] text-white space-y-8 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-secondary" />
                                <h3 className="text-xl font-black italic uppercase tracking-tight">Active Hours</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Mon - Sat</span>
                                    <span className="text-sm font-bold">5:00 AM - 11:30 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Sunday</span>
                                    <span className="text-sm font-bold italic">Revision Only</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-primary/5 border border-gray-100 flex flex-col justify-center">
                        <h2 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter mb-10 leading-none">Diagnostic <br /><span className="text-primary italic-glow">Request.</span></h2>
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <EnquiryField 
                                    label="Parent/Guardian Name" 
                                    placeholder="Full Identity" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                />
                                <EnquiryField 
                                    label="Contact Identifier" 
                                    placeholder="+91 XXX XXX XXXX" 
                                    name="contact" 
                                    value={formData.contact} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <EnquiryField 
                                label="Academic Module / Grade" 
                                placeholder="e.g. 10th Grade CBSE Physics" 
                                name="module" 
                                value={formData.module} 
                                onChange={handleChange} 
                            />
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Learning Requirements</label>
                                <textarea 
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm min-h-[150px] italic text-gray-900 placeholder:text-gray-400 shadow-sm" 
                                    placeholder="Specific challenges or goals..."
                                ></textarea>
                            </div>
                            <button suppressHydrationWarning type="submit" className="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group">
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Transmit Enquiry Hub
                            </button>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center italic">Institutional response latency: &lt; 24 hours</p>
                        </form>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}

function ContactCard({ icon, label, value, desc }: { icon: any, label: string, value: string, desc: string }) {
    return (
        <div className="flex items-center gap-8 p-10 rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/20 group hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-all scale-110">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
                <h4 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-none mb-2">{value}</h4>
                <p className="text-xs font-bold text-gray-400 italic leading-none">{desc}</p>
            </div>
        </div>
    );
}

function EnquiryField({ label, placeholder, name, value, onChange }: { label: string, placeholder: string, name: string, value: string, onChange: any }) {
    return (
        <div className="space-y-2 w-full">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <input 
                type="text" 
                name={name}
                value={value}
                onChange={onChange}
                required
                suppressHydrationWarning 
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm italic text-gray-900 placeholder:text-gray-400 shadow-sm" 
                placeholder={placeholder} 
            />
        </div>
    );
}
