'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { Menu, Trash2, Eye, Search, BookOpen, Shield, GraduationCap, Award, Calendar, User } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

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
    paperImages?: string[];
    createdAt: string;
}

const ViewExamModal = ({ exam, isOpen, onClose }: { exam: Exam | null, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen || !exam) return null;

    const images = exam.paperImages && exam.paperImages.length > 0 ? exam.paperImages : (exam.paperImage ? [exam.paperImage] : []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden relative z-10 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="bg-[#45308D] p-5 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-base font-black italic">
                            {exam.studentId?.fullName?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <h2 className="text-base font-bold leading-tight">{exam.studentId?.fullName}</h2>
                            <p className="text-[11px] text-white/70 font-medium">Exam Assessment Details</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white text-lg font-bold"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Class / Grade</p>
                            <p className="text-xs font-bold text-gray-900">{exam.studentId?.class ? `Class ${exam.studentId?.class}` : '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Subject</p>
                            <p className="text-xs font-bold text-[#45308D]">{exam.subject}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Timeline</p>
                            <p className="text-xs font-bold text-gray-900">{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : exam.examMonth}</p>
                        </div>
                        <div className="bg-[#45308D]/5 p-3 rounded-xl border border-[#45308D]/10">
                            <p className="text-[10px] font-bold text-[#45308D] uppercase tracking-wider mb-0.5">Score</p>
                            <p className="text-xs font-black text-[#45308D]">{exam.marks || 0} <span className="text-[10px] text-gray-400 font-medium">/ {exam.maxMarks || 0}</span></p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-500">Authorized Tutor / Examiner</span>
                        <span className="font-bold text-[#45308D]">{exam.teacherId?.name || 'Administrator'}</span>
                    </div>

                    {images.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-700 mb-2">Answer Paper Capture ({images.length} {images.length > 1 ? 'pages' : 'page'})</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {images.map((img: string, idx: number) => (
                                    <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 bg-gray-900 aspect-[3/4] relative group">
                                        <img
                                            src={img}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-95"
                                            alt={`Page ${idx + 1}`}
                                            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x600?text=Paper+Image")}
                                        />
                                        <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                                            Page {idx + 1}
                                        </div>
                                        <a
                                            href={img}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="absolute bottom-1.5 right-1.5 bg-white px-2.5 py-0.5 rounded-md text-[10px] font-bold text-[#45308D] shadow-xs hover:bg-gray-50 transition"
                                        >
                                            View
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-bold text-gray-700 mb-1.5">Teacher Feedback & Progress Notes</p>
                        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 font-medium leading-relaxed">
                            {exam.progressNote || "No specific feedback provided for this exam record."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminExams() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const viewOnly = isViewOnly('exams');

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
        if (viewOnly) return;
        if (!window.confirm('Are you sure you want to delete this exam record?')) return;

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

    const averageScore = exams.length > 0
        ? Math.round(exams.reduce((sum, e) => sum + ((e.marks / (e.maxMarks || 100)) * 100), 0) / exams.length)
        : 0;

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

            <ViewExamModal
                exam={selectedExam}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
            />

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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Exams</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('exams') ? (
                        <AccessDenied roleName={roleName} pageName="Exam Registry" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Academic Assessment
                                        </span>
                                        {viewOnly && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Exam Registry
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Scholarly performance scores & examination answer sheet records</p>
                                </div>

                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by student, subject, tutor..." 
                                        value={filterQuery}
                                        onChange={(e) => setFilterQuery(e.target.value)}
                                        className="w-full h-10 pl-9 pr-3.5 bg-white border border-gray-200 focus:border-[#45308D] focus:ring-1 focus:ring-[#45308D]/20 rounded-xl outline-none text-xs font-semibold text-gray-900 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Stat Highlights */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Exam Logs</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{exams.length}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Average Performance</p>
                                        <p className="text-2xl font-black text-emerald-700 mt-0.5">{averageScore}%</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                        <Award className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs col-span-2 sm:col-span-1 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Tested Subjects</p>
                                        <p className="text-2xl font-black text-indigo-700 mt-0.5">
                                            {new Set(exams.map(e => e.subject)).size}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Table & List Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                {loading ? (
                                    <div className="py-16 text-center text-[#45308D] font-bold text-xs animate-pulse">
                                        Loading exam registry...
                                    </div>
                                ) : filteredExams.length === 0 ? (
                                    <div className="py-16 text-center text-gray-400 font-medium text-xs">
                                        No exam records found matching your query.
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-5 py-3.5">Learner Profile</th>
                                                        <th className="px-5 py-3.5">Subject</th>
                                                        <th className="px-5 py-3.5 hidden md:table-cell">Examiner Tutor</th>
                                                        <th className="px-5 py-3.5">Exam Timeline</th>
                                                        <th className="px-5 py-3.5">Score Result</th>
                                                        <th className="px-5 py-3.5 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {filteredExams.map((exam) => (
                                                        <tr key={exam._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs border border-[#45308D]/10 shrink-0">
                                                                        {exam.studentId?.fullName?.charAt(0) || 'S'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-900">{exam.studentId?.fullName}</p>
                                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                                            {exam.studentId?.class ? `Class ${exam.studentId?.class}` : 'Grade N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="px-2.5 py-0.5 bg-[#45308D]/5 text-[#45308D] text-[10px] font-bold rounded-md">
                                                                    {exam.subject}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 hidden md:table-cell text-xs font-semibold text-gray-700">
                                                                {exam.teacherId?.name || 'Administrator'}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs text-gray-600 font-medium">
                                                                {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : exam.examMonth}
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="text-xs font-black text-gray-900">{exam.marks || 0}</span>
                                                                <span className="text-[10px] text-gray-400 font-bold ml-1">/ {exam.maxMarks || 0}</span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button 
                                                                        onClick={() => { setSelectedExam(exam); setIsViewModalOpen(true); }}
                                                                        className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition" 
                                                                        title="View Exam Details"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                    {!viewOnly && (
                                                                        <button 
                                                                            onClick={() => handleDelete(exam._id)} 
                                                                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" 
                                                                            title="Delete Exam"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="block md:hidden p-3 space-y-2.5">
                                            {filteredExams.map((exam) => (
                                                <div 
                                                    key={exam._id}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-2.5 shadow-xs"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-900">{exam.studentId?.fullName}</p>
                                                            <p className="text-[11px] text-gray-400">{exam.studentId?.class ? `Class ${exam.studentId?.class}` : ''} • {exam.subject}</p>
                                                        </div>
                                                        <span className="px-2.5 py-0.5 text-xs font-black text-[#45308D] bg-[#45308D]/5 rounded-md border border-[#45308D]/10 shrink-0">
                                                            {exam.marks}/{exam.maxMarks}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-50">
                                                        <span>{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : exam.examMonth}</span>
                                                        <div className="flex items-center gap-1">
                                                            <button onClick={() => { setSelectedExam(exam); setIsViewModalOpen(true); }} className="p-1 text-gray-400 hover:text-[#45308D] rounded transition">
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                            {!viewOnly && (
                                                                <button onClick={() => handleDelete(exam._id)} className="p-1 text-gray-400 hover:text-rose-500 rounded transition">
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
