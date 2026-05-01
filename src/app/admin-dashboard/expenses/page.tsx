'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import MonthPicker from '@/components/ui/MonthPicker';
import { 
    Receipt, 
    Plus, 
    Search, 
    Calendar, 
    Filter, 
    Trash2, 
    Edit3, 
    Wifi, 
    CreditCard, 
    Megaphone, 
    Settings, 
    HardDrive, 
    MoreHorizontal,
    TrendingUp,
    IndianRupee,
    ChevronDown,
    X,
    CheckCircle2,
    CalendarDays,
    Menu
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Expense {
    _id: string;
    category: 'Internet' | 'Software Subscription' | 'Marketing' | 'Payment Gateway Charges' | 'Equipment' | 'Miscellaneous';
    amount: number;
    description: string;
    date: string;
    month: string;
}

const CategoryIcons: any = {
    'Internet': <Wifi className="w-5 h-5 text-blue-500" />,
    'Software Subscription': <Settings className="w-5 h-5 text-purple-500" />,
    'Marketing': <Megaphone className="w-5 h-5 text-pink-500" />,
    'Payment Gateway Charges': <CreditCard className="w-5 h-5 text-teal-500" />,
    'Equipment': <HardDrive className="w-5 h-5 text-orange-500" />,
    'Miscellaneous': <MoreHorizontal className="w-5 h-5 text-gray-500" />
};

export default function ExpensesManager() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        category: 'Internet',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    useEffect(() => {
        if (!selectedMonth) setSelectedMonth(currentMonth);
        fetchExpenses();
    }, [selectedMonth]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/expenses?month=${selectedMonth || currentMonth}`);
            setExpenses(data);
        } catch (error) {
            toast.error('Failed to load global expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const expenseDate = new Date(formData.date);
            const monthStr = `${monthNames[expenseDate.getMonth()]} ${expenseDate.getFullYear()}`;
            
            await api.post('/expenses', {
                ...formData,
                amount: Number(formData.amount),
                month: monthStr
            });
            
            toast.success('Expense recorded');
            setIsModalOpen(false);
            setFormData({ category: 'Internet', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
            fetchExpenses();
        } catch (error) {
            toast.error('Entry failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Erase this financial record?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            toast.success('Record purged');
            fetchExpenses();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const monthsOptions = useMemo(() => {
        const options = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setDate(1);
            d.setMonth(d.getMonth() - i);
            options.push(`${monthNames[d.getMonth()]} ${d.getFullYear()}`);
        }
        return options;
    }, []);

    const filteredExpenses = expenses.filter(exp => 
        exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = useMemo(() => {
        const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);
        const count = expenses.length;
        const topCategory = expenses.reduce((acc: any, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});
        const maxCat = Object.entries(topCategory).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'None';
        
        return { total, count, maxCat };
    }, [expenses]);

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
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Expense Hub</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-12 mt-20 lg:mt-0">
                    {/* Header Container */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 mt-4 px-2">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Operating <span className="text-primary">Outflow</span></h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-2 ml-1 flex items-center gap-2"> Institutional Expense Oracle</p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <MonthPicker 
                                selected={selectedMonth} 
                                onChange={setSelectedMonth} 
                                allowAll={false}
                            />

                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full md:w-auto px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 italic"
                            >
                                <Plus className="w-4 h-4" /> Log New Expense
                            </button>
                        </div>
                    </div>

                    {/* Performance Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 mb-12 px-2">
                        <div className="bg-[#45308D] p-3 md:p-10 rounded-[1.5rem] md:rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">Outflow</p>
                            <h2 className="text-lg md:text-4xl font-black italic tracking-tighter mb-4 leading-none">₹{(stats.total || 0).toLocaleString()}</h2>
                            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-white/50 tracking-widest uppercase">
                                <TrendingUp className="w-4 h-4" /> Real-time Sum
                            </div>
                        </div>

                        <div className="bg-white p-3 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/30 group hover:border-primary/20 transition-all">
                            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Transactions</p>
                            <h2 className="text-lg md:text-3xl font-black italic tracking-tighter text-gray-900 leading-none">{stats.count} <span className="text-[10px] not-italic opacity-40">Records</span></h2>
                            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-gray-300 tracking-widest uppercase mt-4">
                                <Receipt className="w-4 h-4" /> Economic Log
                            </div>
                        </div>

                        <div className="bg-[#F8F9FA] p-3 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/30 col-span-2 lg:col-span-1">
                            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Top Sector</p>
                            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter text-teal-700 leading-none truncate">{stats.maxCat}</h2>
                            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-teal-600/40 tracking-widest uppercase mt-4">
                                <Filter className="w-4 h-4" /> Dominant Node
                            </div>
                        </div>
                    </div>

                    {/* Search & List */}
                    <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 mx-2">
                        <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-50">
                            <div>
                                <h3 className="text-lg md:text-xl font-black text-gray-900 italic uppercase">Expense Ledger</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional Outflow Analysis</p>
                            </div>

                            <div className="relative group w-full sm:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Search scholarly nodes..."
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-primary outline-none transition-all shadow-inner"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction Desc.</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Quantum</th>
                                        <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Registry Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center text-primary font-black italic uppercase tracking-widest animate-pulse">Syncing financial matrix...</td>
                                        </tr>
                                    ) : filteredExpenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest text-[9px]">No fiscal outflows recorded for {selectedMonth}</td>
                                        </tr>
                                    ) : (
                                        filteredExpenses.map((exp) => (
                                            <tr key={exp._id} className="group hover:bg-gray-50/80 transition-all duration-300">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-gray-800 tracking-tight leading-none mb-1 group-hover:text-primary transition-colors uppercase italic">{exp.description || 'Institutional cost'}</span>
                                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">CID: {exp._id.slice(-8)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 bg-gray-50 rounded-xl shadow-sm border border-gray-100 transition-transform group-hover:scale-110">
                                                            {CategoryIcons[exp.category]}
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] italic">{exp.category}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase italic">{new Date(exp.date).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-lg font-black text-gray-900 italic tracking-tighter leading-none">₹{(exp.amount || 0).toLocaleString()}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button 
                                                            onClick={() => handleDelete(exp._id)}
                                                            className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 hover:shadow-lg rounded-xl transition-all border border-gray-100 shadow-sm"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
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

            {/* Modal Redesign */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-white">
                        <div className="bg-primary p-6 md:p-8 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white border border-white/20 p-2 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <Receipt className="w-12 h-12 bg-white/10 rounded-[1.2rem] flex items-center justify-center text-3xl mb-4 border border-white/20 italic" />
                            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase mb-1">Add Expense Node</h2>
                            <p className="text-white/60 font-black text-[9px] uppercase tracking-[0.2em]">Institutional Outflow Sync</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 bg-[#fafafa]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Spending Cluster</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-white border-2 border-gray-100 py-4 pl-6 pr-10 rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all appearance-none shadow-sm"
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                                        >
                                            <option>Internet</option>
                                            <option>Software Subscription</option>
                                            <option>Marketing</option>
                                            <option>Payment Gateway Charges</option>
                                            <option>Equipment</option>
                                            <option>Miscellaneous</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantum (₹)</label>
                                    <input 
                                        type="number"
                                        required
                                        className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all shadow-sm"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transaction Timeline</label>
                                <input 
                                    type="date"
                                    required
                                    className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all shadow-sm"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registry Context</label>
                                <textarea 
                                    className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all min-h-[100px] resize-none shadow-sm"
                                    placeholder="Institutional context for this expenditure..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all font-sans"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 italic"
                                >
                                    Commit Entry <CheckCircle2 className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
