'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Menu, User, Mail, Phone, Clock, IndianRupee, BookOpen, GraduationCap, Edit3, CheckCircle, Camera, Loader2, Save } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'react-hot-toast';
import IncentiveProgressCard from '../../components/IncentiveProgressCard';

interface Teacher {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subjects: any[];
    students: any[];
    salaryPerHour: number;
    totalTeachingHours: number;
    totalEarnings: number;
}

export default function TeacherProfile() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form for editing basic info
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                fetchProfile(user.id);
            } catch (e) {
                console.error("Auth data corruption", e);
            }
        }
    }, []);

    const fetchProfile = async (id: string) => {
        try {
            setIsLoading(true);
            const { data } = await api.get(`/teachers/${id}`);
            setTeacher(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
            toast.error('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teacher) return;

        try {
            setIsSaving(true);
            const { data } = await api.put(`/teachers/${teacher._id}`, formData);
            setTeacher(prev => prev ? ({ ...prev, ...data }) : data);
            setIsEditing(false);
            toast.success('Registry updated successfully!');

            // Update cookie if name changed
            const userStr = Cookies.get('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                user.name = data.name;
                Cookies.set('user', JSON.stringify(user));
            }
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#45308D] animate-spin" />
                    <p className="text-xl font-black text-[#45308D] animate-pulse">Synchronizing Records...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-center" toastOptions={{
                duration: 3000,
                style: { background: '#fff', color: '#45308D', fontWeight: 'bold', borderRadius: '9999px' },
            }} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed z-50 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar role="teacher" />
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                {/* Header for Mobile */}
                <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 -ml-2 text-primary hover:bg-primary/10 rounded-lg lg:hidden"
                    >
                        <Menu className="w-8 h-8" />
                    </button>

                    <div className="text-right">
                        <h1 className="text-xl font-bold text-primary tracking-tighter">BrightPath</h1>
                        <p className="text-sm text-gray-400 font-black">Teacher Portal</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full flex flex-col lg:mt-6 gap-8">

                    {/* Profile Banner Card */}
                    <div className="w-full bg-white rounded-[2.5rem] shadow-xl shadow-[#45308D]/5 border border-gray-100 relative overflow-hidden">
                        {/* Elegant background gradients */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#45308D]/5 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FDC70B]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

                        <div className="p-8 md:p-12 relative z-10">
                            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                {/* Avatar Section */}
                                <div className="relative group">
                                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-[#45308D] to-[#45308D]/80 p-1 shadow-2xl shadow-[#45308D]/20">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                                            <div className="text-[#45308D] text-6xl font-black">
                                                {teacher?.name?.charAt(0)}
                                            </div>
                                            {/* Subtle hover overlay for future image upload */}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Camera className="text-white w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-[#FDC70B] w-12 h-12 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                        <GraduationCap className="text-[#45308D] w-6 h-6" />
                                    </div>
                                </div>

                                {/* Identity Section */}
                                <div className="flex-1 text-center md:text-left space-y-4">
                                    {isEditing ? (
                                        <div className="space-y-4 max-w-md">
                                            <input
                                                className="text-4xl font-black text-[#45308D] bg-gray-50 border-b-4 border-[#FDC70B] w-full focus:outline-none focus:bg-gray-100 transition-all p-2 rounded-t-xl"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 focus-within:border-[#45308D] transition-all">
                                                    <Mail className="w-5 h-5 text-gray-400" />
                                                    <input
                                                        className="bg-transparent focus:outline-none w-full font-bold text-gray-700"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 focus-within:border-[#45308D] transition-all">
                                                    <Phone className="w-5 h-5 text-gray-400" />
                                                    <input
                                                        className="bg-transparent focus:outline-none w-full font-bold text-gray-700"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={handleUpdateProfile}
                                                    disabled={isSaving}
                                                    className="px-6 py-2.5 bg-[#45308D] text-white font-black rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
                                                >
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <h2 className="text-4xl sm:text-5xl font-black text-[#45308D] tracking-tighter leading-tight">{teacher?.name}</h2>
                                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-[#45308D]/5 text-[#45308D] rounded-full font-bold text-sm border border-[#45308D]/10">
                                                        <Mail className="w-4 h-4" /> {teacher?.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full font-bold text-sm border border-gray-200">
                                                        <Phone className="w-4 h-4" /> {teacher?.phone || 'No phone record'}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 text-[#45308D] font-black text-sm uppercase tracking-widest hover:underline decoration-4 underline-offset-8"
                                            >
                                                <Edit3 className="w-4 h-4" /> Edit Profile Registry
                                            </button> */}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Top Accent Strip */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#45308D] via-[#45308D]/80 to-[#FDC70B]"></div>
                    </div>

                    <div className="w-full">
                        <IncentiveProgressCard teacherId={teacher?._id} />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Hours Card */}
                        <div className="bg-[#45308D] rounded-[2rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-white/60 font-black uppercase tracking-widest text-xs mb-2">Total Teaching Hours</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-5xl font-black italic">{teacher?.totalTeachingHours || 0}</h3>
                                        <span className="text-xl font-bold text-white/40 italic">hrs</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                    <Clock className="w-8 h-8 text-[#FDC70B]" />
                                </div>
                            </div>
                        </div>

                        {/* Earnings Card */}
                        <div className="bg-[#F8D7DA] rounded-[2rem] p-8 text-[#721c24] border border-[#f5c6cb] relative overflow-hidden group">
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#FDC70B]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[#a94442] font-black uppercase tracking-widest text-xs mb-2">Accumulated Earnings</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-[#a94442]/60">₹</span>
                                            <h3 className="text-5xl font-black italic">{(teacher?.totalEarnings || 0).toLocaleString()}</h3>
                                        </div>
                                    </div>
                                    <div className="w-16 h-16 bg-[#a94442]/10 rounded-2xl flex items-center justify-center border border-[#a94442]/20">
                                        <IndianRupee className="w-8 h-8 text-[#a94442]" />
                                    </div>
                                </div>
                                <div className="bg-[#d4edda] text-[#155724] px-4 py-2 rounded-xl text-sm font-black inline-flex items-center gap-2 border border-[#c3e6cb]">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Base Salary Rate: ₹ {teacher?.salaryPerHour || 0} /hr
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subjects and Students Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Subjects Registered */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-[#45308D]/10 rounded-xl flex items-center justify-center">
                                    <BookOpen className="text-[#45308D] w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-800 tracking-tight">Assigned Subjects</h3>
                                    <p className="text-xs font-bold text-gray-400">Knowledge delivery list</p>
                                </div>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                {!teacher?.subjects || teacher.subjects.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 font-bold italic px-6">No specific subjects currently assigned to your profile registry.</p>
                                    </div>
                                ) : (
                                    teacher.subjects.map((subj: any) => (
                                        <div key={subj._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#45308D]/30 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-[#FDC70B]"></div>
                                                <span className="font-black text-gray-700 leading-tight">{subj.subjectName || subj.name || 'Module Record'}</span>
                                            </div>
                                            <CheckCircle className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Students Directory */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-[#45308D]/10 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="text-[#45308D] w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-800 tracking-tight">Student Directory</h3>
                                    <p className="text-xs font-bold text-gray-400">Assigned students</p>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                {!teacher?.students || teacher.students.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 font-bold italic px-6">Your student training directory is currently empty.</p>
                                    </div>
                                ) : (
                                    teacher.students.map((student: any) => {
                                        // Filter assignments for THIS teacher
                                        const myAssignments = student.subjectAssignments?.filter((a: any) => 
                                            (a.teacherId?._id || a.teacherId) === teacher._id
                                        ) || [];

                                        return (
                                            <div key={student._id} className="flex flex-col p-4 rounded-2xl border border-transparent bg-[#FAFAFA] hover:bg-white hover:border-[#45308D]/20 transition-all duration-300 group shadow-sm hover:shadow-md">
                                                <div className="flex items-center gap-4">
                                                    {/* Small Avatar */}
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FA8072] to-[#ff9b90] text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                        {student.fullName?.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-black text-gray-800 leading-none group-hover:text-[#45308D] transition-colors">{student.fullName}</h4>
                                                        <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Class Level: {student.class || 'N/A'}</p>
                                                    </div>
                                                    <div className="text-[10px] font-black italic text-[#45308D] bg-[#45308D]/5 px-2 py-1 rounded-full">
                                                        Active
                                                    </div>
                                                </div>
                                                
                                                {myAssignments.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                                                        {myAssignments.map((a: any, idx: number) => (
                                                            <div key={idx} className="bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-[#45308D] uppercase tracking-tighter">
                                                                    {a.subjectId?.subjectName || 'Subject'}
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                                <span className="text-[10px] font-bold text-green-600">
                                                                    ₹{a.salaryPerHour || a.billPerHour}/hr
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}</style>
        </div>
    );
}
