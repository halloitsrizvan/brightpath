'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import {
    User,
    IndianRupee,
    Calendar,
    CheckCircle2,
    Plus,
    Trash2,
    CreditCard,
    TrendingDown,
    ShieldCheck,
    ChevronDown,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    AlertCircle
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function FoundersFinance() {
    const [founders, setFounders] = useState<any[]>([]);
    const [salaries, setSalaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter states
    const [selectedMonth, setSelectedMonth] = useState('All Periods');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [showAddFounder, setShowAddFounder] = useState(false);
    const [newFounder, setNewFounder] = useState({ name: '', role: '', email: '', baseSalary: 0 });

    const [showPayModal, setShowPayModal] = useState<any>(null); // Stores salary object
    const [payData, setPayData] = useState({ amount: 0, debtContribution: 0, notes: '' });

    const monthsOptions = useMemo(() => {
        const arr = ['All Periods'];
        const date = new Date();
        date.setDate(1);
        for (let i = 0; i < 6; i++) {
            const m = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const y = date.getFullYear();
            arr.push(`${m} ${y}`);
            date.setMonth(date.getMonth() - 1);
        }
        return arr;
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [foundersRes, salariesRes] = await Promise.all([
                api.get('/admin/founders'),
                api.get(`/admin/founders/salary${selectedMonth !== 'All Periods' ? `?month=${selectedMonth}` : ''}`)
            ]);
            setFounders(foundersRes.data);
            setSalaries(salariesRes.data);
        } catch (err) {
            toast.error("Failed to fetch records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const handleAddFounder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsProcessing(true);
            await api.post('/admin/founders', newFounder);
            toast.success("Founder added successfully");
            setShowAddFounder(false);
            setNewFounder({ name: '', role: '', email: '', baseSalary: 0 });
            fetchData();
        } catch (err) {
            toast.error("Failed to add founder");
        } finally {
            setIsProcessing(false);
        }
    };

    const generateMonthlySalaries = async () => {
        const month = monthsOptions[1]; // Current month
        if (month === 'All Periods') return;

        try {
            setIsProcessing(true);
            let count = 0;
            for (const founder of founders) {
                // Check if already exists
                const exists = salaries.find(s => s.founderId?._id === founder._id && s.month === month);
                if (!exists) {
                    await api.post('/admin/founders/salary', {
                        founderId: founder._id,
                        amount: founder.baseSalary,
                        month: month
                    });
                    count++;
                }
            }
            toast.success(`Generated records for ${count} founders`);
            fetchData();
        } catch (err) {
            toast.error("Generation incomplete");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSettleSalary = async () => {
        if (!showPayModal) return;
        try {
            setIsProcessing(true);
            await api.put(`/admin/founders/salary/${showPayModal._id}`, {
                status: 'paid',
                paymentDate: new Date(),
                amount: payData.amount,
                debtContribution: payData.debtContribution,
                notes: payData.notes
            });
            toast.success("Disbursement confirmed");
            setShowPayModal(null);
            fetchData();
        } catch (err) {
            toast.error("Process failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredSalaries = salaries.filter(s =>
        (s.founderId?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center min-vh-screen bg-gray-50 italic font-black text-primary animate-pulse h-screen">
            PROCESSING EXECUTIVE LEDGER...
        </div>
    );

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>

            <div className="flex-1 lg:ml-64 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Executive Payroll</h1>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">Founder Compensation & Debt Recovery</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowAddFounder(true)}
                            className="px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-primary hover:border-primary transition flex items-center gap-2 shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Founder
                        </button>
                        <button
                            onClick={generateMonthlySalaries}
                            className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" /> Generate {monthsOptions[1]}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Executive Payout</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4">₹{salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                            <ShieldCheck className="w-4 h-4" />
                            <span>{founders.length} Active Founders</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Settled Records</p>
                        <h2 className="text-4xl font-black italic tracking-tighter text-teal-600 mb-4">{salaries.filter(s => s.status === 'paid').length}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-600/60">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Monthly Disbursements</span>
                        </div>
                    </div>

                    <div className="bg-amber-500 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-amber-200 relative overflow-hidden group">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Debt Recovery</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4">₹{salaries.reduce((sum, s) => sum + (s.debtContribution || 0), 0).toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                            <TrendingDown className="w-4 h-4" />
                            <span>From Profit Allocation</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH FOUNDER..."
                            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-[2rem] font-bold text-gray-700 shadow-sm focus:border-primary/20 outline-none transition-all placeholder:text-gray-300 uppercase text-[10px] tracking-widest"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative min-w-[220px]">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                        <select
                            className="w-full pl-14 pr-12 py-5 bg-white border-2 border-transparent rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest shadow-sm focus:border-primary/20 outline-none transition-all cursor-pointer appearance-none"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {monthsOptions.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-50 overflow-hidden mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="p-10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                        <th className="pb-6 px-4">Executive</th>
                                        <th className="pb-6">Period</th>
                                        <th className="pb-6">Amount</th>
                                        <th className="pb-6">Debt Cut</th>
                                        <th className="pb-6 text-right">Settlement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredSalaries.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <AlertCircle className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                                <p className="text-gray-300 font-bold italic uppercase tracking-widest text-xs">No payroll records found for this scope.</p>
                                            </td>
                                        </tr>
                                    ) : filteredSalaries.map((salary: any) => (
                                        <tr key={salary._id} className="group hover:bg-gray-50/50 transition duration-300">
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black italic shadow-inner group-hover:scale-110 transition">
                                                        {salary.founderId?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-800">{salary.founderId?.name}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md mt-1 inline-block">{salary.founderId?.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{salary.month}</span>
                                            </td>
                                            <td className="py-6">
                                                <p className="text-sm font-black text-gray-800 italic tracking-tight">₹{salary.amount?.toLocaleString()}</p>
                                            </td>
                                            <td className="py-6 font-mono text-[10px] font-bold text-amber-600">
                                                {salary.debtContribution > 0 ? `-₹${salary.debtContribution.toLocaleString()}` : '--'}
                                            </td>
                                            <td className="py-6 text-right">
                                                {salary.status === 'paid' ? (
                                                    <div className="flex items-center justify-end gap-2 text-green-500">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Disbursed</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setShowPayModal(salary);
                                                            setPayData({ amount: salary.amount, debtContribution: 0, notes: '' });
                                                        }}
                                                        className="px-6 py-2 bg-[#fdf2f2] text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition shadow-lg shadow-rose-100 flex items-center gap-2 ml-auto"
                                                    >
                                                        Settle Now <ArrowUpRight className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAddFounder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">Onboard Founder</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Register Institutional Leadership</p>
                            </div>
                            <button onClick={() => setShowAddFounder(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition"><AddFounderIcon /></button>
                        </div>
                        <form onSubmit={handleAddFounder} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    required
                                    className="w-full bg-gray-50 border-2 border-transparent p-5 text-sm font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                    value={newFounder.name}
                                    onChange={(e) => setNewFounder({ ...newFounder, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Designation</label>
                                    <input
                                        className="w-full bg-gray-50 border-2 border-transparent p-5 text-sm font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                        value={newFounder.role}
                                        onChange={(e) => setNewFounder({ ...newFounder, role: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Salary</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 border-2 border-transparent p-5 text-sm font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                        value={newFounder.baseSalary}
                                        onChange={(e) => setNewFounder({ ...newFounder, baseSalary: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 pb-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Email</label>
                                <input
                                    className="w-full bg-gray-50 border-2 border-transparent p-5 text-sm font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                    value={newFounder.email}
                                    onChange={(e) => setNewFounder({ ...newFounder, email: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-50"
                            >
                                {isProcessing ? 'SYNCHRONIZING...' : 'ADD EXECUTIVE PROFILE'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showPayModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter tracking-tighter">Settle Disbursement</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm Payment for {showPayModal.founderId?.name}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payout Amount</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 border-2 border-transparent p-5 text-sm font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all"
                                        value={payData.amount}
                                        onChange={(e) => setPayData({ ...payData, amount: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-1">Debt Cut</label>
                                    <input
                                        type="number"
                                        className="w-full bg-rose-50 border-2 border-transparent p-5 text-sm font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-rose-200 outline-none transition-all"
                                        value={payData.debtContribution}
                                        onChange={(e) => setPayData({ ...payData, debtContribution: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ledger Notes</label>
                                <textarea
                                    className="w-full bg-gray-50 border-2 border-transparent p-5 text-sm font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all min-h-[100px]"
                                    placeholder="Add any internal transaction notes..."
                                    value={payData.notes}
                                    onChange={(e) => setPayData({ ...payData, notes: e.target.value })}
                                />
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl flex items-center justify-between border border-gray-100">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Transfer</span>
                                <span className="text-2xl font-black text-primary italic">₹{(payData.amount - payData.debtContribution).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowPayModal(null)}
                                    className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-[2rem] font-black text-[12px] uppercase tracking-widest shadow-sm hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSettleSalary}
                                    disabled={isProcessing}
                                    className="flex-2 py-5 bg-primary text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition disabled:opacity-50"
                                >
                                    {isProcessing ? 'PROCESSING...' : 'CONFIRM DISBURSEMENT'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AddFounderIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
