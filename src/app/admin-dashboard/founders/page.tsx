'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { 
    Users, 
    IndianRupee, 
    Calendar, 
    ChevronDown, 
    Menu, 
    Plus, 
    FileText, 
    ShieldCheck, 
    TrendingDown, 
    CheckCircle2, 
    XCircle,
    Download,
    Eye,
    ChevronRight,
    Search,
    Edit2,
    Trash2,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import FounderModal from '@/features/founders/components/FounderModal';
import DebtTransactionModal from '@/features/founders/components/DebtTransactionModal';

interface Founder {
    _id: string;
    name: string;
    email: string;
    role: string;
    baseSalary: number;
    debtRemaining: number;
}

interface SalaryRecord {
    _id: string;
    founderId: any;
    month: string;
    amount: number;
    debtContribution: number;
    netPay: number;
    status: 'paid' | 'pending';
    paidAt?: string;
}

export default function FoundersManagement() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [founders, setFounders] = useState<Founder[]>([]);
    const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('All Periods');
    const [activeTab, setActiveTab] = useState<'directory' | 'salaries'>('directory');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // Debt states
    const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
    const [debtModalType, setDebtModalType] = useState<'debt' | 'return'>('debt');
    const [targetFounder, setTargetFounder] = useState<any>(null);

    const monthsOptions = useMemo(() => {
        const arr = ['All Periods'];
        const date = new Date();
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
            const [fRes, sRes] = await Promise.all([
                api.get('/admin/founders'),
                api.get(`/admin/founders/salary${selectedMonth !== 'All Periods' ? `?month=${selectedMonth}` : ''}`)
            ]);
            setFounders(fRes.data);
            setSalaries(sRes.data);
        } catch (err) {
            toast.error("Synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const generateMonthlySalaries = async () => {
        try {
            const targetMonth = monthsOptions[1];
            await api.post('/finance/generate-payroll', { month: targetMonth, type: 'founder' });
            toast.success(`Payroll generated for ${targetMonth}`);
            fetchData();
        } catch (err) {
            toast.error("Payroll generation failed");
        }
    };

    const settleSalary = async (id: string) => {
        try {
            await api.put(`/admin/founders/salary/${id}`, { status: 'paid' });
            toast.success("Compensation settled");
            fetchData();
        } catch (err) {
            toast.error("Settlement failed");
        }
    };

    const handleDeleteFounder = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this trustee? This action is irreversible.')) {
            try {
                await api.delete(`/admin/founders/${id}`);
                toast.success('Trustee removed from core');
                fetchData();
            } catch (err) {
                toast.error('Deletion failed');
            }
        }
    };

    const handleDebtAction = (founder: any, type: 'debt' | 'return') => {
        setTargetFounder(founder);
        setDebtModalType(type);
        setIsDebtModalOpen(true);
    };

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
            <Toaster position="top-right" />
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Executive Suite</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-12 mt-20 lg:mt-0">
                    <FounderModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={fetchData}
                        editData={editData}
                    />

                    <DebtTransactionModal 
                        isOpen={isDebtModalOpen}
                        onClose={() => setIsDebtModalOpen(false)}
                        onSuccess={fetchData}
                        founder={targetFounder}
                        type={debtModalType}
                    />

                    {/* Header Section */}
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10 mt-4 px-2">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Founders Core</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 ml-1">Executive Equity & Payroll Matrix</p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                             <div className="relative group w-full md:min-w-[200px]">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <select
                                    className="w-full pl-11 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest focus:border-primary outline-none transition-all cursor-pointer appearance-none shadow-sm"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {monthsOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            <button
                                onClick={() => { setEditData(null); setIsModalOpen(true); }}
                                className="w-full md:w-auto px-8 py-3.5 bg-white border-2 border-gray-100 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-primary transition-all flex items-center justify-center gap-2 italic"
                            >
                                <Users className="w-4 h-4" /> Add Trustee
                            </button>

                            <button
                                onClick={generateMonthlySalaries}
                                className="w-full md:w-auto px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 italic"
                            >
                                <Plus className="w-4 h-4" /> Run {monthsOptions[1]} Payroll
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-12 px-2">
                        <div className="bg-primary p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Yield</p>
                            <h2 className="text-xl md:text-3xl font-black italic tracking-tighter mb-4 leading-none">₹{salaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</h2>
                            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-white/80">
                                <ShieldCheck className="w-4 h-4" />
                                <span>{founders.length} Active Trustees</span>
                            </div>
                        </div>

                        <div className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30">
                            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Settlements</p>
                            <h2 className="text-xl md:text-3xl font-black italic tracking-tighter text-teal-600 mb-4 leading-none">{salaries.filter(s => s.status === 'paid').length} Processed</h2>
                            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-teal-600/60">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Confirmed Disb.</span>
                            </div>
                        </div>

                        <div className="bg-[#F8F9FA] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-primary border border-gray-100 shadow-xl shadow-gray-200/20 col-span-2 lg:col-span-1">
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Debt Recovery</p>
                            <h2 className="text-xl md:text-3xl font-black italic tracking-tighter mb-4 text-gray-800 leading-none">₹{salaries.reduce((sum, s) => sum + (s.debtContribution || 0), 0).toLocaleString()} <span className="text-xs md:text-lg not-italic opacity-40">Recouped</span></h2>
                             <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter opacity-40">
                                <TrendingDown className="w-4 h-4" />
                                <span>Institutional Return</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Matrix */}
                    <div className="space-y-12 px-2">
                        {/* Payroll Table */}
                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-lg font-black text-gray-800 italic uppercase">Compensation Ledger</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Economic Disbursal Log</p>
                                </div>
                                <div className="flex bg-gray-50 p-1 rounded-xl">
                                    <button onClick={() => setActiveTab('directory')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition ${activeTab === 'directory' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>Members</button>
                                    <button onClick={() => setActiveTab('salaries')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition ${activeTab === 'salaries' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>Flows</button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                {activeTab === 'salaries' ? (
                                    <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                                        <thead>
                                            <tr className="bg-white text-gray-300 text-[9px] md:text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-8 py-6">Founder Node</th>
                                                <th className="px-4 py-6">Cycle</th>
                                                <th className="px-4 py-6">Gross Flow</th>
                                                <th className="px-4 py-6">Debt Recov.</th>
                                                <th className="px-4 py-6">Net Yield</th>
                                                <th className="px-8 py-6 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {salaries.map((salary: any) => (
                                                <tr key={salary._id} className="group hover:bg-gray-50/50 transition duration-200">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-black text-[10px]">{salary.founderId?.name?.charAt(0)}</div>
                                                            <span className="text-sm font-black text-gray-800 tracking-tight">{salary.founderId?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-[11px] font-bold text-gray-400 uppercase">{salary.month}</td>
                                                    <td className="px-4 py-5 font-black text-xs">₹{salary.amount.toLocaleString()}</td>
                                                    <td className="px-4 py-5 font-black text-xs text-rose-500">-₹{(salary.debtContribution || 0).toLocaleString()}</td>
                                                    <td className="px-4 py-5 font-black text-sm italic text-primary">₹{salary.netPay.toLocaleString()}</td>
                                                    <td className="px-8 py-5 text-right">
                                                        {salary.status === 'pending' ? (
                                                            <button 
                                                                onClick={() => settleSalary(salary._id)}
                                                                className="px-5 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition"
                                                            >
                                                                Settle
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center justify-end gap-1.5">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                                        <thead>
                                            <tr className="bg-white text-gray-300 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-8 py-6">Executive Profile</th>
                                                <th className="px-4 py-6">Base Tier (₹)</th>
                                                <th className="px-4 py-6">Principal Debt (₹)</th>
                                                <th className="px-8 py-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {founders.map((f: any) => (
                                                <tr key={f._id} className="group hover:bg-gray-50/50 transition">
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-gray-800 tracking-tight group-hover:text-primary transition-colors">{f.name}</span>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{f.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-6 font-black text-gray-800 italic">₹{f.baseSalary.toLocaleString()}</td>
                                                    <td className="px-4 py-6">
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-sm font-black text-rose-500 italic">₹{(f.debtRemaining || 0).toLocaleString()}</span>
                                                            <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-rose-500" style={{ width: '40%' }}></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <div className="flex bg-gray-50 p-1 rounded-xl gap-1 mr-2">
                                                                <button 
                                                                    onClick={() => handleDebtAction(f, 'debt')}
                                                                    className="px-3 py-1.5 bg-white border border-gray-100 text-rose-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-1 shadow-sm"
                                                                >
                                                                    <ArrowUpRight className="w-3 h-3" /> Debt
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDebtAction(f, 'return')}
                                                                    className="px-3 py-1.5 bg-white border border-gray-100 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center gap-1 shadow-sm"
                                                                >
                                                                    <ArrowDownRight className="w-3 h-3" /> Return
                                                                </button>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button 
                                                                    onClick={() => { setEditData(f); setIsModalOpen(true); }}
                                                                    className="p-2 hover:bg-primary/10 text-gray-400 hover:text-primary rounded-xl transition-all"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteFounder(f._id)}
                                                                    className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Insight Panel */}
                        <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 flex items-center gap-4 text-primary">
                            <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                            <p className="text-[9px] font-bold italic leading-relaxed">Executive payroll is automatically adjusted for debt recovery. Distributions are logged in the master ledger for fiscal audit integrity.</p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
