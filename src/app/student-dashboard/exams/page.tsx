'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { Menu, FileText, Calendar, Trophy, Download } from 'lucide-react';
import Cookies from 'js-cookie';

export default function StudentExams() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [studentName, setStudentName] = useState('Student');

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setStudentName(user.name || 'Student');
            } catch (e) { }
        }
        api.get('/exams')
            .then(res => {
                setExams(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
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
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Exam Registry</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{studentName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-12 mt-20 lg:mt-0">
                    <div className="flex flex-col mb-10">
                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2 ml-1">Academic Credentials</p>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                            Exam <span className="text-primary">Performance</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-[2.5rem] p-8 h-80 border border-gray-100 animate-pulse flex items-center justify-center shadow-xl shadow-gray-200/20">
                                    <FileText className="w-16 h-16 text-gray-50 opacity-10" />
                                </div>
                            ))
                        ) : exams.length === 0 ? (
                            <div className="col-span-full bg-white rounded-[2.5rem] p-20 border border-gray-100 text-center shadow-xl shadow-gray-200/20">
                                <FileText className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                                <p className="text-gray-400 font-black italic uppercase tracking-widest text-xs">No examination certifications found in registry.</p>
                            </div>
                        ) : (
                            exams.map((exam) => {
                                const percentage = Math.round((exam.marks / exam.maxMarks) * 100);
                                return (
                                    <div key={exam._id} className="relative group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all hover:-translate-y-1 overflow-hidden">
                                        {/* Score Badge */}
                                        <div className="absolute top-0 right-0 p-8">
                                            <div className="w-16 h-16 rounded-2xl bg-primary flex flex-col items-center justify-center text-white shadow-xl shadow-primary/30">
                                                <span className="text-[9px] font-black leading-none opacity-60 mb-1">SCORE</span>
                                                <span className="text-xl font-black">{percentage}%</span>
                                            </div>
                                        </div>

                                        {/* Icon & Subject */}
                                        <div className="mb-8 relative z-10">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-6 shadow-lg shadow-gray-100/50">
                                                <Trophy className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-800 tracking-tighter uppercase leading-none italic mb-2">{exam.subject}</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{exam.examMonth} Assessment Portfolio</p>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px w-full bg-gray-50 mb-6"></div>

                                        {/* Marks Display */}
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Institutional Verified</span>
                                                <span className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
                                                    {exam.marks} <span className="text-sm font-bold text-gray-400 not-italic uppercase tracking-widest ml-1">/ {exam.maxMarks}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Links/Actions */}
                                        <div className="flex flex-col gap-4">
                                            {exam.paperImage && (
                                                <a
                                                    href={exam.paperImage}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-3 py-4 bg-secondary text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
                                                >
                                                    <Download className="w-4 h-4" /> Download Certificate Paper
                                                </a>
                                            )}

                                            {exam.progressNote && (
                                                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Mentorship Logic</p>
                                                    <p className="text-[11px] font-bold text-gray-700 italic leading-relaxed">
                                                        "{exam.progressNote}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
