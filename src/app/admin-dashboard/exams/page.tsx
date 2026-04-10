'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { Menu, Filter, Trash2, Edit3, Eye, PlusCircle, Search, Calendar, BookOpen, User, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Exam {
    _id: string;
    studentId: {
        _id: string;
        fullName: string;
        class?: string;
    };
    teacherId?: {
        name: string;
    };
    subject: string;
    marks: number;
    maxMarks: number;
    examMonth: string;
    examDate?: string;
    progressNote?: string;
    paperImage?: string;
    createdAt: string;
}

const ViewExamModal = ({ exam, isOpen, onClose }: { exam: Exam | null, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !exam) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
                {/* Modal Header */}
                <div className="bg-[#45308D] p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <span className="text-2xl">&times;</span>
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold border border-white/30 italic">
                            {exam.studentId?.fullName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">{exam.studentId?.fullName}</h2>
                            <p className="text-white/70 font-black text-[10px] uppercase tracking-[0.2em] mt-1">Institutional Exam Registry</p>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Class Segment</p>
                            <p className="text-sm font-bold text-gray-800 italic uppercase">{exam.studentId?.class || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subject Node</p>
                            <p className="text-sm font-bold text-[#45308D] italic uppercase">{exam.subject}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Timeline</p>
                            <p className="text-sm font-bold text-gray-800 italic uppercase">{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : exam.examMonth}</p>
                        </div>
                        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Quantum</p>
                            <p className="text-lg font-black text-primary">{(exam.marks || 0)} <span className="text-[10px] text-gray-400 tracking-normal italic uppercase">/ {(exam.maxMarks || 0)}</span></p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized Examiner</p>
                        <p className="text-xs font-black text-primary italic uppercase">{exam.teacherId?.name || 'Administrator'}</p>
                    </div>

                    {exam.paperImage && (
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Evidence Capture</p>
                            <div className="rounded-3xl overflow-hidden border-4 border-gray-50 shadow-md bg-gray-100 aspect-video relative group">
                                <img
                                    src={exam.paperImage}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Answer Paper"
                                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+Not+Found")}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                                <a href={exam.paperImage} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-6 py-2 rounded-full text-[10px] font-black text-primary shadow-lg hover:bg-white transition-all transform hover:scale-105 uppercase tracking-widest italic">
                                    Enlarge Source
                                </a>
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Analytical Insights</p>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 min-h-[100px] italic text-xs font-medium text-gray-500 leading-relaxed shadow-inner">
                            {exam.progressNote || "No specific feedback provided for this exam record."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminExams() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/exams');
            setExams(data);
        } catch (error) {
            toast.error('Failed to load exams');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Erase this scholarly record permanentely?')) return;

        try {
            await api.delete(`/exams/${id}`);
            setExams(exams.filter(e => e._id !== id));
            toast.success('Record purged');
        } catch (error) {
            toast.error('Purge failed');
        }
    };

    const filteredExams = exams.filter(exam => {
        const query = filterQuery.toLowerCase();
        return (
            exam.studentId?.fullName?.toLowerCase().includes(query) ||
            exam.subject?.toLowerCase().includes(query) ||
            exam.examMonth?.toLowerCase().includes(query) ||
            exam.studentId?.class?.toLowerCase().includes(query) ||
            exam.teacherId?.name?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
            <Toaster position="top-right" />
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <ViewExamModal
                exam={selectedExam}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
            />

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Exams Hub</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-12 mt-20 lg:mt-0">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4 px-2">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Exam Registry</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 ml-1">Scholarly Performance Database</p>
                        </div>

                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search scholarly nodes..."
                                className="w-full bg-white border-2 border-gray-100 py-3.5 pl-11 pr-12 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 focus:outline-none focus:border-primary transition-all shadow-sm"
                                value={filterQuery}
                                onChange={(e) => setFilterQuery(e.target.value)}
                            />
                            {filterQuery && (
                                <button
                                    onClick={() => setFilterQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-300 hover:text-red-500 uppercase"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
                        {loading ? (
                            <div className="p-32 text-center text-primary font-black italic uppercase tracking-widest animate-pulse">Syncing historical records...</div>
                        ) : filteredExams.length === 0 ? (
                            <div className="p-24 text-center">
                                <Search className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                                <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[9px]">No scholarly records detected in the matrix.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                                    <thead>
                                        <tr className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                            <th className="px-8 py-7">Learner Enrollment</th>
                                            <th className="px-4 py-7">Subject Vector</th>
                                            <th className="px-4 py-7 hidden md:table-cell">Authorized Tutor</th>
                                            <th className="px-4 py-7">Chronicle Date</th>
                                            <th className="px-4 py-7">Result</th>
                                            <th className="px-8 py-7 text-right">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredExams.map((exam) => (
                                            <tr key={exam._id} className="group hover:bg-gray-50/50 transition duration-300">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary font-black italic tracking-tighter text-xs group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                            {exam.studentId?.fullName?.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1 uppercase italic">{exam.studentId?.fullName}</span>
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{exam.studentId?.class}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <span className="px-5 py-2 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest rounded-xl italic border border-primary/5">{exam.subject}</span>
                                                </td>
                                                <td className="px-4 py-6 text-gray-400 text-[10px] font-black uppercase italic hidden md:table-cell">{exam.teacherId?.name || 'Admin'}</td>
                                                <td className="px-4 py-6">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap italic">{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : exam.examMonth}</p>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm font-black text-gray-900 italic">{(exam.marks || 0)}</span>
                                                        <span className="text-[10px] text-gray-300 font-bold uppercase">/ {(exam.maxMarks || 0)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button 
                                                            onClick={() => { setSelectedExam(exam); setIsViewModalOpen(true); }}
                                                            className="p-3 bg-gray-50 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-xl transition shadow-sm"
                                                        >
                                                            <Eye className="w-4.5 h-4.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(exam._id)}
                                                            className="p-3 bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition shadow-sm"
                                                        >
                                                            <Trash2 className="w-4.5 h-4.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
