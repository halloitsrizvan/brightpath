'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

export default function TeacherDashboard() {
    const [stats, setStats] = useState({
        totalStudentsAssigned: 0,
        classesTakenToday: 0,
        totalHoursThisMonth: 0,
        salaryEstimate: 0
    });

    useEffect(() => {
        api.get('/dashboard/teacher').then(res => setStats(res.data)).catch(console.error);
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar role="teacher" />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-2">Teacher Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Students Assigned" value={stats.totalStudentsAssigned} color="bg-indigo-500" />
                    <StatCard title="Classes Today" value={stats.classesTakenToday} color="bg-emerald-500" />
                    <StatCard title="Monthly Hours" value={stats.totalHoursThisMonth} color="bg-rose-500" />
                    <StatCard title="Est. Salary" value={`₹${stats.salaryEstimate}`} color="bg-amber-500" />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <p className="text-gray-500">Record attendance or upload exam marks using the sidebar.</p>
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
