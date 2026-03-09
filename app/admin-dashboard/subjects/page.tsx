'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import SubjectModal from '../../components/modals/SubjectModal';

export default function AdminSubjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSubjects = () => {
        setLoading(true);
        api.get('/subjects')
            .then(res => {
                setSubjects(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>
            <div className="flex-1 lg:ml-64 p-8">
                <div className="flex justify-between items-center mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-gray-800">Subjects Management</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-primary/90 transition"
                    >
                        + Add Subject
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading subjects...</div>
                    ) : subjects.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No subjects found.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-4 font-medium">Subject Name</th>
                                    <th className="p-4 font-medium">Class Level</th>
                                    <th className="p-4 font-medium">Syllabus</th>
                                    <th className="p-4 font-medium">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((sub: any) => (
                                    <tr key={sub._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-medium text-gray-800">{sub.subjectName}</td>
                                        <td className="p-4 text-gray-600">{sub.classLevel || '-'}</td>
                                        <td className="p-4 text-gray-600">{sub.syllabus || '-'}</td>
                                        <td className="p-4 text-gray-600 max-w-xs truncate">{sub.description || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <SubjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchSubjects}
            />
        </div>
    );
}
