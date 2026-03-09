'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Menu, ChevronDown, CheckCircle, Plus } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'react-hot-toast';

export default function MarkAttendance() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teacherName, setTeacherName] = useState('Teacher Name');

    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        studentId: '',
        subjectId: '',
        date: new Date().toISOString().split('T')[0],
        durationMinutes: 60,
        status: 'Present',
        notes: ''
    });

    const [selectedStudentInfo, setSelectedStudentInfo] = useState({
        classInfo: '-',
        phoneInfo: '-'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.name) setTeacherName(user.name);
            } catch (e) { }
        }

        // Fetch students and subjects
        api.get('/students').then(res => setStudents(res.data)).catch(console.error);
        api.get('/subjects').then(res => setSubjects(res.data)).catch(console.error);
    }, []);

    const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const studentId = e.target.value;
        setFormData({ ...formData, studentId });

        const student = students.find(s => s._id === studentId);
        if (student) {
            setSelectedStudentInfo({
                classInfo: student.class || `Missing class. Keys: ${Object.keys(student).join(', ')}`,
                phoneInfo: student.contactNumber || student.phone || `No contact. Keys: ${Object.keys(student).join(', ')}`
            });
        } else {
            setSelectedStudentInfo({ classInfo: '-', phoneInfo: '-' });
        }
    };

    const handleAddStudentClick = () => {
        toast('Additional student feature coming soon!', { icon: '🧑‍🎓' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.studentId || !formData.subjectId) {
            toast.error('Please select a student and subject');
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post('/attendance', formData);
            toast.success('Attendance submitted successfully', { icon: '✅' });

            // Reset form but keep context intact
            setFormData(prev => ({ ...prev, studentId: '', notes: '' }));
            setSelectedStudentInfo({ classInfo: '-', phoneInfo: '-' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit attendance');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-center" toastOptions={{
                duration: 3000,
                style: {
                    background: '#fff',
                    color: '#45308D',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    borderRadius: '9999px',
                },
            }} />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed lg:static z-50 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar role="teacher" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Header (matches teacher dashboard) */}
                <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 -ml-2 text-primary hover:bg-primary/10 rounded-lg lg:hidden"
                    >
                        <Menu className="w-8 h-8" />
                    </button>

                    <div className="text-right">
                        <h1 className="text-xl font-bold text-primary">BrightPath</h1>
                        <p className="text-sm text-gray-500 font-medium">{teacherName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full flex flex-col items-center lg:mt-6">
                    {/* Desktop Title */}
                    <div className="hidden lg:flex w-full items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-primary tracking-tight">Mark Attendance</h1>
                        <p className="text-lg font-medium text-gray-600">Welcome back, {teacherName}!</p>
                    </div>

                    <div className="w-full bg-white rounded-3xl shadow-xl shadow-primary/5 p-6 sm:p-10 border border-gray-100 relative overflow-hidden">
                        {/* Decorative Top Accent */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary/80 to-secondary opacity-90"></div>

                        <div className="mb-8 text-center sm:text-left">
                            <h2 className="text-2xl font-extrabold text-gray-800">New Attendance Record</h2>
                            <p className="text-gray-500 text-sm mt-1">Fill in the details below to record student attendance.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col w-full flex-1 space-y-6">

                            {/* Student Selection */}
                            <div className="relative group">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Student</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-gray-50/50 text-gray-900 border-2 border-gray-200 p-4 pr-12 text-[16px] font-medium rounded-2xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300"
                                        value={formData.studentId}
                                        onChange={handleStudentChange}
                                        required
                                    >
                                        <option value="" disabled>Select Student...</option>
                                        {students.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.fullName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                        <ChevronDown className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>

                            {/* Class and Phone info pills */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center justify-center text-center">
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Class Info</div>
                                        <div className="text-primary font-semibold text-[16px]">
                                            {selectedStudentInfo.classInfo !== '-' ? selectedStudentInfo.classInfo : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-secondary/10 rounded-2xl p-4 border border-secondary/20 flex items-center justify-center text-center">
                                    <div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Contact</div>
                                        <div className="text-gray-800 font-semibold text-[16px]">
                                            {selectedStudentInfo.phoneInfo !== '-' ? selectedStudentInfo.phoneInfo : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* + Student Button */}
                            <div className="flex justify-center my-2">
                                <button
                                    type="button"
                                    onClick={handleAddStudentClick}
                                    className="flex items-center gap-2 bg-white text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary/5 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm"
                                >
                                    <Plus className="w-5 h-5" /> Add Multiple
                                </button>
                            </div>

                            {/* Subject and Duration */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Subject</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-gray-50/50 text-gray-900 border-2 border-gray-200 p-4 pr-12 text-[16px] font-medium rounded-2xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300"
                                            value={formData.subjectId}
                                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                            required
                                        >
                                            <option value="" disabled>Select Subject</option>
                                            {subjects.map(subject => (
                                                <option key={subject._id} value={subject._id}>
                                                    {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Duration</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-gray-50/50 text-gray-900 border-2 border-gray-200 p-4 pr-12 text-[16px] font-medium rounded-2xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300"
                                            value={formData.durationMinutes}
                                            onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                                            required
                                        >
                                            <option value={30}>30 mins</option>
                                            <option value={60}>1 Hours</option>
                                            <option value={90}>1.5 Hours</option>
                                            <option value={120}>2 Hours</option>
                                            <option value={180}>3 Hours</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date & Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-gray-50/50 text-gray-900 border-2 border-gray-200 p-4 text-[16px] font-medium rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300 cursor-pointer"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                {/* <div className="relative group">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Status</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-gray-50/50 text-gray-900 border-2 border-gray-200 p-4 pr-12 text-[16px] font-medium rounded-2xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Notes (Optional)</label>
                                <textarea
                                    placeholder="Add any relevant notes..."
                                    className="w-full bg-gray-50/50 border-2 border-gray-200 p-4 text-[16px] font-medium rounded-2xl text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-y transition-all duration-300 hover:border-gray-300"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl text-[18px] font-bold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
                                >
                                    {isSubmitting ? 'Recording...' : 'Submit Attendance Record'}
                                    {!isSubmitting && <CheckCircle className="w-5 h-5" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
