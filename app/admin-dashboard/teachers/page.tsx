'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import TeacherModal from '../../components/modals/TeacherModal';

export default function AdminTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTeachers = () => {
        setLoading(true);
        api.get('/teachers')
            .then(res => {
                setTeachers(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-gray-800">Teachers Management</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-secondary text-primary px-4 py-2 rounded-lg font-bold shadow-md hover:bg-secondary/90 transition"
                    >
                        + Add Teacher
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading teachers...</div>
                    ) : teachers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No teachers found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Salary / Hr</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher: any) => (
                                    <tr key={teacher._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-medium text-gray-800">{teacher.name}</td>
                                        <td className="p-4 text-gray-600">{teacher.email}</td>
                                        <td className="p-4 font-medium text-gray-800">₹{teacher.salaryPerHour}</td>
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
            <TeacherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTeachers}
            />
        </div>
    );
}
