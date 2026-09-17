'use client';
import { useState } from 'react';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Smartphone, Mail, MapPin, Send, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/utils/api';

export default function ContactClient() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        module: '',
        requirements: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await api.post('/contact', formData);
            
            if (res.data.success) {
                const now = new Date().toLocaleString();
                const message = encodeURIComponent(
                    `📚 *BrightPath Enquiry*\n` +
                    `----------------------------------\n\n` +
                    `👤 *Name:* ${formData.name}\n` +
                    `📞 *Contact:* ${formData.contact}\n` +
                    `📚 *Subject/Grade:* ${formData.module}\n` +
                    `📝 *Requirements:* ${formData.requirements}\n\n` +
                    `----------------------------------\n` +
                    `⏰ *Sent:* ${now}\n` +
                    `🌐 *Source:* Website Contact Form`
                );

                const whatsappUrl = `https://api.whatsapp.com/send?phone=918590878148&text=${message}`;
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                toast.success('Message sent! Opening WhatsApp...');
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Hero */}
            <header className="pt-32 pb-12 bg-surface">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Contact Us</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-display leading-tight mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Ready to start your child&apos;s academic journey? We&apos;d love to hear from you.
                    </p>
                </div>
            </header>

            {/* Contact Content */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <ContactCard icon={<Smartphone className="w-5 h-5" />} label="Phone" value="+91 85908 78148" desc="Call us for quick inquiries" />
                        <ContactCard icon={<Mail className="w-5 h-5" />} label="Email" value="enquiry@brightpath.eduvora" desc="For detailed questions" />
                        <ContactCard icon={<MapPin className="w-5 h-5" />} label="Location" value="Calicut, Kerala" desc="Serving students across India & abroad" />

                        <div className="bg-primary p-6 rounded-xl text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-4 h-4 text-secondary" />
                                <h3 className="text-sm font-bold">Working Hours</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-3">
                                    <span className="text-white/60">Mon – Sat</span>
                                    <span className="font-medium">5:00 AM – 11:30 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Sunday</span>
                                    <span className="font-medium">Revision Only</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-lg shadow-gray-100/60 border border-gray-100/80">
                        <h2 className="text-2xl font-bold text-gray-900 font-display mb-6">Send us a message</h2>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Your Name" placeholder="Full name" name="name" value={formData.name} onChange={handleChange} />
                                <FormField label="Phone / Email" placeholder="+91 XXX XXX XXXX" name="contact" value={formData.contact} onChange={handleChange} />
                            </div>
                            <FormField label="Subject / Grade" placeholder="e.g. 10th Grade CBSE Physics" name="module" value={formData.module} onChange={handleChange} />
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500">Your Requirements</label>
                                <textarea 
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary/40 focus:bg-white transition-all outline-none text-sm text-gray-900 min-h-[120px] placeholder:text-gray-400" 
                                    placeholder="Tell us about your child's specific challenges or goals..."
                                ></textarea>
                            </div>
                            <button 
                                suppressHydrationWarning 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-primary text-white font-semibold text-sm rounded-lg shadow-md shadow-primary/15 hover:bg-primary/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                            <p className="text-xs text-gray-400 text-center">We typically respond within 24 hours</p>
                        </form>
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}

function ContactCard({ icon, label, value, desc }: { icon: React.ReactNode, label: string, value: string, desc: string }) {
    return (
        <div className="flex items-start gap-4 p-5 rounded-xl bg-surface border border-gray-100/80">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">{value}</h3>
                <p className="text-xs text-gray-400">{desc}</p>
            </div>
        </div>
    );
}

function FormField({ label, placeholder, name, value, onChange }: { label: string, placeholder: string, name: string, value: string, onChange: React.ChangeEventHandler<HTMLInputElement> }) {
    return (
        <div className="space-y-1.5 w-full">
            <label className="text-xs font-medium text-gray-500">{label}</label>
            <input 
                type="text" 
                name={name}
                value={value}
                onChange={onChange}
                required
                suppressHydrationWarning 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary/40 focus:bg-white transition-all outline-none text-sm text-gray-900 placeholder:text-gray-400" 
                placeholder={placeholder} 
            />
        </div>
    );
}
