'use client';
import { useState } from 'react';
import { X, ChevronDown, CheckCircle2 } from 'lucide-react';
import * as fpixel from '@/lib/fpixel';
import * as gtag from '@/lib/gtag';

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const COUNTRY_DIAL_CODES: { [key: string]: string } = {
    'India': '+91',
    'GCC': '+971',
    'UAE': '+971',
    'Saudi Arabia': '+966',
    'Qatar': '+974',
    'Oman': '+968',
    'Kuwait': '+965',
    'Bahrain': '+973',
    'Europe': '+44',
    'United Kingdom': '+44',
    'Germany': '+49',
    'France': '+33',
    'Ireland': '+353',
    'United States': '+1',
    'Canada': '+1',
    'Australia': '+61',
    'New Zealand': '+64',
    'Singapore': '+65',
    'Malaysia': '+60',
    'Other': '+91'
};

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        userType: 'student',
        fullName: '',
        email: '',
        country: '',
        phoneNumber: '',
        whatsappNumber: '',
        studentClass: ''
    });
    
    if (!isOpen) return null;

    const activeDialCode = COUNTRY_DIAL_CODES[formData.country] || '+91';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formattedPhone = formData.phoneNumber.startsWith('+') 
                ? formData.phoneNumber 
                : `${activeDialCode} ${formData.phoneNumber.trim()}`;
            const formattedWhatsapp = formData.whatsappNumber.startsWith('+') 
                ? formData.whatsappNumber 
                : `${activeDialCode} ${formData.whatsappNumber.trim()}`;

            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    phoneNumber: formattedPhone,
                    whatsappNumber: formattedWhatsapp,
                    leadType: 'demo'
                })
            });

            if (response.ok) {
                fpixel.event('Lead', {
                    content_name: 'Book Free Demo',
                    lead_type: 'demo',
                    student_class: formData.studentClass
                });
                gtag.event('generate_lead', {
                    event_category: 'Demo Booking',
                    event_label: formData.studentClass || 'General',
                    lead_type: 'demo'
                });
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsSubmitted(false);
                    onClose();
                    setFormData({
                        userType: 'student',
                        fullName: '',
                        email: '',
                        country: '',
                        phoneNumber: '',
                        whatsappNumber: '',
                        studentClass: ''
                    });
                }, 3000);
            }
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {isSubmitted ? (
                    <div className="p-10 text-center flex flex-col items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 font-display mb-1">Request Received!</h2>
                            <p className="text-gray-500 text-sm">Our team will contact you shortly to schedule your demo.</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 md:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-display leading-tight mb-1">
                                Book a <span className="text-primary">Free Demo</span>
                            </h2>
                            <p className="text-sm text-gray-500">Experience personalized learning firsthand</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-full">
                                    <label className="text-xs font-medium text-gray-500">I&apos;m a</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.userType}
                                            onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="student">Student</option>
                                            <option value="parent">Parent</option>
                                            <option value="teacher">Teacher</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-600">Full Name <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" required placeholder="Enter full name" 
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all" 
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-600">Class <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select 
                                            required
                                            value={formData.studentClass}
                                            onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Class</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i} value={i + 1}>Class {i + 1}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-600">Country / Region</label>
                                    <div className="relative">
                                        <select 
                                            required
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Country / Region</option>
                                            <optgroup label="Popular Regions">
                                                <option value="India">India</option>
                                                <option value="GCC">GCC (Gulf Region)</option>
                                                <option value="UAE">United Arab Emirates (UAE)</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="Qatar">Qatar</option>
                                                <option value="Oman">Oman</option>
                                                <option value="Kuwait">Kuwait</option>
                                                <option value="Bahrain">Bahrain</option>
                                            </optgroup>
                                            <optgroup label="Europe & UK">
                                                <option value="Europe">Europe (General)</option>
                                                <option value="United Kingdom">United Kingdom (UK)</option>
                                                <option value="Germany">Germany</option>
                                                <option value="France">France</option>
                                                <option value="Ireland">Ireland</option>
                                            </optgroup>
                                            <optgroup label="Americas & Other">
                                                <option value="United States">United States (USA)</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Australia">Australia</option>
                                                <option value="New Zealand">New Zealand</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Malaysia">Malaysia</option>
                                                <option value="Other">Other Countries</option>
                                            </optgroup>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-600">Email Address <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <input 
                                        type="email" placeholder="example@mail.com" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all" 
                                    />
                                </div>

                                <div className="space-y-1.5 col-span-full md:col-span-1">
                                    <label className="text-xs font-medium text-gray-600">Phone Number <span className="text-red-500">*</span></label>
                                    <div className="flex gap-2">
                                        <div className="h-11 px-2.5 bg-gray-100 border border-gray-200 rounded-lg flex items-center text-xs font-bold text-gray-700 min-w-[50px] justify-center transition-colors">
                                            {activeDialCode}
                                        </div>
                                        <input 
                                            type="tel" required placeholder="Calling number" 
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="flex-1 min-w-0 h-11 px-3.5 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 col-span-full md:col-span-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-gray-600">WhatsApp Number <span className="text-red-500">*</span></label>
                                        {formData.phoneNumber && formData.phoneNumber !== formData.whatsappNumber && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, whatsappNumber: formData.phoneNumber })}
                                                className="text-[10px] text-primary hover:underline font-normal"
                                            >
                                                Same as phone
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-11 px-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center text-xs font-bold min-w-[50px] justify-center transition-colors">
                                            {activeDialCode}
                                        </div>
                                        <input 
                                            type="tel" required placeholder="WhatsApp number" 
                                            value={formData.whatsappNumber}
                                            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                            className="flex-1 min-w-0 h-11 px-3.5 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-primary text-white font-semibold text-sm rounded-lg shadow-md shadow-primary/15 hover:bg-primary/90 active:scale-[0.99] transition-all mt-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Sending...' : 'Book My Free Demo'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
