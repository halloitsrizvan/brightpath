'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { X, IndianRupee, Calendar, CreditCard, FileText, CheckCircle2, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffSalaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    staff: any;
    defaultMonth?: string;
}

export default function StaffSalaryModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    staff,
    defaultMonth 
}: StaffSalaryModalProps) {
    const getCurrentMonthYear = () => {
        const date = new Date();
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    };

    const [amount, setAmount] = useState<number>(0);
    const [month, setMonth] = useState<string>(defaultMonth || getCurrentMonthYear());
    const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer');
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Generate recent 12 months for selector
    const getMonthOptions = () => {
        const options: string[] = [];
        const date = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
            options.push(d.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
        }
        return options;
    };

    useEffect(() => {
        if (isOpen && staff) {
            document.body.style.overflow = 'hidden';
            setAmount(staff.baseSalary || 0);
            setMonth(defaultMonth || getCurrentMonthYear());
            setPaymentMethod('Bank Transfer');
            setPaymentDate(new Date().toISOString().split('T')[0]);
            setNotes('');
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, staff, defaultMonth]);

    if (!isOpen || !staff) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0) {
            toast.error('Salary amount must be greater than 0');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/admin/staffs/salary', {
                staffId: staff._id,
                amount,
                month,
                paymentDate,
                paymentMethod,
                notes: notes || `Monthly salary for ${month}`,
                status: 'paid'
            });

            const salaryRecord = res.data;
            if (salaryRecord?._id) {
                // Auto download / open invoice PDF in new tab
                window.open(`/api/admin/staffs/salary/${salaryRecord._id}/invoice`, '_blank');
            }

            toast.success(`Salary of ₹${amount.toLocaleString()} paid! Downloading invoice PDF...`);
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to process salary payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 my-auto animate-in fade-in zoom-in-95 duration-150">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-none">
                                Disburse Staff Salary
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Pay and record monthly compensation
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Staff Summary Card */}
                <div className="px-6 pt-5">
                    <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#45308D]/10 text-[#45308D] flex items-center justify-center font-bold text-xs">
                                {staff.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-900">{staff.name}</h4>
                                <span className="text-[10px] font-semibold text-gray-400">{staff.email}</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[10px] font-bold text-[#45308D] bg-[#45308D]/5 px-2 py-0.5 rounded border border-[#45308D]/10">
                                {staff.adminRole || staff.role}
                            </span>
                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                                Base: ₹{staff.baseSalary?.toLocaleString() || '0'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Target Month */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">
                                Payroll Month <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none cursor-pointer"
                                >
                                    {getMonthOptions().map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">
                                Amount to Pay (₹) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    value={amount || ''}
                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">
                                Payment Method <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none cursor-pointer"
                            >
                                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                                <option value="UPI">UPI / GPay / PhonePe</option>
                                <option value="Cash">Cash</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>

                        {/* Payment Date */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">
                                Payment Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-bold text-gray-700 block">
                                Remarks / Transaction Note
                            </label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. October payroll processed via HDFC netbanking"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition flex items-center gap-1.5"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{loading ? 'Processing...' : 'Confirm & Mark as Paid'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
