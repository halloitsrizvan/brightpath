'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import AttendanceModal from '@/features/attendance/components/AttendanceModal';
import { Menu, Calendar, Clock, ChevronDown, User, BookOpen, UserCheck, Search, Filter, AlertCircle, Plus, Trash2 } from 'lucide-react';

export default function AdminAttendance() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('All Time');

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const query = selectedMonth === 'All Time' ? '' : `?month=${selectedMonth}`;
            const { data } = await api.get(`/attendance${query}`);
            setAttendance(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you absolutely certain you want to purge this session log? This action is permanent.')) return;
        
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

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
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
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Attendance Hub</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-12 mt-20 lg:mt-0">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4 px-2">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Attendance Logs</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 ml-1">Academic Session Control & Records</p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="relative group w-full md:min-w-[200px]">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <select
                                    className="w-full pl-11 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest focus:border-primary outline-none transition-all cursor-pointer appearance-none shadow-sm"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    <option value="All Time">All Academic Cycles</option>
                                    <option value="January 2024">January 2024</option>
                                    <option value="February 2024">February 2024</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full md:w-auto px-8 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 italic"
                            >
                                <Plus className="w-4 h-4" /> Log Manual Entry
                            </button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12 px-2">
                        <div className="bg-primary p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group border-2 border-primary">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Logs</p>
                            <h2 className="text-xl md:text-4xl font-black italic tracking-tighter mb-4 leading-none">{stats.totalSessions} <span className="text-xs md:text-lg not-italic opacity-60">Sess.</span></h2>
                            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-white/80">
                                <BookOpen className="w-4 h-4" />
                                <span>Academic Volume</span>
                            </div>
                        </div>

                        <div className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/30 group hover:border-primary/20 transition-all duration-300">
                            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Class Output</p>
                            <h2 className="text-xl md:text-4xl font-black italic tracking-tighter text-gray-900 leading-none">{stats.totalHours.toFixed(1)} <span className="text-xs md:text-lg not-italic opacity-60 text-gray-400">Hrs</span></h2>
                             <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-gray-300 mt-4">
                                <Clock className="w-4 h-4" />
                                <span>Engagement</span>
                            </div>
                        </div>

                        <div className="bg-[#FDC70B] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-gray-900 shadow-2xl shadow-yellow-200/50 relative overflow-hidden group">
                            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Active Faculty</p>
                            <h2 className="text-xl md:text-4xl font-black italic tracking-tighter mb-4 leading-none">{stats.activeTeachers} <span className="text-xs md:text-lg not-italic opacity-40">Tutors</span></h2>
                             <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter opacity-40">
                                <UserCheck className="w-4 h-4" />
                                <span>Instructors</span>
                            </div>
                        </div>

                        <div className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/30 relative group overflow-hidden">
                            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Learners</p>
                            <h2 className="text-xl md:text-4xl font-black italic tracking-tighter text-teal-600 mb-4 leading-none">{stats.activeStudents} <span className="text-xs md:text-lg not-italic opacity-40 text-gray-300">Active</span></h2>
                            <div className="hidden md:block w-full h-1 bg-gray-50 rounded-full mt-4 overflow-hidden shadow-inner">
                                <div className="h-full bg-teal-500 rounded-full" style={{ width: stats.totalSessions > 0 ? '75%' : '0%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
                        {loading ? (
                            <div className="p-32 text-center text-primary font-black italic uppercase tracking-widest animate-pulse">Syncing logs...</div>
                        ) : attendance.length === 0 ? (
                            <div className="p-20 text-center">
                                <AlertCircle className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                                <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">No activity records found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                                    <thead>
                                        <tr className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                            <th className="px-6 md:px-8 py-6">Timestamp & Date</th>
                                            <th className="px-4 py-6">Student Enrollment</th>
                                            <th className="px-4 py-6 hidden md:table-cell">Assigned Tutor</th>
                                            <th className="px-4 py-6">Subject Module</th>
                                            <th className="px-4 py-6 text-right">Duration</th>
                                            <th className="px-6 md:px-8 py-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {attendance.map((record: any) => (
                                            <tr key={record._id} className="group hover:bg-gray-50/50 transition duration-200">
                                                <td className="px-6 md:px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="hidden sm:flex w-9 h-9 rounded-xl bg-gray-50 text-primary items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition">
                                                            <Calendar className="w-4 h-4" />
                                                        </div>
                                                        <p className="text-[11px] font-black text-gray-400 italic">
                                                            {new Date(record.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 font-black text-xs md:text-sm text-gray-800">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center text-[9px] text-primary group-hover:bg-primary group-hover:text-white transition-colors">{record.studentId?.fullName?.charAt(0)}</div>
                                                        <span className="truncate max-w-[120px]">{record.studentId?.fullName || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 text-gray-500 text-[11px] font-bold hidden md:table-cell">
                                                     <div className="flex items-center gap-2">
                                                        <UserCheck className="w-4 h-4 text-gray-300" />
                                                        {record.teacherId?.name || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-primary/5 text-primary text-[9px] md:text-[10px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl uppercase tracking-tighter border border-primary/10">
                                                        {record.subjectId?.subjectName || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-5 text-right font-black text-gray-800 italic tracking-tight text-xs md:text-sm">
                                                    {(record.durationMinutes / 60).toFixed(1)} <span className="text-[10px] not-italic opacity-40">Hrs</span>
                                                </td>
                                                <td className="px-6 md:px-8 py-5 text-right">
                                                    <button 
                                                        onClick={() => handleDelete(record._id)}
                                                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                                                        title="Delete Log"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Legend/Helper Insight */}
                    <div className="mt-8 flex items-center gap-3 p-5 md:p-6 bg-primary/5 rounded-[1.5rem] md:rounded-[2rem] border border-primary/10 text-primary/70 mx-2">
                        <Clock className="w-5 h-5 flex-shrink-0" />
                        <p className="text-[9px] font-bold italic leading-relaxed">Log times are recorded in real-time. Tutoring durations are automatically converted to decimal hours for payroll accuracy.</p>
                    </div>
                </div>
            </div>
            
            <AttendanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAttendance}
            />
        </div>
    );
}
