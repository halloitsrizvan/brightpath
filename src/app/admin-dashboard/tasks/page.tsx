'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import MonthPicker from '@/components/ui/MonthPicker';
import { Menu, Plus, Trash2, Edit3, Target, DollarSign, Clock, CheckCircle2, Circle, Calendar, Save, Loader2, X, ListTodo, TrendingUp, AlertCircle, ChevronDown } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Task {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    allocatedAdmin?: {
        _id: string;
        name: string;
    };
}

interface MonthlyGoal {
    month: string;
    targetRevenue: number;
    targetHours: number;
}

export default function AdminTasks() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [admins, setAdmins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGoalLoading, setIsGoalLoading] = useState(true);

    // Monthly Goal State
    const currentMonthStr = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())} ${new Date().getFullYear()}`;
    const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
    const [goalData, setGoalData] = useState<any>(null);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    // To-Do State
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskFormData, setTaskFormData] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        dueDate: '',
        allocatedAdmin: ''
    });

    const [goalFormData, setGoalFormData] = useState({
        targetRevenue: 0,
        targetHours: 0
    });

    useEffect(() => {
        fetchTasks();
        fetchAdmins();
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [selectedMonth]);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/admin/tasks');
            setTasks(res.data);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/admin/founders');
            setAdmins(res.data);
        } catch (error) {
            console.error('Failed to load admins', error);
        }
    };

    const fetchGoals = async () => {
        try {
            setIsGoalLoading(true);
            const res = await api.get(`/admin/goals?month=${selectedMonth}`);
            setGoalData(res.data);
            setGoalFormData({
                targetRevenue: res.data.goal.targetRevenue || 0,
                targetHours: res.data.goal.targetHours || 0
            });
        } catch (error) {
            console.error('Failed to load goals', error);
        } finally {
            setIsGoalLoading(false);
        }
    };

    const handleTaskSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            if (editingTask) {
                await api.put(`/admin/tasks/${editingTask._id}`, taskFormData);
                toast.success('Task updated');
            } else {
                await api.post('/admin/tasks', taskFormData);
                toast.success('Task created');
            }
            setIsTaskModalOpen(false);
            fetchTasks();
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTask = async (task: Task) => {
        try {
            const newStatus = !task.completed;
            const updated = await api.put(`/admin/tasks/${task._id}`, { completed: newStatus });
            setTasks(tasks.map(t => t._id === task._id ? updated.data : t));
            toast.success(newStatus ? 'Task completed!' : 'Task reopened');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteTask = async (id: string) => {
        if (!confirm('Permanently delete this task?')) return;
        try {
            await api.delete(`/admin/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
            toast.success('Task removed');
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const handleGoalSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await api.post('/admin/goals', {
                month: selectedMonth,
                ...goalFormData
            });
            toast.success('Targets updated for ' + selectedMonth);
            setIsGoalModalOpen(false);
            fetchGoals();
        } catch (error) {
            toast.error('Failed to update targets');
        } finally {
            setIsSaving(false);
        }
    };

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

    const revenueProgress = goalData ? (goalData.goal.targetRevenue > 0 ? (goalData.currentRevenue / goalData.goal.targetRevenue) * 100 : 0) : 0;
    const hoursProgress = goalData ? (goalData.goal.targetHours > 0 ? (goalData.currentHours / goalData.goal.targetHours) * 100 : 0) : 0;

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-center" />

            {/* Sidebar */}
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl text-[#45308D] shadow-sm active:scale-95 transition-all">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-[#45308D] italic uppercase tracking-tighter leading-none">BrightPath</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-10 mt-20 lg:mt-0">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-4xl font-black text-[#45308D] tracking-tight italic">Operations & Targets</h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Management Control Panel</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <MonthPicker
                                selected={selectedMonth}
                                onChange={setSelectedMonth}
                                allowAll={false}
                            />
                            <button
                                onClick={() => setIsGoalModalOpen(true)}
                                className="bg-[#45308D] text-white p-4 rounded-[1.5rem] hover:scale-110 transition-all shadow-lg hover:shadow-[#45308D]/20 active:scale-95"
                            >
                                <Target className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Progress Trackers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Revenue Tracking */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150 group-hover:rotate-0 transition-all duration-700">
                                <DollarSign className="w-32 h-32 text-[#FDC70B]" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-[#FDC70B]/10 flex items-center justify-center text-[#c79c09]">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-[#c79c09] uppercase tracking-[0.2em]">Revenue Mastery</p>
                                        <h3 className="text-2xl font-black text-gray-800">Monthly Yield</h3>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-gray-400 text-xs font-bold uppercase mb-1">Current Progress</p>
                                            <p className="text-4xl font-black text-[#45308D] italic">INR {goalData?.currentRevenue.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-xs font-bold uppercase mb-1">Target</p>
                                            <p className="text-xl font-black text-gray-400">INR {goalData?.goal.targetRevenue.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#FDC70B] to-[#ffda57] transition-all duration-1000 ease-out relative"
                                            style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-right text-[#45308D]">{revenueProgress.toFixed(1)}% Completed</p>
                                </div>
                            </div>
                        </div>

                        {/* Hours Tracking */}
                        <div className="bg-[#45308D] rounded-[3rem] p-10 shadow-2xl relative group overflow-hidden border-4 border-[#45308D]">
                            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150 group-hover:rotate-0 transition-all duration-700">
                                <Clock className="w-32 h-32 text-white" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center text-white">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Operational Efficiency</p>
                                        <h3 className="text-2xl font-black text-white">Academic Hours</h3>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end text-white">
                                        <div>
                                            <p className="text-white/40 text-xs font-bold uppercase mb-1">Recorded Output</p>
                                            <p className="text-4xl font-black italic">{goalData?.currentHours.toFixed(1)}<span className="text-xl not-italic ml-2 opacity-60">Hrs</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/40 text-xs font-bold uppercase mb-1">Benchmark</p>
                                            <p className="text-xl font-black opacity-40">{goalData?.goal.targetHours}<span className="text-sm ml-1">Hrs</span></p>
                                        </div>
                                    </div>

                                    <div className="h-6 w-full bg-white/10 rounded-full overflow-hidden border-4 border-white/10 shadow-inner">
                                        <div
                                            className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                            style={{ width: `${Math.min(hoursProgress, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm font-black text-right text-white">{hoursProgress.toFixed(1)}% Capacity reached</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* To-Do List Section */}
                    <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-10 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#45308D]/5 flex items-center justify-center text-[#45308D]">
                                    <ListTodo className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">Executive Tasklist</h3>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{tasks.filter(t => !t.completed).length} Pending Missions</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingTask(null);
                                    setTaskFormData({ title: '', description: '', priority: 'medium', dueDate: '', allocatedAdmin: '' });
                                    setIsTaskModalOpen(true);
                                }}
                                className="bg-[#45308D] text-white px-8 py-4 rounded-[1.5rem] font-black flex items-center gap-3 hover:scale-105 transition-all shadow-lg active:scale-95"
                            >
                                <Plus className="w-5 h-5" /> Initialize Mission
                            </button>
                        </div>

                        <div className="p-8">
                            {isLoading ? (
                                <div className="p-20 flex justify-center text-[#45308D] animate-pulse font-black uppercase tracking-widest text-sm">Synchronizing ledger...</div>
                            ) : tasks.length === 0 ? (
                                <div className="p-20 text-center flex flex-col items-center">
                                    <CheckCircle2 className="w-20 h-20 text-gray-100 mb-6" />
                                    <p className="text-gray-400 font-bold text-lg">Your itinerary is currently clear.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {tasks.map(task => (
                                        <div
                                            key={task._id}
                                            className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative ${task.completed
                                                    ? 'bg-gray-50 border-transparent opacity-60 grayscale'
                                                    : 'bg-white border-gray-100 hover:border-[#45308D] hover:shadow-2xl hover:-translate-y-2'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <button
                                                    onClick={() => toggleTask(task)}
                                                    className={`transition-all active:scale-90 ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-[#45308D]'}`}
                                                >
                                                    {task.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                                                </button>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingTask(task);
                                                            setTaskFormData({
                                                                title: task.title,
                                                                description: task.description || '',
                                                                priority: task.priority,
                                                                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                                                                allocatedAdmin: task.allocatedAdmin?._id || ''
                                                            });
                                                            setIsTaskModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-[#45308D] transition-colors"
                                                    >
                                                        <Edit3 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTask(task._id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <h4 className={`text-xl font-black mb-3 leading-tight ${task.completed ? 'line-through' : 'text-gray-800'}`}>{task.title}</h4>
                                            <p className="text-gray-400 font-bold text-sm mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
                                            
                                            {task.allocatedAdmin && (
                                                <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100 w-fit">
                                                    <div className="w-6 h-6 rounded-full bg-[#45308D] text-white flex items-center justify-center text-[10px] font-black uppercase">
                                                        {task.allocatedAdmin.name.charAt(0)}
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{task.allocatedAdmin.name}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                                <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-full border-2 ${task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {task.priority} Priority
                                                </span>
                                                {task.dueDate && (
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Goals Update Modal */}
            {isGoalModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#45308D]/20 backdrop-blur-md" onClick={() => setIsGoalModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-white">
                        <div className="bg-[#45308D] p-6 md:p-8 text-white relative">
                            <button onClick={() => setIsGoalModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white border border-white/20 p-2 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 bg-white/10 rounded-[1.2rem] flex items-center justify-center border border-white/20 mb-4">
                                <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase mb-1">Adjust Benchmarks</h2>
                            <p className="text-white/60 font-black text-[9px] uppercase tracking-[0.2em]">Institutional Targets Sync</p>
                        </div>

                        <form onSubmit={handleGoalSave} className="p-6 md:p-8 space-y-5 bg-[#fafafa]">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Revenue Target (INR)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full bg-white border-2 border-gray-100 py-4 pl-12 pr-6 rounded-2xl font-bold text-sm text-black outline-none focus:border-[#45308D] transition-all shadow-sm"
                                        value={goalFormData.targetRevenue}
                                        onChange={(e) => setGoalFormData({...goalFormData, targetRevenue: Number(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hours Benchmark (Hrs)</label>
                                <div className="relative">
                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full bg-white border-2 border-gray-100 py-4 pl-12 pr-6 rounded-2xl font-bold text-sm text-black outline-none focus:border-[#45308D] transition-all shadow-sm"
                                        value={goalFormData.targetHours}
                                        onChange={(e) => setGoalFormData({...goalFormData, targetHours: Number(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsGoalModalOpen(false)}
                                    className="flex-1 py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all font-sans"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="flex-[2] py-4 bg-[#45308D] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#45308D]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 italic disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Commit Targets
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Task Creation Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#45308D]/20 backdrop-blur-md" onClick={() => setIsTaskModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-white">
                        <div className="bg-[#45308D] p-6 md:p-8 text-white relative">
                            <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white border border-white/20 p-2 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 bg-white/10 rounded-[1.2rem] flex items-center justify-center border border-white/20 mb-4">
                                <ListTodo className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase mb-1">{editingTask ? 'Modify Mission' : 'Add Task Node'}</h2>
                            <p className="text-white/60 font-black text-[9px] uppercase tracking-[0.2em]">Administrative Intelligence Sync</p>
                        </div>

                        <form onSubmit={handleTaskSave} className="p-6 md:p-8 space-y-5 bg-[#fafafa]">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Objective Title</label>
                                <input 
                                    className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm text-black outline-none focus:border-[#45308D] transition-all shadow-sm"
                                    value={taskFormData.title}
                                    placeholder="What needs to be done?"
                                    onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Allocated Admin (Founder)</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-white border-2 border-gray-100 py-4 pl-6 pr-10 rounded-2xl font-bold text-sm text-black outline-none focus:border-[#45308D] transition-all appearance-none shadow-sm"
                                        value={taskFormData.allocatedAdmin}
                                        onChange={(e) => setTaskFormData({...taskFormData, allocatedAdmin: e.target.value})}
                                    >
                                        <option value="">Unassigned</option>
                                        {admins.map(admin => (
                                            <option key={admin._id} value={admin._id}>{admin.name} ({admin.email})</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Context</label>
                                <textarea 
                                    className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm text-black outline-none focus:border-[#45308D] transition-all min-h-[100px] resize-none shadow-sm"
                                    placeholder="Add any necessary details..."
                                    value={taskFormData.description}
                                    onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Priority</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-white border-2 border-gray-100 py-4 pl-6 pr-10 rounded-2xl font-bold text-sm text-black outline-none focus:border-[#45308D] transition-all appearance-none shadow-sm"
                                            value={taskFormData.priority}
                                            onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value as any})}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deadline</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-sm text-black outline-none focus:border-[#45308D] transition-all shadow-sm"
                                        value={taskFormData.dueDate}
                                        onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsTaskModalOpen(false)}
                                    className="flex-1 py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all font-sans"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-[2] py-4 bg-[#45308D] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#45308D]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 italic disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingTask ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    {editingTask ? 'Commit Change' : 'Initialize Mission'}
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
