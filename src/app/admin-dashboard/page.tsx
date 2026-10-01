'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Cookies from 'js-cookie';
import api from '@/utils/api';
import { Users, UserCheck, BookOpen, GraduationCap, IndianRupee, TrendingUp, Calendar, Clock, ArrowUpRight, Menu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

export default function AdminDashboard() {
    const { canViewIncome, roleName, mounted } = useAdminPermissions();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        classesThisMonth: 0,
        monthlyRevenue: 0,
        hoursPerDay: [] as any[],
        velocityData: [] as any[],
        latestLogs: [] as any[]
    });
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('Admin');

    useEffect(() => {
        api.get('/dashboard/admin').then(res => setStats(res.data)).catch(console.error);
        
        const userCookie = Cookies.get('user');
        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                if (user.name) setUserName(user.name);
            } catch (e) {}
        }

        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const greetings = () => {
        if (!currentTime) return "Welcome";
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900">
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                {/* Mobile Header Bar */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 bg-white/80 backdrop-blur-md shadow-xs p-3.5 flex items-center justify-between lg:hidden border-b border-gray-100">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-[#45308D] shadow-xs active:scale-95 transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">BrightPath</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {/* Welcome Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                    Command Center
                                </span>
                                {roleName && (
                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                        {roleName}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                {greetings()}, <span className="text-[#45308D]">{userName}</span>
                            </h1>
                        </div>

                        {currentTime && (
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 w-fit">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-[#45308D]" />
                                    <span>{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                                    <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Metrics Grid */}
                    <div className={`grid grid-cols-2 ${mounted && !canViewIncome() ? 'md:grid-cols-3 xl:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-4'} gap-3 md:gap-4`}>
                        <DashboardCard
                            title="Active Enrollment"
                            value={stats.totalStudents.toLocaleString()}
                            description="Enrolled Students"
                            icon={<Users className="w-5 h-5" />}
                            color="bg-[#45308D]"
                        />
                        <DashboardCard
                            title="Academic Faculty"
                            value={stats.totalTeachers.toLocaleString()}
                            description="Active Tutors"
                            icon={<UserCheck className="w-5 h-5" />}
                            color="bg-indigo-600"
                        />
                        <DashboardCard
                            title="Monthly Activity"
                            value={stats.classesThisMonth.toLocaleString()}
                            description="Completed Classes"
                            icon={<BookOpen className="w-5 h-5" />}
                            color="bg-teal-600"
                        />
                        {(!mounted || canViewIncome()) && (
                            <DashboardCard
                                title="Monthly Income"
                                value={typeof stats.monthlyRevenue === 'number' ? `₹${(stats.monthlyRevenue / 1000).toFixed(0)}k` : stats.monthlyRevenue}
                                description="Realized Revenue"
                                icon={<IndianRupee className="w-5 h-5" />}
                                color="bg-[#FDC70B]"
                                textColor="text-gray-900"
                                isFinancial
                            />
                        )}
                    </div>

                    {/* Operational Overview & Live Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Teaching Velocity Chart (2 cols) */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-50">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Teaching Velocity</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Dual-Period Delivery Output (Hours/Day)</p>
                                </div>

                                <div className="flex items-center gap-3 text-xs font-semibold">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#45308D]"></div>
                                        <span className="text-gray-600">Current Month</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                        <span className="text-gray-400">Previous</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-[240px] md:h-[260px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#45308D" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="#45308D" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis 
                                            dataKey="day" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                                            dy={6}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                borderRadius: '1rem', 
                                                border: '1px solid #f3f4f6', 
                                                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                padding: '0.75rem 1rem'
                                            }}
                                            itemStyle={{ padding: '1px 0' }}
                                            cursor={{ stroke: '#45308D', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="previous" 
                                            stroke="#e5e7eb" 
                                            strokeWidth={2}
                                            strokeDasharray="4 4"
                                            fill="transparent" 
                                            dot={false}
                                            activeDot={{ r: 3, fill: '#9ca3af' }}
                                            name="Previous Month"
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="current" 
                                            stroke="#45308D" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorCurrent)" 
                                            dot={{ r: 3, fill: '#45308D', strokeWidth: 1.5, stroke: '#fff' }}
                                            activeDot={{ r: 5 }}
                                            name="Current Month"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity Feed (1 col) */}
                        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Recent Sessions</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Live Classroom Logs</p>
                                    </div>
                                    <button 
                                        onClick={() => window.location.href = '/admin-dashboard/attendance'} 
                                        className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition"
                                        title="View All Attendance"
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                                    {stats.latestLogs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                                            <Clock className="w-8 h-8 mb-2 opacity-30" />
                                            <p className="text-xs font-bold uppercase tracking-wider">No recent logs recorded</p>
                                        </div>
                                    ) : (
                                        stats.latestLogs.map((log: any, idx: number) => (
                                            <div 
                                                key={log._id || idx} 
                                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-[#45308D]/10 text-[#45308D] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-1.5">
                                                        <h4 className="text-xs font-bold text-gray-900 truncate">
                                                            {log.studentId?.fullName || 'Student'}
                                                        </h4>
                                                        <span className="text-[10px] font-semibold text-gray-400 flex-shrink-0">
                                                            {new Date(log.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                                        <span className="text-[#45308D] font-medium">{log.subjectId?.subjectName || 'General'}</span>
                                                        <span className="text-gray-300 mx-1">•</span>
                                                        <span>{log.teacherId?.name || 'Tutor'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => window.location.href = '/admin-dashboard/attendance'} 
                                className="w-full mt-4 py-2.5 bg-gray-50 hover:bg-[#45308D] text-gray-600 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-gray-100 hover:border-transparent cursor-pointer"
                            >
                                <span>Full Attendance History</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function DashboardCard({ title, value, description, icon, color, textColor = "text-white", isFinancial }: any) {
    return (
        <div className={`${color} ${textColor} p-4 md:p-5 rounded-2xl shadow-sm relative group overflow-hidden transition-all duration-200 hover:-translate-y-1`}>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-all"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">{title}</span>
                    <div className="p-2 bg-white/15 rounded-xl backdrop-blur-xs flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none mb-1">{value}</h2>
                    <p className="text-[10px] font-semibold opacity-70 tracking-tight">{description}</p>
                </div>
            </div>
        </div>
    );
}
