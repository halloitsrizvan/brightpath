'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import StudentModal from '../../components/modals/StudentModal';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudents = () => {
        setLoading(true);
        api.get('/students')
            .then(res => {
                setStudents(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-primary/90 transition"
                    >
                        + Add Student
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading students...</div>
                    ) : students.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No students found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Role / Status</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student: any) => (
                                    <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-medium text-gray-800">{student.fullName}</td>
                                        <td className="p-4 text-gray-600">{student.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {student.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-primary hover:text-primary/80 font-medium mr-3">Edit</button>
                                            <button className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchStudents}
            />
        </div>
    );
}
