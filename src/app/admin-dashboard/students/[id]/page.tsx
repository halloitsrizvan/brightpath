'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { 
    User, 
    IndianRupee, 
    TrendingUp, 
    Clock, 
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar,
    CheckCircle2,
    XCircle,
    BookOpen,
    Menu,
    Shield
} from 'lucide-react';
import { 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Area, 
    AreaChart 
} from 'recharts';
import { toast, Toaster } from 'react-hot-toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

export default function StudentInsights() {
    const { id } = useParams();
    const router = useRouter();
    const { canAccess, canViewIncome, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [student, setStudent] = useState<any>(null);
    const [fees, setFees] = useState<any[]>([]);
    const [analysis, setAnalysis] = useState<any>(null);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSubject, setActiveSubject] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [resStudent, resFees, resAnalysis, resAttendance] = await Promise.all([
                    api.get(`/students/${id}`),
                    api.get(`/finance/fees?studentId=${id}`),
                    api.get(`/exams/analysis?studentId=${id}`),
                    api.get(`/attendance?studentId=${id}`)
                ]);

                setStudent(resStudent.data);
                setFees(resFees.data);
                setAnalysis(resAnalysis.data);
                setAttendance(resAttendance.data);

                if (resAnalysis.data.subjects && resAnalysis.data.subjects.length > 0) {
                    setActiveSubject(resAnalysis.data.subjects[0]);
                }
            } catch (err) {
                toast.error("Failed to load student data");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const financialSummary = useMemo(() => {
        const total = fees.reduce((acc, f) => acc + (f.amount || 0), 0);
        const paid = fees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const pending = total - paid;
        return { total, paid, pending };
    }, [fees]);

    const availableTabs = [
        { id: 'profile', icon: <User className="w-3.5 h-3.5" />, label: 'Profile' },
        ...(canViewIncome() ? [{ id: 'finance', icon: <IndianRupee className="w-3.5 h-3.5" />, label: 'Fee Ledger' }] : []),
        { id: 'exams', icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Academic Analytics' },
        { id: 'attendance', icon: <Clock className="w-3.5 h-3.5" />, label: 'Attendance' }
    ];

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#fafafa]">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#45308D] border-t-transparent"></div>
        </div>
    );

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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Student Profile</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('students') ? (
                        <AccessDenied roleName={roleName} pageName="Student Profiles" />
                    ) : (
                        <>
                            {/* Top Navigation & Profile Header */}
                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5">
                                <button 
                                    onClick={() => router.push('/admin-dashboard/students')}
                                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-[#45308D] transition-colors w-fit group"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> 
                                    <span>Back to Directory</span>
                                </button>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#45308D] text-white rounded-2xl flex items-center justify-center text-xl font-black italic shadow-md shadow-[#45308D]/20 shrink-0">
                                            {student?.fullName?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#45308D] bg-[#45308D]/5 px-2 py-0.5 rounded-md border border-[#45308D]/10">
                                                    Student Central
                                                </span>
                                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${
                                                    (student?.status || 'active') === 'active' 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                                                        : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                }`}>
                                                    {student?.status || 'active'}
                                                </span>
                                            </div>
                                            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mt-1">
                                                {student?.fullName}
                                            </h1>
                                            <p className="text-xs text-gray-400 font-medium">
                                                {student?.class ? `Class ${student?.class}` : 'Academic Record'} • Joined {student?.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tab switcher */}
                                    <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl w-full sm:w-auto overflow-x-auto">
                                        {availableTabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                                                    activeTab === tab.id 
                                                    ? 'bg-white text-[#45308D] shadow-xs' 
                                                    : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                            >
                                                {tab.icon} <span>{tab.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* TAB 1: PROFILE */}
                            {activeTab === 'profile' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-xs space-y-6">
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Contact & Identification</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
                                                        <Mail className="w-3 h-3 text-[#45308D]" /> Email Address
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-900 truncate">{student?.email || 'N/A'}</p>
                                                </div>
                                                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
                                                        <Phone className="w-3 h-3 text-teal-600" /> Phone Number
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-900">{student?.contactNumber || 'N/A'}</p>
                                                </div>
                                                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
                                                        <MapPin className="w-3 h-3 text-indigo-600" /> Residential Location
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-900">{student?.residentialLocation || student?.district || 'N/A'}</p>
                                                </div>
                                                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
                                                        <Calendar className="w-3 h-3 text-amber-600" /> Date of Birth
                                                    </p>
                                                    <p className="text-xs font-bold text-gray-900">{student?.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Academic & Parental Info</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Class / Standard</p>
                                                    <p className="text-xs font-bold text-gray-900">{student?.class ? `Class ${student.class}` : 'N/A'}</p>
                                                </div>
                                                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Parent / Guardian Name</p>
                                                    <p className="text-xs font-bold text-gray-900">{student?.parentName || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-[#45308D] p-5 rounded-2xl text-white shadow-xs space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Account Status</span>
                                                <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[9px] font-bold uppercase">Active</span>
                                            </div>
                                            <h4 className="text-xl font-black tracking-tight">{student?.fullName}</h4>
                                            <p className="text-xs text-white/80 leading-relaxed">
                                                Clear to participate in all live sessions, assessments, and academic modules.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: FINANCE */}
                            {activeTab === 'finance' && canViewIncome() && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Billed</p>
                                            <h4 className="text-xl font-black text-gray-900 mt-0.5">₹{financialSummary.total.toLocaleString()}</h4>
                                        </div>
                                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 shadow-xs">
                                            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Settled Amount</p>
                                            <h4 className="text-xl font-black text-emerald-700 mt-0.5">₹{financialSummary.paid.toLocaleString()}</h4>
                                        </div>
                                        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 shadow-xs">
                                            <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Outstanding Due</p>
                                            <h4 className="text-xl font-black text-rose-700 mt-0.5">₹{financialSummary.pending.toLocaleString()}</h4>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                        <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Fee History Matrix</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-white text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                                                        <th className="px-5 py-3.5">Billing Month</th>
                                                        <th className="px-5 py-3.5">Amount (₹)</th>
                                                        <th className="px-5 py-3.5 hidden md:table-cell">Payment Channel</th>
                                                        <th className="px-5 py-3.5">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {fees.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="py-8 text-center text-gray-400 text-xs font-medium">No fee records logged yet.</td>
                                                        </tr>
                                                    ) : (
                                                        fees.map((fee: any) => (
                                                            <tr key={fee._id} className="hover:bg-gray-50/60 transition-colors">
                                                                <td className="px-5 py-3.5 font-bold text-gray-900 text-xs">{fee.month}</td>
                                                                <td className="px-5 py-3.5 font-bold text-gray-900 text-xs">₹{fee.amount?.toLocaleString()}</td>
                                                                <td className="px-5 py-3.5 text-gray-500 text-xs font-medium hidden md:table-cell">{fee.paymentMethod || 'Institutional Transfer'}</td>
                                                                <td className="px-5 py-3.5">
                                                                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                                                                        fee.paymentStatus === 'paid' 
                                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                                                                            : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                                    }`}>
                                                                        {fee.paymentStatus}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: EXAMS */}
                            {activeTab === 'exams' && (
                                <div className="space-y-6">
                                    {!activeSubject ? (
                                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
                                            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                            <h2 className="text-base font-bold text-gray-900">No Assessment Records</h2>
                                            <p className="text-gray-400 text-xs mt-1">No exam logs found for this student.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.subjects.map((sub: string) => (
                                                    <button
                                                        key={sub}
                                                        onClick={() => setActiveSubject(sub)}
                                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                            activeSubject === sub 
                                                            ? 'bg-[#45308D] text-white shadow-xs' 
                                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        {sub}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-xs space-y-4">
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">Performance Growth Curve</h3>
                                                    <p className="text-xs text-gray-400 font-medium">Trajectory in {activeSubject}</p>
                                                </div>

                                                <div className="h-[280px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={analysis.data[activeSubject]}>
                                                            <defs>
                                                                <linearGradient id="colorAdminExam" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#45308D" stopOpacity={0.2} />
                                                                    <stop offset="95%" stopColor="#45308D" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                            <XAxis 
                                                                dataKey="formattedDate" 
                                                                axisLine={false} 
                                                                tickLine={false} 
                                                                tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                                                            />
                                                            <YAxis 
                                                                domain={[0, 100]}
                                                                axisLine={false} 
                                                                tickLine={false} 
                                                                tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 600 }}
                                                            />
                                                            <Tooltip 
                                                                contentStyle={{ 
                                                                    backgroundColor: '#fff', 
                                                                    borderRadius: '0.75rem', 
                                                                    border: '1px solid #f0f0f0', 
                                                                    fontSize: '11px',
                                                                    fontWeight: 'bold',
                                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                                }}
                                                            />
                                                            <Area 
                                                                type="monotone" 
                                                                dataKey="percentage" 
                                                                stroke="#45308D" 
                                                                strokeWidth={2.5}
                                                                fillOpacity={1} 
                                                                fill="url(#colorAdminExam)" 
                                                                dot={{ r: 3, fill: '#45308D' }}
                                                            />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: ATTENDANCE */}
                            {activeTab === 'attendance' && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                    <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Attendance Ledger</h3>
                                        <Clock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-white text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                                                    <th className="px-5 py-3.5">Session Date</th>
                                                    <th className="px-5 py-3.5">Subject</th>
                                                    <th className="px-5 py-3.5 hidden md:table-cell">Assigned Teacher</th>
                                                    <th className="px-5 py-3.5">Duration</th>
                                                    <th className="px-5 py-3.5 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {attendance.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="py-8 text-center text-gray-400 text-xs font-medium">No session logs found for this student.</td>
                                                    </tr>
                                                ) : (
                                                    attendance.map((log: any) => (
                                                        <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                                                                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="px-2.5 py-0.5 bg-[#45308D]/5 text-[#45308D] text-[10px] font-bold rounded-md">
                                                                    {log.subjectId?.subjectName || 'Subject'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 hidden md:table-cell text-xs font-semibold text-gray-700">
                                                                {log.teacherId?.name || 'Faculty Member'}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                                                                {log.durationMinutes} min
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                                                                    log.status === 'Present' 
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                                                                        : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                                }`}>
                                                                    {log.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
