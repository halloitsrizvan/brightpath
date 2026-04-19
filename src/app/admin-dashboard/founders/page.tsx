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
import Cookies from 'js-cookie';
import DebtTransactionModal from '@/features/founders/components/DebtTransactionModal';
import AdminModal from '@/features/founders/components/AdminModal';

interface Founder {
    _id: string;
    name: string;
    email: string;
    role: string;
    baseSalary: number;
    debtRemaining: number;
    lastDebtReason?: string;
}

export default function FoundersManagement() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<Founder | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // Debt states
    const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
    const [debtModalType, setDebtModalType] = useState<'debt' | 'return'>('debt');
    const [targetFounder, setTargetFounder] = useState<any>(null);
    const [debtLogs, setDebtLogs] = useState<any[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userCookie = Cookies.get('user');
            const loggedInUser = userCookie ? JSON.parse(userCookie) : null;

            const res = await api.get('/admin/founders');
            const data = res.data;
            setFounders(data);

            if (loggedInUser) {
                const profile = data.find((f: Founder) => f.email === loggedInUser.email);
                if (profile) setCurrentUser(profile);
            }
            fetchLogs();
        } catch (err) {
            toast.error("Synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            setLogsLoading(true);
            const res = await api.get('/admin/founders/debt');
            setDebtLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setLogsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const totalBaseTier = founders.reduce((sum, f) => sum + (f.baseSalary || 0), 0);
    const totalDebtCount = founders.reduce((sum, f) => sum + (f.debtRemaining || 0), 0);

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
                    <AdminModal 
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
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Admin Core</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 ml-1">Administrative Equity & Live Matrix</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 px-2">
                        <div className="bg-primary p-6 rounded-[2rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">My Base Tier</p>
                            <h2 className="text-2xl font-black italic tracking-tighter mb-4 leading-none">₹{currentUser?.baseSalary?.toLocaleString() || '0'}</h2>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-white/80">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Personal Tier</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Base Tier</p>
                            <h2 className="text-2xl font-black italic tracking-tighter text-gray-800 mb-4 leading-none">₹{totalBaseTier.toLocaleString()}</h2>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 tracking-widest uppercase">
                                <Users className="w-4 h-4 text-primary" />
                                <span>Aggregate Core</span>
                            </div>
                        </div>

                        <div className="bg-rose-500 p-6 rounded-[2rem] text-white shadow-xl shadow-rose-500/20">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">My Debt</p>
                            <h2 className="text-2xl font-black italic tracking-tighter mb-4 leading-none">₹{currentUser?.debtRemaining?.toLocaleString() || '0'}</h2>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-white/80 uppercase">
                                <TrendingDown className="w-4 h-4" />
                                <span>Personal Liability</span>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0B] p-6 rounded-[2rem] text-white shadow-xl shadow-black/20">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Total Debt</p>
                            <h2 className="text-2xl font-black italic tracking-tighter mb-4 text-white leading-none">₹{totalDebtCount.toLocaleString()}</h2>
                             <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter opacity-40">
                                <IndianRupee className="w-4 h-4" />
                                <span>System Exposure</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Matrix */}
                    <div className="space-y-12 px-2">
                        {/* Member Matrix */}
                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-lg font-black text-gray-800 italic uppercase">Administrative Matrix</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live Economic Core Directory</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                                        <thead>
                                            <tr className="bg-white text-gray-300 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-8 py-6">Admin Profile</th>
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
                                                            {f.lastDebtReason && (
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight italic bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100/50 w-fit">
                                                                    {f.lastDebtReason}
                                                                </span>
                                                            )}
                                                            <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                                                                <div className="h-full bg-rose-500" style={{ width: '40%' }}></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            {currentUser?._id === f._id && (
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
                                                            )}
                                                            
                                                            {currentUser?.email === 'admin@brightpath.com' && (
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
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                            </div>
                        </div>

                        {/* Insight Panel */}
                        <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 flex items-center gap-4 text-primary">
                            <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                            <p className="text-[9px] font-bold italic leading-relaxed">Administrative payroll is automatically adjusted for debt recovery. Distributions are logged in the master ledger for fiscal audit integrity.</p>
                        </div>

                        {/* Debt History Logs */}
                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mt-12 mb-20">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-gray-800 italic uppercase">Administrative Debt Registry</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Audit Trail of Core Capital Flows</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                            <th className="px-8 py-5">Date</th>
                                            <th className="px-4 py-5">Target Admin</th>
                                            <th className="px-4 py-5">Event</th>
                                            <th className="px-4 py-5">Quantum</th>
                                            <th className="px-8 py-5">Justification</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {logsLoading ? (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-20 text-center text-primary font-black italic uppercase tracking-widest animate-pulse">Retrieving historical data matrices...</td>
                                            </tr>
                                        ) : debtLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-20 text-center text-gray-300 font-bold italic uppercase tracking-widest text-[9px]">No historical capital entries detected in the registry.</td>
                                            </tr>
                                        ) : (
                                            debtLogs.map((log: any) => (
                                                <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase italic">
                                                        {new Date(log.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-4 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-gray-800">{log.founderId?.name || 'Admin Core'}</span>
                                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{log.founderId?.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-6">
                                                        {log.type === 'debt' ? (
                                                            <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest italic bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                                                                <ArrowUpRight className="w-3 h-3" /> Debt
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest italic bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                                                                <ArrowDownRight className="w-3 h-3" /> Return
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className={`px-4 py-6 font-black text-sm italic ${log.type === 'debt' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                        {log.type === 'debt' ? '+' : '-'}₹{log.amount.toLocaleString()}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-[10px] font-bold text-gray-400 italic leading-relaxed max-w-xs">{log.reason || 'Institutional adjustment'}</p>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
