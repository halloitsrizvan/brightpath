'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import TeacherModal from '@/features/teachers/components/TeacherModal';
import { Menu, Edit3, Trash2, Search } from 'lucide-react';

export default function AdminTeachers() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchTeachers = () => {
        setLoading(true);
        api.get('/teachers')
            .then(res => {
                setTeachers(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    const handleEdit = (teacher: any) => {
        setEditData(teacher);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await api.delete(`/teachers/${id}`);
                fetchTeachers();
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const filteredTeachers = teachers.filter((teacher: any) => {
        const query = searchQuery.toLowerCase();
        return (
            teacher.name?.toLowerCase().includes(query) ||
            teacher.email?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
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
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Teachers</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-8 mt-20 lg:mt-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mt-4 px-2">
                        <div>
                            <h1 className="text-3xl font-black text-primary tracking-tighter italic uppercase">Teachers Portal</h1>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">Faculty Registry & Payroll Registry</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search teacher name or email..." 
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
                                className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 italic whitespace-nowrap"
                            >
                                + Add Teacher
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading teachers...</div>
                        ) : filteredTeachers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 font-bold text-xs italic">No teachers found matching search.</div>
                        ) : (
                            <>
                                {/* Desktop View: Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50 bg-gray-50/50">
                                                <th className="px-8 py-6">Faculty Identifier</th>
                                                <th className="px-4 py-6">System Email</th>
                                                <th className="px-4 py-6">Salary Rate</th>
                                                <th className="px-8 py-6 text-right">Registry Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredTeachers.map((teacher: any) => (
                                                <tr key={teacher._id} className="group hover:bg-gray-50/50 transition duration-200">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-gray-50 text-primary flex items-center justify-center border border-gray-100 font-black italic shadow-inner">
                                                                {teacher.name.charAt(0)}
                                                            </div>
                                                            <p className="text-sm font-black text-gray-800 tracking-tight">{teacher.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-gray-400 text-xs font-bold">{teacher.email}</td>
                                                    <td className="px-4 py-5">
                                                        <span className="bg-green-50 text-green-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter border border-green-100">
                                                            ₹{teacher.salaryPerHour} / Hr
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleEdit(teacher)} className="p-2.5 bg-gray-50 text-primary hover:bg-primary hover:text-white rounded-xl transition shadow-sm border border-gray-100">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(teacher._id)} className="p-2.5 bg-gray-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition shadow-sm border border-gray-100">
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
                                    {filteredTeachers.map((teacher: any) => (
                                        <div 
                                            key={teacher._id}
                                            className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-3 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-xl bg-gray-50 text-primary flex items-center justify-center border border-gray-100 font-black italic shadow-inner shrink-0">
                                                        {teacher.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-black text-gray-800 tracking-tight truncate">{teacher.name}</p>
                                                        <p className="text-[11px] font-medium text-gray-400 truncate">{teacher.email}</p>
                                                    </div>
                                                </div>
                                                <span className="bg-green-50 text-green-600 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter border border-green-100 shrink-0">
                                                    ₹{teacher.salaryPerHour}/Hr
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                                                <button onClick={() => handleEdit(teacher)} className="p-2 bg-gray-50 text-primary hover:bg-primary hover:text-white rounded-lg transition shadow-sm border border-gray-100">
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(teacher._id)} className="p-2 bg-gray-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition shadow-sm border border-gray-100">
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
            <TeacherModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTeachers}
                editData={editData}
            />
        </div>
    );
}
