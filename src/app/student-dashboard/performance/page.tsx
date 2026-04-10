'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { 
    Menu,
    TrendingUp, 
    Award, 
    Target, 
    Calendar, 
    ChevronRight, 
    ChevronLeft,
    Clock,
    BookOpen,
    Info
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
import Cookies from 'js-cookie';

export default function StudentPerformance() {
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeSubject, setActiveSubject] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [studentName, setStudentName] = useState('Student');

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setStudentName(user.name || 'Student');
            } catch (e) { }
        }
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/exams/analysis');
                setAnalysisData(data);
                if (data.subjects && data.subjects.length > 0) {
                    setActiveSubject(data.subjects[0]);
                }
            } catch (err) {
                toast.error("Failed to load performance metrics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, []);

    const subjectStats = useMemo(() => {
        if (!activeSubject || !analysisData?.data[activeSubject]) return null;
        const exams = analysisData.data[activeSubject];
        const latest = exams[exams.length - 1];
        const prev = exams.length > 1 ? exams[exams.length - 2] : null;
        
        const avg = Math.round(exams.reduce((sum: number, e: any) => sum + e.percentage, 0) / exams.length);
        const highest = Math.max(...exams.map((e: any) => e.percentage));
        const momentum = prev ? latest.percentage - prev.percentage : 0;

        return { avg, highest, latest, momentum };
    }, [activeSubject, analysisData]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#fafafa]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing academic records...</p>
            </div>
        </div>
    );

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans overflow-x-hidden">
            <Toaster position="top-right" />
            <Sidebar role="student" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Fixed Header for Mobile */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Growth Suite</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{studentName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-12 mt-20 lg:mt-0">
                    <div className="flex flex-col mb-10">
                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2 ml-1">Learning Metrics</p>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                            Academic <span className="text-primary">Growth</span>
                        </h1>
                    </div>

                    <main className="space-y-10">
                        {!activeSubject ? (
                            <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center text-center border border-gray-100 shadow-xl shadow-gray-200/40">
                                <BookOpen className="w-20 h-20 text-gray-200 mb-6" />
                                <h2 className="text-2xl font-black text-gray-400 italic uppercase italic tracking-tighter leading-none mb-4">No Academic History</h2>
                                <p className="text-gray-400 font-bold text-sm max-w-xs uppercase tracking-widest text-[10px]">Performance charts will appear once your tutors log your first exam results.</p>
                            </div>
                        ) : (
                            <>
                                {/* Subject Toggles */}
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {analysisData.subjects.map((sub: string) => (
                                        <button
                                            key={sub}
                                            onClick={() => setActiveSubject(sub)}
                                            className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all ${
                                                activeSubject === sub 
                                                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                                                : 'bg-white text-gray-400 border border-gray-100 hover:border-primary/20 hover:text-primary shadow-sm'
                                            }`}
                                        >
                                            {sub}
                                        </button>
                                    ))}
                                </div>

                                {/* Stats Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all"></div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-primary" /> Average Retention
                                        </p>
                                        <h4 className="text-4xl font-black italic tracking-tighter text-gray-800 uppercase leading-none">{subjectStats?.avg}%</h4>
                                        <div className="mt-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic opacity-60">Cumulative Portfolio Score</span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <Award className="w-4 h-4 text-teal-600" /> Peak Performance
                                        </p>
                                        <h4 className="text-4xl font-black italic tracking-tighter text-gray-800 uppercase leading-none">{subjectStats?.highest}%</h4>
                                        <div className="mt-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic opacity-60">Highest Historical Record</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#45308D] p-8 rounded-[2.5rem] shadow-2xl shadow-primary/30 relative overflow-hidden group text-white">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2">
                                            <Target className="w-4 h-4" /> Momentum Pulse
                                        </p>
                                        <h4 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                                            {subjectStats?.momentum ? (subjectStats.momentum > 0 ? `+${subjectStats.momentum}` : subjectStats.momentum) : '---'}
                                        </h4>
                                        <div className="mt-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest italic leading-none ${subjectStats?.momentum && subjectStats.momentum >= 0 ? 'text-green-300' : 'text-rose-300'}`}>
                                                {subjectStats?.momentum && subjectStats.momentum >= 0 ? "Positive Growth Matrix" : "Revision Required"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Growth Graph */}
                                <div className="bg-white rounded-[3rem] p-6 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-indigo-500 to-primary"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">Progression Curve</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Chronological timeline of academic output</p>
                                        </div>
                                        <div className="hidden sm:block px-5 py-2.5 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-gray-400 tracking-widest border border-gray-100">Analytical View Enabled</div>
                                    </div>

                                    <div className="h-[300px] md:h-[450px] w-full mt-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={analysisData.data[activeSubject!]}>
                                                <defs>
                                                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#45308D" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#45308D" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis 
                                                    dataKey="formattedDate" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 700 }}
                                                    dy={10}
                                                />
                                                <YAxis 
                                                    domain={[0, 100]}
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 700 }}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: '#fff', 
                                                        borderRadius: '2rem', 
                                                        border: 'none', 
                                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.2)',
                                                        padding: '1.5rem'
                                                    }}
                                                    cursor={{ stroke: '#45308D', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            const d = payload[0].payload;
                                                            return (
                                                                <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 min-w-[220px]">
                                                                    <div className="flex justify-between items-center mb-4">
                                                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{d.formattedDate}</span>
                                                                        <span className="text-xl font-black italic text-gray-800">{d.percentage}%</span>
                                                                    </div>
                                                                    <div className="space-y-4 pt-4 border-t border-gray-50">
                                                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Score Ledger</span>
                                                                            <span className="text-[11px] font-black text-gray-800">{d.marks} / {d.maxMarks}</span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5 leading-none">Mentorship Logic</p>
                                                                            <p className="text-[11px] font-bold text-gray-600 italic leading-relaxed">
                                                                                "{d.progressNote || 'Standard evaluation recorded.'}"
                                                                            </p>
                                                                        </div>
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
                                                    fill="url(#colorProgress)" 
                                                    dot={{ r: 5, fill: '#45308D', strokeWidth: 3, stroke: '#fff' }}
                                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                                    isAnimationActive={true}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
