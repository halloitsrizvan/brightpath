'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, UserCheck, BookOpen, Settings, LogOut, FileText, IndianRupee, Trophy, ListTodo, Receipt, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';

export default function Sidebar({ role }: { role: 'admin' | 'teacher' | 'student' }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        router.push('/');
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
                { name: 'Tasks & Targets', href: '/admin-dashboard/tasks', icon: <ListTodo className="w-5 h-5" /> },
            ];
        }
        if (role === 'teacher') {
            return [
                { name: 'Dashboard', href: '/teacher-dashboard', icon: <Home className="w-5 h-5" /> },
                { name: 'Attendance', href: '/teacher-dashboard/attendance', icon: <Settings className="w-5 h-5" /> },
                { name: 'Manage Exams', href: '/teacher-dashboard/exams', icon: <BookOpen className="w-5 h-5" /> },
                { name: 'Profile', href: '/teacher-dashboard/profile', icon: <Users className="w-5 h-5" /> },
            ];
        }
        return [
            { name: 'Dashboard', href: '/student-dashboard', icon: <Home className="w-5 h-5" /> },
            { name: 'Attendance', href: '/student-dashboard/attendance', icon: <Settings className="w-5 h-5" /> },
            { name: 'Exams', href: '/student-dashboard/exams', icon: <BookOpen className="w-5 h-5" /> },
            { name: 'Profile', href: '/student-dashboard/profile', icon: <Users className="w-5 h-5" /> },
        ];
    };

        if (!mounted) return null;

    return (
        <div className="flex flex-col w-64 h-screen bg-primary text-[#e5e5e5] shadow-2xl border-r border-white/5">
            <div className="p-4 pt-6 pb-2">
                <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.2)]  transition-all duration-500 cursor-default group border-4 border-white/10">
                    <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-500">
                        <NextImage src="/logo.png" alt="BrightPath Logo" width={40} height={40} className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-primary tracking-widest uppercase italic leading-none">BrightPath</h1>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">Admin Portal</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 py-4 space-y-2">
                {getLinks().map((link) => {
                    const isActive = link.href === pathname || (link.href !== `/${role}-dashboard` && pathname.startsWith(link.href));
                    return (
                        <Link key={link.name} href={link.href}>
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
    );
}
