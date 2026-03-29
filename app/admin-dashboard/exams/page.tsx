'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Menu, Filter, Trash2, Edit3, Eye, PlusCircle, Search } from 'lucide-react';
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
    progressNote?: string;
    paperImage?: string;
    createdAt: string;
}

const ViewExamModal = ({ exam, isOpen, onClose }: { exam: Exam | null, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !exam) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
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
                            <p className="text-white/70 font-medium text-lg italic">Master Exam Record</p>
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
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Month</p>
                            <p className="text-lg font-bold text-gray-800">{exam.examMonth}</p>
                        </div>
                        <div className="bg-[#45308D]/5 p-4 rounded-2xl border border-[#45308D]/10">
                            <p className="text-xs font-bold text-[#45308D] uppercase tracking-widest mb-1">Result</p>
                            <p className="text-xl font-black text-[#FDC70B]">{exam.marks} <span className="text-sm text-gray-400">/ {exam.maxMarks}</span></p>
                        </div>
                    </div>

                    <div className="bg-[#FDC70B]/5 p-4 rounded-2xl border border-[#FDC70B]/20 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Authorized Examiner</p>
                        <p className="font-black text-[#45308D] italic">{exam.teacherId?.name || 'Administrator'}</p>
                    </div>

                    {exam.paperImage && (
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
                        <p className="text-sm font-bold text-gray-700 mb-3 ml-1">Observations & Feedback</p>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 min-h-[100px] italic text-gray-600 leading-relaxed shadow-inner">
                            {exam.progressNote || "No specific feedback provided for this exam record."}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                        <span>Database UID: {exam._id}</span>
                        <span>Creation Date: {new Date(exam.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-[#45308D] text-white font-bold rounded-2xl shadow-lg shadow-[#45308D]/20 hover:shadow-[#45308D]/40 hover:-translate-y-0.5 transition-all"
                    >
                        Close Registry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function AdminExams() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [exams, setExams] = useState<Exam[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get('/exams');
            setExams(data);
        } catch (error) {
            console.error('Failed to fetch exams', error);
            toast.error('Failed to load all exam records');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this exam record?')) return;

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
            exam.studentId?.class?.toLowerCase().includes(query) ||
            exam.teacherId?.name?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-center" toastOptions={{
                duration: 3000,
                style: { background: '#fff', color: '#45308D', fontWeight: 'bold', borderRadius: '9999px' },
            }} />

            <ViewExamModal
                exam={selectedExam}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
            />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed z-50 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar role="admin" />
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                {/* Header for Mobile */}
                <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 -ml-2 text-primary hover:bg-primary/10 rounded-lg lg:hidden"
                    >
                        <Menu className="w-8 h-8" />
                    </button>

                    <div className="text-right">
                        <h1 className="text-xl font-bold text-primary">BrightPath</h1>
                        <p className="text-sm text-gray-500 font-medium">Administrator</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col lg:mt-6">
                    {/* Desktop Title */}
                    <div className="hidden lg:flex w-full items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-[#45308D] tracking-tight">All Exam Records</h1>
                            <p className="text-lg font-medium text-gray-600 mt-1">Manage all student examination results system-wide.</p>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 px-1 gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 tracking-tight">Database Records</h3>
                                <p className="text-sm text-gray-500 font-medium mt-1">Search through all history</p>
                            </div>

                            <div className="relative group min-w-[320px]">
                                <input
                                    type="text"
                                    placeholder="Search student, teacher, or subject..."
                                    className="w-full bg-white border-2 border-gray-100 py-3 pl-11 pr-4 rounded-2xl text-sm font-bold text-black focus:outline-none focus:border-[#45308D] focus:ring-4 focus:ring-[#45308D]/10 transition-all shadow-sm"
                                    value={filterQuery}
                                    onChange={(e) => setFilterQuery(e.target.value)}
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#45308D] transition-colors" />
                                {filterQuery && (
                                    <button
                                        onClick={() => setFilterQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-red-500"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Exam History Cards */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="text-center p-12 text-gray-400 font-medium animate-pulse">Loading global exam history...</div>
                            ) : filteredExams.length === 0 ? (
                                <div className="text-center p-12 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-bold">{filterQuery ? `No records found for "${filterQuery}"` : "No records exist."}</p>
                                    {filterQuery && (
                                        <button
                                            onClick={() => setFilterQuery('')}
                                            className="text-[#45308D] font-black text-sm hover:underline"
                                        >
                                            Reset Filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                (
                                    filteredExams.map((exam) => (
                                        <div key={exam._id} className="bg-white hover:border-[#45308D]/30 transition-all duration-300 border border-gray-100 rounded-[1rem] p-5 flex flex-col sm:flex-row items-center justify-between gap-5 group shadow-sm hover:shadow-xl relative overflow-hidden">
                                            {/* Subtle internal gradient accent */}
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#45308D]/20 group-hover:bg-[#45308D] transition-colors"></div>

                                            <div className="flex items-center gap-5 w-full sm:w-auto">
                                                {/* Sophisticated Avatar */}
                                                <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-[#45308D] to-[#45308D]/80 text-white flex items-center justify-center rounded-2xl text-2xl font-black shadow-lg shadow-[#45308D]/20 group-hover:scale-105 transition-transform duration-500">
                                                    {exam.studentId?.fullName?.charAt(0) || '?'}
                                                </div>

                                                <div className="flex flex-col gap-1.5 transition-all">
                                                    <h4 className="text-xl font-black text-gray-900 leading-tight group-hover:text-[#45308D] transition-colors tracking-tight">
                                                        {exam.studentId?.fullName || 'Unknown Student'}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full border border-gray-200">
                                                            Class {exam.studentId?.class || '-'} 
                                                        </span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-[#45308D]/5 text-[#45308D] px-2 py-0.5 rounded-full border border-[#45308D]/10">
                                                            {exam.subject}
                                                        </span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest bg-[#FDC70B]/10 text-[#c79c09] px-2 py-0.5 rounded-full border border-[#FDC70B]/20">
                                                            {exam.examMonth}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] font-bold text-gray-400 mt-0.5 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        Examiner: <span className="text-[#45308D] font-black italic">{exam.teacherId?.name || 'Administrator'}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-50 pt-4 sm:pt-0">
                                                {/* Score Visualization */}
                                                <div className="flex flex-col items-end gap-1 min-w-[100px]">
                                                    <div className="text-sm font-black text-gray-400 uppercase tracking-tighter mb-0.5">Global Mark</div>
                                                    <div className="text-3xl font-black text-gray-800 flex items-baseline gap-1 leading-none group-hover:text-[#45308D] transition-colors">
                                                        {exam.marks}
                                                        <span className="text-xs text-gray-400 font-bold">/ {exam.maxMarks}</span>
                                                    </div>
                                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden shadow-inner border border-gray-200/50">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#45308D] to-[#FDC70B] rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${Math.min(100, Math.max(0, (exam.marks / exam.maxMarks) * 100))}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Elegant Icon Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setSelectedExam(exam); setIsViewModalOpen(true); }}
                                                        className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/10 hover:shadow-md rounded-xl transition-all active:scale-95"
                                                        title="View Registry"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <Link
                                                        href={`/teacher-dashboard/exams/form?id=${exam._id}`}
                                                        className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-[#FDC70B] hover:bg-[#FDC70B]/10 hover:shadow-md rounded-xl transition-all active:scale-95"
                                                        title="Modify Entry"
                                                    >
                                                        <Edit3 className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(exam._id)}
                                                        className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:shadow-md rounded-xl transition-all active:scale-95"
                                                        title="Erase Record"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
