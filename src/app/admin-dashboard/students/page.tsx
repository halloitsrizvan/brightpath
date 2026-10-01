'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import StudentModal from '@/features/students/components/StudentModal';
import StudentViewModal from '@/features/students/components/StudentViewModal';
import { Eye, Edit2, Trash2, Menu, Search, Shield, Plus, Users, UserCheck, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

export default function AdminStudents() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [viewData, setViewData] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const router = useRouter();

    const fetchStudents = () => {
        setLoading(true);
        api.get('/students')
            .then(res => {
                setStudents(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleEdit = (student: any) => {
        if (isViewOnly('students')) return;
        setEditData(student);
        setIsModalOpen(true);
    };

    const handleView = (student: any) => {
        router.push(`/admin-dashboard/students/${student._id}`);
    };

    const handleDelete = async (id: string) => {
        if (isViewOnly('students')) return;
        if (window.confirm('Are you sure you want to delete this student record?')) {
            try {
                await api.delete(`/students/${id}`);
                fetchStudents();
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter((student: any) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = (
            student.fullName?.toLowerCase().includes(query) ||
            student.email?.toLowerCase().includes(query) ||
            student.class?.toLowerCase().includes(query) ||
            student.contactNumber?.includes(query)
        );
        const matchesStatus = statusFilter === 'all' || (student.status || 'active') === statusFilter;
        return matchesQuery && matchesStatus;
    });

    const activeCount = students.filter((s: any) => (s.status || 'active') === 'active').length;
    const inactiveCount = students.length - activeCount;

    const viewOnlyMode = isViewOnly('students');

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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Students</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('students') ? (
                        <AccessDenied roleName={roleName} pageName="the Student Registry" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Academic Cohort
                                        </span>
                                        {viewOnlyMode && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Student Registry
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Directory and enrollment profile management</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search students..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-10 pl-9 pr-3.5 bg-white border border-gray-200 focus:border-[#45308D] focus:ring-1 focus:ring-[#45308D]/20 rounded-xl outline-none text-xs font-semibold text-gray-900 transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    {!viewOnlyMode && (
                                        <button
                                            onClick={() => {
                                                setEditData(null);
                                                setIsModalOpen(true);
                                            }}
                                            className="w-full sm:w-auto px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Student</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Metric Badges & Filter Tabs */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Enrolled</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{students.length}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Students</p>
                                        <p className="text-2xl font-black text-emerald-700 mt-0.5">{activeCount}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs col-span-2 sm:col-span-1 flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Inactive / Left</p>
                                        <p className="text-2xl font-black text-rose-600 mt-0.5">{inactiveCount}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Filter Bar */}
                            <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl w-fit">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        statusFilter === 'all'
                                            ? 'bg-white text-gray-900 shadow-xs'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    All ({students.length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('active')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        statusFilter === 'active'
                                            ? 'bg-white text-emerald-700 shadow-xs'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    Active ({activeCount})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('inactive')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        statusFilter === 'inactive'
                                            ? 'bg-white text-rose-700 shadow-xs'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    Inactive ({inactiveCount})
                                </button>
                            </div>

                            {/* Table & List Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                {loading ? (
                                    <div className="py-16 text-center text-[#45308D] font-bold text-xs animate-pulse">
                                        Loading student directory...
                                    </div>
                                ) : filteredStudents.length === 0 ? (
                                    <div className="py-16 text-center text-gray-400 font-medium text-xs">
                                        No student records found matching your criteria.
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-5 py-3.5">Student Profile</th>
                                                        <th className="px-5 py-3.5">Contact / Email</th>
                                                        <th className="px-5 py-3.5">Class / Grade</th>
                                                        <th className="px-5 py-3.5">Status</th>
                                                        <th className="px-5 py-3.5 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {filteredStudents.map((student: any) => (
                                                        <tr key={student._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs border border-[#45308D]/10 shrink-0">
                                                                        {student.fullName?.charAt(0) || 'S'}
                                                                    </div>
                                                                    <div>
                                                                        <button 
                                                                            onClick={() => handleView(student)}
                                                                            className="text-xs font-bold text-gray-900 hover:text-[#45308D] transition-colors text-left block"
                                                                        >
                                                                            {student.fullName}
                                                                        </button>
                                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                                            {student.residentialLocation || student.district || 'Location N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <div className="text-xs font-semibold text-gray-700">{student.email}</div>
                                                                <div className="text-[10px] text-gray-400">{student.contactNumber || 'No phone'}</div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-bold">
                                                                    {student.class ? `Class ${student.class}` : 'Grade N/A'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                                                                    (student.status || 'active') === 'active' 
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                                                                        : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                                }`}>
                                                                    {student.status || 'active'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button 
                                                                        onClick={() => handleView(student)} 
                                                                        className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition" 
                                                                        title="View Student Profile"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                    {!viewOnlyMode && (
                                                                        <>
                                                                            <button 
                                                                                onClick={() => handleEdit(student)} 
                                                                                className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition" 
                                                                                title="Edit Student"
                                                                            >
                                                                                <Edit2 className="w-4 h-4" />
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleDelete(student._id)} 
                                                                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" 
                                                                                title="Delete Student"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </>
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
                                            {filteredStudents.map((student: any) => (
                                                <div 
                                                    key={student._id}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-3 shadow-xs"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-9 h-9 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs border border-[#45308D]/10 shrink-0">
                                                                {student.fullName?.charAt(0) || 'S'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <button 
                                                                    onClick={() => handleView(student)}
                                                                    className="text-xs font-bold text-gray-900 hover:text-[#45308D] transition-colors text-left truncate block max-w-[180px]"
                                                                >
                                                                    {student.fullName}
                                                                </button>
                                                                <p className="text-[11px] font-medium text-gray-400 truncate">{student.email}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md shrink-0 border ${
                                                            (student.status || 'active') === 'active' 
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                                                                : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                        }`}>
                                                            {student.status || 'active'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                                                        <span className="text-[10px] text-gray-400 font-semibold">
                                                            {student.class ? `Class ${student.class}` : 'Grade N/A'}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            <button onClick={() => handleView(student)} className="p-1.5 text-gray-400 hover:text-[#45308D] rounded-lg transition" title="View Profile">
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                            {!viewOnlyMode && (
                                                                <>
                                                                    <button onClick={() => handleEdit(student)} className="p-1.5 text-gray-400 hover:text-[#45308D] rounded-lg transition" title="Edit Profile">
                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button onClick={() => handleDelete(student._id)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg transition" title="Delete Profile">
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </>
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

            {!viewOnlyMode && (
                <StudentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchStudents}
                    editData={editData}
                />
            )}
            <StudentViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                student={viewData}
            />
        </div>
    );
}
