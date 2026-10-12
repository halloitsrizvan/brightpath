'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { 
    Menu, 
    ChevronDown, 
    CheckCircle, 
    Plus, 
    Trash2, 
    Calendar, 
    Clock, 
    Search, 
    X, 
    LayoutGrid, 
    List, 
    FileText, 
    Users, 
    Sparkles, 
    Eye, 
    RotateCcw,
    BookOpen
} from 'lucide-react';
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
    studentId: { 
        _id?: string;
        fullName: string;
        class?: string;
        grade?: string;
        phone?: string;
        contactNumber?: string;
    };
    subjectId: { 
        _id?: string;
        subjectName: string; 
    };
    durationMinutes: number;
    status: string;
    notes?: string;
    createdAt?: string;
}

export default function AttendancePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teacherName, setTeacherName] = useState('Teacher Name');
    const [teacherId, setTeacherId] = useState<string>('');

    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const getCurrentMonthYear = () => {
        const date = new Date();
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    };

    const currentMonthString = getCurrentMonthYear();
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthString);
    const [availableMonths, setAvailableMonths] = useState<string[]>([currentMonthString]);
    const [activeTab, setActiveTab] = useState<'mark' | 'records'>('mark');
    const [savedRecords, setSavedRecords] = useState<SavedAttendance[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Records filtering & UX state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Present' | 'Absent'>('all');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [selectedDetailRecord, setSelectedDetailRecord] = useState<SavedAttendance | null>(null);

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

    const fetchAvailableMonths = async () => {
        try {
            const res = await api.get('/attendance?getMonths=true');
            if (Array.isArray(res.data) && res.data.length > 0) {
                setAvailableMonths(res.data);
            }
        } catch (e) {
            console.error('Failed to load available months', e);
        }
    };

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
        fetchAvailableMonths();
    }, []);

    const fetchHistory = async (monthOverride?: string) => {
        setIsLoadingRecords(true);
        try {
            const targetMonth = monthOverride !== undefined ? monthOverride : selectedMonth;
            const query = targetMonth && targetMonth !== 'All Time' ? `?month=${encodeURIComponent(targetMonth)}` : '';
            const res = await api.get(`/attendance${query}`);
            setSavedRecords(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingRecords(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'records') {
            fetchHistory(selectedMonth);
            fetchAvailableMonths();
        }
    }, [activeTab, selectedMonth]);

    const displayMonths = Array.from(new Set([
        ...availableMonths,
        ...(selectedMonth && selectedMonth !== 'All Time' ? [selectedMonth] : [])
    ]));

    const filteredRecords = savedRecords.filter((rec) => {
        const query = searchQuery.trim().toLowerCase();
        const studentName = (rec.studentId?.fullName || '').toLowerCase();
        const studentClass = (rec.studentId?.class || rec.studentId?.grade || '').toLowerCase();
        const subjectName = (rec.subjectId?.subjectName || '').toLowerCase();
        const notes = (rec.notes || '').toLowerCase();

        const matchesQuery = !query || 
            studentName.includes(query) || 
            studentClass.includes(query) || 
            subjectName.includes(query) ||
            notes.includes(query);

        const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;

        return matchesQuery && matchesStatus;
    });

    const totalSessions = filteredRecords.length;
    const totalMinutes = filteredRecords.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const uniqueStudentsCount = new Set(
        filteredRecords.map(r => r.studentId?._id || r.studentId?.fullName).filter(Boolean)
    ).size;

    const formatSessionDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return {
                dateText: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
                timeText: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
        } catch {
            return { dateText: dateStr, weekday: '', timeText: '' };
        }
    };

    const formatDuration = (mins: number) => {
        const hours = Math.floor(mins / 60);
        const remMins = mins % 60;
        if (hours > 0 && remMins > 0) return `${hours}h ${remMins}m`;
        if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
        return `${remMins} mins`;
    };

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
            fetchAvailableMonths();

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

                <div className={`flex-1 p-4 md:p-8 ${activeTab === 'records' ? 'max-w-6xl' : 'max-w-4xl'} mx-auto w-full flex flex-col items-center mt-20 lg:mt-6 transition-all duration-300`}>
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
                        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* KPI Metrics Strip */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow">
                                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Sessions</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5 leading-none">{totalSessions}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 truncate max-w-[130px]">{selectedMonth}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow">
                                    <div className="w-11 h-11 rounded-2xl bg-[#FDC70B]/20 text-amber-800 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Teaching Hours</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5 leading-none">
                                            {totalHours} <span className="text-xs font-bold text-gray-500">hrs</span>
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">{totalMinutes} mins total</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow">
                                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Unique Students</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5 leading-none">{uniqueStudentsCount}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">Active learners</p>
                                    </div>
                                </div>

                                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow">
                                    <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Avg Duration</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5 leading-none">
                                            {avgMinutes} <span className="text-xs font-bold text-gray-500">m</span>
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">Per class average</p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Records Container */}
                            <div className="w-full bg-white rounded-[0.5rem] shadow-2xl shadow-primary/5 p-5 sm:p-8 border border-gray-100 relative overflow-hidden min-h-[500px]">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary via-secondary/80 to-primary opacity-90" />
 
                                {/* Header & Controls Bar */}
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center">
                                            <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight">Attendance Ledger</h2>
                                            {/* {selectedMonth !== currentMonthString && (
                                                <button
                                                    onClick={() => setSelectedMonth(currentMonthString)}
                                                    className="px-2.5 py-1 bg-primary/10 hover:bg-primary/15 text-primary rounded-lg text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1 active:scale-95"
                                                    title="Switch to current month"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                    <span>Jump to This Month</span>
                                                </button>
                                            )} */}
                                        </div>
                                        {/* <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                            Showing verified session logs for <span className="text-primary font-black">{selectedMonth}</span>
                                        </p> */}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <select 
                                                value={selectedMonth} 
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                className="appearance-none pl-9 pr-9 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                                                aria-label="Filter records by month"
                                            >
                                                {displayMonths.map((m) => (
                                                    <option key={m} value={m}>
                                                        {m} {m === currentMonthString ? '(Current)' : ''}
                                                    </option>
                                                ))}
                                                <option value="All Time">All Time</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            </div>
                                        </div>

                                        {/* View Mode Toggle */}
                                        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-xs">
                                            <button
                                                type="button"
                                                onClick={() => setViewMode('table')}
                                                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${viewMode === 'table' ? 'bg-white text-primary shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
                                                title="Table View"
                                            >
                                                <List className="w-4 h-4" />
                                                <span className="hidden sm:inline text-[11px]">Table</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setViewMode('cards')}
                                                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${viewMode === 'cards' ? 'bg-white text-primary shadow-xs' : 'text-gray-400 hover:text-gray-700'}`}
                                                title="Card Grid View"
                                            >
                                                <LayoutGrid className="w-4 h-4" />
                                                <span className="hidden sm:inline text-[11px]">Cards</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Toolbar (Search + Status Filter Pills) */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-2xl mb-6">
                                    {/* Search Input */}
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <input 
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search student, class, subject, or notes..."
                                            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                        />
                                        {searchQuery && (
                                            <button 
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                  
                                </div>

                                {/* Content Rendering */}
                                {isLoadingRecords ? (
                                    <div className="py-24 flex flex-col items-center justify-center space-y-3">
                                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
                                            Synchronizing Session Ledger...
                                        </p>
                                    </div>
                                ) : filteredRecords.length === 0 ? (
                                    <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
                                        <div className="w-16 h-16 rounded-3xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                                            <Calendar className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                                                {searchQuery ? 'No matching sessions found' : `No logs recorded for ${selectedMonth}`}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                                                {searchQuery 
                                                    ? `No sessions match "${searchQuery}". Try clearing search filters.`
                                                    : 'Your attendance registry for this cycle is currently empty.'
                                                }
                                            </p>
                                        </div>
                                        {searchQuery ? (
                                            <button
                                                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
                                            >
                                                Clear Search Filters
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setActiveTab('mark')}
                                                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-primary/20 transition active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Log a Session Now</span>
                                            </button>
                                        )}
                                    </div>
                                ) : viewMode === 'table' ? (
                                    /* TABLE VIEW */
                                    <div className="w-full overflow-x-auto -mx-2 sm:mx-0">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/50">
                                                    <th className="py-3 px-2.5 sm:px-4 rounded-l-xl w-[25%] sm:w-[22%]">Date & Day</th>
                                                    <th className="py-3 px-2.5 sm:px-4 w-[38%] sm:w-[40%]">Student & Class</th>
                                                    <th className="py-3 px-2.5 sm:px-4 w-[22%] sm:w-[23%]"> Module</th>
                                                    <th className="py-3 px-2.5 sm:px-4 text-center rounded-r-xl w-[15%]">Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredRecords.map((rec) => {
                                                    const { dateText, weekday } = formatSessionDate(rec.date);
                                                    return (
                                                        <tr 
                                                             key={rec._id} 
                                                             onClick={() => setSelectedDetailRecord(rec)}
                                                             className="group hover:bg-purple-50/40 transition-colors cursor-pointer"
                                                         >
                                                             {/* Date & Weekday */}
                                                             <td className="py-3.5 sm:py-4 px-2.5 sm:px-4">
                                                                 <div className="flex items-center gap-1.5 sm:gap-2">
                                                                     <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gray-100 text-gray-600 flex flex-col items-center justify-center font-bold leading-none shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                                         <span className="text-[8px] sm:text-[9px] uppercase font-black">{weekday}</span>
                                                                     </div>
                                                                     <span className="text-[11px] sm:text-xs font-bold text-gray-800 whitespace-nowrap">{dateText}</span>
                                                                 </div>
                                                             </td>

                                                             {/* Student Profile & Class */}
                                                             <td className="py-3.5 sm:py-4 px-2.5 sm:px-4">
                                                                 <div className="min-w-0 pr-1">
                                                                     <p className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-primary transition-colors truncate">
                                                                         {rec.studentId?.fullName || "Student Removed"}
                                                                     </p>
                                                                     {(rec.studentId?.class || rec.studentId?.grade) && (
                                                                         <span className="inline-block text-[9px] sm:text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-md mt-0.5 truncate max-w-full">
                                                                             {rec.studentId.class || rec.studentId.grade}
                                                                         </span>
                                                                     )}
                                                                 </div>
                                                             </td>

                                                             {/* Subject / Learning Module */}
                                                             <td className="py-3.5 sm:py-4 px-2.5 sm:px-4">
                                                                 <span className="text-[11px] sm:text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-2 sm:px-3 py-1 rounded-xl inline-block truncate max-w-[110px] sm:max-w-none">
                                                                     {rec.subjectId?.subjectName || "Module"}
                                                                 </span>
                                                             </td>

                                                             {/* Duration */}
                                                             <td className="py-3.5 sm:py-4 px-2.5 sm:px-4 text-center">
                                                                 <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-black text-gray-800 bg-gray-100/80 px-2 sm:px-2.5 py-1 rounded-lg whitespace-nowrap">
                                                                     <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
                                                                     {formatDuration(rec.durationMinutes)}
                                                                 </span>
                                                             </td>
                                                         </tr>
                                                     );
                                                 })}
                                             </tbody>
                                         </table>
                                     </div>
                                ) : (
                                    /* CARDS / GRID VIEW */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredRecords.map((rec) => {
                                            const { dateText, weekday } = formatSessionDate(rec.date);
                                            return (
                                                <div 
                                                    key={rec._id}
                                                    onClick={() => setSelectedDetailRecord(rec)}
                                                    className="bg-white border border-gray-150 p-5 rounded-3xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                                                >
                                                    {/* Card Header: Date & Status */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                                            <span>{weekday}, {dateText}</span>
                                                        </div>
                                                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                            rec.status === 'Present' 
                                                                ? 'bg-emerald-50 text-emerald-700' 
                                                                : 'bg-red-50 text-red-700'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${rec.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                            {rec.status || 'Present'}
                                                        </span>
                                                    </div>

                                                    {/* Card Body: Student & Subject */}
                                                    <div className="flex items-start gap-3 pt-1">
                                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#45308D]/15 to-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-sm shrink-0 border border-primary/10">
                                                            {rec.studentId?.fullName?.charAt(0) || 'S'}
                                                        </div>
                                                        <div className="space-y-1 flex-1 min-w-0">
                                                            <h4 className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors truncate">
                                                                {rec.studentId?.fullName || "Student Removed"}
                                                            </h4>
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                <span className="text-[11px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                                                                    {rec.subjectId?.subjectName || "Module"}
                                                                </span>
                                                                {(rec.studentId?.class || rec.studentId?.grade) && (
                                                                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                                        {rec.studentId.class || rec.studentId.grade}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Notes snippet if available */}
                                                    {rec.notes && (
                                                        <div className="bg-gray-50 p-2.5 rounded-xl text-xs text-gray-600 line-clamp-2 border border-gray-100">
                                                            <span className="font-bold text-gray-400 text-[10px] uppercase block mb-0.5">Notes:</span>
                                                            {rec.notes}
                                                        </div>
                                                    )}

                                                    {/* Card Footer: Duration & Details Action */}
                                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                                        <span className="font-black text-gray-800 flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                            {formatDuration(rec.durationMinutes)}
                                                        </span>
                                                        <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                                            <span>Details</span>
                                                            <span>→</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SESSION DETAILS MODAL */}
                    {selectedDetailRecord && (
                        <div 
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
                            onClick={() => setSelectedDetailRecord(null)}
                        >
                            <div 
                                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

                                {/* Modal Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                                            {selectedDetailRecord.studentId?.fullName?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 tracking-tight">
                                                {selectedDetailRecord.studentId?.fullName || "Student Removed"}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                {selectedDetailRecord.studentId?.class ? `Class: ${selectedDetailRecord.studentId.class}` : 'Active Student'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedDetailRecord(null)}
                                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Session Metadata Grid */}
                                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Session Date</span>
                                        <span className="font-bold text-gray-900 mt-0.5 block">
                                            {new Date(selectedDetailRecord.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Subject Module</span>
                                        <span className="font-bold text-primary mt-0.5 block">
                                            {selectedDetailRecord.subjectId?.subjectName || "Subject Removed"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Class Duration</span>
                                        <span className="font-bold text-gray-900 mt-0.5 block">
                                            {selectedDetailRecord.durationMinutes} minutes ({formatDuration(selectedDetailRecord.durationMinutes)})
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Attendance Status</span>
                                        <span className={`font-black mt-0.5 inline-block ${selectedDetailRecord.status === 'Present' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            ● {selectedDetailRecord.status || 'Present'}
                                        </span>
                                    </div>
                                </div>

                                {/* Student Contact info if available */}
                                {(selectedDetailRecord.studentId?.contactNumber || selectedDetailRecord.studentId?.phone) && (
                                    <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100/80 text-xs flex items-center justify-between">
                                        <span className="font-bold text-gray-500">Parent / Student Contact:</span>
                                        <span className="font-black text-primary">
                                            {selectedDetailRecord.studentId.contactNumber || selectedDetailRecord.studentId.phone}
                                        </span>
                                    </div>
                                )}

                                {/* Session Notes */}
                                <div>
                                    <span className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1.5">
                                        Session Notes & Remarks
                                    </span>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 text-xs text-gray-800 leading-relaxed font-medium min-h-[80px]">
                                        {selectedDetailRecord.notes ? (
                                            <p>{selectedDetailRecord.notes}</p>
                                        ) : (
                                            <p className="text-gray-400 italic">No notes were attached to this session entry.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedDetailRecord(null)}
                                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition cursor-pointer shadow-md"
                                >
                                    Close Details
                                </button>
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
