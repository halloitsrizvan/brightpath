'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import TeacherModal from '@/features/teachers/components/TeacherModal';
import { Menu, Edit3, Trash2, Search, Shield, Plus, Users, IndianRupee, BookOpen } from 'lucide-react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

export default function AdminTeachers() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    const viewOnly = isViewOnly('teachers');

    const fetchTeachers = () => {
        setLoading(true);
        api.get('/teachers')
            .then(res => {
                setTeachers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleEdit = (teacher: any) => {
        if (viewOnly) return;
        setEditData(teacher);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (viewOnly) return;
        if (window.confirm('Are you sure you want to delete this teacher record?')) {
            try {
                await api.delete(`/teachers/${id}`);
                fetchTeachers();
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const filteredTeachers = teachers.filter((teacher: any) => {
        const query = searchQuery.toLowerCase();
        return (
            teacher.name?.toLowerCase().includes(query) ||
            teacher.email?.toLowerCase().includes(query) ||
            teacher.phone?.includes(query)
        );
    });

    const averageRate = teachers.length > 0 
        ? Math.round(teachers.reduce((sum, t) => sum + (Number(t.salaryPerHour) || 0), 0) / teachers.length)
        : 0;

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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Teachers</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('teachers') ? (
                        <AccessDenied roleName={roleName} pageName="Faculty & Teachers" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Academic Faculty
                                        </span>
                                        {viewOnly && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Faculty Directory
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Faculty registry, hourly compensation & teaching profiles</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search faculty..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-10 pl-9 pr-3.5 bg-white border border-gray-200 focus:border-[#45308D] focus:ring-1 focus:ring-[#45308D]/20 rounded-xl outline-none text-xs font-semibold text-gray-900 transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    {!viewOnly && (
                                        <button
                                            onClick={() => {
                                                setEditData(null);
                                                setIsModalOpen(true);
                                            }}
                                            className="w-full sm:w-auto px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Teacher</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stat Highlights */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Faculty</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{teachers.length}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Avg Hourly Rate</p>
                                        <p className="text-2xl font-black text-teal-700 mt-0.5">₹{averageRate}/hr</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                                        <IndianRupee className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs col-span-2 sm:col-span-1 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Status</p>
                                        <p className="text-2xl font-black text-indigo-700 mt-0.5">100% Active</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Table & List Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                {loading ? (
                                    <div className="py-16 text-center text-[#45308D] font-bold text-xs animate-pulse">
                                        Loading faculty directory...
                                    </div>
                                ) : filteredTeachers.length === 0 ? (
                                    <div className="py-16 text-center text-gray-400 font-medium text-xs">
                                        No faculty members found matching your search.
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-5 py-3.5">Faculty Member</th>
                                                        <th className="px-5 py-3.5">Email / Phone</th>
                                                        <th className="px-5 py-3.5">Salary Tier</th>
                                                        {!viewOnly && <th className="px-5 py-3.5 text-right">Actions</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {filteredTeachers.map((teacher: any) => (
                                                        <tr key={teacher._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs border border-[#45308D]/10 shrink-0">
                                                                        {teacher.name?.charAt(0) || 'T'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-900">{teacher.name}</p>
                                                                        <span className="text-[10px] text-gray-400 font-medium">Faculty Member</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <div className="text-xs font-semibold text-gray-700">{teacher.email}</div>
                                                                <div className="text-[10px] text-gray-400">{teacher.phone || 'No phone recorded'}</div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg text-[10px] font-bold">
                                                                    ₹{teacher.salaryPerHour} / hr
                                                                </span>
                                                            </td>
                                                            {!viewOnly && (
                                                                <td className="px-5 py-3.5 text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <button 
                                                                            onClick={() => handleEdit(teacher)} 
                                                                            className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition" 
                                                                            title="Edit Faculty"
                                                                        >
                                                                            <Edit3 className="w-4 h-4" />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDelete(teacher._id)} 
                                                                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" 
                                                                            title="Delete Faculty"
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
                                            {filteredTeachers.map((teacher: any) => (
                                                <div 
                                                    key={teacher._id}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-3 shadow-xs"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-9 h-9 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs border border-[#45308D]/10 shrink-0">
                                                                {teacher.name?.charAt(0) || 'T'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-bold text-gray-900 truncate">{teacher.name}</p>
                                                                <p className="text-[11px] font-medium text-gray-400 truncate">{teacher.email}</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-2 py-0.5 text-[9px] font-bold rounded-md shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                                            ₹{teacher.salaryPerHour}/hr
                                                        </span>
                                                    </div>

                                                    {!viewOnly && (
                                                        <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-50">
                                                            <button onClick={() => handleEdit(teacher)} className="p-1.5 text-gray-400 hover:text-[#45308D] rounded-lg transition" title="Edit Profile">
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleDelete(teacher._id)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg transition" title="Delete Profile">
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

            {!viewOnly && (
                <TeacherModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchTeachers}
                    editData={editData}
                />
            )}
        </div>
    );
}
