'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/app/components/Sidebar';
import api from '@/app/utils/api';
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
    CheckCircle,
    XCircle,
    Search,
    BookOpen,
    Filter,
    ChevronRight,
    Download
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Area, 
    AreaChart 
} from 'recharts';
import { toast, Toaster } from 'react-hot-toast';

export default function StudentInsights() {
    const { id } = useParams();
    const router = useRouter();
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
                toast.error("Failed to aggregate student data");
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

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#fafafa]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="p-8 md:p-12 pb-4">
                    <button 
                        onClick={() => router.push('/admin-dashboard/students')}
                        className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Directory
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-primary text-white rounded-[2rem] flex items-center justify-center text-3xl font-black italic shadow-2xl shadow-primary/20">
                                {student?.fullName?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-1">Student Central Profile</p>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                                    {student?.fullName}
                                </h1>
                            </div>
                        </div>
                        
                        <div className="flex bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm relative z-10">
                            {[
                                { id: 'profile', icon: <User className="w-4 h-4" />, label: 'Identity' },
                                { id: 'finance', icon: <IndianRupee className="w-4 h-4" />, label: 'Ledger' },
                                { id: 'exams', icon: <TrendingUp className="w-4 h-4" />, label: 'Analytics' },
                                { id: 'attendance', icon: <Clock className="w-4 h-4" />, label: 'Presence' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                        : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                                    }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <main className="p-8 md:p-12 pt-4 flex-1">
                    {activeTab === 'profile' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
                            <div className="md:col-span-2 space-y-8">
                                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 space-y-10">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter mb-6">Contact Matrix</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <Mail className="w-3 h-3" /> Digital Address
                                                </p>
                                                <p className="text-[15px] font-bold text-gray-700">{student?.email}</p>
                                            </div>
                                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <Phone className="w-3 h-3" /> Communication
                                                </p>
                                                <p className="text-[15px] font-bold text-gray-700">{student?.contactNumber}</p>
                                            </div>
                                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <MapPin className="w-3 h-3" /> Regional Sector
                                                </p>
                                                <p className="text-[15px] font-bold text-gray-700">{student?.residentialLocation || student?.district || 'N/A'}</p>
                                            </div>
                                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" /> Birth Registry
                                                </p>
                                                <p className="text-[15px] font-bold text-gray-700">{student?.dob ? new Date(student.dob).toDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter mb-6">Institutional Metadata</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Academic Grade</p>
                                                <p className="text-[15px] font-bold text-gray-700">{student?.class}</p>
                                            </div>
                                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Parental Sentinel</p>
                                                <p className="text-[15px] font-bold text-gray-700">{student?.parentName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="bg-[#45308D] rounded-[3rem] p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Academic Status</p>
                                    <h4 className="text-3xl font-black italic tracking-tighter uppercase">{student?.status || 'Active'}</h4>
                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <p className="text-[10px] font-medium opacity-60 leading-relaxed italic">
                                            Registered into the system on {new Date(student?.createdAt).toLocaleDateString()}. Currently cleared for all academic and financial modules.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'finance' && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Receivables</p>
                                    <h4 className="text-4xl font-black italic tracking-tighter text-gray-800">₹{financialSummary.total.toLocaleString()}</h4>
                                </div>
                                <div className="bg-green-50/50 p-10 rounded-[2.5rem] border border-green-100 shadow-sm relative overflow-hidden">
                                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Total Settled</p>
                                    <h4 className="text-4xl font-black italic tracking-tighter text-green-700">₹{financialSummary.paid.toLocaleString()}</h4>
                                    <CheckCircle className="absolute -bottom-4 -right-4 w-20 h-20 text-green-500/10" />
                                </div>
                                <div className="bg-rose-50/50 p-10 rounded-[2.5rem] border border-rose-100 shadow-sm relative overflow-hidden">
                                    <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1">Pending Balance</p>
                                    <h4 className="text-4xl font-black italic tracking-tighter text-rose-700">₹{financialSummary.pending.toLocaleString()}</h4>
                                    <XCircle className="absolute -bottom-4 -right-4 w-20 h-20 text-rose-500/10" />
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40">
                                <div className="p-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-lg font-black text-gray-800 italic uppercase">Payment History Matrix</h3>
                                    <div className="flex gap-2">
                                        <div className="px-4 py-2 bg-white rounded-xl text-[9px] font-black uppercase text-gray-400 tracking-widest border border-gray-100">All Nodes</div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="p-8">Period Index</th>
                                                <th className="p-8">Quantum (₹)</th>
                                                <th className="p-8">Settlement Node</th>
                                                <th className="p-8">Status</th>
                                                <th className="p-8 text-right">Reference</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fees.map((fee: any) => (
                                                <tr key={fee._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                                    <td className="p-8 font-black text-gray-800 text-sm italic">{fee.month}</td>
                                                    <td className="p-8 font-black text-gray-800 text-sm">₹{fee.amount.toLocaleString()}</td>
                                                    <td className="p-8 text-gray-500 text-[11px] font-bold uppercase tracking-widest">{fee.paymentMethod || 'Institutional Transfer'}</td>
                                                    <td className="p-8">
                                                        <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${fee.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {fee.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="p-8 text-right">
                                                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tight">{fee._id.substring(0, 10)}...</p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'exams' && (
                        <div className="space-y-10 animate-in zoom-in-95 duration-500">
                             {!activeSubject ? (
                                <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center text-center border border-gray-100 shadow-xl shadow-gray-200/40">
                                    <BookOpen className="w-20 h-20 text-gray-200 mb-6" />
                                    <h2 className="text-2xl font-black text-gray-400 italic uppercase">No Academic Logs</h2>
                                    <p className="text-gray-400 font-bold text-sm max-w-xs mt-2">No historical exam data found for this student across all modules.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-wrap gap-3">
                                        {analysis.subjects.map((sub: string) => (
                                            <button
                                                key={sub}
                                                onClick={() => setActiveSubject(sub)}
                                                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                    activeSubject === sub 
                                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                                                    : 'bg-white text-gray-400 border border-gray-100 hover:text-primary'
                                                }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40">
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">Strategic Growth Curve</h3>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional analysis for {activeSubject}</p>
                                            </div>
                                        </div>

                                        <div className="h-[400px] w-full">
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
                                                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                                        dy={10}
                                                    />
                                                    <YAxis 
                                                        domain={[0, 100]}
                                                        axisLine={false} 
                                                        tickLine={false} 
                                                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                                    />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#fff', 
                                                            borderRadius: '1.5rem', 
                                                            border: 'none', 
                                                            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                                            fontSize: '11px',
                                                            fontWeight: 'bold',
                                                            padding: '1.25rem'
                                                        }}
                                                        content={({ active, payload }) => {
                                                            if (active && payload && payload.length) {
                                                                const d = payload[0].payload;
                                                                return (
                                                                    <div className="bg-white p-5 rounded-3xl shadow-2xl border border-gray-50 min-w-[220px]">
                                                                        <div className="flex justify-between items-center mb-3">
                                                                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{d.formattedDate}</span>
                                                                            <span className="text-sm font-black italic">{d.percentage}%</span>
                                                                        </div>
                                                                        <div className="space-y-2 pt-2 border-t border-gray-50">
                                                                            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                                                                                <span>Assigned Tutor</span>
                                                                                <span className="text-gray-800">{d.tutor}</span>
                                                                            </div>
                                                                            <p className="text-[10px] text-gray-400 italic mt-3 leading-relaxed">"{d.progressNote || 'Standard evaluation.'}"</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                    />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey="percentage" 
                                                        stroke="#45308D" 
                                                        strokeWidth={4}
                                                        fillOpacity={1} 
                                                        fill="url(#colorAdminExam)" 
                                                        dot={{ r: 5, fill: '#45308D', strokeWidth: 2, stroke: '#fff' }}
                                                        activeDot={{ r: 7, strokeWidth: 0 }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div className="space-y-8 animate-in slide-in-from-right-5 duration-500">
                            <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40">
                                <div className="p-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-lg font-black text-gray-800 italic uppercase">Presence History Ledger</h3>
                                    <Clock className="w-6 h-6 text-primary opacity-20" />
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="p-8">Chronicle Date</th>
                                                <th className="p-8">Subject Module</th>
                                                <th className="p-8">Lead Mentor</th>
                                                <th className="p-8">Time Quantum</th>
                                                <th className="p-8 text-right">Status Node</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendance.map((log: any) => (
                                                <tr key={log._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                                    <td className="p-8">
                                                        <p className="text-sm font-black text-gray-800 italic leading-none">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">Evaluation Cycle</p>
                                                    </td>
                                                    <td className="p-8">
                                                        <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl">
                                                            {log.subjectId?.subjectName}
                                                        </span>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-[9px] font-black text-gray-400">
                                                                {log.teacherId?.name?.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-600">{log.teacherId?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-8 font-black text-gray-800 text-xs italic">{log.durationMinutes} Minutes</td>
                                                    <td className="p-8 text-right">
                                                        <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full ${log.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
