'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Menu, Search, Filter, PlusCircle, Edit3, Trash2, Eye } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';

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
    examDate: string;
    progressNote?: string;
    paperImage?: string;
    createdAt: string;
}

const ViewExamModal = ({ exam, isOpen, onClose }: { exam: Exam | null, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !exam) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#45308D] to-[#45308D]/90 p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <span className="text-2xl">&times;</span>
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold border border-white/30">
                            {exam.studentId?.fullName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{exam.studentId?.fullName}</h2>
                            <p className="text-white/70 font-medium text-lg italic">Exam Result Details</p>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Class</p>
                            <p className="text-lg font-bold text-gray-800">{exam.studentId?.class || '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                            <p className="text-lg font-bold text-[#45308D]">{exam.subject}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Exam Date</p>
                            <p className="text-lg font-bold text-gray-800">{new Date(exam.examDate || exam.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-[#45308D]/5 p-4 rounded-2xl border border-[#45308D]/10">
                            <p className="text-xs font-bold text-[#45308D] uppercase tracking-widest mb-1">Score</p>
                            <p className="text-xl font-black text-[#FDC70B]">{exam.marks} <span className="text-sm text-gray-400">/ {exam.maxMarks}</span></p>
                        </div>
                    </div>

                    {(exam.paperImage) && (
                        <div>
                            <p className="text-sm font-bold text-gray-700 mb-3 ml-1">Answer Paper Image</p>
                            <div className="rounded-3xl overflow-hidden border-4 border-gray-50 shadow-md bg-gray-100 aspect-video relative group">
                                <img
                                    src={exam.paperImage}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Answer Paper"
                                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+Not+Found")}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                                <a href={exam.paperImage} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-[#45308D] shadow-lg hover:bg-white transition-all transform hover:scale-105">
                                    Open Full Image
                                </a>
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-bold text-gray-700 mb-3 ml-1">Teacher Notes</p>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 min-h-[100px] italic text-gray-600 leading-relaxed shadow-inner">
                            {exam.progressNote || "No specific feedback provided for this exam."}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                        <span>Record ID: {exam._id}</span>
                        <span>Added On: {new Date(exam.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-[#45308D] text-white font-bold rounded-2xl shadow-lg shadow-[#45308D]/20 hover:shadow-[#45308D]/40 hover:-translate-y-0.5 transition-all"
                    >
                        Close Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ExamDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teacherName, setTeacherName] = useState('Teacher Name');
    const [exams, setExams] = useState<Exam[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.name) setTeacherName(user.name);
                fetchExams(user.id);
            } catch (e) { }
        }
    }, []);

    const fetchExams = async (teacherId: string) => {
        try {
            setIsLoading(true);
            const { data } = await api.get(`/exams/teacher/${teacherId}`);
            setExams(data);
        } catch (error) {
            console.error('Failed to fetch exams', error);
            toast.error('Failed to load exam history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this exam record?')) return;

        try {
            await api.delete(`/exams/${id}`);
            setExams(exams.filter(e => e._id !== id));
            toast.success('Exam record deleted');
        } catch (error) {
            toast.error('Failed to delete exam');
        }
    };

    const filteredExams = exams.filter(exam => {
        const query = filterQuery.toLowerCase();
        return (
            exam.studentId?.fullName?.toLowerCase().includes(query) ||
            exam.subject?.toLowerCase().includes(query) ||
            exam.examMonth?.toLowerCase().includes(query) ||
            exam.studentId?.class?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans overflow-x-hidden">
            <Toaster position="top-right" />
            
            <ViewExamModal
                exam={selectedExam}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
            />

            <Sidebar role="teacher" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Header for Mobile */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Exams</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{teacherName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col mt-20 lg:mt-6">
                    {/* Desktop Title */}
                    <div className="hidden lg:flex w-full items-center justify-between mb-6">
                        <h1 className="text-4xl font-black text-primary tracking-tighter italic uppercase">Exam Registry</h1>
                        <p className="text-lg font-medium text-gray-600">Welcome back, {teacherName}</p>
                    </div>

                    {/* Giant Entry Portal Button (Matches Reference) */}
                    <Link
                        href="/teacher-dashboard/exams/form"
                        className="w-full relative overflow-hidden group mb-10 transition-all transform hover:shadow-2xl shadow-xl rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center min-h-[220px]"
                    >
                        {/* Elegant background gradients aligned with theme */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#45308D]/5 to-[#45308D]/10 opacity-70 transition-opacity group-hover:opacity-100"></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FDC70B]/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#45308D]/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center gap-4">
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#45308D] tracking-tighter italic uppercase leading-none">
                                Exam Mark <br className="hidden sm:block" />
                                Entry Portal
                            </h2>
                            <div className="text-[#FDC70B] bg-[#45308D] text-xs px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-xl shadow-[#45308D]/20 mt-2 flex items-center gap-2 group-hover:scale-105 transition-transform">
                                <PlusCircle className="w-4 h-4" /> Go to Form
                            </div>
                        </div>
                    </Link>

                    <div className="flex flex-col w-full">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 px-1 gap-4">
                            <div>
                                <h3 className="text-2xl font-black text-primary italic uppercase tracking-tighter">History</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Registry Audit & Search</p>
                            </div>

                            <div className="relative group min-w-[300px]">
                                <input
                                    type="text"
                                    placeholder="Search student, subject or class..."
                                    className="w-full bg-white border-2 border-gray-100 py-3.5 pl-11 pr-4 rounded-2xl text-[13px] font-bold text-black focus:outline-none focus:border-[#45308D] focus:ring-4 focus:ring-[#45308D]/10 transition-all shadow-sm"
                                    value={filterQuery}
                                    onChange={(e) => setFilterQuery(e.target.value)}
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#45308D] transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isLoading ? (
                                <div className="col-span-2 py-20 text-center text-gray-400 font-bold italic tracking-widest animate-pulse">SYNCHRONIZING EXAM RECORDS...</div>
                            ) : filteredExams.length === 0 ? (
                                <div className="col-span-2 py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
                                    <p className="text-gray-400 font-bold italic uppercase tracking-widest">No matching records found</p>
                                </div>
                            ) : filteredExams.map((exam) => (
                                <div
                                    key={exam._id}
                                    className="group bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary font-black text-sm italic border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors">
                                                {exam.studentId?.fullName?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-800 text-sm md:text-md">{exam.studentId?.fullName}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class: {exam.studentId?.class || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-black text-primary italic leading-none">{exam.marks} <span className="text-[10px] text-gray-300 font-bold opacity-70">/ {exam.maxMarks}</span></div>
                                            <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${(exam.marks / exam.maxMarks) >= 0.8 ? 'text-teal-500' : 'text-primary/60'}`}>
                                                {(exam.marks / exam.maxMarks * 100).toFixed(0)}% Proficiency
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 rounded-xl p-3 mb-4 flex items-center justify-between border border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Subject</span>
                                            <span className="text-[11px] font-black text-primary uppercase italic">{exam.subject}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Exam Date</span>
                                            <span className="text-[10px] font-bold text-gray-600">{new Date(exam.examDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                             {exam.paperImage && (
                                                <div className="w-5 h-5 rounded-md bg-teal-50 text-teal-500 flex items-center justify-center">
                                                    <Edit3 className="w-3 h-3" />
                                                </div>
                                             )}
                                             <span className="text-[10px] font-bold text-gray-300 italic truncate max-w-[150px] uppercase tracking-tighter">
                                                {exam.progressNote || "No Notes attached"}
                                             </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setSelectedExam(exam); setIsViewModalOpen(true); }}
                                                className="p-2 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exam._id)}
                                                className="p-2 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
