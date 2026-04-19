'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { 
    Trophy, 
    Plus, 
    Edit3, 
    Trash2, 
    Star, 
    TrendingUp, 
    Users, 
    Menu, 
    Calendar,
    ChevronDown,
    X,
    Filter,
    CheckCircle2,
    CalendarDays
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface IncentiveRule {
    _id: string;
    ruleName: string;
    targetHours: number;
    incentiveAmount: number;
    active: boolean;
    targetTeachers: string[];
}

interface Teacher {
    _id: string;
    name: string;
}

interface SalaryRecord {
    _id: string;
    teacherId: {
        _id: string;
        name: string;
    };
    totalHours: number;
    incentives: number;
    month: string;
}

export default function IncentivesManager() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [rules, setRules] = useState<IncentiveRule[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingRule, setEditingRule] = useState<IncentiveRule | null>(null);

    // Month Selector State
    const currentMonth = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())} ${new Date().getFullYear()}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    // Form State
    const [formData, setFormData] = useState({
        ruleName: 'Monthly Incentive',
        targetHours: 20,
        incentiveAmount: 2000,
        active: true,
        targetTeachers: [] as string[]
    });

    const months = useMemo(() => {
        const arr = [];
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

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchSalaries();
    }, [selectedMonth]);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const [rulesRes, teachersRes] = await Promise.all([
                api.get('/admin/incentives'),
                api.get('/teachers')
            ]);
            setRules(rulesRes.data);
            setTeachers(teachersRes.data);
        } catch (error) {
            toast.error('Failed to synchronize data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSalaries = async () => {
        try {
            const res = await api.get(`/finance/salary?month=${selectedMonth}`);
            setSalaries(res.data);
        } catch (e) {
            console.error("Failed to fetch salaries for tracking", e);
        }
    };

    const handleOpenModal = (rule?: IncentiveRule) => {
        if (rule) {
            setEditingRule(rule);
            setFormData({
                ruleName: rule.ruleName,
                targetHours: rule.targetHours,
                incentiveAmount: rule.incentiveAmount,
                active: rule.active,
                targetTeachers: rule.targetTeachers || []
            });
        } else {
            setEditingRule(null);
            setFormData({
                ruleName: 'Monthly Incentive',
                targetHours: 20,
                incentiveAmount: 2000,
                active: true,
                targetTeachers: []
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            if (editingRule) {
                await api.put(`/admin/incentives/${editingRule._id}`, formData);
                toast.success('Incentive plan updated');
            } else {
                await api.post('/admin/incentives', formData);
                toast.success('New incentive plan launched');
            }
            fetchInitialData();
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Matrix update failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Erase this reward matrix permanently?')) return;
        try {
            await api.delete(`/admin/incentives/${id}`);
            toast.success('Plan purged');
            fetchInitialData();
        } catch (error) {
            toast.error('Purge failed');
        }
    };

    const getAchieversForRule = (rule: IncentiveRule) => {
        return salaries.filter(s => {
            const matchesTeacher = rule.targetTeachers.length === 0 || rule.targetTeachers.includes(s.teacherId?._id);
            return matchesTeacher && s.totalHours >= rule.targetHours;
        });
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
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Incentives Hub</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-12 mt-20 lg:mt-0">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4 px-2">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Rewards Matrix</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 ml-1">Faculty Performance Incentive Engine</p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="relative group w-full md:min-w-[200px]">
                                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary z-10" />
                                <select 
                                    className="w-full pl-11 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest focus:border-primary outline-none transition-all cursor-pointer appearance-none shadow-sm"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            
                            <button 
                                onClick={() => handleOpenModal()}
                                className="w-full md:w-auto px-8 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 italic"
                            >
                                <Plus className="w-4 h-4" /> Initialize Plan
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                         <div className="p-32 text-center text-primary font-black italic uppercase tracking-widest animate-pulse">Synchronizing performance data...</div>
                    ) : rules.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-24 text-center border-2 border-dashed border-gray-100 mx-2">
                            <Trophy className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                            <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[9px]">No incentive matrices configured in the system.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                            {rules.map(rule => {
                                const achievers = getAchieversForRule(rule);
                                return (
                                    <div key={rule._id} className={`bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 ${!rule.active ? 'opacity-60 grayscale' : ''}`}>
                                        <div className="absolute top-0 right-0 p-6 md:p-10 flex gap-2 z-10">
                                            <button onClick={() => handleOpenModal(rule)} className="p-3 bg-gray-50 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-xl transition shadow-sm"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(rule._id)} className="p-3 bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                        </div>

                                        <div className="flex items-center gap-6 mb-10">
                                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-inner transition-colors ${rule.active ? 'bg-primary/5 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                                <Trophy className="w-8 h-8 md:w-10 md:h-10" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg md:text-2xl font-black text-gray-800 tracking-tighter italic uppercase">{rule.ruleName}</h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {rule.active ? (
                                                        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic border border-green-200">Active</span>
                                                    ) : (
                                                        <span className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic">Disabled</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-10">
                                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Star className="w-3 h-3" /> Hourly Target</p>
                                                <p className="text-xl font-black text-primary italic uppercase tracking-tighter">{rule.targetHours}h</p>
                                            </div>
                                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><TrendingUp className="w-3 h-3" /> Reward Quantum</p>
                                                <p className="text-xl font-black text-teal-600 italic uppercase tracking-tighter">₹{(rule.incentiveAmount || 0).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-50">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{selectedMonth} Achievers</p>
                                                <span className="text-xs font-black text-primary">{achievers.length} Facult.</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {achievers.length === 0 ? (
                                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">No threshold breaches detected yet.</p>
                                                ) : achievers.map(s => (
                                                    <span key={s._id} className="px-3 py-1.5 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-primary/10">
                                                        {s.teacherId?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Redesign */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-white">
                        <div className="bg-primary p-6 lg:p-8 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white border border-white/20 p-2 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 bg-white/10 rounded-[1.2rem] flex items-center justify-center text-2xl mb-4 border border-white/20 italic">
                                T
                            </div>
                            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">{editingRule ? 'Modify Reward' : 'New Reward Plan'}</h2>
                            <p className="text-white/60 font-black text-[9px] uppercase tracking-[0.2em] mt-1">Institutional Performance Matrix</p>
                        </div>

                        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-5 bg-[#fafafa]">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Designation</label>
                                <input 
                                    className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all shadow-sm"
                                    placeholder="e.g. Master Instructor Incentive"
                                    value={formData.ruleName}
                                    onChange={(e) => setFormData({...formData, ruleName: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hourly Threshold</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all shadow-sm"
                                        value={formData.targetHours}
                                        onChange={(e) => setFormData({...formData, targetHours: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantum (₹)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm outline-none focus:border-primary transition-all shadow-sm"
                                        value={formData.incentiveAmount}
                                        onChange={(e) => setFormData({...formData, incentiveAmount: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Faculty Audience</label>
                                <div className="bg-white border-2 border-gray-100 p-6 rounded-2xl max-h-40 overflow-y-auto no-scrollbar shadow-sm">
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 accent-primary cursor-pointer"
                                            checked={formData.targetTeachers.length === 0}
                                            onChange={() => setFormData({...formData, targetTeachers: []})}
                                        />
                                        <span className="text-[10px] font-black text-primary uppercase italic">Universal Faculty Tier (All)</span>
                                    </div>
                                    <div className="space-y-3">
                                        {teachers.map(t => (
                                            <div key={t._id} className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 accent-primary cursor-pointer"
                                                    checked={formData.targetTeachers.includes(t._id)}
                                                    onChange={(e) => {
                                                        const newArr = e.target.checked 
                                                            ? [...formData.targetTeachers, t._id]
                                                            : formData.targetTeachers.filter(id => id !== t._id);
                                                        setFormData({...formData, targetTeachers: newArr});
                                                    }}
                                                />
                                                <span className="text-xs font-bold text-gray-600">{t.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                                    disabled={isSaving}
                                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 italic disabled:opacity-50"
                                >
                                    {isSaving ? 'Synching...' : (editingRule ? 'Modify Matrix' : 'Launch Matrix')} <CheckCircle2 className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
