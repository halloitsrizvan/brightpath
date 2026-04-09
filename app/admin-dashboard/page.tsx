'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Users, UserCheck, BookOpen, GraduationCap, IndianRupee, TrendingUp, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        classesThisMonth: 0,
        monthlyRevenue: 0,
        hoursPerDay: [] as { day: number, hours: number }[]
    });
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        api.get('/dashboard/admin').then(res => setStats(res.data)).catch(console.error);
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
        <div className="flex bg-[#fafafa] min-h-screen font-sans">
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="p-8 md:p-12 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-[#45308D] font-black text-[10px] uppercase tracking-[0.4em] mb-2 ml-1">Executive Command Center</p>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                                {greetings()}, <span className="text-[#45308D]">Admin</span>
                            </h1>
                            <p className="text-gray-400 font-bold text-sm mt-3 flex items-center gap-2">
                                {currentTime && (
                                    <>
                                        <Calendar className="w-4 h-4" /> {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <Clock className="w-4 h-4" /> {currentTime.toLocaleTimeString()}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="p-8 md:p-12 pt-4 flex-1 space-y-10">
                    {/* Performance Summary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        <DashboardCard
                            title="Active Enrollment"
                            value={stats.totalStudents}
                            description="Students registered"
                            icon={<Users className="w-6 h-6" />}
                            color="bg-[#45308D]"
                        />
                        <DashboardCard
                            title="Academic Staff"
                            value={stats.totalTeachers}
                            description="Active Tutors"
                            icon={<UserCheck className="w-6 h-6" />}
                            color="bg-indigo-600"
                        />
                        <DashboardCard
                            title="Monthly Activity"
                            value={stats.classesThisMonth}
                            description="Classes this month"
                            icon={<BookOpen className="w-6 h-6" />}
                            color="bg-teal-600"
                        />
                        <DashboardCard
                            title="Monthly Income"
                            value={`₹${stats.monthlyRevenue.toLocaleString()}`}
                            description="Current period yield"
                            icon={<IndianRupee className="w-6 h-6" />}
                            color="bg-[#FDC70B]"
                            textColor="text-gray-900"
                            isFinancial
                        />
                    </div>

                    {/* Operational Overview Placeholder Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group min-h-[450px] flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#45308D] to-indigo-600"></div>
                            
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[#45308D] font-black text-[10px] uppercase tracking-[0.4em] mb-1">Operational Velocity</p>
                                    <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter">Strategic Insights</h3>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-gray-400 tracking-widest border border-gray-100">Monthly View</div>
                                </div>
                            </div>

                            <div className="flex-1 w-full h-[300px] mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.hoursPerDay}>
                                        <defs>
                                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#45308D" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#45308D" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="day" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                borderRadius: '1rem', 
                                                border: 'none', 
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                            itemStyle={{ color: '#45308D' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="hours" 
                                            stroke="#45308D" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorHours)" 
                                            dot={{ r: 4, fill: '#45308D', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Aggregate Teaching Hours / Day</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase text-teal-600 tracking-widest">Real-time Analytics</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#45308D] rounded-[3rem] p-12 text-white shadow-2xl shadow-[#45308D]/20 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <GraduationCap className="w-12 h-12 mb-6" />
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Institutional Health</h3>
                                <p className="text-white/60 font-medium text-sm leading-relaxed mb-8">
                                    All academic modules are currently operational. Average student attendance is tracking at 94% retention.
                                </p>
                            </div>
                            <button className="bg-white text-[#45308D] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2">
                                View Full Audit <ArrowUpRight className="w-4 h-4" />
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
        <div className={`${color} ${textColor} p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 relative group overflow-hidden transition-all hover:-translate-y-2`}>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                        {icon}
                    </div>
                    {isFinancial && <TrendingUp className="w-5 h-5 opacity-40" />}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">{title}</p>
                <div className="flex items-end gap-2">
                    <h2 className="text-4xl font-black italic tracking-tighter leading-none">{value}</h2>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-40">{description}</p>
            </div>
        </div>
    );
}
