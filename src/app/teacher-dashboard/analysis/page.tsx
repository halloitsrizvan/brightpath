'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { 
    Users, 
    Search, 
    ChevronRight,
    TrendingUp,
    BarChart3,
    ArrowLeft,
    GraduationCap,
    Clock,
    BookOpen,
    Menu
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="flex justify-center items-center h-screen bg-[#fafafa]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
    );

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans overflow-x-hidden">
            <Toaster position="top-right" />
            <Sidebar role="teacher" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-secondary shadow-sm active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="text-right">
                        <h2 className="text-xl font-black text-secondary italic uppercase tracking-tighter leading-none">Analysis Hub</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Expert Insight</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-12 mt-20 lg:mt-0 font-sans">
                    <div className="flex flex-col mb-10 px-2 lg:px-0">
                        <p className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-2 ml-1">Mentorship Pulse</p>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                            Student <span className="text-secondary">Analysis</span>
                        </h1>
                    </div>

                    <main className="w-full flex-1">
                        {!selectedStudent ? (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="relative max-w-md group px-2 lg:px-0">
                                    <Search className="absolute left-6 lg:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-secondary transition-colors" />
                                    <input 
                                        type="text"
                                        placeholder="Search student progress..."
                                        className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-[2rem] font-bold text-gray-700 shadow-xl shadow-gray-200/20 focus:border-secondary/20 outline-none transition-all placeholder:text-gray-300 uppercase text-[10px] tracking-widest"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 lg:px-0">
                                    {filteredStudents.map(student => (
                                        <button 
                                            key={student._id}
                                            onClick={() => handleSelectStudent(student)}
                                            className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 text-left hover:border-secondary/40 transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors"></div>
                                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-black italic">
                                                    {student.fullName?.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-black text-gray-800 italic uppercase tracking-tighter leading-none mb-1">{student.fullName}</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{student.class || 'Academic Portfolio'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex -space-x-2">
                                                    {(student.subjectAssignments || []).slice(0, 3).map((a: any, i: number) => (
                                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-[8px] font-black flex items-center justify-center uppercase">
                                                            {(a.subjectId?.subjectName || a.subjectId?.name || "S")[0]}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-secondary opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-8 duration-500 space-y-10 px-2 lg:px-0">
                                <button 
                                    onClick={() => setSelectedStudent(null)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-secondary font-black uppercase text-[10px] tracking-widest transition-colors mb-4"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Intelligence Roster
                                </button>

                                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                                    <div className="xl:col-span-1 space-y-6">
                                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 text-center">
                                            <div className="w-24 h-24 rounded-[2rem] bg-secondary/10 text-secondary flex items-center justify-center text-4xl font-black italic mx-auto mb-6 shadow-xl shadow-secondary/10">
                                                {selectedStudent.fullName?.charAt(0)}
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-none mb-2">{selectedStudent.fullName}</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">{selectedStudent.class || 'Portfolio Active'}</p>
                                            
                                            <div className="space-y-4 text-left">
                                                <div className="bg-gray-50/50 p-4 rounded-2xl flex items-center gap-4">
                                                    <Clock className="w-5 h-5 text-secondary opacity-40" />
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Enrollment Status</p>
                                                        <p className="text-sm font-black italic text-gray-800 uppercase tracking-tighter">Active</p>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50/50 p-4 rounded-2xl flex items-center gap-4">
                                                    <BookOpen className="w-5 h-5 text-secondary opacity-40" />
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Active Modules</p>
                                                        <p className="text-sm font-black italic text-gray-800 uppercase tracking-tighter">{(selectedStudent.subjectAssignments || []).length} Assigned</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="xl:col-span-3 space-y-8">
                                        {analysisLoading ? (
                                            <div className="h-[400px] bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center p-20 text-center animate-pulse">
                                                <TrendingUp className="w-12 h-12 text-secondary opacity-10 mb-6" />
                                                <p className="text-gray-400 font-black italic uppercase tracking-widest text-xs">Synchronizing Academic Growth Curves...</p>
                                            </div>
                                        ) : !analysisData || analysisData.subjects.length === 0 ? (
                                            <div className="h-[400px] bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center p-20 text-center">
                                                <BookOpen className="w-12 h-12 text-gray-200 mb-6" />
                                                <p className="text-gray-400 font-black italic uppercase tracking-widest text-xs">No examination data detected for this subject portfolio.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex flex-wrap gap-3 mb-4">
                                                    {analysisData.subjects.map((sub: string) => (
                                                        <button 
                                                            key={sub}
                                                            onClick={() => setActiveSubject(sub)}
                                                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubject === sub ? 'bg-secondary text-white shadow-xl shadow-secondary/30' : 'bg-white text-gray-400 hover:text-secondary shadow-sm'}`}
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
                                                            <AreaChart data={analysisData.data[activeSubject!]}>
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
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
