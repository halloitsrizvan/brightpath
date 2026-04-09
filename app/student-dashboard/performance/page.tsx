'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { 
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

export default function StudentPerformance() {
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeSubject, setActiveSubject] = useState<string | null>(null);

    useEffect(() => {
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Syncing academic records...</p>
            </div>
        </div>
    );

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="fixed z-50 h-full">
                <Sidebar role="student" />
            </div>

            <div className="flex-1 lg:ml-64 flex flex-col">
                <header className="p-8 md:p-12 pb-4">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2 ml-1">Learning Metrics</p>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                        Academic <span className="text-primary">Growth</span>
                    </h1>
                </header>

                <main className="p-8 md:p-12 pt-4 flex-1 space-y-10">
                    {!activeSubject ? (
                        <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center text-center border border-gray-100 shadow-xl shadow-gray-200/40">
                            <BookOpen className="w-20 h-20 text-gray-200 mb-6" />
                            <h2 className="text-2xl font-black text-gray-400 italic uppercase">No Academic History</h2>
                            <p className="text-gray-400 font-bold text-sm max-w-xs mt-2">Performance charts will appear once your tutors log your first exam results.</p>
                        </div>
                    ) : (
                        <>
                            {/* Subject Toggles */}
                            <div className="flex flex-wrap gap-3">
                                {analysisData.subjects.map((sub: string) => (
                                    <button
                                        key={sub}
                                        onClick={() => setActiveSubject(sub)}
                                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                            activeSubject === sub 
                                            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                                            : 'bg-white text-gray-400 border border-gray-100 hover:border-primary/20 hover:text-primary'
                                        }`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>

                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all"></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <TrendingUp className="w-3 h-3 text-primary" /> Average Retention
                                    </p>
                                    <h4 className="text-4xl font-black italic tracking-tighter text-gray-800">{subjectStats?.avg}%</h4>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Cumulative Score</span>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <Award className="w-3 h-3 text-teal-600" /> Peak Performance
                                    </p>
                                    <h4 className="text-4xl font-black italic tracking-tighter text-gray-800">{subjectStats?.highest}%</h4>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Personal Best</span>
                                    </div>
                                </div>

                                <div className="bg-[#45308D] p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden group text-white">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 flex items-center gap-2">
                                        <Target className="w-3 h-3" /> Recent Momentum
                                    </p>
                                    <h4 className="text-4xl font-black italic tracking-tighter">
                                        {subjectStats?.momentum ? (subjectStats.momentum > 0 ? `+${subjectStats.momentum}` : subjectStats.momentum) : '---'}
                                    </h4>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest italic opacity-80 ${subjectStats?.momentum && subjectStats.momentum >= 0 ? 'text-green-300' : 'text-rose-300'}`}>
                                            {subjectStats?.momentum && subjectStats.momentum >= 0 ? "Positive Growth" : "Subject to review"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Growth Graph */}
                            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">Progression Curve</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Timeline of academic evaluations</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-gray-400 tracking-widest border border-gray-100">Chronological View</div>
                                    </div>
                                </div>

                                <div className="h-[400px] w-full mt-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analysisData.data[activeSubject]}>
                                            <defs>
                                                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
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
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    padding: '1.25rem'
                                                }}
                                                cursor={{ stroke: '#45308D', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const d = payload[0].payload;
                                                        return (
                                                            <div className="bg-white p-5 rounded-3xl shadow-2xl border border-gray-50 min-w-[200px]">
                                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">{d.formattedDate}</p>
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
                                                                        <span className="text-lg font-black italic text-gray-800">{d.percentage}%</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center px-3">
                                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Raw Marks</span>
                                                                        <span className="text-[11px] font-black text-gray-600">{d.marks}/{d.maxMarks}</span>
                                                                    </div>
                                                                    <div className="pt-2 border-t border-gray-50 mt-2">
                                                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Tutor Insights</p>
                                                                        <p className="text-[11px] font-bold text-gray-600 italic leading-relaxed">"{d.progressNote || 'No notes provided for this session.'}"</p>
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
                                                activeDot={{ r: 7, strokeWidth: 0 }}
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
    );
}
