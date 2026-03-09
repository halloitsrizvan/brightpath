'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Menu, Plus, Trash2, Edit3, Trophy, Target, DollarSign, Users, CheckCircle, XCircle, Save, Loader2, X } from 'lucide-react';
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

export default function AdminIncentives() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [rules, setRules] = useState<IncentiveRule[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingRule, setEditingRule] = useState<IncentiveRule | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        ruleName: 'Monthly Incentive',
        targetHours: 20,
        incentiveAmount: 2000,
        active: true,
        targetTeachers: [] as string[]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [rulesRes, teachersRes] = await Promise.all([
                api.get('/admin/incentives'),
                api.get('/teachers') // This route exists and returns all teachers
            ]);
            setRules(rulesRes.data);
            setTeachers(teachersRes.data);
        } catch (error) {
            toast.error('Failed to synchronize data');
        } finally {
            setIsLoading(false);
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
            fetchData();
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

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-center" />

            {/* Sidebar */}
            <div className={`fixed z-50 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar role="admin" />
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="flex items-center justify-between p-4 bg-white shadow-sm lg:hidden">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
                        <Menu className="w-8 h-8 text-[#45308D]" />
                    </button>
                    <h1 className="text-xl font-bold text-[#45308D]">BrightPath Admin</h1>
                </header>

                <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-[#45308D] tracking-tight">Incentive Management</h1>
                            <p className="text-gray-500 font-medium">Configure performance rewards for the teaching staff.</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-[#45308D] text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all w-fit"
                        >
                            <Plus className="w-5 h-5" /> Design New Incentive
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-20 text-[#45308D] animate-pulse font-black">Syncing rules...</div>
                    ) : rules.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-200">
                            <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-bold">No incentive rules configured yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {rules.map(rule => (
                                <div key={rule._id} className={`bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group ${!rule.active ? 'opacity-60 grayscale' : ''}`}>
                                    <div className="absolute top-0 right-0 p-6 flex gap-2">
                                        <button onClick={() => handleOpenModal(rule)} className="text-gray-400 hover:text-[#45308D] transition-colors"><Edit3 className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(rule._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${rule.active ? 'bg-[#45308D]/10 text-[#45308D]' : 'bg-gray-100 text-gray-400'}`}>
                                            <Trophy className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-800">{rule.ruleName}</h3>
                                            <div className="flex items-center gap-2">
                                                {rule.active ? (
                                                    <span className="text-[10px] font-black uppercase text-green-500 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> System Active
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                                                        <XCircle className="w-3 h-3" /> Deactivated
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Target</p>
                                            <p className="text-2xl font-black text-[#45308D] italic">{rule.targetHours}h</p>
                                        </div>
                                        <div className="bg-[#FDC70B]/10 p-4 rounded-2xl border border-[#FDC70B]/20">
                                            <p className="text-[10px] font-black uppercase text-[#c79c09] mb-1">Bonus</p>
                                            <p className="text-2xl font-black text-[#c79c09] italic">₹{rule.incentiveAmount}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 mb-3 ml-1 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> Enrolled Teachers ({rule.targetTeachers.length})
                                        </p>
                                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                                            {rule.targetTeachers.map(teacher => (
                                                <div key={teacher._id} className="text-[11px] font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                                                    {teacher.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Incentive Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#45308D]/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-in zoom-in slide-in-from-bottom duration-300">
                        <div className="bg-[#45308D] p-8 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors">
                                <X className="w-8 h-8" />
                            </button>
                            <h2 className="text-3xl font-black italic tracking-tighter">{editingRule ? 'Modify Incentive' : 'New Incentive Blueprint'}</h2>
                            <p className="text-white/60 font-bold">Define the rules and assign teachers.</p>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto pr-6 custom-scrollbar">
                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-700 ml-1">Incentive Plan Name</label>
                                <input
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-black text-black focus:outline-none focus:border-[#45308D] transition-all"
                                    value={formData.ruleName}
                                    onChange={e => setFormData({ ...formData, ruleName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-gray-700 ml-1">Target Hours (Monthly)</label>
                                    <div className="relative group">
                                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#45308D] transition-colors" />
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pl-12 font-black text-black focus:outline-none focus:border-[#45308D] transition-all"
                                            value={formData.targetHours}
                                            onChange={e => setFormData({ ...formData, targetHours: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-black text-gray-700 ml-1">Bonus Reward (₹)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#45308D] transition-colors" />
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pl-12 font-black text-black focus:outline-none focus:border-[#45308D] transition-all"
                                            value={formData.incentiveAmount}
                                            onChange={e => setFormData({ ...formData, incentiveAmount: Number(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-black text-gray-700 ml-1">Targeted Faculty ({formData.targetTeachers.length} Selected)</label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, targetTeachers: teachers.map(t => t._id) })}
                                        className="text-[10px] font-black uppercase text-[#45308D] hover:underline"
                                    >
                                        Select All
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1 pr-3 custom-scrollbar">
                                    {teachers.map(teacher => (
                                        <div
                                            key={teacher._id}
                                            onClick={() => toggleTeacher(teacher._id)}
                                            className={`p-3 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${formData.targetTeachers.includes(teacher._id)
                                                ? 'bg-[#45308D]/5 border-[#45308D] shadow-sm'
                                                : 'bg-white border-gray-100 hover:border-gray-200 opacity-60'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${formData.targetTeachers.includes(teacher._id)
                                                ? 'bg-[#45308D] text-white'
                                                : 'bg-gray-200 text-gray-500'}`}>
                                                {teacher.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-xs font-black truncate">{teacher.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 truncate">{teacher.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={formData.active}
                                            onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                        <div className={`w-14 h-7 rounded-full transition-all ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${formData.active ? 'translate-x-7' : ''}`}></div>
                                    </div>
                                    <span className="text-sm font-black text-gray-700">Deploy Active immediately</span>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-[#45308D] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#45308D]/20 hover:shadow-[#45308D]/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editingRule ? 'Update Incentive Plan' : 'Publish Incentive'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 bg-gray-50 text-gray-500 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}</style>
        </div>
    );
}
