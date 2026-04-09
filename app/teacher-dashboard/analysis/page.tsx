'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { 
    Users, 
    Search, 
    ChevronRight,
    TrendingUp,
    BarChart3,
    ArrowLeft,
    GraduationCap,
    Clock,
    BookOpen
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

export default function TeacherAnalysis() {
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [activeSubject, setActiveSubject] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/students'); // Assuming teacher only sees their assigned students
                setStudents(data);
            } catch (err) {
                toast.error("Failed to load students roster");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const fetchAnalysis = async (studentId: string) => {
        try {
            setAnalysisLoading(true);
            const { data } = await api.get(`/exams/analysis?studentId=${studentId}`);
            setAnalysisData(data);
            if (data.subjects && data.subjects.length > 0) {
                setActiveSubject(data.subjects[0]);
            } else {
                setActiveSubject(null);
            }
        } catch (err) {
            toast.error("Analysis failed to synchronize");
        } finally {
            setAnalysisLoading(false);
        }
    };

    const handleSelectStudent = (student: any) => {
        setSelectedStudent(student);
        fetchAnalysis(student._id);
    };

    const filteredStudents = students.filter(s => 
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#fafafa]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="fixed z-50 h-full">
                <Sidebar role="teacher" />
            </div>

            <div className="flex-1 lg:ml-64 flex flex-col">
                <header className="p-8 md:p-12 pb-4">
                    <p className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-2 ml-1">Mentorship Pulse</p>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                        Student <span className="text-secondary">Analysis</span>
                    </h1>
                </header>

                <main className="p-8 md:p-12 pt-4 flex-1">
                    {!selectedStudent ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="relative max-w-md group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-secondary transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Search student progress..."
                                    className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-[2rem] font-bold text-gray-700 shadow-sm focus:border-secondary/20 outline-none transition-all placeholder:text-gray-300 uppercase text-[10px] tracking-widest"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStudents.map(student => (
                                    <button 
                                        key={student._id}
                                        onClick={() => handleSelectStudent(student)}
                                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 text-left group flex flex-col items-start"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary text-xl font-black italic shadow-inner mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                                            {student.fullName.charAt(0)}
                                        </div>
                                        <h3 className="text-lg font-black text-gray-800 mb-1">{student.fullName}</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{student.class} | {student.residentialLocation}</p>
                                        <div className="mt-auto flex items-center gap-2 text-[9px] font-black uppercase text-secondary tracking-widest bg-secondary/5 px-4 py-2 rounded-xl group-hover:bg-secondary/10 transition-colors">
                                            Analytics Hub <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                            <button 
                                onClick={() => setSelectedStudent(null)}
                                className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-secondary transition-colors group mb-6"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                            </button>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary text-2xl font-black shadow-inner">
                                        {selectedStudent.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">{selectedStudent.fullName}</h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{selectedStudent.email} • {selectedStudent.residentialLocation}</p>
                                    </div>
                                </div>
                            </div>

                            {analysisLoading ? (
                                <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-gray-50 text-gray-300">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mb-4"></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Compiling Progress Curve...</p>
                                </div>
                            ) : !activeSubject ? (
                                <div className="bg-white p-20 rounded-[3rem] border border-gray-50 text-center flex flex-col items-center">
                                    <Clock className="w-16 h-16 text-gray-100 mb-6" />
                                    <h3 className="text-xl font-black text-gray-300 italic uppercase">Log-History Empty</h3>
                                    <p className="text-gray-300 font-bold text-xs mt-2 uppercase tracking-widest">No exam data found for this student.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {analysisData.subjects.map((sub: string) => (
                                            <button
                                                key={sub}
                                                onClick={() => setActiveSubject(sub)}
                                                className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                                                    activeSubject === sub 
                                                    ? 'bg-secondary text-white shadow-xl shadow-secondary/20' 
                                                    : 'bg-white text-gray-400 border border-gray-100 hover:text-secondary'
                                                }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40">
                                        <div className="flex items-center justify-between mb-10">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">Mentorship Progression</h3>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Growth chart for {activeSubject}</p>
                                            </div>
                                            <BarChart3 className="w-6 h-6 text-secondary opacity-20" />
                                        </div>

                                        <div className="h-[400px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={analysisData.data[activeSubject]}>
                                                    <defs>
                                                        <linearGradient id="colorMentorship" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#45308D" stopOpacity={0.15} />
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
                                                        cursor={{ stroke: '#45308D', strokeWidth: 1, strokeDasharray: '4 4' }}
                                                        content={({ active, payload }) => {
                                                            if (active && payload && payload.length) {
                                                                const d = payload[0].payload;
                                                                return (
                                                                    <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-50 min-w-[200px]">
                                                                        <div className="flex justify-between items-center mb-3">
                                                                            <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">{d.formattedDate}</span>
                                                                            <span className="text-sm font-black italic">{d.percentage}%</span>
                                                                        </div>
                                                                        <div className="pt-2 border-t border-gray-50">
                                                                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Session Logic</p>
                                                                            <p className="text-[10px] font-bold text-gray-600 italic">"{d.progressNote || 'Standard evaluation recorded.'}"</p>
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
                                                        fill="url(#colorMentorship)" 
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
                </main>
            </div>
        </div>
    );
}
