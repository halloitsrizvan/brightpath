'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Menu, Plus, Trash2, Edit3, Trophy, Target, DollarSign, Users, CheckCircle, XCircle, Save, Loader2, X, Calendar, ChevronRight, Award } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Teacher {
    _id: string;
    name: string;
    email: string;
}

interface IncentiveRule {
    _id: string;
    ruleName: string;
    targetHours: number;
    incentiveAmount: number;
    active: boolean;
    targetTeachers: Teacher[];
}

interface SalaryRecord {
    teacherId: { _id: string, name: string };
    totalHours: number;
    month: string;
}

export default function AdminIncentives() {
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
                targetTeachers: rule.targetTeachers.map(t => t._id)
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
                toast.success('Incentive updated');
            } else {
                await api.post('/admin/incentives', formData);
                toast.success('Incentive created');
            }
            setIsModalOpen(false);
            fetchInitialData();
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Discard this incentive permanently?')) return;
        try {
            await api.delete(`/admin/incentives/${id}`);
            toast.success('Incentive discarded');
            setRules(rules.filter(r => r._id !== id));
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const toggleTeacher = (id: string) => {
        setFormData(prev => ({
            ...prev,
            targetTeachers: prev.targetTeachers.includes(id)
                ? prev.targetTeachers.filter(t => t !== id)
                : [...prev.targetTeachers, id]
        }));
    };

    // Calculate achievers for a rule based on the fetched salaries
    const getAchieversForRule = (rule: IncentiveRule) => {
        const salaryMap = new Map<string, number>();
        salaries.forEach(s => {
            const tId = typeof s.teacherId === 'object' ? s.teacherId._id : s.teacherId;
            salaryMap.set(tId, s.totalHours);
        });

        return rule.targetTeachers.filter(teacher => {
            const hours = salaryMap.get(teacher._id) || 0;
            return hours >= rule.targetHours;
        });
    };

    const months = useMemo(() => {
        const arr = [];
        const date = new Date();
        date.setDate(1); // Set to 1st of month to avoid overflow (e.g. March 29 -> Feb 29 -> March 1)
        for (let i = 0; i < 6; i++) {
            const m = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const y = date.getFullYear();
            arr.push(`${m} ${y}`);
            date.setMonth(date.getMonth() - 1);
        }
        return arr;
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-center" />

            <div className={`fixed z-50 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar role="admin" />
            </div>

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="flex items-center justify-between p-4 bg-white shadow-sm lg:hidden">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
                        <Menu className="w-8 h-8 text-[#45308D]" />
                    </button>
                    <h1 className="text-xl font-bold text-[#45308D]">BrightPath Admin</h1>
                </header>

                <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-3xl font-black text-[#45308D] tracking-tight">Incentive Tracking</h1>
                            <p className="text-gray-500 font-medium">Analyze and manage faculty rewards.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#45308D]" />
                                <select 
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl font-black text-sm focus:border-[#45308D] outline-none transition-all cursor-pointer"
                                >
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-[#45308D] text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all"
                            >
                                <Plus className="w-5 h-5" /> New Plan
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-20 text-[#45308D] animate-pulse font-black">Syncing system...</div>
                    ) : rules.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-200">
                            <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-bold">No incentive rules configured yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {rules.map(rule => {
                                const achievers = getAchieversForRule(rule);
                                return (
                                    <div key={rule._id} className={`bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group ${!rule.active ? 'opacity-60 grayscale' : ''}`}>
                                        <div className="absolute top-0 right-0 p-6 flex gap-2">
                                            <button onClick={() => handleOpenModal(rule)} className="text-gray-400 hover:text-[#45308D] transition-colors bg-gray-50 p-2 rounded-xl"><Edit3 className="w-5 h-5" /></button>
                                            <button onClick={() => handleDelete(rule._id)} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-xl"><Trash2 className="w-5 h-5" /></button>
                                        </div>

                                        <div className="flex items-center gap-4 mb-8">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${rule.active ? 'bg-[#45308D]/10 text-[#45308D]' : 'bg-gray-100 text-gray-400'}`}>
                                                <Trophy className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">{rule.ruleName}</h3>
                                                <div className="flex items-center gap-2">
                                                    {rule.active ? (
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Active Plan</span>
                                                    ) : (
                                                        <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Draft / Stopped</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-gray-50/50 p-5 rounded-[2rem] border border-gray-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Target className="w-4 h-4 text-[#45308D] opacity-40" />
                                                    <p className="text-[10px] font-black uppercase text-gray-400">Target</p>
                                                </div>
                                                <p className="text-3xl font-black text-[#45308D] italic">{rule.targetHours}<span className="text-base not-italic text-gray-400 ml-1">hrs</span></p>
                                            </div>
                                            <div className="bg-[#FDC70B]/5 p-5 rounded-[2rem] border border-[#FDC70B]/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign className="w-4 h-4 text-[#FDC70B]" />
                                                    <p className="text-[10px] font-black uppercase text-[#c79c09]">Bonus</p>
                                                </div>
                                                <p className="text-3xl font-black text-[#c79c09] italic">₹{rule.incentiveAmount.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Award className="w-5 h-5 text-yellow-500" />
                                                        <h4 className="text-sm font-black text-gray-800 uppercase tracking-tighter">Achievers ({selectedMonth})</h4>
                                                    </div>
                                                    <span className="text-2xl font-black text-green-500 bg-green-50 px-4 py-1 rounded-2xl">{achievers.length}</span>
                                                </div>
                                                
                                                {achievers.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                                        {achievers.map(teacher => (
                                                            <div key={teacher._id} className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100 group/item hover:bg-green-50 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-black text-xs">
                                                                        {teacher.name.charAt(0)}
                                                                    </div>
                                                                    <p className="text-sm font-black text-gray-700">{teacher.name}</p>
                                                                </div>
                                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                        <p className="text-xs font-bold text-gray-400">No teachers have met this target for {selectedMonth} yet.</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-6 border-t border-gray-50">
                                                <p className="text-[10px] font-black uppercase text-gray-300 mb-3 flex items-center gap-2">
                                                    <Users className="w-3 h-3" /> Target Group ({rule.targetTeachers.length} assigned)
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {rule.targetTeachers.slice(0, 5).map(teacher => (
                                                        <div key={teacher._id} className="text-[10px] font-bold bg-white text-gray-400 px-3 py-1 rounded-full border border-gray-100 italic">
                                                            {teacher.name}
                                                        </div>
                                                    ))}
                                                    {rule.targetTeachers.length > 5 && (
                                                        <div className="text-[10px] font-bold bg-white text-gray-400 px-3 py-1 rounded-full border border-gray-100 font-mono">+{rule.targetTeachers.length - 5} more</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Incentive Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#45308D]/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-in zoom-in slide-in-from-bottom duration-300 border-4 border-white">
                        <div className="bg-[#45308D] p-10 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/60 hover:text-white hover:rotate-90 transition-all">
                                <X className="w-10 h-10" />
                            </button>
                            <h2 className="text-4xl font-black italic tracking-tighter mb-2">{editingRule ? 'Modify Plan' : 'New Strategic Plan'}</h2>
                            <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Architecture & Governance</p>
                        </div>

                        <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Plan Identifier</label>
                                <input
                                    className="w-full bg-gray-50 border-4 border-transparent rounded-3xl p-5 font-black text-xl text-black focus:outline-none focus:border-[#45308D] focus:bg-white transition-all shadow-inner"
                                    value={formData.ruleName}
                                    placeholder="e.g. Master Mentor Bonus"
                                    onChange={e => setFormData({ ...formData, ruleName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Target Cap (Hrs)</label>
                                    <div className="relative group">
                                        <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#45308D] transition-colors" />
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border-4 border-transparent rounded-3xl p-5 pl-14 font-black text-xl text-black focus:outline-none focus:border-[#45308D] focus:bg-white transition-all shadow-inner"
                                            value={formData.targetHours}
                                            onChange={e => setFormData({ ...formData, targetHours: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Bonus Yield (₹)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#45308D] transition-colors" />
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border-4 border-transparent rounded-3xl p-5 pl-14 font-black text-xl text-black focus:outline-none focus:border-[#45308D] focus:bg-white transition-all shadow-inner"
                                            value={formData.incentiveAmount}
                                            onChange={e => setFormData({ ...formData, incentiveAmount: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Assigned Faculty ({formData.targetTeachers.length})</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, targetTeachers: teachers.map(t => t._id) })}
                                        className="text-[10px] font-black uppercase text-[#45308D] hover:underline"
                                    >
                                        Select All Candidates
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-56 overflow-y-auto p-1 pr-4 custom-scrollbar">
                                    {teachers.map(teacher => (
                                        <div
                                            key={teacher._id}
                                            onClick={() => toggleTeacher(teacher._id)}
                                            className={`p-4 rounded-[2rem] border-4 cursor-pointer flex items-center gap-4 transition-all ${formData.targetTeachers.includes(teacher._id)
                                                ? 'bg-[#45308D]/5 border-[#45308D] scale-95'
                                                : 'bg-white border-gray-100 hover:border-gray-200 opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${formData.targetTeachers.includes(teacher._id)
                                                ? 'bg-[#45308D] text-white'
                                                : 'bg-gray-200 text-gray-500'}`}>
                                                {teacher.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-black truncate">{teacher.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 truncate uppercase">{teacher.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-4">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.active}
                                            onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                        <div className={`w-16 h-8 rounded-full transition-all ${formData.active ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${formData.active ? 'translate-x-8' : ''}`}></div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-black text-gray-800 block uppercase tracking-tight">Active Deployment</span>
                                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Incentive logic will apply to current metrics</span>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-6 pt-10 border-t-4 border-gray-50">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-[2] bg-[#45308D] text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-[#45308D]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-xl"
                                >
                                    {isSaving ? <Loader2 className="w-8 h-8 animate-spin" /> : <Save className="w-7 h-7" />}
                                    {editingRule ? 'Save Changes' : 'Publish Plan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-100 text-gray-500 py-6 rounded-[2rem] font-black hover:bg-gray-200 transition-all border-4 border-white text-xl"
                                >
                                    Exit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #F3F4F6;
                    border-radius: 9999px;
                    border: 2px solid white;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #E5E7EB;
                }
            `}</style>
        </div>
    );
}
