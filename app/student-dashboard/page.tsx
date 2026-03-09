'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import Cookies from 'js-cookie';
import { BookOpen, Settings } from 'lucide-react';

export default function StudentDashboard() {
    const [stats, setStats] = useState({
        subjectsEnrolled: 0,
        teachers: [],
        attendanceSummary: 0
    });

    const [studentName, setStudentName] = useState('Student');

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setStudentName(user.name || 'Student');
            } catch (e) { }
        }
        api.get('/dashboard/student').then(res => setStats(res.data)).catch(console.error);
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <div className="fixed z-50 h-full">
                <Sidebar role="student" />
            </div>
            <div className="flex-1 lg:ml-64 p-4 md:p-8 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 tracking-tight italic">Welcome, {studentName}!</h1>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1 opacity-60">Learning Progress Portal</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Active Modules" value={stats.subjectsEnrolled} color="bg-violet-500" />
                    <StatCard title="Assigned Tutors" value={stats.teachers.length} color="bg-pink-500" />
                    <StatCard title="Sessions Logged" value={stats.attendanceSummary} color="bg-teal-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 p-8 border border-gray-100 flex flex-col justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-tight mb-2 uppercase">Your Academic Roadmap</h2>
                        <p className="text-gray-500 font-medium tracking-wide mb-6">View your detailed progress reports, attendance history, and exam marking securely from the sidebar navigation.</p>
                        <div className="pt-2">
                            <a href="/student-dashboard/exams" className="px-6 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">View Results</a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-[2.5rem] p-8 border border-secondary/10 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Settings className="w-32 h-32 rotate-12" />
                        </div>
                        <div className="text-center relative z-10">
                            <h3 className="text-sm font-black text-secondary tracking-[0.2em] uppercase mb-4">Support & Feedback</h3>
                            <p className="text-gray-600 font-semibold max-w-xs mx-auto mb-6">Need help with your modules or have questions for your tutors?</p>
                            <a href="mailto:support@brightpath.com" className="text-secondary font-black text-xs uppercase underline tracking-widest decoration-2 underline-offset-4">Get in Touch</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <div className="mt-4 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
                <div className={`w-12 h-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center`}>
                    <div className={`w-4 h-4 rounded-full ${color}`}></div>
                </div>
            </div>
        </div>
    );
}
