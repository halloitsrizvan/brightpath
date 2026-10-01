'use client';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

interface AccessDeniedProps {
    roleName?: string;
    pageName?: string;
}

export default function AccessDenied({ roleName = 'Current Role', pageName = 'this section' }: AccessDeniedProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[65vh] p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-6 shadow-xl shadow-rose-500/10">
                <ShieldAlert className="w-10 h-10" />
            </div>

            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 mb-4">
                Access Restricted • {roleName}
            </span>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">
                Permission Denied
            </h2>

            <p className="text-xs md:text-sm font-medium text-gray-500 max-w-md mb-8 leading-relaxed">
                Your assigned role <strong className="text-gray-800">({roleName})</strong> does not have authorization to access {pageName}. Please contact a Super Admin if you require access.
            </p>

            <Link
                href="/admin-dashboard"
                className="px-6 py-3.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 italic"
            >
                <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </Link>
        </div>
    );
}
