'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';

export default function AdminExams() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/exams')
            .then(res => {
                setExams(res.data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-2">Exam Results</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading exams...</div>
                    ) : exams.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No exam records found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-4 font-medium">Month</th>
                                    <th className="p-4 font-medium">Student</th>
                                    <th className="p-4 font-medium">Subject</th>
                                    <th className="p-4 font-medium">Marks</th>
                                    <th className="p-4 font-medium">Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((record: any) => (
                                    <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 text-gray-600">{record.examMonth}</td>
                                        <td className="p-4 font-medium text-gray-800">{record.studentId?.fullName || '-'}</td>
                                        <td className="p-4 text-gray-600">{record.subject}</td>
                                        <td className="p-4 font-bold text-gray-800">{record.marks} / {record.maxMarks}</td>
                                        <td className="p-4 text-gray-500 text-sm max-w-xs truncate" title={record.progressNote}>{record.progressNote || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
