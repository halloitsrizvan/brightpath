'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import Cookies from 'js-cookie';
import { BookOpen, Settings, Menu, TrendingUp, Calendar, Clock, GraduationCap, Users, UserCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
    const [stats, setStats] = useState({
        subjectsEnrolled: 0,
        teachers: [],
        attendanceSummary: 0,
        performanceData: [] as any[]
    });

    const [studentName, setStudentName] = useState('Student');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="flex bg-[#fafafa] min-h-screen font-sans overflow-x-hidden">
            <Sidebar role="student" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Fixed Header for Mobile */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Student Hub</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{studentName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-12 mt-20 lg:mt-0">
                    <div className="flex flex-col mb-10">
                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2 ml-1">Academic Performance Tracker</p>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                            Welcome Back, <span className="text-primary">{studentName.split(' ')[0]}</span>
                        </h1>
                    </div>

                    {/* Stats Grid - 3 cards in one line on mobile */}
                    <div className="grid grid-cols-3 gap-2 md:gap-6 mb-10">
                        <DashboardStatCard 
                            title="Modules"   // Shortened for mobile
                            value={stats.subjectsEnrolled} 
                            icon={<BookOpen className="w-4 h-4 md:w-5 md:h-5" />}
                            color="bg-violet-600"
                        />
                        <DashboardStatCard 
                            title="Tutors"    // Shortened for mobile
                            value={stats.teachers.length} 
                            icon={<UserCheck className="w-4 h-4 md:w-5 md:h-5" />}
                            color="bg-pink-600"
                        />
                        <DashboardStatCard 
                            title="Sessions"  // Shortened for mobile
                            value={stats.attendanceSummary} 
                            icon={<TrendingUp className="w-4 h-4 md:w-5 md:h-5" />}
                            color="bg-teal-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Performance Chart Component */}
                        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-violet-600"></div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                <div>
                                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-1">Learning Velocity</p>
                                    <h3 className="text-xl md:text-2xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">Daily Hours Insight</h3>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black uppercase text-gray-400 tracking-widest border border-gray-100">
                                    Current Month
                                </div>
                            </div>

                            <div className="w-full h-[250px] md:h-[300px] mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart 
                                        data={stats.performanceData.length > 0 ? stats.performanceData : [{day: 1, hours: 0}]}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#45308D" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#45308D" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="day" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 700 }}
                                            dy={5}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 700 }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                borderRadius: '1rem', 
                                                border: 'none', 
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                fontSize: '10px',
                                                fontWeight: 'bold'
                                            }}
                                            cursor={{ stroke: '#45308D', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="hours" 
                                            stroke="#45308D" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorHours)" 
                                            isAnimationActive={true}
                                            dot={{ r: 3, fill: '#45308D', strokeWidth: 1.5, stroke: '#fff' }}
                                            activeDot={{ r: 5, strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-[2.5rem] p-10 border border-secondary/10 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Settings className="w-48 h-48 rotate-12" />
                            </div>
                            
                            <div className="relative z-10">
                                <span className="px-4 py-2 bg-secondary/20 text-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Institutional Support</span>
                                <h3 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter mt-6 leading-none">Need Assistance?</h3>
                                <p className="text-gray-500 font-bold text-sm mt-4 leading-relaxed">
                                    Encountering challenges with your academic modules or scheduling? Our mentorship elite is ready to assist.
                                </p>
                            </div>

                            <a 
                                href="mailto:support@brightpath.com" 
                                className="relative z-10 w-full py-5 bg-white border border-secondary/20 text-secondary font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-secondary/5 hover:scale-[1.02] transition-all text-center flex items-center justify-center gap-2 group mt-8 sm:mt-0"
                            >
                                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                                Get Technical Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardStatCard({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) {
    return (
        <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 ${color} opacity-[0.03] rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16 group-hover:scale-110 transition-transform`}></div>
            <div className="flex flex-col md:flex-row items-center md:justify-between relative z-10 gap-2 md:gap-0">
                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center text-white ${color} shadow-lg shadow-gray-100/50`}>
                    <div className={`text-${color.split('-')[1]}-600`}>{icon}</div>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">{title}</p>
                    <h2 className="text-xl md:text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">{value}</h2>
                </div>
            </div>
        </div>
    );
}
