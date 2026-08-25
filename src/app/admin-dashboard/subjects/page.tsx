'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import SubjectModal from '@/features/subjects/components/SubjectModal';
import { Menu, Trash2, Pencil, BookOpen } from 'lucide-react';

export default function AdminSubjects() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);

    const fetchSubjects = () => {
        setLoading(true);
        api.get('/subjects')
            .then(res => {
                setSubjects(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you certain you want to remove this academic unit? This action cannot be undone.')) {
            try {
                await api.delete(`/subjects/${id}`);
                fetchSubjects();
            } catch (err) {
                console.error(err);
                alert('Command failed: Could not purge subject record.');
            }
        }
    };

    const handleEdit = (subject: any) => {
        setSelectedSubject(subject);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSubject(null);
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Subjects</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-8 mt-20 lg:mt-0 flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mt-4 px-2">
                        <div>
                            <h1 className="text-3xl font-black text-primary tracking-tighter italic uppercase">Academic Units</h1>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">Curriculum & Subject Management</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 italic"
                        >
                            + Add Subject
                        </button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading subjects...</div>
                        ) : subjects.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No subjects found.</div>
                        ) : (
                            <>
                                {/* Desktop View: Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100 italic">
                                                <th className="p-4 font-medium">Subject Name</th>
                                                <th className="p-4 font-medium">Class Level</th>
                                                <th className="p-4 font-medium">Syllabus</th>
                                                <th className="p-4 font-medium">Description</th>
                                                <th className="p-4 font-medium text-right">Operations</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subjects.map((sub: any) => (
                                                <tr key={sub._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition group">
                                                    <td className="p-4 font-medium text-gray-800">{sub.subjectName}</td>
                                                    <td className="p-4 text-gray-600">{sub.classLevel || '-'}</td>
                                                    <td className="p-4 text-gray-600">{sub.syllabus || '-'}</td>
                                                    <td className="p-4 text-gray-600 max-w-xs">{sub.description || '-'}</td>
                                                    <td className="p-4 text-right flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(sub)}
                                                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-90"
                                                            title="Modify Subject"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(sub._id)}
                                                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                                            title="Purge Subject"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View: Div Cards */}
                                <div className="block md:hidden p-3 space-y-2.5">
                                    {subjects.map((sub: any) => (
                                        <div 
                                            key={sub._id} 
                                            className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-3 shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-xs font-black text-gray-900 tracking-tight leading-none mb-1 truncate">{sub.subjectName}</h4>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                                        <span>Class {sub.classLevel || 'N/A'}</span>
                                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                        <span>Syllabus: {sub.syllabus || 'N/A'}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {sub.description && (
                                                <div className="text-xs font-medium text-gray-500 line-clamp-2">
                                                    {sub.description}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <div className="flex items-center gap-1.5">
                                                    {sub.syllabus && (
                                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                            {sub.syllabus}
                                                        </span>
                                                    )}
                                                    {sub.classLevel && (
                                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
                                                            Class {sub.classLevel}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={() => handleEdit(sub)}
                                                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all active:scale-90"
                                                        title="Modify Subject"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(sub._id)}
                                                        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                                                        title="Purge Subject"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <SubjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchSubjects}
                subject={selectedSubject}
            />
        </div>
    );
}
