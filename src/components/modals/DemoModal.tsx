'use client';
import { useState } from 'react';
import { X, ChevronDown, CheckCircle2 } from 'lucide-react';

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        userType: 'student',
        fullName: '',
        email: '',
        country: '',
        phoneNumber: '',
        studentClass: ''
    });
    
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    leadType: 'demo'
                })
            });

            if (response.ok) {
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
                                    <label className="text-xs font-medium text-gray-500">Full Name</label>
                                    <input 
                                        type="text" required placeholder="Enter full name" 
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all" 
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500">Email Address</label>
                                    <input 
                                        type="email" required placeholder="example@mail.com" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all" 
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500">Country</label>
                                    <input 
                                        type="text" required placeholder="Your country" 
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all" 
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500">Class</label>
                                    <div className="relative">
                                        <select 
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

                                <div className="space-y-1.5 col-span-full">
                                    <label className="text-xs font-medium text-gray-500">Phone Number</label>
                                    <div className="flex gap-2">
                                        <div className="h-11 px-3 bg-gray-100 border border-gray-200 rounded-lg flex items-center text-sm font-medium text-gray-600">+91</div>
                                        <input 
                                            type="tel" required placeholder="Phone number" 
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="flex-1 h-11 px-4 bg-gray-50 border border-gray-200 focus:border-primary/40 focus:bg-white rounded-lg outline-none text-sm text-gray-900 transition-all" 
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
