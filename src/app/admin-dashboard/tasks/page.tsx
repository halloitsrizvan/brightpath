'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import MonthPicker from '@/components/ui/MonthPicker';
import { Menu, Plus, Trash2, Edit3, Target, DollarSign, Clock, CheckCircle2, Circle, Calendar, Save, Loader2, X, ListTodo, TrendingUp, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Task {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
}

interface MonthlyGoal {
    month: string;
    targetRevenue: number;
    targetHours: number;
}

export default function AdminTasks() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
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
        dueDate: ''
    });

    const [goalFormData, setGoalFormData] = useState({
        targetRevenue: 0,
        targetHours: 0
    });

    useEffect(() => {
        fetchTasks();
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
                                    setTaskFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
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
                                            className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative ${
                                                task.completed 
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
                                                                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
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
                                            <p className="text-gray-400 font-bold text-sm mb-6 line-clamp-2 leading-relaxed">{task.description}</p>
                                            
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                                <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-full border-2 ${
                                                    task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#45308D]/60 backdrop-blur-md" onClick={() => setIsGoalModalOpen(false)}></div>
                    <div className="bg-white rounded-[4rem] w-full max-w-xl overflow-hidden relative z-10 shadow-2xl border-4 border-white animate-in zoom-in duration-300">
                        <div className="bg-[#45308D] p-12 text-white text-center relative">
                            <button onClick={() => setIsGoalModalOpen(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-all">
                                <X className="w-8 h-8" />
                            </button>
                            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <Target className="w-10 h-10" />
                            </div>
                            <h2 className="text-4xl font-black italic tracking-tighter mb-2">Adjust Benchmarks</h2>
                            <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Calibrating {selectedMonth}</p>
                        </div>
                        <form onSubmit={handleGoalSave} className="p-12 space-y-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest ml-2">Revenue Target (INR)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-[#45308D] transition-all" />
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full bg-gray-50 border-4 border-transparent rounded-[2rem] p-6 pl-16 font-black text-2xl focus:border-[#45308D] focus:bg-white outline-none transition-all shadow-inner"
                                        value={goalFormData.targetRevenue}
                                        onChange={(e) => setGoalFormData({...goalFormData, targetRevenue: Number(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest ml-2">Hours Benchmark (Hrs)</label>
                                <div className="relative group">
                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-[#45308D] transition-all" />
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full bg-gray-50 border-4 border-transparent rounded-[2rem] p-6 pl-16 font-black text-2xl focus:border-[#45308D] focus:bg-white outline-none transition-all shadow-inner"
                                        value={goalFormData.targetHours}
                                        onChange={(e) => setGoalFormData({...goalFormData, targetHours: Number(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="w-full bg-[#45308D] text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                                Locked Targets
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Task Creation Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#45308D]/60 backdrop-blur-md" onClick={() => setIsTaskModalOpen(false)}></div>
                    <div className="bg-white rounded-[4rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl border-4 border-white animate-in zoom-in duration-300">
                        <div className="bg-[#45308D] p-10 text-white relative">
                            <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-all">
                                <X className="w-8 h-8" />
                            </button>
                            <h2 className="text-4xl font-black italic tracking-tighter mb-1">{editingTask ? 'Modify Mission' : 'New Strategic Entry'}</h2>
                            <p className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Administrative Intelligence</p>
                        </div>
                        <form onSubmit={handleTaskSave} className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Objective Title</label>
                                <input 
                                    className="w-full bg-gray-50 border-4 border-transparent rounded-[1.5rem] p-5 font-black text-lg focus:border-[#45308D] outline-none transition-all"
                                    value={taskFormData.title}
                                    placeholder="Enter mission title..."
                                    onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Operational Context</label>
                                <textarea 
                                    className="w-full bg-gray-50 border-4 border-transparent rounded-[1.5rem] p-5 font-bold text-gray-600 focus:border-[#45308D] outline-none transition-all min-h-[120px]"
                                    value={taskFormData.description}
                                    placeholder="Brief background or requirements..."
                                    onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Priority Level</label>
                                    <select 
                                        className="w-full bg-gray-50 border-4 border-transparent rounded-[1.5rem] p-5 font-black focus:border-[#45308D] outline-none transition-all"
                                        value={taskFormData.priority}
                                        onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value as any})}
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Deadline Date</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-gray-50 border-4 border-transparent rounded-[1.5rem] p-5 font-black focus:border-[#45308D] outline-none transition-all"
                                        value={taskFormData.dueDate}
                                        onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="flex-1 bg-[#45308D] text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editingTask ? 'Apply Changes' : 'Initialize Mission'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsTaskModalOpen(false)}
                                    className="px-8 bg-gray-100 text-gray-500 rounded-[1.5rem] font-black hover:bg-gray-200 transition-all font-mono italic"
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
