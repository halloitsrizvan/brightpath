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

interface SavedAttendance {
    _id: string;
    date: string;
    studentId: { fullName: string };
    subjectId: { subjectName: string };
    durationMinutes: number;
    status: string;
}

export default function AttendancePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teacherName, setTeacherName] = useState('Teacher Name');
    const [teacherId, setTeacherId] = useState<string>('');

    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [activeTab, setActiveTab] = useState<'mark' | 'records'>('mark');
    const [savedRecords, setSavedRecords] = useState<SavedAttendance[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

    const fetchHistory = async () => {
        setIsLoadingRecords(true);
        try {
            const res = await api.get('/attendance');
            setSavedRecords(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingRecords(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'records') {
            fetchHistory();
        }
    }, [activeTab]);

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

            setShowSuccessPopup(true);

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
            <Sidebar role="teacher" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                {/* Header (matches teacher dashboard) */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Attendance</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{teacherName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col items-center mt-20 lg:mt-6">
                    {/* Desktop Title & Tab Switcher */}
                    <div className="hidden lg:flex w-full items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-primary tracking-tighter italic uppercase">Attendance Hub</h1>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Registry & Payout Verification</p>
                        </div>

                        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
                            <button
                                onClick={() => setActiveTab('mark')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'mark' ? 'bg-white text-primary shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Mark Log
                            </button>
                            <button
                                onClick={() => setActiveTab('records')}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'records' ? 'bg-white text-primary shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Past Records
                            </button>
                        </div>
                    </div>

                    {/* Mobile Tab Switcher */}
                    <div className="lg:hidden w-full flex bg-gray-100 p-1 rounded-xl mb-6 border border-gray-200">
                        <button
                            onClick={() => setActiveTab('mark')}
                            className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mark' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                        >
                            Mark
                        </button>
                        <button
                            onClick={() => setActiveTab('records')}
                            className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'records' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                        >
                            Records
                        </button>
                    </div>

                    {activeTab === 'mark' ? (
                        <div className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 p-6 sm:p-10 border border-gray-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary/80 to-secondary opacity-90"></div>

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

                                                    <div className="relative md:col-span-4">
                                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Subject</label>
                                                        <select
                                                            className="w-full bg-gray-50/50 text-gray-900 border-2 border-gray-200 p-3 pr-10 text-[15px] font-medium rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            value={record.subjectId}
                                                            onChange={(e) => handleRecordChange(record.id, 'subjectId', e.target.value)}
                                                            required
                                                            disabled={!record.studentId}
                                                        >
                                                            <option value="" disabled>{record.studentId ? "Select Subject..." : "Select Student First"}</option>
                                                            {record.studentId && (() => {
                                                                const student = students.find(s => s._id === record.studentId);
                                                                if (!student) return null;

                                                                const myAssignments = (student.subjectAssignments || []).filter((a: any) => 
                                                                    (a.teacherId?._id || a.teacherId) === teacherId
                                                                );

                                                                if (myAssignments.length > 0) {
                                                                    return myAssignments.map((a: any) => {
                                                                        const sub = a.subjectId;
                                                                        const sId = sub?._id || sub;
                                                                        const sName = sub?.subjectName || sub?.name || "Unknown Subject";
                                                                        return <option key={sId} value={sId}>{sName}</option>;
                                                                    });
                                                                }

                                                                if (!student.subjects) return null;
                                                                return student.subjects.map((subjId: any) => {
                                                                    const actualId = typeof subjId === 'object' ? subjId._id : subjId;
                                                                    const subjectFromList = subjects.find(s => s._id === actualId);
                                                                    const sName = (typeof subjId === 'object' && (subjId.subjectName || subjId.name))
                                                                        || (subjectFromList && (subjectFromList.subjectName || subjectFromList.name))
                                                                        || actualId;
                                                                    return <option key={actualId} value={actualId}>{sName}</option>;
                                                                });
                                                            })()}
                                                        </select>
                                                        <div className="absolute right-3 top-9 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                                            <ChevronDown className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>

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

                                {/* --------- SESSION DETAILS --------- */}
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
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 relative">
                                                    <input 
                                                        type="number" 
                                                        min="0" 
                                                        placeholder="0"
                                                        className="w-full bg-white text-gray-900 border-2 border-gray-200 p-3.5 text-center text-[15px] font-bold rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300"
                                                        value={Math.floor(sharedData.durationMinutes / 60)}
                                                        onChange={(e) => setSharedData({ ...sharedData, durationMinutes: (parseInt(e.target.value) || 0) * 60 + (sharedData.durationMinutes % 60) })}
                                                    />
                                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase font-black text-gray-400">Hours</span>
                                                </div>
                                                <span className="text-xl font-black text-gray-300">:</span>
                                                <div className="flex-1 relative">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        max="59"
                                                        placeholder="00"
                                                        className="w-full bg-white text-gray-900 border-2 border-gray-200 p-3.5 text-center text-[15px] font-bold rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300"
                                                        value={sharedData.durationMinutes % 60}
                                                        onChange={(e) => setSharedData({ ...sharedData, durationMinutes: Math.floor(sharedData.durationMinutes / 60) * 60 + (Math.min(59, parseInt(e.target.value) || 0)) })}
                                                    />
                                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase font-black text-gray-400">Mins</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Session Notes (Optional)</label>
                                    <textarea
                                        placeholder="Add overall notes for this attendance submission..."
                                        className="w-full bg-gray-50/50 border-2 border-gray-200 p-4 text-[16px] font-medium rounded-2xl text-gray-900 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[100px] resize-y transition-all duration-300 hover:border-gray-300"
                                        value={sharedData.notes}
                                        onChange={(e) => setSharedData({ ...sharedData, notes: e.target.value })}
                                    ></textarea>
                                </div>

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
                    ) : (
                        <div className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 p-6 sm:p-8 border border-gray-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-secondary/80 to-primary opacity-90"></div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-800 italic uppercase">Your Attendance Logs</h2>
                                <div className="p-3 bg-gray-50 rounded-2xl flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-tighter">{savedRecords.length} Saved Sessions</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                            <th className="pb-4">Session Date</th>
                                            <th className="pb-4">Student Profile</th>
                                            <th className="pb-4">Learning Module</th>
                                            <th className="pb-4 text-right">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {isLoadingRecords ? (
                                            <tr><td colSpan={4} className="py-20 text-center animate-pulse text-gray-400 font-bold italic tracking-widest">SYNCHRONIZING RECORDS...</td></tr>
                                        ) : savedRecords.length === 0 ? (
                                            <tr><td colSpan={4} className="py-20 text-center text-gray-400 font-bold italic">No attendance history found.</td></tr>
                                        ) : savedRecords.map((rec) => (
                                            <tr key={rec._id} className="group hover:bg-gray-50/50 transition-all">
                                                <td className="py-5">
                                                    <span className="text-xs font-bold text-gray-600 italic">{new Date(rec.date).toLocaleDateString()}</span>
                                                </td>
                                                <td className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary font-black text-xs">
                                                            {rec.studentId?.fullName?.charAt(0)}
                                                        </div>
                                                        <p className="text-sm font-black text-gray-800">{rec.studentId?.fullName || "Student Removed"}</p>
                                                    </div>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-xs font-black text-primary italic uppercase bg-primary/5 px-2.5 py-1 rounded-lg">
                                                        {rec.subjectId?.subjectName || "Module Removed"}
                                                    </span>
                                                </td>
                                                <td className="py-5 text-right font-black text-sm italic text-gray-700">
                                                    {rec.durationMinutes}m
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center border-4 border-primary/10 relative animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100 scale-110">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2 italic tracking-tighter uppercase">Success!</h2>
                        <p className="text-gray-500 font-bold text-sm leading-relaxed mb-8">
                            Your attendance session has been logged and updated in the teacher ledger.
                        </p>
                        <button 
                            onClick={() => setShowSuccessPopup(false)}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition shadow-xl"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
