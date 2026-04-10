'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { 
    Calendar, 
    TrendingUp, 
    Users, 
    BookOpen, 
    IndianRupee, 
    Download, 
    ChevronRight, 
    Clock, 
    CheckCircle,
    AlertCircle,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Table as TableIcon,
    Menu
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function MonthlyReport() {
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'financials' | 'attendance' | 'exams'>('financials');

    const monthsOptions = useMemo(() => {
        const arr = [];
        const date = new Date();
        date.setDate(1);
        for (let i = 0; i < 12; i++) {
            const m = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const y = date.getFullYear();
            const val = `${m} ${y}`;
            arr.push(val);
            date.setMonth(date.getMonth() - 1);
        }
        return arr;
    }, []);

    useEffect(() => {
        if (monthsOptions.length > 0) {
            setSelectedMonth(monthsOptions[0]);
        }
    }, [monthsOptions]);

    const fetchReport = async () => {
        if (!selectedMonth) return;
        try {
            setLoading(true);
            const { data } = await api.get(`/reports/monthly?month=${selectedMonth}`);
            setReportData(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load monthly report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [selectedMonth]);

    if (loading && !reportData) {
        return (
            <div className="flex h-screen bg-[#0A0A0B] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="flex bg-[#0A0A0B] min-h-screen font-sans text-white">
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <Toaster position="top-right" />

            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto">
                {/* Mobile Header Trigger Row */}
                <div className="flex items-center justify-between w-full lg:hidden mb-6 bg-[#161618] p-4 rounded-2xl border border-gray-800">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">BrightPath</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Monthly Audit</p>
                    </div>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Monthly Analytics</h1>
                        <p className="text-gray-400">Comprehensive performance audit for {selectedMonth}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-[#161618] border border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:border-gray-700 transition-all min-w-[200px]"
                            >
                                {monthsOptions.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <button 
                            onClick={() => window.print()}
                            className="p-2.5 bg-[#161618] border border-gray-800 rounded-xl hover:border-gray-700 transition-all text-gray-400 hover:text-white"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {reportData && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-[#161618] border border-gray-800 p-6 rounded-2xl hover:border-primary/30 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <IndianRupee className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">Revenue</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold">₹{reportData.financials.summary.totalReceived.toLocaleString()}</h3>
                                    <p className="text-sm text-gray-500">Collected this month</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Receivable: ₹{reportData.financials.summary.totalReceivable.toLocaleString()}</span>
                                    <div className="flex items-center text-emerald-500">
                                        <ArrowUpRight className="w-3 h-3 mr-1" />
                                        <span>Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#161618] border border-gray-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">Profit</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold">₹{reportData.financials.summary.netProfit.toLocaleString()}</h3>
                                    <p className="text-sm text-gray-400">Net operating margin</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Pre-tax estimate</span>
                                    <div className="flex items-center text-emerald-500 font-medium">
                                        {((reportData.financials.summary.netProfit / (reportData.financials.summary.totalReceived || 1)) * 100).toFixed(0)}% Margin
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#161618] border border-gray-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-purple-500/10 rounded-xl">
                                        <Clock className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">Intensity</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold">{reportData.attendance.totalHours} hrs</h3>
                                    <p className="text-sm text-gray-500">{reportData.attendance.totalSessions} Learning sessions</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-800/50 text-xs">
                                    <div className="flex items-center justify-between text-gray-400 mb-2">
                                        <span>Capacity Utilization</span>
                                        <span>Steady</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1">
                                        <div className="bg-purple-500 h-1 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#161618] border border-gray-800 p-6 rounded-2xl hover:border-amber-500/30 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-amber-500/10 rounded-xl">
                                        <BookOpen className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">Exams</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold">{reportData.exams.averagePerformance}%</h3>
                                    <p className="text-sm text-gray-500">Average student score</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">{reportData.exams.count} Assessments held</span>
                                    <div className="flex items-center text-amber-500 font-medium">
                                        Quality Audit
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Visuals */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Faculty Distribution */}
                                <div className="bg-[#161618] border border-gray-800 rounded-2xl overflow-hidden">
                                    <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                                <Users className="w-5 h-5 text-primary" />
                                                Teaching Distribution
                                            </h2>
                                            <p className="text-sm text-gray-500">Hours contributed by faculty members</p>
                                        </div>
                                    </div>
                                    <div className="p-6 h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={reportData.attendance.teacherStats} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                                                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                                <Tooltip 
                                                    cursor={{ fill: '#1f2937' }}
                                                    contentStyle={{ backgroundColor: '#161618', border: '1px solid #374151', borderRadius: '8px' }}
                                                />
                                                <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                                                    {reportData.attendance.teacherStats.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Detailed Tables */}
                                <div className="bg-[#161618] border border-gray-800 rounded-2xl overflow-hidden">
                                    <div className="border-b border-gray-800">
                                        <nav className="flex px-4" aria-label="Tabs">
                                            {['financials', 'attendance', 'exams'].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveSection(tab as any)}
                                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-all capitalize ${
                                                        activeSection === tab 
                                                        ? 'border-primary text-primary' 
                                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    <div className="p-0 overflow-x-auto min-h-[400px]">
                                        {activeSection === 'financials' && (
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="bg-[#0A0A0B] text-gray-400 font-medium">
                                                    <tr>
                                                        <th className="px-6 py-4 border-b border-gray-800">Category</th>
                                                        <th className="px-6 py-4 border-b border-gray-800">Entity</th>
                                                        <th className="px-6 py-4 border-b border-gray-800">Amount</th>
                                                        <th className="px-6 py-4 border-b border-gray-800 text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800">
                                                    {reportData.financials.fees.map((fee: any) => (
                                                        <tr key={fee._id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4">Student Fee</td>
                                                            <td className="px-6 py-4 font-medium">{fee.studentId?.fullName}</td>
                                                            <td className="px-6 py-4">₹{fee.amount.toLocaleString()}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${fee.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                                    {fee.paymentStatus.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {reportData.financials.salaries.map((sal: any) => (
                                                        <tr key={sal._id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4">Tutor Payroll</td>
                                                            <td className="px-6 py-4 font-medium">{sal.teacherId?.name}</td>
                                                            <td className="px-6 py-4 text-rose-400">-₹{sal.totalSalary.toLocaleString()}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${sal.paidStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                                    {sal.paidStatus.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}

                                        {activeSection === 'attendance' && (
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="bg-[#0A0A0B] text-gray-400 font-medium">
                                                    <tr>
                                                        <th className="px-6 py-4 border-b border-gray-800">Date</th>
                                                        <th className="px-6 py-4 border-b border-gray-800">Student</th>
                                                        <th className="px-6 py-4 border-b border-gray-800">Tutor</th>
                                                        <th className="px-6 py-4 border-b border-gray-800">Duration</th>
                                                        <th className="px-6 py-4 border-b border-gray-800 text-right">Subject</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800">
                                                    {reportData.attendance.logs.map((log: any) => (
                                                        <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4 text-gray-400">{new Date(log.date).toLocaleDateString('en-GB')}</td>
                                                            <td className="px-6 py-4 font-medium">{log.studentId?.fullName}</td>
                                                            <td className="px-6 py-4">{log.teacherId?.name}</td>
                                                            <td className="px-6 py-4">{log.durationMinutes} mins</td>
                                                            <td className="px-6 py-4 text-right">{log.subjectId?.name || 'General'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}

                                        {activeSection === 'exams' && (
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="bg-[#0A0A0B] text-gray-400 font-medium">
                                                    <tr>
                                                        <th className="px-6 py-4 border-b border-gray-800">Student</th>
                                                        <th className="px-6 py-4 border-b border-gray-800">Subject</th>
                                                        <th className="px-6 py-4 border-b border-gray-800 text-center">Score</th>
                                                        <th className="px-6 py-4 border-b border-gray-800 text-right">Performance</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800">
                                                    {reportData.exams.records.map((exam: any) => (
                                                        <tr key={exam._id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4 font-medium">{exam.studentId?.fullName}</td>
                                                            <td className="px-6 py-4">{exam.subject}</td>
                                                            <td className="px-6 py-4 text-center">{exam.marks} / {exam.maxMarks}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <div className="w-20 bg-gray-800 rounded-full h-1.5">
                                                                        <div 
                                                                            className={`h-1.5 rounded-full ${((exam.marks/exam.maxMarks)*100) > 80 ? 'bg-emerald-500' : ((exam.marks/exam.maxMarks)*100) > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                                            style={{ width: `${(exam.marks/exam.maxMarks)*100}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-xs font-medium">{((exam.marks/exam.maxMarks)*100).toFixed(0)}%</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Breakdown */}
                            <div className="space-y-8">
                                <div className="bg-[#161618] border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Financial Ledger</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Income Collected</p>
                                                    <p className="text-xs text-gray-500">Total fees settled</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-emerald-500">₹{reportData.financials.summary.totalReceived.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                                                    <ArrowDownRight className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Payroll Paid</p>
                                                    <p className="text-xs text-gray-500">Tutor disbursements</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-rose-500">₹{reportData.financials.summary.totalDisbursed.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                                                    <AlertCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">General Expenses</p>
                                                    <p className="text-xs text-gray-500">Maintenance & Ops</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-orange-500">₹{reportData.financials.summary.totalExpenses.toLocaleString()}</p>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-800">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-lg font-bold">Net Profit</span>
                                                <span className="text-lg font-bold text-emerald-500">₹{reportData.financials.summary.netProfit.toLocaleString()}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500">Calculation: (Collected Income) - (Payroll + Expenses + Founder Salaries)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-bold mb-2">Ready to Audit?</h3>
                                        <p className="text-sm text-gray-300 mb-6">Generate a detailed PDF dossier for this month's operations including all logs and receipts.</p>
                                        <button className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                            <Download className="w-4 h-4" />
                                            Export Executive Summary
                                        </button>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
