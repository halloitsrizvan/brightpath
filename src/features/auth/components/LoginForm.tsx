'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/utils/api';
import { ShieldCheck, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm({ role, roleTitle }: { role: 'admin' | 'teacher' | 'student', roleTitle: string }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password, role });

            Cookies.set('token', data.token);
            Cookies.set('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') router.push('/admin-dashboard');
            else if (data.user.role === 'teacher') router.push('/teacher-dashboard');
            else router.push('/student-dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication credentials rejected.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/4 -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32 -z-10" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-8 hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft className="w-4 h-4" /> Back to Official Portal
                </Link>
                
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 rotate-3">
                        B
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-gray-900 leading-none uppercase">Brightpath</span>
                        <span className="text-[10px] font-bold text-primary tracking-[0.3em] leading-none mt-1 uppercase">Kerala</span>
                    </div>
                </div>
                <h2 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
                    Security <span className="text-primary">Gateway</span>
                </h2>
                <p className="mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Authorized {roleTitle} Access Only
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white py-12 px-8 shadow-2xl shadow-primary/5 rounded-[2.5rem] border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
                    
                    <form className="space-y-8" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Identifier</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Key / Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-gray-900 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl border border-red-100 animate-in fade-in zoom-in-95">
                                <ShieldCheck className="w-4 h-4 text-red-500" />
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Validating Session...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4" />
                                    Initiate Security Login
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] italic px-8 leading-relaxed">
                    By accessing this terminal, you agree to our strictly audited academic privacy protocols.
                </p>
            </div>
        </div>
    );
}
