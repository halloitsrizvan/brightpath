'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import MonthPicker from '@/components/ui/MonthPicker';
import { 
    Trophy, 
    Plus, 
    Edit3, 
    Trash2, 
    Star, 
    TrendingUp, 
    Users, 
    Menu, 
    Shield, 
    Award,
    CheckCircle2
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

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
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [rules, setRules] = useState<IncentiveRule[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingRule, setEditingRule] = useState<IncentiveRule | null>(null);

    const viewOnly = isViewOnly('incentives');

    const currentMonth = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())} ${new Date().getFullYear()}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const [formData, setFormData] = useState({
        ruleName: 'Monthly Incentive',
        targetHours: 20,
        incentiveAmount: 2000,
        active: true,
        targetTeachers: [] as string[]
    });

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
        if (viewOnly) return;
        try {
            setIsSaving(true);
            if (editingRule) {
                await api.put(`/admin/incentives/${editingRule._id}`, formData);
                toast.success('Incentive plan updated');
            } else {
                await api.post('/admin/incentives', formData);
                toast.success('New incentive plan created');
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
        if (viewOnly) return;
        if (!window.confirm('Are you sure you want to delete this incentive plan?')) return;
        try {
            await api.delete(`/admin/incentives/${id}`);
            toast.success('Plan deleted');
            fetchInitialData();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const getAchieversForRule = (rule: IncentiveRule) => {
        return salaries.filter(s => {
            const matchesTeacher = rule.targetTeachers.length === 0 || rule.targetTeachers.includes(s.teacherId?._id);
            return matchesTeacher && s.totalHours >= rule.targetHours;
        });
    };

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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Incentives</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('incentives') ? (
                        <AccessDenied roleName={roleName} pageName="Faculty Rewards Matrix" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Performance Rewards
                                        </span>
                                        {viewOnly && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Faculty Incentives
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Teaching hour thresholds & monthly performance bonuses</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                                    <MonthPicker 
                                        selected={selectedMonth} 
                                        onChange={setSelectedMonth} 
                                        allowAll={false}
                                    />
                                    
                                    {!viewOnly && (
                                        <button 
                                            onClick={() => handleOpenModal()}
                                            className="w-full sm:w-auto px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>New Incentive Plan</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Plans Grid */}
                            {isLoading ? (
                                <div className="bg-white rounded-2xl p-16 text-center text-[#45308D] font-bold text-xs animate-pulse border border-gray-100 shadow-xs">
                                    Loading performance incentive plans...
                                </div>
                            ) : rules.length === 0 ? (
                                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-xs">
                                    <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <h2 className="text-base font-bold text-gray-900">No Incentive Plans Configured</h2>
                                    <p className="text-gray-400 text-xs mt-1">Create threshold criteria for faculty bonuses.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rules.map(rule => {
                                        const achievers = getAchieversForRule(rule);
                                        return (
                                            <div 
                                                key={rule._id} 
                                                className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:border-[#45308D]/20 transition-all space-y-4 ${
                                                    !rule.active ? 'opacity-60' : ''
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10 shrink-0">
                                                                <Trophy className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-base font-bold text-gray-900">{rule.ruleName}</h3>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                                        rule.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-gray-100 text-gray-500'
                                                                    }`}>
                                                                        {rule.active ? 'Active' : 'Disabled'}
                                                                    </span>
                                                                    <span className="text-[11px] text-gray-400 font-medium">
                                                                        {rule.targetTeachers.length === 0 ? 'All Faculty' : `${rule.targetTeachers.length} Tutors`}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {!viewOnly && (
                                                            <div className="flex items-center gap-1">
                                                                <button 
                                                                    onClick={() => handleOpenModal(rule)} 
                                                                    className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition"
                                                                    title="Edit Plan"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(rule._id)} 
                                                                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                                    title="Delete Plan"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2.5 mt-4">
                                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                                                <Star className="w-3 h-3 text-amber-500" /> Hourly Target
                                                            </p>
                                                            <p className="text-base font-black text-[#45308D]">{rule.targetHours} hrs</p>
                                                        </div>
                                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                                                <TrendingUp className="w-3 h-3 text-emerald-600" /> Bonus Amount
                                                            </p>
                                                            <p className="text-base font-black text-emerald-700">₹{(rule.incentiveAmount || 0).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-gray-100">
                                                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                                                        <span className="text-gray-500">{selectedMonth} Achievers</span>
                                                        <span className="text-[#45308D] font-bold">{achievers.length} qualified</span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1">
                                                        {achievers.length === 0 ? (
                                                            <span className="text-[11px] text-gray-400">No tutors crossed the {rule.targetHours}h threshold yet.</span>
                                                        ) : (
                                                            achievers.map(s => (
                                                                <span key={s._id} className="px-2 py-0.5 bg-[#45308D]/5 text-[#45308D] border border-[#45308D]/10 rounded text-[10px] font-bold">
                                                                    {s.teacherId?.name} ({s.totalHours}h)
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
                                <h2 className="text-base font-bold leading-tight">{editingRule ? 'Modify Incentive Plan' : 'New Incentive Plan'}</h2>
                                <p className="text-[11px] text-white/70 font-medium">Define hourly targets and bonus reward payout</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white text-lg font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Plan Name</label>
                                <input 
                                    className="w-full bg-white border border-gray-200 py-2 px-3 rounded-xl font-semibold text-xs outline-none focus:border-[#45308D] transition-all"
                                    placeholder="e.g. 20-Hour Teaching Bonus"
                                    value={formData.ruleName}
                                    onChange={(e) => setFormData({...formData, ruleName: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Target Hours</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white border border-gray-200 py-2 px-3 rounded-xl font-semibold text-xs outline-none focus:border-[#45308D] transition-all"
                                        value={formData.targetHours}
                                        onChange={(e) => setFormData({...formData, targetHours: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1">Incentive (₹)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white border border-gray-200 py-2 px-3 rounded-xl font-semibold text-xs outline-none focus:border-[#45308D] transition-all"
                                        value={formData.incentiveAmount}
                                        onChange={(e) => setFormData({...formData, incentiveAmount: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">Target Faculty Audience</label>
                                <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl max-h-36 overflow-y-auto space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer pb-2 border-b border-gray-200 font-bold text-xs text-[#45308D]">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 accent-[#45308D] rounded"
                                            checked={formData.targetTeachers.length === 0}
                                            onChange={() => setFormData({...formData, targetTeachers: []})}
                                        />
                                        <span>All Teachers (Universal)</span>
                                    </label>
                                    {teachers.map(t => (
                                        <label key={t._id} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 accent-[#45308D] rounded"
                                                checked={formData.targetTeachers.includes(t._id)}
                                                onChange={(e) => {
                                                    const newArr = e.target.checked 
                                                        ? [...formData.targetTeachers, t._id]
                                                        : formData.targetTeachers.filter(id => id !== t._id);
                                                    setFormData({...formData, targetTeachers: newArr});
                                                }}
                                            />
                                            <span>{t.name}</span>
                                        </label>
                                    ))}
                                </div>
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
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 bg-[#45308D] hover:bg-[#45308D]/90 text-white rounded-xl font-bold text-xs shadow-xs transition disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : (editingRule ? 'Update Plan' : 'Save Plan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
