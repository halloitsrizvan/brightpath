
'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Settings, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentAttendance() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const totalCount = attendance.length;
    const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="fixed z-50 h-full">
                <Sidebar role="student" />
            </div>
            <div className="flex-1 lg:ml-64 p-8">
                <div className="flex justify-between items-center mb-8 mt-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Attendance Registry</h1>
                        <p className="text-gray-500 font-medium">Your learning timeline and presence records</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-gray-400">Attendance Score</span>
                            <span className="text-2xl font-black text-primary italic">{percentage}%</span>
                        </div>
                        <div className="h-10 w-1 bg-gray-100 rounded-full"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-gray-400">Sessions</span>
                            <span className="text-2xl font-black text-gray-800 italic">{presentCount}/{totalCount}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 font-bold italic animate-pulse">Synchronizing records...</div>
                    ) : attendance.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-bold italic">No attendance records found in your directory.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                        <th className="p-6">Date</th>
                                        <th className="p-6">Subject</th>
                                        <th className="p-6">Tutor</th>
                                        <th className="p-6">Duration</th>
                                        <th className="p-6 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.map((record) => (
                                        <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-all group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-gray-700">{new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="font-black text-gray-800 tracking-tight">{record.subjectId?.subjectName || 'Module'}</span>
                                            </td>
                                            <td className="p-6">
                                                <span className="font-bold text-gray-600">{record.teacherId?.name || 'Assigned Tutor'}</span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-medium">{record.durationMinutes} mins</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                {record.status === 'Present' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100 shadow-sm">
                                                        <CheckCircle2 className="w-3 h-3" /> Present
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                                                        <XCircle className="w-3 h-3" /> Absent
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
