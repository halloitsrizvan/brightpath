'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { X, Shield, Mail, Briefcase, IndianRupee, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: any;
}

export default function AdminModal({ isOpen, onClose, onSuccess, editData }: AdminModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        baseSalary: 0,
        debtRemaining: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setFormData({
                    name: editData.name || '',
                    email: editData.email || '',
                    password: '', // Never populate password
                    role: editData.role || '',
                    baseSalary: editData.baseSalary || 0,
                    debtRemaining: editData.debtRemaining || 0
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: '',
                    baseSalary: 0,
                    debtRemaining: 0
                });
            }
        }
    }, [isOpen, editData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editData) {
                await api.put(`/admin/founders/${editData._id}`, formData);
                toast.success('Administrative profile updated');
            } else {
                await api.post('/admin/founders', formData);
                toast.success('New administrator registered');
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative p-8 md:p-12">
                    <button 
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>

                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                                Admin <span className="text-primary">Registry</span>
                            </h2>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {editData ? 'Modify Core Administrative Details' : 'Onboard New Principal Administrator'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        required
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Endpoint</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        required
                                        type="email"
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="founder@brightpath.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Strategic Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        required
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="e.g. Managing Director"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Monthly Base Tier (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        required
                                        type="number"
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder="0"
                                        value={formData.baseSalary || ''}
                                        onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Access (Password)</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="password"
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        placeholder={editData ? "•••••••• (Leave blank to keep)" : "••••••••"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        </div>

                        <div className="pt-8 flex flex-col md:flex-row gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-gray-100 text-gray-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
                            >
                                Abort Operation
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Synchronizing...' : editData ? 'Update Administration Core' : 'Confirm Admin Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
