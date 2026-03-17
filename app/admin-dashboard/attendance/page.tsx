'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import AttendanceModal from '../../components/modals/AttendanceModal';

export default function AdminAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAttendance = () => {
        setLoading(true);
        api.get('/attendance')
            .then(res => {
                setAttendance(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>
            <div className="flex-1 lg:ml-64 p-8">
                <div className="flex justify-between items-center mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-gray-800">Attendance Records</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-primary/90 transition"
                    >
                        + Add Record
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading attendance...</div>
                    ) : attendance.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No attendance records found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Student</th>
                                    <th className="p-4 font-medium">Teacher</th>
                                    <th className="p-4 font-medium">Subject</th>
                                    <th className="p-4 font-medium">Duration (Mins)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record: any) => (
                                    <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 text-gray-600">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-gray-800">{record.studentId?.fullName || '-'}</td>
                                        <td className="p-4 text-gray-600">{record.teacherId?.name || '-'}</td>
                                        <td className="p-4 text-gray-600">{record.subjectId?.subjectName || '-'}</td>
                                        <td className="p-4 text-gray-600 font-medium">{record.durationMinutes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
