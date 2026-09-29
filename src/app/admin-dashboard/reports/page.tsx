'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import MonthPicker from '@/components/ui/MonthPicker';
import { 
    Calendar, 
    TrendingUp, 
    TrendingDown,
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
    Menu,
    Activity,
    Sparkles,
    Zap,
    ShieldAlert,
    PieChart as PieChartIcon,
    Filter,
    Search,
    FileSpreadsheet,
    Layers,
    Compass,
    ExternalLink,
    AlertTriangle,
    GraduationCap,
    Award,
    RefreshCw,
    UserCheck,
    UserMinus,
    UserPlus,
    Trophy,
    Target,
    Flame,
    Globe,
    UserX
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    Cell, 
    Legend 
} from 'recharts';
import { ReportsSkeleton } from './Skeleton';
import Link from 'next/link';

export default function MonthlyReport() {
    const [reportData, setReportData] = useState<any>(null);
    const [trendsData, setTrendsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [trendsLoading, setTrendsLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'financials' | 'attendance' | 'exams' | 'students' | 'anomalies'>('financials');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
    const [studentRosterFilter, setStudentRosterFilter] = useState<'all' | 'active' | 'inactive' | 'new' | 'dormant'>('all');
    const [studentLeaderboardTab, setStudentLeaderboardTab] = useState<'academic' | 'dedicated' | 'value'>('academic');
    const [classDistributionFilter, setClassDistributionFilter] = useState<'all' | 'active' | 'inactive'>('active');
    const [exportingPdf, setExportingPdf] = useState(false);
    const [exportingCsv, setExportingCsv] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [selectedTierModal, setSelectedTierModal] = useState<{ title: string; students: any[] } | null>(null);

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
        if (monthsOptions.length > 0 && !selectedMonth) {
            setSelectedMonth(monthsOptions[0]);
        }
    }, [monthsOptions, selectedMonth]);

    const fetchReport = async () => {
        if (!selectedMonth) return;
        try {
            setLoading(true);
            const { data } = await api.get(`/reports/monthly?month=${encodeURIComponent(selectedMonth)}`);
            setReportData(data);
        } catch (err: any) {
            console.error("Failed to load monthly report:", err);
            toast.error(err?.response?.data?.message || "Failed to load monthly report");
        } finally {
            setLoading(false);
        }
    };

    const fetchTrends = async () => {
        if (!selectedMonth) return;
        try {
            setTrendsLoading(true);
            const { data } = await api.get(`/reports/trends?month=${encodeURIComponent(selectedMonth)}&count=6`);
            if (data && Array.isArray(data.trends)) {
                setTrendsData(data.trends);
            }
        } catch (err) {
            console.error("Failed to load historical trends:", err);
        } finally {
            setTrendsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedMonth) {
            fetchReport();
            fetchTrends();
        }
    }, [selectedMonth]);

    const handleExportPdf = async () => {
        if (!selectedMonth) return;
        try {
            setExportingPdf(true);
            setShowExportMenu(false);
            const response = await api.get(`/reports/monthly/export?month=${encodeURIComponent(selectedMonth)}`, {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Executive_Summary_${selectedMonth.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Executive Dossier PDF exported successfully!");
        } catch (err: any) {
            console.error("PDF Export Error:", err);
            toast.error("Failed to export Executive Dossier PDF");
        } finally {
            setExportingPdf(false);
        }
    };

    const handleExportCsv = async (datasetType: 'all' | 'financials' | 'attendance' | 'exams' | 'students' = 'all') => {
        if (!selectedMonth) return;
        try {
            setExportingCsv(true);
            setShowExportMenu(false);
            const response = await api.get(`/reports/monthly/export-csv?month=${encodeURIComponent(selectedMonth)}&type=${datasetType}`, {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `BrightPath_${datasetType}_${selectedMonth.replace(/\s+/g, '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success(`CSV (${datasetType}) exported successfully!`);
        } catch (err: any) {
            console.error("CSV Export Error:", err);
            toast.error("Failed to export CSV dataset");
        } finally {
            setExportingCsv(false);
        }
    };

    if (loading && !reportData) {
        return (
            <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
                <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <ReportsSkeleton />
            </div>
        );
    }

    // Filtered Financials
    const filteredFees = (reportData?.financials?.fees || []).filter((f: any) => {
        const matchesQuery = !searchQuery || 
            (f.studentId?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.month || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'paid' && f.paymentStatus === 'paid') ||
            (statusFilter === 'unpaid' && f.paymentStatus !== 'paid');
        return matchesQuery && matchesStatus;
    });

    const filteredSalaries = (reportData?.financials?.salaries || []).filter((s: any) => {
        const matchesQuery = !searchQuery || 
            (s.teacherId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.month || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'paid' && s.paidStatus === 'paid') ||
            (statusFilter === 'unpaid' && s.paidStatus !== 'paid');
        return matchesQuery && matchesStatus;
    });

    // Filtered Attendance
    const filteredAttendance = (reportData?.attendance?.logs || []).filter((a: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (a.studentId?.fullName || '').toLowerCase().includes(q) ||
               (a.teacherId?.name || '').toLowerCase().includes(q) ||
               (a.subjectId?.subjectName || a.subjectId?.name || '').toLowerCase().includes(q);
    });

    // Filtered Exams
    const filteredExams = (reportData?.exams?.records || []).filter((e: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (e.studentId?.fullName || '').toLowerCase().includes(q) ||
               (e.subject || '').toLowerCase().includes(q);
    });

    // Filtered Students Cohort
    const filteredStudents = (reportData?.studentsAnalytics?.roster || []).filter((st: any) => {
        const matchesQuery = !searchQuery || 
            st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            st.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
            st.syllabus.toLowerCase().includes(searchQuery.toLowerCase()) ||
            st.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesStatus = true;
        if (studentRosterFilter === 'active') matchesStatus = st.status === 'active';
        else if (studentRosterFilter === 'inactive') matchesStatus = st.status === 'inactive';
        else if (studentRosterFilter === 'new') matchesStatus = st.isNewThisMonth;
        else if (studentRosterFilter === 'dormant') matchesStatus = st.isDormant;

        return matchesQuery && matchesStatus;
    });

    // Filtered Class Distribution
    const filteredClassCounts = (() => {
        if (!reportData?.studentsAnalytics?.roster) return [];
        const counts: Record<string, number> = {};
        reportData.studentsAnalytics.roster.forEach((st: any) => {
            if (classDistributionFilter === 'active' && st.status !== 'active') return;
            if (classDistributionFilter === 'inactive' && st.status !== 'inactive') return;
            const cls = st.class ? `Class ${st.class}` : 'Unassigned';
            counts[cls] = (counts[cls] || 0) + 1;
        });

        return Object.entries(counts).sort((a, b) => {
            const numA = parseInt(a[0].replace(/\D/g, '')) || 999;
            const numB = parseInt(b[0].replace(/\D/g, '')) || 999;
            return numA - numB;
        });
    })();

    const anomalySessions = reportData?.attendance?.anomalySessions || [];

    const formatDelta = (val?: number) => {
        if (val === undefined || val === null) return null;
        const isPos = val > 0;
        const isNeg = val < 0;
        return (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2.5 py-0.5 rounded-full ${isPos ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : isNeg ? 'bg-rose-50 text-rose-700 border border-rose-200/80' : 'bg-gray-100 text-gray-600'}`}>
                {isPos ? <ArrowUpRight className="w-3 h-3 text-emerald-600" /> : isNeg ? <ArrowDownRight className="w-3 h-3 text-rose-600" /> : null}
                <span>{isPos ? `+${val}%` : `${val}%`} MoM</span>
            </span>
        );
    };

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <Toaster position="top-right" />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                
                {/* Mobile Header Bar */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">BrightPath</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Intelligence</p>
                    </div>
                </header>

                <main className="p-4 md:p-12 mt-20 lg:mt-0 space-y-8">
                    
                    {/* Header Section */}
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 px-1">
                        <div>
                            <p className="text-primary font-black text-[10px] uppercase tracking-[0.35em] mb-1.5 ml-0.5">
                                Institutional Intelligence & Analytics Cockpit
                            </p>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                                Reports & Analytics
                            </h1>
                            <p className="text-gray-500 font-medium text-xs md:text-sm mt-2">
                                Audited operational health, student population metrics, and prescriptive insights for <strong className="text-gray-900 font-black">{selectedMonth}</strong>
                            </p>
                        </div>

                        {/* Top Controls Group */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
                            <MonthPicker 
                                selected={selectedMonth} 
                                onChange={setSelectedMonth} 
                                allowAll={false}
                            />

                            {/* Export Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="w-full sm:w-auto px-4 py-3 bg-white border-2 border-white shadow-md shadow-slate-200/60 rounded-2xl hover:bg-gray-50 transition flex items-center justify-center gap-2 text-xs font-black text-gray-700 cursor-pointer active:scale-98 uppercase tracking-wider"
                                >
                                    <Download className="w-4 h-4 text-primary" />
                                    <span>Export Dossier</span>
                                </button>

                                {showExportMenu && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                        <div className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 mb-1">
                                            Export Options
                                        </div>
                                        <button
                                            onClick={handleExportPdf}
                                            disabled={exportingPdf}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-primary/5 hover:text-primary flex items-center gap-2.5 transition cursor-pointer"
                                        >
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span>{exportingPdf ? 'Compiling PDF...' : 'Executive Dossier (PDF)'}</span>
                                        </button>
                                        <button
                                            onClick={() => handleExportCsv('all')}
                                            disabled={exportingCsv}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition cursor-pointer"
                                        >
                                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                            <span>Full Institutional CSV</span>
                                        </button>
                                        <button
                                            onClick={() => handleExportCsv('students')}
                                            disabled={exportingCsv}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition cursor-pointer"
                                        >
                                            <Users className="w-4 h-4 text-blue-600" />
                                            <span>Student Population & Roster (CSV)</span>
                                        </button>
                                        <button
                                            onClick={() => handleExportCsv('financials')}
                                            disabled={exportingCsv}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2.5 transition cursor-pointer"
                                        >
                                            <IndianRupee className="w-4 h-4 text-indigo-600" />
                                            <span>Financial Ledger (CSV)</span>
                                        </button>
                                        <button
                                            onClick={() => handleExportCsv('attendance')}
                                            disabled={exportingCsv}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2.5 transition cursor-pointer"
                                        >
                                            <Clock className="w-4 h-4 text-purple-600" />
                                            <span>Classes & Rates (CSV)</span>
                                        </button>
                                        <button
                                            onClick={() => handleExportCsv('exams')}
                                            disabled={exportingCsv}
                                            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2.5 transition cursor-pointer"
                                        >
                                            <Award className="w-4 h-4 text-amber-600" />
                                            <span>Exam Performance (CSV)</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Refresh Button */}
                            <button 
                                onClick={() => { fetchReport(); fetchTrends(); }}
                                className="p-3 bg-white border-2 border-white shadow-md shadow-slate-200/60 rounded-2xl hover:bg-gray-50 transition text-gray-500 hover:text-primary cursor-pointer active:scale-95 flex items-center justify-center"
                                title="Refresh Analytics"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {reportData && (
                        <div className="space-y-8">
                            
                            {/* ------------------------------------------------------------- */}
                            {/* SECTION 1: PRESCRIPTIVE "WHAT TO DO NEXT" ACTION CENTER       */}
                            {/* ------------------------------------------------------------- */}
                            {reportData.prescriptiveIntelligence && reportData.prescriptiveIntelligence.actionItems?.length > 0 && (
                                <div className="bg-white rounded-3xl md:rounded-[2rem] p-6 md:p-8 border-2 border-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm font-black">
                                                <Compass className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic tracking-tight">
                                                        What To Do Next: Action Center
                                                    </h2>
                                                    {reportData.prescriptiveIntelligence.urgentCount > 0 && (
                                                        <span className="text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full animate-pulse">
                                                            {reportData.prescriptiveIntelligence.urgentCount} Urgent Actions
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    Algorithmic operational diagnostics and prioritized recommendations
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80 w-fit">
                                            {reportData.prescriptiveIntelligence.actionItemsCount} Prioritized Items
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {reportData.prescriptiveIntelligence.actionItems.map((item: any, idx: number) => {
                                            const isUrgent = item.priority === 'urgent';
                                            const isHigh = item.priority === 'high';
                                            const isGrowth = item.category === 'growth';

                                            return (
                                                <div 
                                                    key={item.id || idx}
                                                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md ${
                                                        isUrgent 
                                                            ? 'bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 border-rose-100 hover:border-rose-300' 
                                                            : isHigh 
                                                            ? 'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border-amber-100 hover:border-amber-300' 
                                                            : isGrowth
                                                            ? 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border-emerald-100 hover:border-emerald-300'
                                                            : 'bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 border-indigo-100 hover:border-indigo-300'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2.5">
                                                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                                                isUrgent ? 'bg-rose-100 text-rose-800 border-rose-200' :
                                                                isHigh ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                                isGrowth ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                                                'bg-indigo-100 text-indigo-800 border-indigo-200'
                                                            }`}>
                                                                {item.badge}
                                                            </span>
                                                            <span className="text-xs font-black text-gray-900 italic">
                                                                {item.metric}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tight mb-1.5">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-gray-100/80 flex items-center justify-end">
                                                        <Link 
                                                            href={item.actionUrl}
                                                            className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:text-indigo-900 transition group-hover:translate-x-0.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
                                                        >
                                                            <span>{item.actionLabel}</span>
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ------------------------------------------------------------- */}
                            {/* SECTION 2: EXECUTIVE SCORECARD WITH MOM VARIANCE               */}
                            {/* ------------------------------------------------------------- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                
                                {/* Card 1: Revenue Collected */}
                                <div className="bg-white p-6 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition group flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary">
                                                <IndianRupee className="w-6 h-6" />
                                            </div>
                                            {formatDelta(reportData.financials?.momDeltas?.revenue)}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Realized Revenue</p>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight italic">
                                            ₹{reportData.financials.summary.totalReceived.toLocaleString()}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium mt-1">
                                            Uncollected AR: <strong className="text-amber-600 font-bold">₹{reportData.financials.summary.totalReceivable.toLocaleString()}</strong>
                                        </p>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold mb-1.5">
                                            <span>Collection Velocity</span>
                                            <span className="text-gray-900">{reportData.financials.summary.collectionVelocity}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, reportData.financials.summary.collectionVelocity)}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Net Operating Profit */}
                                <div className="bg-white p-6 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition group flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3.5 rounded-2xl border ${reportData.financials.summary.netProfit < 0 ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                                                {reportData.financials.summary.netProfit < 0 ? <ArrowDownRight className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                                            </div>
                                            {formatDelta(reportData.financials?.momDeltas?.netProfit)}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Net Operating Margin</p>
                                        <h3 className={`text-2xl sm:text-3xl font-black tracking-tight italic ${reportData.financials.summary.netProfit < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            ₹{reportData.financials.summary.netProfit.toLocaleString()}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium mt-1">
                                            Margin: <strong className="text-gray-900 font-bold">{reportData.financials.summary.profitMargin}%</strong>
                                        </p>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                                        <span>Payroll Disbursed</span>
                                        <span className="text-rose-600 font-bold">₹{reportData.financials.summary.totalDisbursed.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Card 3: Teaching Delivery & Volume */}
                                <div className="bg-white p-6 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition group flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-purple-600">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            {formatDelta(reportData.financials?.momDeltas?.hours)}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Teaching Delivery</p>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight italic">
                                            {reportData.attendance.totalHours} hrs
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium mt-1">
                                            {reportData.attendance.totalSessions} Sessions • {reportData.attendance.avgSessionDuration}m avg
                                        </p>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                                        <span>Active Roster</span>
                                        <span className="text-purple-700 font-bold">{reportData.attendance.activeStudentsCount} Students • {reportData.attendance.activeTeachersCount} Tutors</span>
                                    </div>
                                </div>

                                {/* Card 4: Academic Quality & Mastery */}
                                <div className="bg-white p-6 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition group flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-600">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                            {formatDelta(reportData.financials?.momDeltas?.examAverage)}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Exam Benchmark</p>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight italic">
                                            {reportData.exams.averagePerformance}%
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium mt-1">
                                            {reportData.exams.count} Assessments Evaluated
                                        </p>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                                        <span>Mastery / At-Risk</span>
                                        <span className="font-bold text-amber-700">
                                            {reportData.exams?.academicTiers?.mastery?.count || 0} Mastery / {reportData.exams?.academicTiers?.atRisk?.count || 0} At-Risk
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ------------------------------------------------------------- */}
                            {/* STUDENT LIFECYCLE & POPULATION SCORECARDS                     */}
                            {/* ------------------------------------------------------------- */}
                            {reportData.studentsAnalytics && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                    
                                    {/* Student Card 1: Total Enrolled Population */}
                                    <div className="bg-white p-5 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                                                    Total Enrolled
                                                </span>
                                            </div>
                                            <h4 className="text-2xl font-black text-gray-900 tracking-tight italic">
                                                {reportData.studentsAnalytics.summary.totalEnrolled} Students
                                            </h4>
                                            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-500">
                                                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                    <UserCheck className="w-3 h-3" /> {reportData.studentsAnalytics.summary.totalActive} Active
                                                </span>
                                                <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                                                    <UserX className="w-3 h-3" /> {reportData.studentsAnalytics.summary.totalInactive} Left / Inactive
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Student Card 2: New Admissions */}
                                    <div className="bg-white p-5 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600">
                                                    <UserPlus className="w-5 h-5" />
                                                </div>
                                                {formatDelta(reportData.financials?.momDeltas?.newStudents)}
                                            </div>
                                            <h4 className="text-2xl font-black text-emerald-600 tracking-tight italic">
                                                +{reportData.studentsAnalytics.summary.newAdmissionsCount} Joined
                                            </h4>
                                            <p className="text-xs text-gray-500 font-medium mt-1">
                                                New admissions registered in {selectedMonth}
                                            </p>
                                        </div>
                                        <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
                                            Prior Month: <strong className="text-gray-700">{reportData.studentsAnalytics.summary.prevAdmissionsCount} enrolled</strong>
                                        </div>
                                    </div>

                                    {/* Student Card 3: Monthly Active Engagement */}
                                    <div className="bg-white p-5 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                    Engagement Rate
                                                </span>
                                            </div>
                                            <h4 className="text-2xl font-black text-gray-900 tracking-tight italic">
                                                {reportData.studentsAnalytics.summary.activeEngagementRate}%
                                            </h4>
                                            <p className="text-xs text-gray-500 font-medium mt-1">
                                                <strong className="text-indigo-600 font-bold">{reportData.studentsAnalytics.summary.activeLearningCount}</strong> of {reportData.studentsAnalytics.summary.totalActive} active students took classes
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-3">
                                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${reportData.studentsAnalytics.summary.activeEngagementRate}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Student Card 4: Dormant Risk / Churn Alert */}
                                    <div className="bg-white p-5 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`p-2.5 rounded-2xl border ${reportData.studentsAnalytics.summary.dormantCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                                                    <AlertCircle className="w-5 h-5" />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${reportData.studentsAnalytics.summary.dormantCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                                    {reportData.studentsAnalytics.summary.dormantCount > 0 ? 'Dormant Warning' : '100% Retained'}
                                                </span>
                                            </div>
                                            <h4 className={`text-2xl font-black tracking-tight italic ${reportData.studentsAnalytics.summary.dormantCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                                                {reportData.studentsAnalytics.summary.dormantCount} Dormant
                                            </h4>
                                            <p className="text-xs text-gray-500 font-medium mt-1">
                                                Active status but 0 learning sessions in {selectedMonth}
                                            </p>
                                        </div>
                                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                                            <span>Retention Status</span>
                                            <span className="font-bold text-gray-800">
                                                {reportData.studentsAnalytics.summary.totalActive - reportData.studentsAnalytics.summary.dormantCount} Engaged
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* ------------------------------------------------------------- */}
                            {/* SECTION 3: DEEP-DIVE ANALYTICAL VISUALS                        */}
                            {/* ------------------------------------------------------------- */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                
                                {/* Left Visual Column (8 Cols) */}
                                <div className="lg:col-span-8 space-y-8">
                                    
                                    {/* 1. 6-Month Rolling Financial Trajectory */}
                                    <div className="bg-white border-2 border-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                    <TrendingUp className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-gray-900 uppercase italic tracking-tight">
                                                        6-Month Financial & Margin Trajectory
                                                    </h3>
                                                    <p className="text-xs text-gray-500 font-medium">Rolling multi-month trend of Collections, Expenses, and Operating Margin</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-[280px] w-full">
                                            {trendsLoading ? (
                                                <div className="h-full flex flex-col items-center justify-center space-y-2">
                                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-xs text-gray-400 italic">Compiling historical curve...</p>
                                                </div>
                                            ) : trendsData.length === 0 ? (
                                                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                                    No historical trajectory points found
                                                </div>
                                            ) : (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                                        <defs>
                                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#45308D" stopOpacity={0.25}/>
                                                                <stop offset="95%" stopColor="#45308D" stopOpacity={0.0}/>
                                                            </linearGradient>
                                                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                        <XAxis dataKey="shortMonth" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                                            formatter={(value: any, name: any) => {
                                                                const formatted = `₹${Number(value || 0).toLocaleString()}`;
                                                                const key = String(name).toLowerCase();
                                                                let label = name;
                                                                if (key.includes('revenue')) label = 'Revenue';
                                                                else if (key.includes('profit')) label = 'Net Profit';
                                                                else if (key.includes('expense')) label = 'Expenses';
                                                                return [formatted, label];
                                                            }}
                                                        />
                                                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#45308D" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                                                        <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
                                                        <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. Subject Unit Economics & Profitability Matrix */}
                                    <div className="bg-white border-2 border-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                                                    <Layers className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-gray-900 uppercase italic tracking-tight">
                                                        Subject Unit Economics & Profit Margins
                                                    </h3>
                                                    <p className="text-xs text-gray-500 font-medium">Billed Revenue vs Tutor Payroll Cost & Gross Profit by Subject</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-[280px] w-full">
                                            {(!reportData.attendance.subjectEconomics || reportData.attendance.subjectEconomics.length === 0) ? (
                                                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                                    No subject breakdown logs available for this period
                                                </div>
                                            ) : (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={reportData.attendance.subjectEconomics.slice(0, 7)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                                                        <Tooltip 
                                                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                                            formatter={(value: any, name: any) => {
                                                                const formatted = `₹${Number(value || 0).toLocaleString()}`;
                                                                const key = String(name).toLowerCase();
                                                                let label = name;
                                                                if (key.includes('revenue')) label = 'Billed Revenue';
                                                                else if (key.includes('cost')) label = 'Tutor Cost';
                                                                else if (key.includes('profit')) label = 'Gross Profit';
                                                                return [formatted, label];
                                                            }}
                                                        />
                                                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                                        <Bar dataKey="revenue" name="Billed Revenue" fill="#45308D" radius={[6, 6, 0, 0]} />
                                                        <Bar dataKey="tutorCost" name="Tutor Cost" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                                                        <Bar dataKey="grossProfit" name="Gross Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Breakdown Column (4 Cols) */}
                                <div className="lg:col-span-4 space-y-8">
                                    
                                    {/* 1. Student Academic Health Tiers */}
                                    <div className="bg-white border-2 border-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-8">
                                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                                            <div className="p-2.5 rounded-2xl bg-pink-50 text-pink-700 border border-pink-100">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tight">
                                                    Student Academic Health
                                                </h3>
                                                <p className="text-[10px] text-gray-500 font-medium">Performance tier distributions</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Mastery Tier */}
                                            <div 
                                                onClick={() => setSelectedTierModal({ title: 'Mastery Tier (80%+ Avg)', students: reportData.exams?.academicTiers?.mastery?.students || [] })}
                                                className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl hover:bg-emerald-50 transition cursor-pointer flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 uppercase italic">Mastery (80%+)</p>
                                                        <p className="text-[10px] text-gray-500 font-medium">High performing cohort</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-black text-emerald-700">
                                                        {reportData.exams?.academicTiers?.mastery?.count || 0}
                                                    </span>
                                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition" />
                                                </div>
                                            </div>

                                            {/* Proficient Tier */}
                                            <div 
                                                onClick={() => setSelectedTierModal({ title: 'Proficient Tier (60% - 79%)', students: reportData.exams?.academicTiers?.proficient?.students || [] })}
                                                className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl hover:bg-indigo-50 transition cursor-pointer flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 uppercase italic">Proficient (60% - 79%)</p>
                                                        <p className="text-[10px] text-gray-500 font-medium">Consistent understanding</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-black text-indigo-700">
                                                        {reportData.exams?.academicTiers?.proficient?.count || 0}
                                                    </span>
                                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition" />
                                                </div>
                                            </div>

                                            {/* Developing Tier */}
                                            <div 
                                                onClick={() => setSelectedTierModal({ title: 'Developing Tier (45% - 59%)', students: reportData.exams?.academicTiers?.developing?.students || [] })}
                                                className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl hover:bg-amber-50 transition cursor-pointer flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 uppercase italic">Developing (45% - 59%)</p>
                                                        <p className="text-[10px] text-gray-500 font-medium">Needs focused guidance</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-black text-amber-700">
                                                        {reportData.exams?.academicTiers?.developing?.count || 0}
                                                    </span>
                                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition" />
                                                </div>
                                            </div>

                                            {/* At-Risk Tier */}
                                            <div 
                                                onClick={() => setSelectedTierModal({ title: 'At-Risk Tier (< 45%)', students: reportData.exams?.academicTiers?.atRisk?.students || [] })}
                                                className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl hover:bg-rose-50 transition cursor-pointer flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
                                                    <div>
                                                        <p className="text-xs font-black text-rose-900 uppercase italic">At-Risk (&lt; 45%)</p>
                                                        <p className="text-[10px] text-rose-600 font-medium">Requires immediate review</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-black text-rose-700">
                                                        {reportData.exams?.academicTiers?.atRisk?.count || 0}
                                                    </span>
                                                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Faculty Workload & Distribution List */}
                                    <div className="bg-white border-2 border-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-8">
                                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tight">
                                                        Faculty Workload
                                                    </h3>
                                                    <p className="text-[10px] text-gray-500 font-medium">Teaching hours distribution</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                                {reportData.attendance.teacherStats.length} Tutors
                                            </span>
                                        </div>

                                        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                                            {reportData.attendance.teacherStats.map((t: any, idx: number) => (
                                                <div key={t.id || idx} className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{t.name}</p>
                                                        <p className="text-[10px] text-gray-500">{t.studentsCount} Students • {t.sessions} Sessions</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg text-[10px]">
                                                            {t.hours} hrs
                                                        </span>
                                                        <p className="text-[10px] text-gray-600 font-bold mt-0.5">₹{t.earnings.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ------------------------------------------------------------- */}
                            {/* SECTION 4: STUDENT POPULATION & PERFORMANCE INTELLIGENCE      */}
                            {/* ------------------------------------------------------------- */}
                            {reportData.studentsAnalytics && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
                                            <Trophy className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">
                                                Student Population & Performance Intelligence
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium">Cohort analytics, top student rankings, and demographic dynamics for {selectedMonth}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        
                                        {/* Left: Best Students Spotlight / Leaderboards (7 Cols) */}
                                        <div className="lg:col-span-7 bg-white border-2 border-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                                            <div>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                                                    <div>
                                                        <h4 className="text-base font-black text-gray-900 uppercase italic tracking-tight flex items-center gap-2">
                                                            <Flame className="w-4 h-4 text-amber-500" />
                                                            <span>Best Students & Top Contributors</span>
                                                        </h4>
                                                        <p className="text-xs text-gray-500 font-medium">Spotlight of highest achieving and engaged learners</p>
                                                    </div>

                                                    {/* Leaderboard Switcher */}
                                                    <div className="flex items-center p-1 bg-gray-100 rounded-xl">
                                                        <button
                                                            onClick={() => setStudentLeaderboardTab('academic')}
                                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${studentLeaderboardTab === 'academic' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                                        >
                                                            🏆 Academic
                                                        </button>
                                                        <button
                                                            onClick={() => setStudentLeaderboardTab('dedicated')}
                                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${studentLeaderboardTab === 'dedicated' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                                        >
                                                            ⏱️ Class Hours
                                                        </button>
                                                        <button
                                                            onClick={() => setStudentLeaderboardTab('value')}
                                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${studentLeaderboardTab === 'value' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                                        >
                                                            💎 High Value
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Leaderboard List */}
                                                <div className="space-y-3">
                                                    {studentLeaderboardTab === 'academic' && (
                                                        reportData.studentsAnalytics.leaderboards.topAcademic.length === 0 ? (
                                                            <div className="py-12 text-center text-xs text-gray-400 italic">No assessment scores logged for this period</div>
                                                        ) : (
                                                            reportData.studentsAnalytics.leaderboards.topAcademic.map((st: any, idx: number) => (
                                                                <div key={st.id} className="p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between transition group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-amber-400 text-amber-950 shadow-xs' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-700/20 text-amber-800' : 'bg-gray-200 text-gray-700'}`}>
                                                                            #{idx + 1}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                                                                <span>{st.name}</span>
                                                                                {st.isNewThisMonth && <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">New</span>}
                                                                            </p>
                                                                            <p className="text-[10px] text-gray-500 font-medium">Class {st.class} • {st.syllabus} • {st.examsCount} Exam(s)</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl">
                                                                            {st.examAvg}% Average
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )
                                                    )}

                                                    {studentLeaderboardTab === 'dedicated' && (
                                                        reportData.studentsAnalytics.leaderboards.topDedicated.length === 0 ? (
                                                            <div className="py-12 text-center text-xs text-gray-400 italic">No attendance hours logged for this period</div>
                                                        ) : (
                                                            reportData.studentsAnalytics.leaderboards.topDedicated.map((st: any, idx: number) => (
                                                                <div key={st.id} className="p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between transition group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-purple-500 text-white shadow-xs' : idx === 1 ? 'bg-purple-300 text-purple-950' : 'bg-gray-200 text-gray-700'}`}>
                                                                            #{idx + 1}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-gray-900">{st.name}</p>
                                                                            <p className="text-[10px] text-gray-500 font-medium">Class {st.class} • {st.sessions} Sessions • {st.subjects.join(', ') || 'Classes'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-xl">
                                                                            {st.hours} hrs completed
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )
                                                    )}

                                                    {studentLeaderboardTab === 'value' && (
                                                        reportData.studentsAnalytics.leaderboards.topValue.length === 0 ? (
                                                            <div className="py-12 text-center text-xs text-gray-400 italic">No billing records for this period</div>
                                                        ) : (
                                                            reportData.studentsAnalytics.leaderboards.topValue.map((st: any, idx: number) => (
                                                                <div key={st.id} className="p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between transition group">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-200 text-gray-700'}`}>
                                                                            #{idx + 1}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-gray-900">{st.name}</p>
                                                                            <p className="text-[10px] text-gray-500 font-medium">Class {st.class} • {st.location}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-xs font-black text-gray-900">₹{(st.feePaid + st.feeDue).toLocaleString()}</p>
                                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${st.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                                            {st.feeStatus}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                                <span>Showing top performers for {selectedMonth}</span>
                                                <button
                                                    onClick={() => {
                                                        setActiveSection('students');
                                                        const el = document.getElementById('report-ledger-section');
                                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className="font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                                                >
                                                    <span>View Complete Cohort</span>
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Right: Demographic Breakdown & Lifecycle Tiers (5 Cols) */}
                                        <div className="lg:col-span-5 space-y-6">
                                            
                                            {/* 1. Geographic & Location Split */}
                                            <div className="bg-white border-2 border-white shadow-xl shadow-slate-200/50 rounded-3xl p-6">
                                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                                    <div className="flex items-center gap-2.5">
                                                        <Globe className="w-4 h-4 text-blue-600" />
                                                        <h4 className="text-xs font-black text-gray-900 uppercase italic">Geographic Footprint</h4>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400">GCC vs India</span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                                                            <span className="text-gray-700">India Cohort</span>
                                                            <span className="text-gray-900 font-black">
                                                                {reportData.studentsAnalytics.demographics.locationCounts.India || 0} ({Math.round(((reportData.studentsAnalytics.demographics.locationCounts.India || 0) / Math.max(1, reportData.studentsAnalytics.summary.totalEnrolled)) * 100)}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round(((reportData.studentsAnalytics.demographics.locationCounts.India || 0) / Math.max(1, reportData.studentsAnalytics.summary.totalEnrolled)) * 100)}%` }}></div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                                                            <span className="text-gray-700">GCC Cohort</span>
                                                            <span className="text-gray-900 font-black">
                                                                {reportData.studentsAnalytics.demographics.locationCounts.GCC || 0} ({Math.round(((reportData.studentsAnalytics.demographics.locationCounts.GCC || 0) / Math.max(1, reportData.studentsAnalytics.summary.totalEnrolled)) * 100)}%)
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.round(((reportData.studentsAnalytics.demographics.locationCounts.GCC || 0) / Math.max(1, reportData.studentsAnalytics.summary.totalEnrolled)) * 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. Class Level Breakdown */}
                                            <div className="bg-white border-2 border-white shadow-xl shadow-slate-200/50 rounded-3xl p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-gray-100">
                                                    <div className="flex items-center gap-2.5">
                                                        <GraduationCap className="w-4 h-4 text-purple-600" />
                                                        <h4 className="text-xs font-black text-gray-900 uppercase italic">Grade / Class Distribution</h4>
                                                    </div>

                                                    {/* Active / Inactive / All Toggle */}
                                                    <div className="flex items-center p-0.5 bg-gray-100 rounded-xl self-start sm:self-auto">
                                                        <button
                                                            onClick={() => setClassDistributionFilter('active')}
                                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${classDistributionFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                                        >
                                                            Active ({reportData.studentsAnalytics.summary.totalActive})
                                                        </button>
                                                        <button
                                                            onClick={() => setClassDistributionFilter('inactive')}
                                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${classDistributionFilter === 'inactive' ? 'bg-rose-600 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                                        >
                                                            Inactive ({reportData.studentsAnalytics.summary.totalInactive})
                                                        </button>
                                                        <button
                                                            onClick={() => setClassDistributionFilter('all')}
                                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${classDistributionFilter === 'all' ? 'bg-primary text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                                                        >
                                                            All ({reportData.studentsAnalytics.summary.totalEnrolled})
                                                        </button>
                                                    </div>
                                                </div>

                                                {filteredClassCounts.length === 0 ? (
                                                    <p className="text-xs text-gray-400 py-3 italic text-center">
                                                        No {classDistributionFilter === 'active' ? 'active' : 'inactive'} students enrolled in any classes
                                                    </p>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {filteredClassCounts.map(([cls, count]: any) => (
                                                            <div key={cls} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition">
                                                                <span className="text-gray-700">{cls}</span>
                                                                <span className={`font-black px-1.5 py-0.2 rounded-md text-[10px] ${
                                                                    classDistributionFilter === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                                                    classDistributionFilter === 'inactive' ? 'bg-rose-100 text-rose-800' :
                                                                    'bg-primary/10 text-primary'
                                                                }`}>
                                                                    {count}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ------------------------------------------------------------- */}
                            {/* SECTION 5: ADVANCED SEARCHABLE MULTI-ENTITY DATA LEDGER       */}
                            {/* ------------------------------------------------------------- */}
                            <div id="report-ledger-section" className="bg-white border-2 border-white shadow-xl shadow-slate-200/50 rounded-3xl md:rounded-[2rem] overflow-hidden">
                                
                                {/* Ledger Navigation Header */}
                                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
                                        <button
                                            onClick={() => setActiveSection('financials')}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                                                activeSection === 'financials'
                                                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                                                    : 'text-gray-500 hover:text-gray-900 bg-gray-100'
                                            }`}
                                        >
                                            <IndianRupee className="w-4 h-4" />
                                            <span>Financials ({reportData.financials.fees.length + reportData.financials.salaries.length})</span>
                                        </button>

                                        <button
                                            onClick={() => setActiveSection('attendance')}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                                                activeSection === 'attendance'
                                                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                                                    : 'text-gray-500 hover:text-gray-900 bg-gray-100'
                                            }`}
                                        >
                                            <Clock className="w-4 h-4" />
                                            <span>Classes ({reportData.attendance.logs.length})</span>
                                        </button>

                                        <button
                                            onClick={() => setActiveSection('students')}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                                                activeSection === 'students'
                                                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                                                    : 'text-gray-500 hover:text-gray-900 bg-gray-100'
                                            }`}
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>Students Cohort ({reportData.studentsAnalytics?.roster?.length || 0})</span>
                                        </button>

                                        <button
                                            onClick={() => setActiveSection('exams')}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                                                activeSection === 'exams'
                                                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                                                    : 'text-gray-500 hover:text-gray-900 bg-gray-100'
                                            }`}
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            <span>Assessments ({reportData.exams.records.length})</span>
                                        </button>

                                        {anomalySessions.length > 0 && (
                                            <button
                                                onClick={() => setActiveSection('anomalies')}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                                                    activeSection === 'anomalies'
                                                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                                                        : 'text-rose-700 bg-rose-50 border border-rose-200'
                                                }`}
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                <span>Margin Anomalies ({anomalySessions.length})</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Search & Status Filter */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1 sm:w-64">
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text"
                                                placeholder="Search records..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary shadow-xs transition"
                                            />
                                        </div>

                                        {activeSection === 'financials' && (
                                            <select
                                                value={statusFilter}
                                                onChange={(e: any) => setStatusFilter(e.target.value)}
                                                className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-primary shadow-xs transition cursor-pointer"
                                            >
                                                <option value="all">All Status</option>
                                                <option value="paid">Paid Only</option>
                                                <option value="unpaid">Unpaid Only</option>
                                            </select>
                                        )}

                                        {activeSection === 'students' && (
                                            <select
                                                value={studentRosterFilter}
                                                onChange={(e: any) => setStudentRosterFilter(e.target.value)}
                                                className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-primary shadow-xs transition cursor-pointer"
                                            >
                                                <option value="all">All Cohorts</option>
                                                <option value="active">Active Only</option>
                                                <option value="inactive">Inactive / Dropped</option>
                                                <option value="new">New This Month</option>
                                                <option value="dormant">Dormant (0 classes)</option>
                                            </select>
                                        )}
                                    </div>
                                </div>

                                {/* Table Content Area */}
                                <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                                    
                                    {/* 1. Financials Table */}
                                    {activeSection === 'financials' && (
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="bg-slate-50/90 text-gray-400 font-black uppercase tracking-wider sticky top-0 z-10 border-b border-gray-100 backdrop-blur-xs">
                                                <tr>
                                                    <th className="px-6 py-3.5">Category</th>
                                                    <th className="px-6 py-3.5">Entity / Account</th>
                                                    <th className="px-6 py-3.5 text-right">Amount</th>
                                                    <th className="px-6 py-3.5 text-center">Settlement Details</th>
                                                    <th className="px-6 py-3.5 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredFees.map((fee: any) => (
                                                    <tr key={fee._id} className="hover:bg-slate-50/60 transition">
                                                        <td className="px-6 py-3.5 font-bold text-indigo-700">
                                                            Student Fee
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <p className="font-bold text-gray-900">{fee.studentId?.fullName || 'Student'}</p>
                                                            <p className="text-[10px] text-gray-500 font-medium">{fee.studentId?.class || 'Academic Batch'}</p>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right font-black text-gray-900">
                                                            ₹{fee.amount.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-center text-gray-500 text-[11px] font-medium">
                                                            {fee.billingCutoffDate ? `Cutoff: ${new Date(fee.billingCutoffDate).toLocaleDateString('en-GB')}` : 'Full Month'}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                fee.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                            }`}>
                                                                {fee.paymentStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {filteredSalaries.map((sal: any) => (
                                                    <tr key={sal._id} className="hover:bg-slate-50/60 transition">
                                                        <td className="px-6 py-3.5 font-bold text-purple-700">
                                                            Tutor Payroll
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <p className="font-bold text-gray-900">{sal.teacherId?.name || 'Tutor'}</p>
                                                            <p className="text-[10px] text-gray-500 font-medium">₹{sal.teacherId?.salaryPerHour || 0}/hr base rate</p>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right font-black text-rose-600">
                                                            -₹{sal.totalSalary.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-center text-gray-500 text-[11px] font-medium">
                                                            {sal.pendingStudentSalary > 0 && sal.paidStatus !== 'paid' ? (
                                                                <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">₹{sal.pendingStudentSalary.toLocaleString()} pending student fee</span>
                                                            ) : (
                                                                sal.disbursementCutoffDate ? `Disbursed: ${new Date(sal.disbursementCutoffDate).toLocaleDateString('en-GB')}` : 'Standard Batch'
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                sal.paidStatus === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                                                            }`}>
                                                                {sal.paidStatus}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {/* 2. Students Cohort Table */}
                                    {activeSection === 'students' && (
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="bg-slate-50/90 text-gray-400 font-black uppercase tracking-wider sticky top-0 z-10 border-b border-gray-100 backdrop-blur-xs">
                                                <tr>
                                                    <th className="px-6 py-3.5">Student Profile</th>
                                                    <th className="px-6 py-3.5 text-center">Lifecycle Status</th>
                                                    <th className="px-6 py-3.5 text-center">Monthly Classes</th>
                                                    <th className="px-6 py-3.5 text-center">Assessment Avg</th>
                                                    <th className="px-6 py-3.5 text-right">Tuition Status</th>
                                                    <th className="px-6 py-3.5 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredStudents.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-8 text-center text-xs text-gray-400 italic">
                                                            No student records match the selected filter criteria.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredStudents.map((st: any) => (
                                                        <tr key={st.id} className="hover:bg-slate-50/60 transition">
                                                            <td className="px-6 py-3.5">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-xs">
                                                                        {st.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-gray-900">{st.name}</p>
                                                                        <p className="text-[10px] text-gray-500 font-medium">Class {st.class} • {st.syllabus} • {st.location}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-3.5 text-center">
                                                                <div className="flex items-center justify-center gap-1.5">
                                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        st.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                        {st.status}
                                                                    </span>
                                                                    {st.isNewThisMonth && (
                                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                                                                            New
                                                                        </span>
                                                                    )}
                                                                    {st.isDormant && (
                                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                                                                            Dormant
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-3.5 text-center font-medium">
                                                                {st.sessions > 0 ? (
                                                                    <div>
                                                                        <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg text-[11px]">
                                                                            {st.hours} hrs
                                                                        </span>
                                                                        <p className="text-[10px] text-gray-400 mt-0.5">{st.sessions} sessions</p>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400 text-xs italic">0 sessions</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-3.5 text-center">
                                                                {st.examAvg !== null ? (
                                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        st.examAvg >= 80 ? 'bg-emerald-100 text-emerald-800' :
                                                                        st.examAvg < 45 ? 'bg-rose-100 text-rose-800' :
                                                                        'bg-amber-100 text-amber-800'
                                                                    }`}>
                                                                        {st.examAvg}% ({st.examsCount} tests)
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-400 text-xs">-</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-3.5 text-right">
                                                                <div>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        st.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                                                        st.feeStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                                        'bg-gray-100 text-gray-600'
                                                                    }`}>
                                                                        {st.feeStatus}
                                                                    </span>
                                                                    {st.feePaid > 0 && (
                                                                        <p className="text-[10px] text-gray-500 font-bold mt-0.5">₹{st.feePaid.toLocaleString()}</p>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-3.5 text-right">
                                                                <Link 
                                                                    href="/admin-dashboard/students"
                                                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                                                                >
                                                                    <span>Profile</span>
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    )}

                                    {/* 3. Attendance Table */}
                                    {activeSection === 'attendance' && (
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="bg-slate-50/90 text-gray-400 font-black uppercase tracking-wider sticky top-0 z-10 border-b border-gray-100 backdrop-blur-xs">
                                                <tr>
                                                    <th className="px-6 py-3.5">Date</th>
                                                    <th className="px-6 py-3.5">Student</th>
                                                    <th className="px-6 py-3.5">Tutor</th>
                                                    <th className="px-6 py-3.5">Subject</th>
                                                    <th className="px-6 py-3.5 text-center">Duration</th>
                                                    <th className="px-6 py-3.5 text-right">Billing vs Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredAttendance.map((log: any) => {
                                                    const hours = (log.durationMinutes || 0) / 60;
                                                    const billRate = log.billingRateAtTime || 0;
                                                    const salRate = log.salaryRateAtTime || (log.teacherId?.salaryPerHour || 0);
                                                    const billAmt = Math.round(hours * billRate);
                                                    const costAmt = Math.round(hours * salRate);

                                                    return (
                                                        <tr key={log._id} className="hover:bg-slate-50/60 transition">
                                                            <td className="px-6 py-3.5 text-gray-500 font-bold">
                                                                {new Date(log.date).toLocaleDateString('en-GB')}
                                                            </td>
                                                            <td className="px-6 py-3.5 font-bold text-gray-900">
                                                                {log.studentId?.fullName || 'Student'}
                                                            </td>
                                                            <td className="px-6 py-3.5 text-gray-700 font-medium">
                                                                {log.teacherId?.name || 'Tutor'}
                                                            </td>
                                                            <td className="px-6 py-3.5">
                                                                <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold">
                                                                    {log.subjectId?.subjectName || log.subjectId?.name || 'General'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-3.5 text-center">
                                                                <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                                                    {hours.toFixed(1)} hr ({log.durationMinutes}m)
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-3.5 text-right font-medium">
                                                                <span className="font-bold text-gray-900">₹{billAmt.toLocaleString()}</span>
                                                                <span className="text-gray-400 mx-1.5">/</span>
                                                                <span className="text-rose-600 font-bold">₹{costAmt.toLocaleString()}</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}

                                    {/* 4. Exams Table */}
                                    {activeSection === 'exams' && (
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="bg-slate-50/90 text-gray-400 font-black uppercase tracking-wider sticky top-0 z-10 border-b border-gray-100 backdrop-blur-xs">
                                                <tr>
                                                    <th className="px-6 py-3.5">Date</th>
                                                    <th className="px-6 py-3.5">Student</th>
                                                    <th className="px-6 py-3.5">Subject</th>
                                                    <th className="px-6 py-3.5 text-center">Score</th>
                                                    <th className="px-6 py-3.5 text-right">Mastery Benchmark</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredExams.map((exam: any) => {
                                                    const pct = exam.maxMarks > 0 ? Math.round((exam.marks / exam.maxMarks) * 100) : 0;
                                                    const isMastery = pct >= 80;
                                                    const isAtRisk = pct < 45;

                                                    return (
                                                        <tr key={exam._id} className="hover:bg-slate-50/60 transition">
                                                            <td className="px-6 py-3.5 text-gray-500 font-bold">
                                                                {exam.examDate ? new Date(exam.examDate).toLocaleDateString('en-GB') : '-'}
                                                            </td>
                                                            <td className="px-6 py-3.5 font-bold text-gray-900">
                                                                {exam.studentId?.fullName || 'Student'}
                                                            </td>
                                                            <td className="px-6 py-3.5 text-gray-700 font-medium">
                                                                {exam.subject}
                                                            </td>
                                                            <td className="px-6 py-3.5 text-center font-bold text-gray-900">
                                                                {exam.marks} / {exam.maxMarks}
                                                            </td>
                                                            <td className="px-6 py-3.5 text-right">
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                    isMastery ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                                                    isAtRisk ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                                                    'bg-amber-100 text-amber-800 border border-amber-200'
                                                                }`}>
                                                                    {pct}% {isMastery ? 'Mastery' : isAtRisk ? 'At-Risk' : 'Passing'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}

                                    {/* 5. Margin Anomalies Table */}
                                    {activeSection === 'anomalies' && (
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="bg-rose-50 text-rose-800 font-black uppercase tracking-wider sticky top-0 z-10 border-b border-rose-100">
                                                <tr>
                                                    <th className="px-6 py-3.5">Date</th>
                                                    <th className="px-6 py-3.5">Student & Subject</th>
                                                    <th className="px-6 py-3.5">Tutor</th>
                                                    <th className="px-6 py-3.5 text-center">Duration & Rates</th>
                                                    <th className="px-6 py-3.5 text-right">Net Session Loss</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-rose-100">
                                                {anomalySessions.map((anom: any) => (
                                                    <tr key={anom.id} className="bg-rose-50/40 hover:bg-rose-50/80 transition">
                                                        <td className="px-6 py-3.5 text-gray-600 font-bold">
                                                            {new Date(anom.date).toLocaleDateString('en-GB')}
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <p className="font-bold text-gray-900">{anom.studentName}</p>
                                                            <p className="text-[10px] text-gray-500 font-medium">{anom.subjectName}</p>
                                                        </td>
                                                        <td className="px-6 py-3.5 font-bold text-gray-700">
                                                            {anom.teacherName}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-center font-medium">
                                                            <span className="text-gray-700">{anom.hours} hrs</span>
                                                            <span className="text-[10px] text-gray-400 mx-1.5">•</span>
                                                            <span className="text-indigo-700 font-bold">₹{anom.billRate}/hr bill</span>
                                                            <span className="text-[10px] text-gray-400 mx-1.5">vs</span>
                                                            <span className="text-rose-700 font-bold">₹{anom.salaryRate}/hr cost</span>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right font-black text-rose-600">
                                                            -₹{anom.loss.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ------------------------------------------------------------- */}
                    {/* MODAL: STUDENT ACADEMIC HEALTH TIER DRILL-DOWN                */}
                    {/* ------------------------------------------------------------- */}
                    {selectedTierModal && (
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-in fade-in duration-200">
                            <div 
                                className="absolute inset-0 bg-primary/20 backdrop-blur-md"
                                onClick={() => setSelectedTierModal(null)}
                            ></div>
                            <div className="bg-white rounded-3xl md:rounded-[2rem] p-6 md:p-8 shadow-2xl relative z-10 max-w-lg w-full max-h-[85vh] flex flex-col border-4 border-white animate-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <h3 className="text-base font-black text-gray-900 uppercase italic tracking-tight">
                                        {selectedTierModal.title}
                                    </h3>
                                    <button 
                                        onClick={() => setSelectedTierModal(null)}
                                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="py-4 overflow-y-auto space-y-2.5 flex-1 pr-1">
                                    {selectedTierModal.students.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-8 font-medium italic">No students in this tier</p>
                                    ) : (
                                        selectedTierModal.students.map((st: any, idx: number) => (
                                            <div key={st.studentId || idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between shadow-2xs">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900">{st.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium">{st.assessmentsCount} assessment(s) logged</p>
                                                </div>
                                                <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-xl">
                                                    {st.avgScore}% Avg
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
