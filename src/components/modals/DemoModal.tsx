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
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-zoom-in">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {isSubmitted ? (
                    <div className="p-10 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Success!</h2>
                            <p className="text-gray-500 font-bold text-sm">Your demo request has been received. Our team will contact you shortly.</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 md:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-1">Book a <span className="text-primary">Free Demo</span></h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience the future of personalized learning</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-full">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">I'm a</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.userType}
                                            onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                            className="w-full h-12 px-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none text-xs font-bold text-gray-900 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="student">Student</option>
                                            <option value="parent">Parent</option>
                                            <option value="teacher">Teacher</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 col-span-full" />

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Name</label>
                                    <input 
                                        type="text" required placeholder="Enter full name" 
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full h-12 px-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none text-xs font-bold text-gray-900 transition-all" 
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</label>
                                    <input 
                                        type="email" required placeholder="example@mail.com" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full h-12 px-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none text-xs font-bold text-gray-900 transition-all" 
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Country</label>
                                    <input 
                                        type="text" required placeholder="Select your country" 
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full h-12 px-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none text-xs font-bold text-gray-900 transition-all" 
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Class</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.studentClass}
                                            onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                                            className="w-full h-12 px-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none text-xs font-bold text-gray-900 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Class</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i} value={i + 1}>Class {i + 1}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 col-span-full" />

                                <div className="space-y-1.5 col-span-full">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone Number</label>
                                    <div className="flex gap-2">
                                        <div className="h-12 px-3 bg-gray-100 rounded-xl flex items-center text-xs font-black text-gray-600">+91</div>
                                        <input 
                                            type="tel" required placeholder="Number" 
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="flex-1 h-12 px-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl outline-none text-xs font-bold text-gray-900 transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all mt-2 disabled:opacity-50"
                            >
                                {isLoading ? 'Sending Request...' : 'Book My Free Demo'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
