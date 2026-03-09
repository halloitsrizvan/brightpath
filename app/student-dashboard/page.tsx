'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

export default function StudentDashboard() {
    const [stats, setStats] = useState({
        subjectsEnrolled: 0,
        teachers: [],
        attendanceSummary: 0
    });

    useEffect(() => {
        api.get('/dashboard/student').then(res => setStats(res.data)).catch(console.error);
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="fixed z-50 h-full">
                <Sidebar role="student" />
            </div>
            <div className="flex-1 lg:ml-64 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-2">Student Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Subjects Enrolled" value={stats.subjectsEnrolled} color="bg-violet-500" />
                    <StatCard title="Teachers" value={stats.teachers.length} color="bg-pink-500" />
                    <StatCard title="Classes Attended" value={stats.attendanceSummary} color="bg-teal-500" />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Progress</h2>
                    <p className="text-gray-500">View your detailed attendance and exam results from the sidebar.</p>
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
