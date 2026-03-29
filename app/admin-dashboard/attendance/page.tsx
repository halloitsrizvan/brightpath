'use client';
import { useEffect, useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import AttendanceModal from '../../components/modals/AttendanceModal';
import { Calendar, Clock, ChevronDown, User, BookOpen, UserCheck, Search, Filter, AlertCircle, Plus } from 'lucide-react';

export default function AdminAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('All Time');
    const [isToday, setIsToday] = useState(false);

    const monthsOptions = useMemo(() => {
        const arr = ['All Time'];
        const date = new Date();
        date.setDate(1);
        for (let i = 0; i < 6; i++) {
            const m = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const y = date.getFullYear();
            arr.push(`${m} ${y}`);
            date.setMonth(date.getMonth() - 1);
        }
        return arr;
    }, []);

    const fetchAttendance = () => {
        setLoading(true);
        const query = isToday ? '?today=true' : `?month=${selectedMonth}`;
        api.get(`/attendance${query}`)
            .then(res => {
                setAttendance(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedMonth, isToday]);

    const stats = useMemo(() => {
        const totalSessions = attendance.length;
        const totalHours = attendance.reduce((acc, rec: any) => acc + (rec.durationMinutes / 60), 0);
        const activeTeachers = new Set(attendance.map((rec: any) => rec.teacherId?._id)).size;
        const activeStudents = new Set(attendance.map((rec: any) => rec.studentId?._id)).size;

        return { totalSessions, totalHours, activeTeachers, activeStudents };
    }, [attendance]);

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900">
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>
            
            <div className="flex-1 lg:ml-64 p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4 px-2">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Attendance Ledger</h1>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">Real-time Class Activity Logs</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button 
                            onClick={() => setIsToday(!isToday)}
                            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${isToday ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-gray-400 border-gray-100 hover:border-primary/20'}`}
                        >
                            <Clock className="w-4 h-4" />
                            {isToday ? "Tracking Today" : "Show Today"}
                        </button>

                        {!isToday && (
                            <div className="relative group min-w-[180px]">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <select 
                                    className="w-full pl-10 pr-10 py-3 bg-white border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest focus:border-primary outline-none transition-all cursor-pointer appearance-none shadow-sm"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    {monthsOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        )}

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2 italic"
                        >
                            <Plus className="w-4 h-4" /> Log Entry
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                     <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group border-2 border-primary">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Logs</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4">{stats.totalSessions} Sessions</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                            <BookOpen className="w-4 h-4" />
                            <span>Academic Volume</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/30 group hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="w-10 h-10 text-primary p-2 bg-primary/5 rounded-xl transition group-hover:bg-primary group-hover:text-white" />
                            <span className="text-[10px] font-black text-gray-300 uppercase italic tracking-tighter">Engagement Metric</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Class Output</p>
                        <h2 className="text-4xl font-black italic tracking-tighter text-gray-900">{stats.totalHours.toFixed(1)} Hrs</h2>
                    </div>

                    <div className="bg-secondary p-8 rounded-[2.5rem] text-primary shadow-2xl shadow-secondary/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/50 opacity-0  transition-opacity pointer-events-none"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Active Faculty</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-gray-800">{stats.activeTeachers} Tutors</h2>
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
                            <UserCheck className="w-4 h-4" />
                            <span>Engagement in period</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/30 relative group overflow-hidden">
                        <div className="absolute -bottom-6 -right-6 text-gray-50/50 rotate-12 transition-all group-hover:rotate-0">
                            <User className="w-32 h-32" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Attending Students</p>
                        <h2 className="text-4xl font-black italic tracking-tighter text-teal-600 mb-4">{stats.activeStudents} Learners</h2>
                        <div className="w-full h-1 bg-gray-50 rounded-full mt-4 overflow-hidden shadow-inner">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: stats.totalSessions > 0 ? '75%' : '0%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {loading ? (
                        <div className="p-32 text-center text-primary font-black italic uppercase tracking-widest animate-pulse">Syncing logs...</div>
                    ) : attendance.length === 0 ? (
                        <div className="p-32 text-center">
                            <AlertCircle className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                            <p className="text-gray-400 font-bold italic uppercase tracking-widest text-sm">No activity records found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto p-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                        <th className="px-8 py-6">Timestamp & Date</th>
                                        <th className="px-4 py-6">Student Enrollment</th>
                                        <th className="px-4 py-6">Assigned Tutor</th>
                                        <th className="px-4 py-6">Specialized Subject</th>
                                        <th className="px-8 py-6 text-right">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {attendance.map((record: any) => (
                                        <tr key={record._id} className="group hover:bg-gray-50/50 transition duration-200">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gray-50 text-primary flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <p className="text-xs font-black text-gray-400 italic">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 font-black text-sm text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-[10px] text-primary">{record.studentId?.fullName?.charAt(0)}</div>
                                                    {record.studentId?.fullName || '-'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-gray-600 text-sm font-bold">
                                                 <div className="flex items-center gap-2">
                                                    <UserCheck className="w-4 h-4 text-gray-300" />
                                                    {record.teacherId?.name || '-'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-primary/5 text-primary text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter border border-primary/10">
                                                    {record.subjectId?.subjectName || '-'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-gray-800 italic tracking-tight">
                                                {(record.durationMinutes / 60).toFixed(2)} Hrs
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Legend/Helper Insight */}
                <div className="mt-8 flex items-center gap-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 text-primary/70">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <p className="text-[10px] font-bold italic">Log times are recorded in real-time. Tutoring durations are automatically converted to decimal hours for payroll accuracy.</p>
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
