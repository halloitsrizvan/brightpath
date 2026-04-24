'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, UserCheck, BookOpen, Settings, LogOut, FileText, IndianRupee, Trophy, ListTodo, Receipt, ShieldCheck, TrendingUp, BarChart3, CheckCircle, User } from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';

export default function Sidebar({ role, isOpen, onClose }: { role: 'admin' | 'teacher' | 'student', isOpen?: boolean, onClose?: () => void }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleLogout = async () => {
        try {
            // Call the server-side logout to clear httpOnly cookies
            // Using direct fetch to avoid any interceptor interference
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error('Logout failed:', e);
        }

        // Clear local cookies
        Cookies.remove('token', { path: '/' });
        Cookies.remove('user', { path: '/' });
        
        const loginMap: Record<string, string> = {
            admin: '/admin',
            teacher: '/teacher',
            student: '/student'
        };
        
        // Hard redirect to clear all states and trigger middleware
        window.location.href = loginMap[role] || '/';
    };

    const getLinks = () => {
        if (role === 'admin') {
            return [
                { name: 'Dashboard', href: '/admin-dashboard', icon: <Home className="w-5 h-5" /> },
                { name: 'Students', href: '/admin-dashboard/students', icon: <Users className="w-5 h-5" /> },
                { name: 'Teachers', href: '/admin-dashboard/teachers', icon: <UserCheck className="w-5 h-5" /> },
                { name: 'Subjects', href: '/admin-dashboard/subjects', icon: <BookOpen className="w-5 h-5" /> },
                { name: 'Attendance', href: '/admin-dashboard/attendance', icon: <Settings className="w-5 h-5" /> },
                { name: 'Exams', href: '/admin-dashboard/exams', icon: <FileText className="w-5 h-5" /> },
                { name: 'Finance', href: '/admin-dashboard/finance', icon: <IndianRupee className="w-5 h-5" /> },
                { name: 'Expenses', href: '/admin-dashboard/expenses', icon: <Receipt className="w-5 h-5" /> },
                { name: 'Founders', href: '/admin-dashboard/founders', icon: <ShieldCheck className="w-5 h-5" /> },
                { name: 'Incentives', href: '/admin-dashboard/incentives', icon: <Trophy className="w-5 h-5" /> },
                {name: 'Tasks & Targets', href: '/admin-dashboard/tasks', icon: <ListTodo className="w-5 h-5" /> },
                { name: 'Leads & Enquiries', href: '/admin-dashboard/leads', icon: <TrendingUp className="w-5 h-5" /> },
                { name: 'Blog Management', href: '/admin-dashboard/blog', icon: <BookOpen className="w-5 h-5" /> },
                { name: 'Monthly Report', href: '/admin-dashboard/reports', icon: <BarChart3 className="w-5 h-5" /> },
            ];
        }
        if (role === 'teacher') {
            return [
                { name: 'Dashboard', href: '/teacher-dashboard', icon: <Home className="w-5 h-5" /> },
                { name: 'Attendance', href: '/teacher-dashboard/attendance', icon: <CheckCircle className="w-5 h-5" /> },
                { name: 'Manage Exams', href: '/teacher-dashboard/exams', icon: <BookOpen className="w-5 h-5" /> },
                { name: 'Analysis', href: '/teacher-dashboard/analysis', icon: <BarChart3 className="w-5 h-5" /> },
                { name: 'Profile', href: '/teacher-dashboard/profile', icon: <User className="w-5 h-5" /> },
            ];
        }
        return [
            { name: 'Dashboard', href: '/student-dashboard', icon: <Home className="w-5 h-5" /> },
            { name: 'Attendance', href: '/student-dashboard/attendance', icon: <CheckCircle className="w-5 h-5" /> },
            { name: 'Exams', href: '/student-dashboard/exams', icon: <BookOpen className="w-5 h-5" /> },
            { name: 'Performance', href: '/student-dashboard/performance', icon: <TrendingUp className="w-5 h-5" /> },
            { name: 'Profile', href: '/student-dashboard/profile', icon: <User className="w-5 h-5" /> },
        ];
    };

    if (!mounted) return null;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed top-0 left-0 h-full w-64 bg-primary text-[#e5e5e5] shadow-2xl border-r border-white/5 z-50 transition-transform duration-300 transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
            `}>
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-4 group cursor-default">
                        <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl shadow-black/20 group-hover:scale-105 transition-transform">
                            <NextImage src="/logo.png" alt="BrightPath Logo" width={32} height={32} className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-base font-black text-white tracking-widest uppercase italic leading-none">BrightPath</h1>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 opacity-60 italic">{role} Portal</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {getLinks().map((link) => {
                        const isActive = link.href === pathname || (link.href !== `/${role}-dashboard` && pathname.startsWith(link.href));
                        return (
                            <Link key={link.name} href={link.href} onClick={onClose}>
                                <span className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive ? 'bg-secondary text-primary font-bold shadow-md' : 'hover:bg-white/10 hover:text-white'}`}>
                                    {link.icon}
                                    <span className="font-medium">{link.name}</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-[#ff4c4c] hover:bg-[#ff4c4c1a] rounded-lg w-full transition-all duration-200">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
