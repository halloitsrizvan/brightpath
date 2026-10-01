'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import AttendanceModal from '@/features/attendance/components/AttendanceModal';
import MonthPicker from '@/components/ui/MonthPicker';
import { Menu, Calendar, Clock, BookOpen, User, Plus, Trash2, Shield, Search } from 'lucide-react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

export default function AdminAttendance() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('All Academic Cycles');
    const [searchQuery, setSearchQuery] = useState('');

    const viewOnly = isViewOnly('attendance');

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const query = selectedMonth === 'All Academic Cycles' ? '' : `?month=${selectedMonth}`;
            const { data } = await api.get(`/attendance${query}`);
            setAttendance(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (viewOnly) return;
        if (!window.confirm('Are you sure you want to delete this session log?')) return;
        
        try {
            await api.delete(`/attendance/${id}`);
            fetchAttendance();
        } catch (err) {
            console.error(err);
            alert('Operation failed: Could not delete record.');
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedMonth]);

    const stats = useMemo(() => {
        return {
            totalSessions: attendance.length,
            totalHours: attendance.reduce((acc: any, curr: any) => acc + (curr.durationMinutes / 60), 0),
            activeTeachers: new Set(attendance.map((a: any) => a.teacherId?._id)).size,
            activeStudents: new Set(attendance.map((a: any) => a.studentId?._id)).size
        };
    }, [attendance]);

    const filteredAttendance = attendance.filter((log: any) => {
        const query = searchQuery.toLowerCase();
        return (
            log.studentId?.fullName?.toLowerCase().includes(query) ||
            log.teacherId?.name?.toLowerCase().includes(query) ||
            log.subjectId?.subjectName?.toLowerCase().includes(query)
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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Attendance</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('attendance') ? (
                        <AccessDenied roleName={roleName} pageName="Attendance Hub" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Academic Presence
                                        </span>
                                        {viewOnly && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Attendance Logs
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Real-time session presence & teaching delivery ledger</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                                    <MonthPicker 
                                        selected={selectedMonth} 
                                        onChange={setSelectedMonth} 
                                        allLabel="All Academic Cycles"
                                    />
                                    
                                    {!viewOnly && (
                                        <button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full sm:w-auto px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Log Session</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stat Highlights */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Sessions</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.totalSessions}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Teaching Hours</p>
                                        <p className="text-2xl font-black text-teal-700 mt-0.5">{stats.totalHours.toFixed(1)} hrs</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Active Tutors</p>
                                        <p className="text-2xl font-black text-indigo-700 mt-0.5">{stats.activeTeachers}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <User className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Active Learners</p>
                                        <p className="text-2xl font-black text-amber-700 mt-0.5">{stats.activeStudents}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Search Filter Bar */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by student, teacher, or subject..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-10 pl-9 pr-3.5 bg-white border border-gray-200 focus:border-[#45308D] focus:ring-1 focus:ring-[#45308D]/20 rounded-xl outline-none text-xs font-semibold text-gray-900 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Table & List Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                {loading ? (
                                    <div className="py-16 text-center text-[#45308D] font-bold text-xs animate-pulse">
                                        Loading attendance sessions...
                                    </div>
                                ) : filteredAttendance.length === 0 ? (
                                    <div className="py-16 text-center text-gray-400 font-medium text-xs">
                                        No attendance logs found for this period.
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-5 py-3.5">Session Date</th>
                                                        <th className="px-5 py-3.5">Student</th>
                                                        <th className="px-5 py-3.5">Teacher</th>
                                                        <th className="px-5 py-3.5">Subject</th>
                                                        <th className="px-5 py-3.5">Duration</th>
                                                        <th className="px-5 py-3.5">Status</th>
                                                        {!viewOnly && <th className="px-5 py-3.5 text-right">Actions</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {filteredAttendance.map((log: any) => (
                                                        <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                                                                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                                                                {log.studentId?.fullName || 'Student'}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs font-semibold text-gray-700">
                                                                {log.teacherId?.name || 'Faculty Member'}
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className="px-2.5 py-0.5 bg-[#45308D]/5 text-[#45308D] text-[10px] font-bold rounded-md">
                                                                    {log.subjectId?.subjectName || 'Subject'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                                                                {log.durationMinutes} min
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                                                                    log.status === 'Present' 
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                                                                        : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                                }`}>
                                                                    {log.status}
                                                                </span>
                                                            </td>
                                                            {!viewOnly && (
                                                                <td className="px-5 py-3.5 text-right">
                                                                    <button 
                                                                        onClick={() => handleDelete(log._id)} 
                                                                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" 
                                                                        title="Delete Entry"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="block md:hidden p-3 space-y-2.5">
                                            {filteredAttendance.map((log: any) => (
                                                <div 
                                                    key={log._id}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-2.5 shadow-xs"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-900">{log.studentId?.fullName || 'Student'}</p>
                                                            <p className="text-[11px] text-gray-500 font-medium">{log.teacherId?.name || 'Faculty'}</p>
                                                        </div>
                                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border shrink-0 ${
                                                            log.status === 'Present' 
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                                                                : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                        }`}>
                                                            {log.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-50">
                                                        <span>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {log.durationMinutes}m</span>
                                                        <span className="font-bold text-[#45308D]">{log.subjectId?.subjectName}</span>
                                                        {!viewOnly && (
                                                            <button onClick={() => handleDelete(log._id)} className="p-1 text-gray-400 hover:text-rose-500 rounded transition">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
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

            {!viewOnly && (
                <AttendanceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchAttendance}
                />
            )}
        </div>
    );
}
