'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, UserCheck, BookOpen, Settings, LogOut, FileText, IndianRupee } from 'lucide-react';
import Cookies from 'js-cookie';
import Link from 'next/link';
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
        <div className="flex flex-col w-64 h-screen bg-primary text-[#e5e5e5] shadow-lg border-r border-white/10">
            <div className="flex items-center justify-center h-20 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white tracking-widest">BrightPath</h1>
            </div>
            <div className="flex-1 px-4 py-8 space-y-2">
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
