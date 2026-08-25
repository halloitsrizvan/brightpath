'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import StudentModal from '@/features/students/components/StudentModal';
import StudentViewModal from '@/features/students/components/StudentViewModal';
import { Eye, Edit2, Trash2, Menu, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const filteredStudents = students.filter((student: any) => {
        const query = searchQuery.toLowerCase();
        return (
            student.fullName?.toLowerCase().includes(query) ||
            student.email?.toLowerCase().includes(query) ||
            student.status?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans">
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Student Hub</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-8 mt-20 lg:mt-0">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 mt-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Student Registry</h1>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">Academic Cohort Management</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search student name or email..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 focus:border-primary rounded-2xl outline-none text-xs font-bold text-gray-900 transition-all shadow-sm"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    setEditData(null);
                                    setIsModalOpen(true);
                                }}
                                className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2 italic whitespace-nowrap"
                            >
                                + Add New Student
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {loading ? (
                            <div className="p-32 text-center text-primary font-black italic uppercase tracking-widest animate-pulse">Syncing Registry...</div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="p-32 text-center text-gray-400 font-bold italic uppercase tracking-widest text-xs">No student records found matching criteria.</div>
                        ) : (
                            <>
                                {/* Desktop View: Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                                <th className="px-8 py-6">Personal Profile</th>
                                                <th className="px-4 py-6">Registry Email</th>
                                                <th className="px-4 py-6">Status</th>
                                                <th className="px-8 py-6 text-right">Operations</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredStudents.map((student: any) => (
                                                <tr key={student._id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black italic shadow-inner group-hover:scale-110 transition">
                                                                {student.fullName?.charAt(0)}
                                                            </div>
                                                            <button 
                                                                onClick={() => handleView(student)}
                                                                className="text-sm font-black text-gray-800 hover:text-primary transition-colors text-left italic tracking-tight"
                                                            >
                                                                {student.fullName}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-gray-500 text-xs font-bold">{student.email}</td>
                                                    <td className="px-4 py-5">
                                                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {student.status || 'active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleView(student)} className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition" title="View Profile">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleEdit(student)} className="p-2.5 text-gray-400 hover:text-secondary hover:bg-secondary/5 rounded-xl transition" title="Edit Profile">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(student._id)} className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition" title="Delete Profile">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View: Div Cards */}
                                <div className="block md:hidden p-3 space-y-2.5">
                                    {filteredStudents.map((student: any) => (
                                        <div 
                                            key={student._id}
                                            className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-3 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black italic shadow-inner shrink-0">
                                                        {student.fullName?.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <button 
                                                            onClick={() => handleView(student)}
                                                            className="text-xs font-black text-gray-800 hover:text-primary transition-colors text-left italic tracking-tight truncate block max-w-[180px]"
                                                        >
                                                            {student.fullName}
                                                        </button>
                                                        <p className="text-[11px] font-medium text-gray-400 truncate">{student.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full shrink-0 ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {student.status || 'active'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                                                <button onClick={() => handleView(student)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition" title="View Profile">
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleEdit(student)} className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/5 rounded-lg transition" title="Edit Profile">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(student._id)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Delete Profile">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
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
