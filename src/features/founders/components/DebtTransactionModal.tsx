'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { X, ArrowUpRight, ArrowDownRight, IndianRupee, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DebtTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    founder: any;
    type: 'debt' | 'return';
}

export default function DebtTransactionModal({ isOpen, onClose, onSuccess, founder, type }: DebtTransactionModalProps) {
    const [amount, setAmount] = useState(0);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !founder) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0) return toast.error('Amount must be positive');
        
        setLoading(true);
        try {
            await api.post('/admin/founders/debt', {
                founderId: founder._id,
                type,
                amount,
                reason: isDebt ? reason : (reason || 'Manual Return')
            });
            toast.success(type === 'debt' ? 'Debt recorded' : 'Return processed');
            setAmount(0);
            setReason('');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    const isDebt = type === 'debt';

    return (
        <div className="fixed inset-0 w-full h-full min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 my-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="relative p-6 sm:p-8">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-6 text-center">
                        <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${isDebt ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'} shadow-sm`}>
                            {isDebt ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownRight className="w-7 h-7" />}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            {isDebt ? 'Register Debt' : 'Execute Return'}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Trustee: <span className="font-semibold text-gray-700">{founder.name}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">Amount (₹) *</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    required
                                    type="number"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                                    placeholder="0"
                                    value={amount || ''}
                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        {isDebt && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">Justification / Reason</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none resize-none"
                                    placeholder="Enter administrative reason..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="pt-2 flex items-center justify-end gap-3">
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
                                className={`px-6 py-2.5 ${isDebt ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'} text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition flex items-center justify-center gap-1.5`}
                            >
                                {loading ? 'Processing...' : `Confirm ${isDebt ? 'Debt' : 'Return'}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
