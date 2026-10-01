'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import SubjectModal from '@/features/subjects/components/SubjectModal';
import { Menu, Trash2, Pencil, BookOpen, Shield, Plus, Search, Layers, GraduationCap } from 'lucide-react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

export default function AdminSubjects() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);

    const fetchSubjects = () => {
        setLoading(true);
        api.get('/subjects')
            .then(res => {
                setSubjects(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };
    
    const handleDelete = async (id: string) => {
        if (isViewOnly('subjects')) return;
        if (window.confirm('Are you certain you want to remove this academic unit? This action cannot be undone.')) {
            try {
                await api.delete(`/subjects/${id}`);
                fetchSubjects();
            } catch (err) {
                console.error(err);
                alert('Command failed: Could not delete subject record.');
            }
        }
    };

    const handleEdit = (subject: any) => {
        if (isViewOnly('subjects')) return;
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

    const viewOnlyMode = isViewOnly('subjects');

    const filteredSubjects = subjects.filter((sub: any) => {
        const query = searchQuery.toLowerCase();
        return (
            sub.subjectName?.toLowerCase().includes(query) ||
            sub.classLevel?.toLowerCase().includes(query) ||
            sub.syllabus?.toLowerCase().includes(query) ||
            sub.description?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900">
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Subjects</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('subjects') ? (
                        <AccessDenied roleName={roleName} pageName="Academic Units & Subjects" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Curriculum
                                        </span>
                                        {viewOnlyMode && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Academic Units
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Subject modules, class syllabus & syllabus mapping</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search subjects..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-10 pl-9 pr-3.5 bg-white border border-gray-200 focus:border-[#45308D] focus:ring-1 focus:ring-[#45308D]/20 rounded-xl outline-none text-xs font-semibold text-gray-900 transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    {!viewOnlyMode && (
                                        <button
                                            onClick={() => {
                                                setSelectedSubject(null);
                                                setIsModalOpen(true);
                                            }}
                                            className="w-full sm:w-auto px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Subject</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stat Highlights */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Subjects</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{subjects.length}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Class Levels</p>
                                        <p className="text-2xl font-black text-indigo-700 mt-0.5">
                                            {new Set(subjects.map(s => s.classLevel).filter(Boolean)).size || '1+'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs col-span-2 sm:col-span-1 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Syllabi</p>
                                        <p className="text-2xl font-black text-emerald-700 mt-0.5">
                                            {new Set(subjects.map(s => s.syllabus).filter(Boolean)).size || '1+'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Table & List Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                {loading ? (
                                    <div className="py-16 text-center text-[#45308D] font-bold text-xs animate-pulse">
                                        Loading academic curriculum...
                                    </div>
                                ) : filteredSubjects.length === 0 ? (
                                    <div className="py-16 text-center text-gray-400 font-medium text-xs">
                                        No subjects found matching your search.
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-5 py-3.5">Subject Unit</th>
                                                        <th className="px-5 py-3.5">Class / Standard</th>
                                                        <th className="px-5 py-3.5">Syllabus Framework</th>
                                                        <th className="px-5 py-3.5">Description</th>
                                                        {!viewOnlyMode && <th className="px-5 py-3.5 text-right">Actions</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {filteredSubjects.map((sub: any) => (
                                                        <tr key={sub._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs border border-[#45308D]/10 shrink-0">
                                                                        {sub.subjectName?.charAt(0) || 'S'}
                                                                    </div>
                                                                    <p className="text-xs font-bold text-gray-900">{sub.subjectName}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold">
                                                                    {sub.classLevel || 'Universal'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md text-[10px] font-bold">
                                                                    {sub.syllabus || 'Standard'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs text-gray-500 font-medium max-w-xs truncate">
                                                                {sub.description || 'No description provided.'}
                                                            </td>
                                                            {!viewOnlyMode && (
                                                                <td className="px-5 py-3.5 text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <button 
                                                                            onClick={() => handleEdit(sub)} 
                                                                            className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition" 
                                                                            title="Edit Subject"
                                                                        >
                                                                            <Pencil className="w-4 h-4" />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDelete(sub._id)} 
                                                                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" 
                                                                            title="Delete Subject"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="block md:hidden p-3 space-y-2.5">
                                            {filteredSubjects.map((sub: any) => (
                                                <div 
                                                    key={sub._id}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-3 shadow-xs"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-9 h-9 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs border border-[#45308D]/10 shrink-0">
                                                                {sub.subjectName?.charAt(0) || 'S'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-bold text-gray-900 truncate">{sub.subjectName}</p>
                                                                <p className="text-[11px] font-medium text-gray-400 truncate">{sub.classLevel || 'All Grades'} • {sub.syllabus || 'Standard'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {sub.description && (
                                                        <p className="text-[11px] text-gray-500 line-clamp-2">{sub.description}</p>
                                                    )}

                                                    {!viewOnlyMode && (
                                                        <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-50">
                                                            <button onClick={() => handleEdit(sub)} className="p-1.5 text-gray-400 hover:text-[#45308D] rounded-lg transition" title="Edit Subject">
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleDelete(sub._id)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg transition" title="Delete Subject">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
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

            {!viewOnlyMode && (
                <SubjectModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={fetchSubjects}
                    subject={selectedSubject}
                />
            )}
        </div>
    );
}
