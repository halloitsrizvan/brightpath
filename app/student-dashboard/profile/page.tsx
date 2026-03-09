
'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import Cookies from 'js-cookie';
import { User, Phone, Mail, MapPin, Calendar, Book, ShieldAlert } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function StudentProfile() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            console.log("Fetching student profile for ID:", user.id);
            api.get(`/students/${user.id}`)
                .then(res => {
                    setStudent(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("API Error in Profile:", err);
                    toast.error("Failed to load profile");
                    setLoading(false);
                });
        }
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!student) return;

        setIsSaving(true);
        try {
            const { data } = await api.put(`/students/${student._id}`, {
                fullName: student.fullName,
                parentName: student.parentName,
                contactNumber: student.contactNumber,
                whatsappNumber: student.whatsappNumber,
                district: student.district
            });
            setStudent(data);
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="fixed z-50 h-full">
                <Sidebar role="student" />
            </div>
            <div className="flex-1 lg:ml-64 p-4 md:p-8">
                <div className="max-w-4xl mx-auto mt-4">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 overflow-hidden border border-gray-100 relative">
                        {/* Banner Background */}
                        <div className="h-48 bg-gradient-to-r from-primary via-primary/95 to-secondary opacity-90 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        </div>

                        {/* Profile Info Overlay */}
                        <div className="px-8 pb-8">
                            <div className="relative -mt-20 flex flex-col md:flex-row md:items-end gap-6 mb-8">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] p-2 shadow-2xl relative">
                                    <div className="w-full h-full bg-gray-100 rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white">
                                        <User className="w-16 h-16 md:w-20 md:h-20 text-gray-300" />
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                                </div>
                                <div className="flex-1 pb-2">
                                    <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight italic">{student?.fullName}</h1>
                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                            {student?.class} Student
                                        </span>
                                        <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-500/10">
                                            {student?.syllabus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Details Section */}
                                <div className="lg:col-span-2 space-y-6">
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent's Name</label>
                                                <input
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 text-[15px] font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                                    value={student?.parentName}
                                                    onChange={(e) => setStudent({ ...student, parentName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                                <input
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 text-[15px] font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                                    value={student?.contactNumber}
                                                    onChange={(e) => setStudent({ ...student, contactNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                                                <input
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 text-[15px] font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                                    value={student?.whatsappNumber}
                                                    onChange={(e) => setStudent({ ...student, whatsappNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                                                <input
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 text-[15px] font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                                    value={student?.district}
                                                    onChange={(e) => setStudent({ ...student, district: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="px-8 py-4 bg-primary text-white font-black text-[12px] uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
                                            >
                                                {isSaving ? "Synchronizing..." : "Update Identity Fields"}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Subjects & Tutors */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Book className="w-5 h-5 text-primary" />
                                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Active Modules</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {student?.subjects?.map((sub: any) => (
                                                    <span key={sub._id} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                                                        {sub.subjectName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <ShieldAlert className="w-5 h-5 text-secondary" />
                                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Assigned Tutors</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {student?.preferredTrainers?.map((tea: any) => (
                                                    <span key={tea._id || tea} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                                                        {tea.name || tea}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Stats Box */}
                                <div className="space-y-6">
                                    <div className="bg-primary/5 p-8 rounded-[2.5rem] space-y-6 border border-primary/10">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">System Email</label>
                                            <p className="text-gray-800 font-bold break-all flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary opacity-30" />
                                                {student?.email}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">DOB</label>
                                            <p className="text-gray-800 font-bold flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary opacity-30" />
                                                {student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">Status</label>
                                            <p className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${student?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-gray-800 font-bold uppercase text-[10px] tracking-widest">{student?.status}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-secondary/5 p-8 rounded-[2.5rem] border border-secondary/10 flex flex-col items-center justify-center text-center">
                                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2 font-black">Region</h4>
                                        <div className="flex items-center gap-1.5 text-secondary">
                                            <MapPin className="w-5 h-5 fill-secondary/10" />
                                            <span className="text-2xl font-black italic tracking-tight uppercase leading-none">{student?.residentialLocation}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
