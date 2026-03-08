'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        classesThisMonth: 0,
        monthlyRevenue: 0
    });

    useEffect(() => {
        api.get('/dashboard/admin').then(res => setStats(res.data)).catch(console.error);
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-2">Admin Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Students" value={stats.totalStudents} color="bg-blue-500" />
                    <StatCard title="Total Teachers" value={stats.totalTeachers} color="bg-purple-500" />
                    <StatCard title="Classes This Month" value={stats.classesThisMonth} color="bg-green-500" />
                    <StatCard title="Monthly Revenue" value={`₹${stats.monthlyRevenue}`} color="bg-yellow-500" />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center min-h-[400px]">
                    <p className="text-gray-500 font-medium">Select an option from the sidebar to manage students, teachers, etc.</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
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
