'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import MonthPicker from '@/components/ui/MonthPicker';
import { Menu, Plus, Trash2, Edit3, Target, DollarSign, Clock, CheckCircle2, Circle, Calendar, Save, Loader2, X, ListTodo, TrendingUp, AlertCircle, ChevronDown, Shield } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

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
    const { canAccess, isViewOnly, canViewIncome, roleName, loading: permissionsLoading } = useAdminPermissions();
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

    // Filter & Search States
    const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed' | 'high'>('all');
    const [searchQuery, setSearchQuery] = useState('');

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

    const viewOnlyMode = isViewOnly('tasks');

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
        if (viewOnlyMode) return;
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
        if (viewOnlyMode) return;
        try {
            const newStatus = !task.completed;
            const updated = await api.put(`/admin/tasks/${task._id}`, { completed: newStatus });
            setTasks(tasks.map(t => t._id === task._id ? updated.data : t));
            toast.success(newStatus ? 'Task completed' : 'Task reopened');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteTask = async (id: string) => {
        if (viewOnlyMode) return;
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
        if (viewOnlyMode || !canViewIncome()) return;
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

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            const matchesQuery = !searchQuery || 
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.allocatedAdmin?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

            let matchesTab = true;
            if (taskFilter === 'pending') matchesTab = !t.completed;
            else if (taskFilter === 'completed') matchesTab = t.completed;
            else if (taskFilter === 'high') matchesTab = t.priority === 'high';

            return matchesQuery && matchesTab;
        });
    }, [tasks, searchQuery, taskFilter]);

    const revenueProgress = goalData ? (goalData.goal.targetRevenue > 0 ? (goalData.currentRevenue / goalData.goal.targetRevenue) * 100 : 0) : 0;
    const hoursProgress = goalData ? (goalData.goal.targetHours > 0 ? (goalData.currentHours / goalData.goal.targetHours) * 100 : 0) : 0;

    const pendingCount = tasks.filter(t => !t.completed).length;

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900">
            <Toaster position="top-right" />
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative overflow-x-hidden">
                {/* Mobile Header Bar */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 bg-white/80 backdrop-blur-md shadow-xs p-3.5 flex items-center justify-between lg:hidden border-b border-gray-100">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white border border-gray-200 rounded-xl text-[#45308D] shadow-xs active:scale-95 transition-all">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">BrightPath</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks Hub</span>
                    </div>
                </header>

                {!permissionsLoading && !canAccess('tasks') ? (
                    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full mt-14 lg:mt-0">
                        <AccessDenied roleName={roleName} pageName="Tasks & Operations" />
                    </div>
                ) : (
                    <main className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 mt-14 lg:mt-0">
                        {/* Header Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Operations & Tasks</h1>
                                    {viewOnlyMode && (
                                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                                            <Shield className="w-3 h-3" /> View Only
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 font-semibold mt-1">Milestone Management & Objectives</p>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <MonthPicker
                                    selected={selectedMonth}
                                    onChange={setSelectedMonth}
                                    allowAll={false}
                                />
                                {!viewOnlyMode && canViewIncome() && (
                                    <button
                                        onClick={() => setIsGoalModalOpen(true)}
                                        className="px-3.5 py-2.5 bg-white border border-gray-200 hover:border-[#45308D]/30 text-gray-700 hover:text-[#45308D] text-xs font-bold rounded-xl shadow-xs hover:bg-[#45308D]/5 transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                                        title="Adjust Targets"
                                    >
                                        <Target className="w-4 h-4 text-[#45308D]" />
                                        <span className="hidden sm:inline">Set Targets</span>
                                    </button>
                                )}
                                {!viewOnlyMode && (
                                    <button
                                        onClick={() => {
                                            setEditingTask(null);
                                            setTaskFormData({ title: '', description: '', priority: 'medium', dueDate: '', allocatedAdmin: '' });
                                            setIsTaskModalOpen(true);
                                        }}
                                        className="px-4 py-2.5 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-[#45308D]/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95 flex-shrink-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>New Task</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Monthly Target Progress Cards */}
                        <div className={`grid grid-cols-1 ${canViewIncome() ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
                            {/* Revenue Progress */}
                            {canViewIncome() && (
                                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Monthly Revenue Yield</h3>
                                                <div className="flex items-baseline gap-2 mt-0.5">
                                                    <span className="text-xl font-black text-gray-900 tracking-tight">₹{(goalData?.currentRevenue || 0).toLocaleString()}</span>
                                                    <span className="text-xs text-gray-400 font-semibold">/ ₹{(goalData?.goal?.targetRevenue || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                                            {revenueProgress.toFixed(0)}% Achieved
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mt-1">
                                        <div 
                                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Hours Progress */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-[#45308D]/10 border border-[#45308D]/20 flex items-center justify-center text-[#45308D]">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Teaching Hours Volume</h3>
                                            <div className="flex items-baseline gap-2 mt-0.5">
                                                <span className="text-xl font-black text-[#45308D] tracking-tight">{(goalData?.currentHours || 0).toFixed(1)}h</span>
                                                <span className="text-xs text-gray-400 font-semibold">/ {(goalData?.goal?.targetHours || 0)}h target</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-extrabold text-[#45308D] bg-[#45308D]/10 border border-[#45308D]/20 px-2.5 py-1 rounded-lg">
                                        {hoursProgress.toFixed(0)}% Capacity
                                    </span>
                                </div>

                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mt-1">
                                    <div 
                                        className="h-full bg-[#45308D] rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(hoursProgress, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Task List Management Area */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                            {/* Filter Bar */}
                            <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
                                {/* Tabs */}
                                <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl w-fit">
                                    <button
                                        onClick={() => setTaskFilter('all')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${taskFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        All ({tasks.length})
                                    </button>
                                    <button
                                        onClick={() => setTaskFilter('pending')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${taskFilter === 'pending' ? 'bg-white text-[#45308D] shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Pending ({pendingCount})
                                    </button>
                                    <button
                                        onClick={() => setTaskFilter('completed')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${taskFilter === 'completed' ? 'bg-white text-emerald-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Completed ({tasks.length - pendingCount})
                                    </button>
                                    <button
                                        onClick={() => setTaskFilter('high')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${taskFilter === 'high' ? 'bg-white text-rose-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        High Priority
                                    </button>
                                </div>

                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Search tasks or assignees..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-[#45308D] transition w-full md:w-64 shadow-xs"
                                />
                            </div>

                            {/* Task Items */}
                            <div className="p-4 md:p-6">
                                {isLoading ? (
                                    <div className="py-16 text-center text-[#45308D] font-bold text-xs uppercase tracking-widest animate-pulse">
                                        Loading operational tasks...
                                    </div>
                                ) : filteredTasks.length === 0 ? (
                                    <div className="py-16 text-center flex flex-col items-center justify-center text-gray-400">
                                        <CheckCircle2 className="w-10 h-10 mb-2.5 opacity-30 text-emerald-500" />
                                        <p className="text-sm font-bold text-gray-700">No tasks found</p>
                                        <p className="text-xs text-gray-400 mt-0.5">All objectives in this filter are up to date.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                                        {filteredTasks.map(task => (
                                            <div
                                                key={task._id}
                                                className={`p-4 rounded-xl border transition-all flex flex-col justify-between group ${
                                                    task.completed
                                                        ? 'bg-gray-50/70 border-gray-100 opacity-70'
                                                        : 'bg-white border-gray-100 hover:border-[#45308D]/30 hover:shadow-xs'
                                                }`}
                                            >
                                                <div>
                                                    {/* Card Header: Checkbox, Priority, and Actions */}
                                                    <div className="flex items-start justify-between gap-2 mb-2.5">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <button
                                                                onClick={viewOnlyMode ? undefined : () => toggleTask(task)}
                                                                disabled={viewOnlyMode}
                                                                className={`transition-transform flex-shrink-0 ${viewOnlyMode ? 'cursor-default' : 'active:scale-90 hover:scale-105 cursor-pointer'} ${
                                                                    task.completed ? 'text-emerald-500' : 'text-gray-300 hover:text-[#45308D]'
                                                                }`}
                                                            >
                                                                {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                                            </button>

                                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border flex-shrink-0 ${
                                                                task.priority === 'high' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                                task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-blue-50 text-blue-700 border-blue-200'
                                                            }`}>
                                                                {task.priority}
                                                            </span>
                                                        </div>

                                                        {!viewOnlyMode && (
                                                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
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
                                                                    className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-gray-100 rounded-lg transition"
                                                                    title="Edit Task"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteTask(task._id)}
                                                                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                                    title="Delete Task"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Title & Description */}
                                                    <h4 className={`text-sm font-bold leading-tight mb-1 text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                                        {task.title}
                                                    </h4>
                                                    {task.description && (
                                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Card Footer: Assignee & Due Date */}
                                                <div className="pt-2.5 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 mt-2">
                                                    {task.allocatedAdmin ? (
                                                        <div className="flex items-center gap-1.5 font-semibold text-gray-600 truncate">
                                                            <div className="w-4 h-4 rounded-full bg-[#45308D] text-white flex items-center justify-center text-[9px] font-black uppercase">
                                                                {task.allocatedAdmin.name.charAt(0)}
                                                            </div>
                                                            <span className="truncate">{task.allocatedAdmin.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="italic text-[10px]">Unassigned</span>
                                                    )}

                                                    {task.dueDate && (
                                                        <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                                                            Due {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                )}
            </div>

            {/* Monthly Goals Update Modal */}
            {isGoalModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-[#45308D]/10 text-[#45308D] flex items-center justify-center">
                                    <Target className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 leading-none">Adjust Targets</h3>
                                    <span className="text-[10px] text-gray-400 font-semibold">{selectedMonth}</span>
                                </div>
                            </div>
                            <button onClick={() => setIsGoalModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleGoalSave} className="p-5 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">Revenue Target (₹)</label>
                                <input 
                                    type="number" 
                                    required
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-[#45308D] focus:bg-white transition"
                                    value={goalFormData.targetRevenue}
                                    onChange={(e) => setGoalFormData({...goalFormData, targetRevenue: Number(e.target.value)})}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">Hours Volume Benchmark (Hrs)</label>
                                <input 
                                    type="number" 
                                    required
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-[#45308D] focus:bg-white transition"
                                    value={goalFormData.targetHours}
                                    onChange={(e) => setGoalFormData({...goalFormData, targetHours: Number(e.target.value)})}
                                />
                            </div>

                            <div className="flex gap-2.5 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsGoalModalOpen(false)}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 bg-[#45308D] hover:bg-[#45308D]/90 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                                >
                                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                    <span>Save Targets</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Task Creation Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-[#45308D]/10 text-[#45308D] flex items-center justify-center">
                                    <ListTodo className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
                            </div>
                            <button onClick={() => setIsTaskModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleTaskSave} className="p-5 space-y-3.5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">Task Title <span className="text-red-500">*</span></label>
                                <input 
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 outline-none focus:border-[#45308D] focus:bg-white transition"
                                    value={taskFormData.title}
                                    placeholder="e.g. Review teacher logs or prepare weekly batches"
                                    onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">Assignee</label>
                                <select 
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 outline-none focus:border-[#45308D] focus:bg-white transition cursor-pointer"
                                    value={taskFormData.allocatedAdmin}
                                    onChange={(e) => setTaskFormData({...taskFormData, allocatedAdmin: e.target.value})}
                                >
                                    <option value="">Unassigned</option>
                                    {admins.map(admin => (
                                        <option key={admin._id} value={admin._id}>{admin.name} ({admin.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700 block">Description</label>
                                <textarea 
                                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 outline-none focus:border-[#45308D] focus:bg-white transition min-h-[70px] resize-none"
                                    placeholder="Optional details or instructions..."
                                    value={taskFormData.description}
                                    onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700 block">Priority</label>
                                    <select 
                                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 outline-none focus:border-[#45308D] focus:bg-white transition cursor-pointer"
                                        value={taskFormData.priority}
                                        onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value as any})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700 block">Due Date</label>
                                    <input 
                                        type="date"
                                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 outline-none focus:border-[#45308D] focus:bg-white transition"
                                        value={taskFormData.dueDate}
                                        onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2.5 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsTaskModalOpen(false)}
                                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 bg-[#45308D] hover:bg-[#45308D]/90 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                                >
                                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : editingTask ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                    <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
