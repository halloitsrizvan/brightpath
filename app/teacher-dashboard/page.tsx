'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Menu, Users, Calendar, Clock, IndianRupee } from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import IncentiveProgressCard from '../components/IncentiveProgressCard';

export default function TeacherDashboard() {
    const [stats, setStats] = useState({
        totalStudentsAssigned: 0,
        classesThisMonth: 0,
        totalHoursThisMonth: 0,
        salaryEstimate: 0
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [teacherName, setTeacherName] = useState('Teacher Name');

    useEffect(() => {
        api.get('/dashboard/teacher').then(res => setStats(res.data)).catch(console.error);

        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.name) setTeacherName(user.name);
            } catch (e) { }
        }
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed lg:static z-50 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar role="teacher" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Header (matches wireframe) */}
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

                <div className="flex-1 p-4 md:p-8 max-w-5xl lg:max-w-7xl mx-auto w-full space-y-4 sm:space-y-6 lg:mt-6">
                    {/* Desktop Title (Hidden on mobile as it's in the header) */}
                    <div className="hidden lg:flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-primary tracking-tight">Teacher Dashboard</h1>
                        <p className="text-lg font-medium text-gray-600">Welcome back, {teacherName}!</p>
                    </div>

                    {/* Mark Attendance Hero Card */}
                    <Link href="/teacher-dashboard/attendance" className="block w-full group">
                        <div className="bg-primary hover:bg-primary/90 transition-all duration-300 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center shadow-xl shadow-primary/20 hover:shadow-primary/30 cursor-pointer text-white relative overflow-hidden h-48 sm:h-56">
                            {/* Decorative elements */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/30 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl transform group-hover:scale-110 transition-transform duration-500"></div>

                            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-center z-10 drop-shadow-sm">
                                Mark <br className="sm:hidden" /> Attendance
                            </h2>
                            <div className="z-10 mt-6 px-8 py-3 bg-secondary text-primary font-bold rounded-full text-sm shadow-md group-hover:scale-105 transition-transform duration-300 transform group-hover:-translate-y-1">
                                Go to Register
                            </div>
                        </div>
                    </Link>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
                        <StatBox
                            title="Students assigned"
                            value={stats.totalStudentsAssigned}
                            icon={Users}
                            delay="0"
                        />
                        <StatBox
                            title="Classes this month"
                            value={stats.classesThisMonth}
                            icon={Calendar}
                            delay="100"
                        />
                        <StatBox
                            title="Monthly Hours"
                            value={stats.totalHoursThisMonth}
                            icon={Clock}
                            delay="200"
                        />
                        <StatBox
                            title="Est. Salary"
                            value={`₹${stats.salaryEstimate}`}
                            icon={IndianRupee}
                            delay="300"
                        />
                    </div>

                    <div className="mt-8">
                        <IncentiveProgressCard />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ title, value, icon: Icon, delay }: { title: string, value: string | number, icon: any, delay: string }) {
    return (
        <div
            className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-center items-center border border-gray-100/50 text-center relative overflow-hidden group hover:-translate-y-1"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Elegant top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/80 to-secondary opacity-80 group-hover:opacity-100 transition-opacity"></div>

            <div className="mb-4 p-4 bg-primary/5 group-hover:bg-primary/10 rounded-2xl text-primary transition-colors duration-300">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h3 className="text-sm font-semibold text-gray-500 mb-2 max-w-[90%] mx-auto leading-tight">{title}</h3>
            <p className="text-4xl font-extrabold text-primary tracking-tight">{value || '0'}</p>
        </div>
    );
}
