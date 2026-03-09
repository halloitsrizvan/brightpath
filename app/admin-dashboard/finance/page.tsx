'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';

export default function AdminFinance() {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/teachers'),
            api.get('/students')
        ]).then(([teachersRes, studentsRes]) => {
            setTeachers(teachersRes.data);
            setStudents(studentsRes.data);
            setLoading(false);
        }).catch(console.error);
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>
            <div className="flex-1 lg:ml-64 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-2">Finance Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">Tutor Salaries</h2>
                        </div>
                        {loading ? <div className="p-6 text-gray-500">Loading...</div> : (
                            <ul className="divide-y divide-gray-100">
                                {teachers.slice(0, 5).map((teacher: any) => (
                                    <li key={teacher._id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition">
                                        <div>
                                            <p className="font-bold text-gray-800">{teacher.name}</p>
                                            <p className="text-sm text-gray-500">{teacher.totalHours} hrs logged</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">₹{(teacher.totalHours || 0) * (teacher.salaryPerHour || 0)}</p>
                                            <p className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1 mt-1">Pending payout</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">Student Reports</h2>
                        </div>
                        {loading ? <div className="p-6 text-gray-500">Loading...</div> : (
                            <ul className="divide-y divide-gray-100">
                                {students.slice(0, 5).map((student: any) => (
                                    <li key={student._id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition">
                                        <div>
                                            <p className="font-bold text-gray-800">{student.fullName}</p>
                                            <p className="text-sm text-gray-500">{student.email}</p>
                                        </div>
                                        <a
                                            href={`/api/finance/progress-report/${student._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-secondary hover:text-secondary/80 bg-secondary/10 px-4 py-2 rounded-lg font-bold text-sm transition"
                                        >
                                            Download PDF
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
