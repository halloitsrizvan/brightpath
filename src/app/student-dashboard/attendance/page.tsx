'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { Menu, Calendar, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import Cookies from 'js-cookie';

export default function StudentAttendance() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [studentName, setStudentName] = useState('Student');

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setStudentName(user.name || 'Student');
            } catch (e) { }
        }
        api.get('/attendance')
            .then(res => {
                setAttendance(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const totalCount = attendance.length;

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans overflow-x-hidden">
            <Sidebar role="student" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Fixed Header for Mobile */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Attendance Hub</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{studentName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-12 mt-20 lg:mt-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2 ml-1">Academic Timeline</p>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                                Attendance <span className="text-primary">Registry</span>
                            </h1>
                        </div>
                        <div className="bg-white px-8 py-5 rounded-[2rem] shadow-xl shadow-primary/5 border border-gray-100 flex items-center gap-6 self-start md:self-auto">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Total Sessions</p>
                                <p className="text-3xl font-black text-gray-800 italic leading-none">{totalCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400 font-black italic uppercase tracking-widest text-xs">Synchronizing academic timeline...</p>
                            </div>
                        ) : attendance.length === 0 ? (
                            <div className="p-20 text-center">
                                <Calendar className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-black italic uppercase tracking-widest text-xs">No attendance records found in your directory.</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                                <th className="p-8">Session Date</th>
                                                <th className="p-8">Academic Module</th>
                                                <th className="p-8">Assigned Tutor</th>
                                                <th className="p-8">Duration</th>
                                                <th className="p-8 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendance.map((record) => (
                                                <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-all group">
                                                    <td className="p-8 text-gray-700 font-bold">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                                                <Calendar className="w-5 h-5" />
                                                            </div>
                                                            <span>{new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-8">
                                                        <span className="font-black text-gray-800 tracking-tight text-lg italic uppercase">{record.subjectId?.subjectName || 'Module'}</span>
                                                    </td>
                                                    <td className="p-8">
                                                        <span className="font-bold text-gray-600">{record.teacherId?.name || 'Assigned Tutor'}</span>
                                                    </td>
                                                    <td className="p-8">
                                                        <div className="flex items-center gap-2 text-primary font-black px-4 py-2 bg-primary/5 rounded-xl w-fit">
                                                            <Clock className="w-4 h-4" />
                                                            <span className="text-sm">{record.durationMinutes}m Output</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-8 text-right">
                                                        {record.status === 'Present' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100 shadow-sm">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Present
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                                                                <XCircle className="w-3.5 h-3.5" /> Absent
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden divide-y divide-gray-100">
                                    {attendance.map((record) => (
                                        <div key={record._id} className="p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Session Date</p>
                                                        <p className="font-bold text-gray-700 leading-none">{new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                {record.status === 'Present' ? (
                                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg shadow-sm">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </div>
                                                ) : (
                                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg shadow-sm">
                                                        <XCircle className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-1">{record.subjectId?.subjectName || 'Module'}</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tutor: {record.teacherId?.name || 'N/A'}</p>
                                            </div>

                                            <div className="flex items-center gap-2 text-primary font-black px-4 py-2 bg-primary/5 rounded-xl w-fit">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[10px] uppercase tracking-widest">{record.durationMinutes}m Session Output</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
