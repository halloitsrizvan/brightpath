'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import StudentModal from '../../components/modals/StudentModal';
import StudentViewModal from '../../components/modals/StudentViewModal';
import { Eye, Edit2, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);

    const router = useRouter();

    const fetchStudents = () => {
        setLoading(true);
        api.get('/students')
            .then(res => {
                setStudents(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    const handleEdit = (student: any) => {
        setEditData(student);
        setIsModalOpen(true);
    };

    const handleView = (student: any) => {
        router.push(`/admin-dashboard/students/${student._id}`);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                fetchStudents();
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>
            <div className="flex-1 lg:ml-64 p-8">
                <div className="flex justify-between items-center mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
                    <button
                        onClick={() => {
                            setEditData(null);
                            setIsModalOpen(true);
                        }}
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
                                    <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {student.fullName?.charAt(0)}
                                                </div>
                                                <button 
                                                    onClick={() => handleView(student)}
                                                    className="font-bold text-gray-800 hover:text-primary transition-colors text-left"
                                                >
                                                    {student.fullName}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm font-medium">{student.email}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {student.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleView(student)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition" title="View Profile">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEdit(student)} className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/5 rounded-lg transition" title="Edit Profile">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(student._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete Permanent">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
                editData={editData}
            />
            <StudentViewModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                student={viewData}
            />
        </div>
    );
}
