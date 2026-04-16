'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { X, ArrowUpRight, ArrowDownRight, IndianRupee, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DebtTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    founder: any; // The founder targeted
    type: 'debt' | 'return';
}

export default function DebtTransactionModal({ isOpen, onClose, onSuccess, founder, type }: DebtTransactionModalProps) {
    const [amount, setAmount] = useState(0);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

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
        <div className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-md flex items-center justify-center z-[110] p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative p-8 md:p-10">
                    <button 
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>

                    <div className="mb-8 text-center">
                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${isDebt ? 'bg-rose-500/10 text-rose-500 shadow-rose-500/10' : 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10'} shadow-lg rotate-3`}>
                            {isDebt ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter leading-none mb-2">
                            {isDebt ? 'Register' : 'Execute'} <span className={isDebt ? 'text-rose-500' : 'text-emerald-500'}>{isDebt ? 'Debt' : 'Return'}</span>
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            Trustee: {founder.name}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantum (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    required
                                    type="number"
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="0"
                                    value={amount || ''}
                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        {isDebt && (
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Justification / Reason</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-300" />
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                        placeholder="Enter administrative reason..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 ${isDebt ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'} text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2`}
                        >
                            {loading ? 'Processing...' : `Confirm ${isDebt ? 'Debt Registration' : 'Return Transaction'}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
