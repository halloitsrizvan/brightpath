'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import MonthPicker from '@/components/ui/MonthPicker';
import { 
    Receipt, 
    Plus, 
    Search, 
    Trash2, 
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
    Menu,
    Shield
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

interface Expense {
    _id: string;
    category: 'Internet' | 'Software Subscription' | 'Marketing' | 'Payment Gateway Charges' | 'Equipment' | 'Miscellaneous';
    amount: number;
    description: string;
    date: string;
    month: string;
}

const CategoryIcons: any = {
    'Internet': <Wifi className="w-4 h-4 text-blue-500" />,
    'Software Subscription': <Settings className="w-4 h-4 text-purple-500" />,
    'Marketing': <Megaphone className="w-4 h-4 text-pink-500" />,
    'Payment Gateway Charges': <CreditCard className="w-4 h-4 text-teal-500" />,
    'Equipment': <HardDrive className="w-4 h-4 text-orange-500" />,
    'Miscellaneous': <MoreHorizontal className="w-4 h-4 text-gray-500" />
};

export default function ExpensesManager() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const viewOnly = isViewOnly('expenses');
    
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
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (viewOnly) return;
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
        if (viewOnly) return;
        if (!window.confirm('Are you sure you want to delete this expense record?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            toast.success('Record deleted');
            fetchExpenses();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

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
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900">
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
                {/* Mobile Header Bar */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 bg-white/80 backdrop-blur-md shadow-xs p-3.5 flex items-center justify-between lg:hidden border-b border-gray-100">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-[#45308D] shadow-xs active:scale-95 transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Expenses</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('expenses') ? (
                        <AccessDenied roleName={roleName} pageName="Operating Outflow & Expenses" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Outflow Management
                                        </span>
                                        {viewOnly && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Operational Expenses
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Overhead cost tracking, subscription costs & monthly outflows</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                                    <MonthPicker 
                                        selected={selectedMonth} 
                                        onChange={setSelectedMonth} 
                                        allowAll={false}
                                    />

                                    {!viewOnly && (
                                        <button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full sm:w-auto px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Expense</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stat Highlights */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Total Outflow</p>
                                        <p className="text-2xl font-black text-rose-600 mt-0.5">₹{(stats.total || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Entries Count</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.count}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center border border-gray-100">
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs col-span-2 lg:col-span-1 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Primary Category</p>
                                        <p className="text-xl font-black text-teal-700 mt-0.5 truncate">{stats.maxCat}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Search Filter Bar */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search expense description or category..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-9 pr-3.5 bg-white border border-gray-200 focus:border-[#45308D] focus:ring-1 focus:ring-[#45308D]/20 rounded-xl outline-none text-xs font-semibold text-gray-900 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Table & List Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                {loading ? (
                                    <div className="py-16 text-center text-[#45308D] font-bold text-xs animate-pulse">
                                        Loading expense matrix...
                                    </div>
                                ) : filteredExpenses.length === 0 ? (
                                    <div className="py-16 text-center text-gray-400 font-medium text-xs">
                                        No expenses recorded for {selectedMonth}.
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-5 py-3.5">Expense Description</th>
                                                        <th className="px-5 py-3.5">Category</th>
                                                        <th className="px-5 py-3.5">Date</th>
                                                        <th className="px-5 py-3.5 text-right">Amount (₹)</th>
                                                        {!viewOnly && <th className="px-5 py-3.5 text-center">Actions</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {filteredExpenses.map((exp) => (
                                                        <tr key={exp._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <p className="text-xs font-bold text-gray-900">{exp.description || 'Institutional cost'}</p>
                                                                <span className="text-[10px] text-gray-400">ID: {exp._id.slice(-6)}</span>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                                                        {CategoryIcons[exp.category]}
                                                                    </div>
                                                                    <span className="text-xs font-semibold text-gray-700">{exp.category}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs text-gray-600 font-medium">
                                                                {new Date(exp.date).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right font-black text-gray-900 text-xs">
                                                                ₹{(exp.amount || 0).toLocaleString()}
                                                            </td>
                                                            {!viewOnly && (
                                                                <td className="px-5 py-3.5 text-center">
                                                                    <button 
                                                                        onClick={() => handleDelete(exp._id)}
                                                                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                                        title="Delete Record"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="block md:hidden p-3 space-y-2.5">
                                            {filteredExpenses.map((exp) => (
                                                <div 
                                                    key={exp._id}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-2.5 shadow-xs"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-100 shrink-0">
                                                                {CategoryIcons[exp.category]}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-900 truncate max-w-[180px]">{exp.description || 'Cost'}</p>
                                                                <p className="text-[10px] text-gray-400">{exp.category}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-black text-rose-600 shrink-0">
                                                            ₹{(exp.amount || 0).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-50">
                                                        <span>{new Date(exp.date).toLocaleDateString()}</span>
                                                        {!viewOnly && (
                                                            <button onClick={() => handleDelete(exp._id)} className="p-1 text-gray-400 hover:text-rose-500 rounded transition">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative z-10 shadow-2xl border border-gray-100 flex flex-col">
                        <div className="bg-[#45308D] p-5 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold leading-tight">Log New Expense</h2>
                                <p className="text-[11px] text-white/70 font-medium">Record operational overhead payment</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white text-lg font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-white border border-gray-200 py-2 pl-3 pr-8 rounded-xl font-semibold text-xs outline-none focus:border-[#45308D] transition-all appearance-none"
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
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Amount (₹)</label>
                                    <input 
                                        type="number"
                                        required
                                        className="w-full bg-white border border-gray-200 py-2 px-3 rounded-xl font-semibold text-xs outline-none focus:border-[#45308D] transition-all"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Date</label>
                                <input 
                                    type="date"
                                    required
                                    className="w-full bg-white border border-gray-200 py-2 px-3 rounded-xl font-semibold text-xs outline-none focus:border-[#45308D] transition-all"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Description / Notes</label>
                                <textarea 
                                    className="w-full bg-white border border-gray-200 py-2 px-3 rounded-xl font-semibold text-xs outline-none focus:border-[#45308D] transition-all min-h-[80px] resize-none"
                                    placeholder="Add expense details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-2.5 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-2.5 bg-[#45308D] hover:bg-[#45308D]/90 text-white rounded-xl font-bold text-xs shadow-xs transition"
                                >
                                    Save Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
