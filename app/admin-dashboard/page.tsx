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
        hoursPerDay: [] as any[],
        velocityData: [] as any[],
        latestLogs: [] as any[]
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
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#45308D]"></div>
                                        <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Target Month</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Previous Cycle</span>
                                    </div>
                                    <div className="px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-gray-400 tracking-widest border border-gray-100">Comparative View</div>
                                </div>
                            </div>

                            <div className="flex-1 w-full h-[300px] mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.velocityData}>
                                        <defs>
                                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#45308D" stopOpacity={0.2} />
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
                                                borderRadius: '1.5rem', 
                                                border: 'none', 
                                                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                padding: '1.25rem'
                                            }}
                                            itemStyle={{ padding: '2px 0' }}
                                            cursor={{ stroke: '#45308D', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        {/* PREVIOUS MONTH LINE */}
                                        <Area 
                                            type="monotone" 
                                            dataKey="previous" 
                                            stroke="#e5e7eb" 
                                            strokeWidth={3}
                                            strokeDasharray="5 5"
                                            fill="transparent" 
                                            dot={false}
                                            activeDot={{ r: 4, fill: '#e5e7eb', strokeWidth: 0 }}
                                            name="Previous Month"
                                        />
                                        {/* CURRENT MONTH LINE */}
                                        <Area 
                                            type="monotone" 
                                            dataKey="current" 
                                            stroke="#45308D" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorCurrent)" 
                                            dot={{ r: 4, fill: '#45308D', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                            name="Current Month"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Dual-Period Teaching Velocity (Hours/Day)</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase text-teal-600 tracking-widest">Deep Analytical Sync</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group flex flex-col">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-[#45308D] font-black text-[10px] uppercase tracking-[0.4em] mb-1">Live Feed</p>
                                    <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter">Activity Ledger</h3>
                                </div>
                                <button onClick={() => window.location.href='/admin-dashboard/attendance'} className="p-3 bg-gray-50 rounded-2xl hover:bg-primary/5 hover:text-primary transition group/btn">
                                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-4">
                                {stats.latestLogs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-300 py-10">
                                        <Clock className="w-12 h-12 mb-4 opacity-20" />
                                        <p className="text-xs font-black uppercase tracking-widest">No recent sessions</p>
                                    </div>
                                ) : (
                                    stats.latestLogs.map((log: any, idx: number) => (
                                        <div key={log._id} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group/item">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black italic shadow-inner">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 overflow-hidden">
                                                    <h4 className="text-sm font-black text-gray-800 truncate tracking-tight">{log.studentId?.fullName}</h4>
                                                    <span className="text-[9px] font-black text-gray-400 whitespace-nowrap uppercase tracking-widest">{new Date(log.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 mt-0.5 uppercase tracking-widest">
                                                    <span className="text-primary/60">{log.subjectId?.subjectName}</span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                    <span>with {log.teacherId?.name}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <div className="mt-8">
                                <button onClick={() => window.location.href='/admin-dashboard/attendance'} className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-[#45308D] hover:text-white transition-all shadow-sm">
                                    Analyze Complete History
                                </button>
                            </div>
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
