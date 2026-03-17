'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { Menu, ChevronDown, CheckCircle, Plus, Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'react-hot-toast';

interface AttendanceRecord {
    id: string; // unique local ID for the UI
    studentId: string;
    subjectId: string;
    classInfo: string;
    phoneInfo: string;
    status: string;
}

export default function MarkAttendance() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teacherName, setTeacherName] = useState('Teacher Name');
    const [teacherId, setTeacherId] = useState<string>('');

    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    // Shared fields
    const [sharedData, setSharedData] = useState({
        date: new Date().toISOString().split('T')[0],
        durationMinutes: 60,
        notes: ''
    });

    // Array of student attendance records for this submittal
    const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([
        { id: Date.now().toString(), studentId: '', subjectId: '', classInfo: '-', phoneInfo: '-', status: 'Present' }
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.name) setTeacherName(user.name);
                if (user.id) setTeacherId(user.id);
            } catch (e) { }
        }

        api.get('/students').then(res => setStudents(res.data)).catch(console.error);
        api.get('/subjects').then(res => setSubjects(res.data)).catch(console.error);
    }, []);

    const handleAddStudentRow = () => {
        setAttendanceList([
            ...attendanceList,
            { id: Date.now().toString(), studentId: '', subjectId: '', classInfo: '-', phoneInfo: '-', status: 'Present' }
        ]);
    };

    const handleRemoveStudentRow = (id: string) => {
        if (attendanceList.length > 1) {
            setAttendanceList(attendanceList.filter(record => record.id !== id));
        } else {
            toast.error('You need at least one student row.');
        }
    };

    const handleRecordChange = (id: string, field: keyof AttendanceRecord, value: string) => {
        setAttendanceList(attendanceList.map(record => {
            if (record.id === id) {
                const updatedRecord = { ...record, [field]: value };

                // If the studentId changed, automatically update classInfo and phoneInfo
                if (field === 'studentId') {
                    const student = students.find(s => s._id === value);
                    if (student) {
                        updatedRecord.classInfo = student.class || '-';
                        updatedRecord.phoneInfo = student.contactNumber || student.phone || '-';
                    } else {
                        updatedRecord.classInfo = '-';
                        updatedRecord.phoneInfo = '-';
                    }
                }
                return updatedRecord;
            }
            return record;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const isValid = attendanceList.every(record => record.studentId && record.subjectId);
        if (!isValid) {
            toast.error('Please ensure all rows have a student and a subject selected.');
            return;
        }

        try {
            setIsSubmitting(true);

            // Map through list and await all POST requests
            const promises = attendanceList.map(record => {
                const payload = {
                    studentId: record.studentId,
                    subjectId: record.subjectId,
                    status: record.status,
                    date: sharedData.date,
                    durationMinutes: sharedData.durationMinutes,
                    notes: sharedData.notes
                };
                return api.post('/attendance', payload);
            });

            await Promise.all(promises);

            toast.success(`Successfully saved ${attendanceList.length} attendance record(s)`, { icon: '✅' });

            // Reset state
            setAttendanceList([
                { id: Date.now().toString(), studentId: '', subjectId: '', classInfo: '-', phoneInfo: '-', status: 'Present' }
            ]);
            setSharedData({ ...sharedData, notes: '' });

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit some attendance records');
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
            <div className={`fixed z-50 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar role="teacher" />
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
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

                <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col items-center lg:mt-6">
                    {/* Desktop Title */}
                    <div className="hidden lg:flex w-full items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-primary tracking-tight">Mark Attendance</h1>
                        <p className="text-lg font-medium text-gray-600">Welcome back, {teacherName}!</p>
                    </div>

                    <div className="w-full bg-white rounded-3xl shadow-xl shadow-primary/5 p-6 sm:p-10 border border-gray-100 relative overflow-hidden">
                        {/* Decorative Top Accent */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary/80 to-secondary opacity-90"></div>

                        {/* <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-800">New Attendance Session</h2>
                                <p className="text-gray-500 text-sm mt-1">Configure class details and record multiple students.</p>
                            </div>
                        </div> */}

                        <form onSubmit={handleSubmit} className="flex flex-col w-full flex-1 space-y-8">

                            {/* --------- STUDENT RECORDS CONFIG --------- */}
                            <div>
                                <h3 className="text-md font-bold text-primary mb-4 flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2">1</span>
                                    Student List
                                </h3>

                                <div className="space-y-4">
                                    {attendanceList.map((record, index) => (
                                        <div key={record.id} className="relative bg-white border border-gray-200 p-5 rounded-2xl shadow-sm transition-all hover:border-primary/40 hover:shadow-md group">

                                            {/* Optional Remove Button for rows > 1 */}
                                            {attendanceList.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveStudentRow(record.id)}
                                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                                                    title="Remove student row"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-4 pr-6">
                                                {/* Student Selector */}
                                                <div className="relative md:col-span-4">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Student {index + 1}</label>
                                                    <select
                                                        className="w-full bg-gray-50/50 text-gray-900 border-2 border-gray-200 p-3 pr-10 text-[15px] font-medium rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300"
                                                        value={record.studentId}
                                                        onChange={(e) => handleRecordChange(record.id, 'studentId', e.target.value)}
                                                        required
                                                    >
                                                        <option value="" disabled>Select Student...</option>
                                                        {students.map(student => (
                                                            <option key={student._id} value={student._id}>
                                                                {student.fullName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-9 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {/* Subject Selector */}
                                                <div className="relative md:col-span-4">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Subject</label>
                                                    <select
                                                        className="w-full bg-gray-50/50 text-gray-900 border-2 border-gray-200 p-3 pr-10 text-[15px] font-medium rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        value={record.subjectId}
                                                        onChange={(e) => handleRecordChange(record.id, 'subjectId', e.target.value)}
                                                        required
                                                        disabled={!record.studentId}
                                                    >                                                        <option value="" disabled>{record.studentId ? "Select Subject..." : "Select Student First"}</option>
                                                        {record.studentId && (() => {
                                                            const student = students.find(s => s._id === record.studentId);
                                                            if (!student) return null;

                                                            // Filter assignments for THIS teacher
                                                            const myAssignments = (student.subjectAssignments || []).filter((a: any) => 
                                                                (a.teacherId?._id || a.teacherId) === teacherId
                                                            );

                                                            if (myAssignments.length > 0) {
                                                                return myAssignments.map((a: any) => {
                                                                    const sub = a.subjectId;
                                                                    const sId = sub?._id || sub;
                                                                    const sName = sub?.subjectName || sub?.name || "Unknown Subject";
                                                                    return (
                                                                        <option key={sId} value={sId}>
                                                                            {sName}
                                                                        </option>
                                                                    );
                                                                });
                                                            }

                                                            // Fallback to student's general subjects if no specific assignments (for safety)
                                                            if (!student.subjects) return null;
                                                            return student.subjects.map((subjId: any) => {
                                                                const actualId = typeof subjId === 'object' ? subjId._id : subjId;
                                                                const subjectFromList = subjects.find(s => s._id === actualId);
                                                                const sName = (typeof subjId === 'object' && (subjId.subjectName || subjId.name))
                                                                    || (subjectFromList && (subjectFromList.subjectName || subjectFromList.name))
                                                                    || actualId;

                                                                return (
                                                                    <option key={actualId} value={actualId}>
                                                                        {sName}
                                                                    </option>
                                                                );
                                                            });
                                                        })()}
                                                    </select>
                                                    <div className="absolute right-3 top-9 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                {/* Status Selector */}
                                                {/* <div className="relative md:col-span-4">
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Status</label>
                                                    <select
                                                        className={`w-full border-2 p-3 pr-10 text-[15px] font-bold rounded-xl appearance-none focus:outline-none focus:ring-4 transition-all hover:border-gray-300 ${record.status === 'Present'
                                                                ? 'bg-green-50/50 text-green-700 border-green-200 focus:border-green-500 focus:ring-green-500/10'
                                                                : 'bg-red-50/50 text-red-700 border-red-200 focus:border-red-500 focus:ring-red-500/10'
                                                            }`}
                                                        value={record.status}
                                                        onChange={(e) => handleRecordChange(record.id, 'status', e.target.value)}
                                                    >
                                                        <option value="Present">Present</option>
                                                        <option value="Absent">Absent</option>
                                                    </select>
                                                    <div className={`absolute right-3 top-9 pointer-events-none transition-colors ${record.status === 'Present' ? 'text-green-500' : 'text-red-500'}`}>
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div> */}
                                            </div>

                                            {/* Preview Pills directly inside row */}
                                            {record.studentId && (
                                                <div className="flex flex-wrap gap-3 mt-2 pt-3 border-t border-gray-50">
                                                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-xs text-gray-600 font-medium">
                                                        <span className="text-gray-400 font-normal">Class:</span> {record.classInfo !== '-' ? record.classInfo : 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-xs text-gray-600 font-medium">
                                                        <span className="text-gray-400 font-normal">Contact:</span> {record.phoneInfo !== '-' ? record.phoneInfo : 'N/A'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Header action to add another row */}
                                <div className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={handleAddStudentRow}
                                        className="inline-flex items-center gap-2 bg-white text-primary border border-dashed border-primary/40 hover:bg-primary/5 hover:border-primary px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Add Another Student
                                    </button>
                                </div>
                            </div>

                            {/* --------- GLOBALS / SHARED FIELDS --------- */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h3 className="text-md font-bold text-primary mb-4 flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2">2</span>
                                    Session Details
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white text-gray-900 border-2 border-gray-200 p-3.5 text-[15px] font-medium rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300 cursor-pointer"
                                            value={sharedData.date}
                                            onChange={(e) => setSharedData({ ...sharedData, date: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="relative group">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Class Duration</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-white text-gray-900 border-2 border-gray-200 p-3.5 pr-12 text-[15px] font-medium rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 hover:border-gray-300"
                                                value={sharedData.durationMinutes}
                                                onChange={(e) => setSharedData({ ...sharedData, durationMinutes: Number(e.target.value) })}
                                                required
                                            >
                                                <option value={30}>30 mins</option>
                                                <option value={60}>1 Hours</option>
                                                <option value={90}>1.5 Hours</option>
                                                <option value={120}>2 Hours</option>
                                                <option value={180}>3 Hours</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                                <ChevronDown className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>




                            {/* --------- NOTES --------- */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Session Notes (Optional)</label>
                                <textarea
                                    placeholder="Add overall notes for this attendance submission..."
                                    className="w-full bg-gray-50/50 border-2 border-gray-200 p-4 text-[16px] font-medium rounded-2xl text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-y transition-all duration-300 hover:border-gray-300"
                                    value={sharedData.notes}
                                    onChange={(e) => setSharedData({ ...sharedData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white p-5 rounded-2xl text-[18px] font-bold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
                                >
                                    {isSubmitting ? 'Recording...' : `Submit ${attendanceList.length} Record(s)`}
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
