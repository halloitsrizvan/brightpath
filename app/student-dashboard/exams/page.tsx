
'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { FileText, Calendar, Trophy, Download } from 'lucide-react';

export default function StudentExams() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        <div className="flex bg-gray-50 min-h-screen">
            <div className="fixed z-50 h-full">
                <Sidebar role="student" />
            </div>
            <div className="flex-1 lg:ml-64 p-8">
                <div className="mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Academic Performance</h1>
                    <p className="text-gray-500 font-medium tracking-wide">Review your exam history and scored marks</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-[2rem] p-6 h-64 border border-gray-100 animate-pulse flex items-center justify-center">
                                <FileText className="w-12 h-12 text-gray-100" />
                            </div>
                        ))
                    ) : exams.length === 0 ? (
                        <div className="col-span-full bg-white rounded-[2rem] p-12 border border-gray-100 text-center">
                            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-bold italic">No exam records found yet.</p>
                        </div>
                    ) : (
                        exams.map((exam) => {
                            const percentage = Math.round((exam.marks / exam.maxMarks) * 100);
                            return (
                                <div key={exam._id} className="relative group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all hover:-translate-y-1 overflow-hidden">
                                    {/* Score Badge */}
                                    <div className="absolute top-0 right-0 p-6">
                                        <div className="w-14 h-14 rounded-2xl bg-primary flex flex-col items-center justify-center text-white shadow-lg shadow-primary/30">
                                            <span className="text-xs font-black leading-none opacity-60">SCORE</span>
                                            <span className="text-lg font-black">{percentage}%</span>
                                        </div>
                                    </div>

                                    {/* Icon & Subject */}
                                    <div className="mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-tight">{exam.subject}</h3>
                                        <p className="text-xs font-black text-gray-400 mt-1 uppercase tracking-[0.15em]">{exam.examMonth} Evaluation</p>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-gray-50 mb-4"></div>

                                    {/* Marks Display */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-300 uppercase letter tracking-widest">Achieved</span>
                                            <span className="text-2xl font-black text-gray-800 italic">{exam.marks} <span className="text-xs font-bold text-gray-400 not-italic">/ {exam.maxMarks}</span></span>
                                        </div>
                                    </div>

                                    {/* Links/Actions */}
                                    <div className="flex items-center gap-3 pt-2">
                                        {exam.paperImage && (
                                            <a
                                                href={exam.paperImage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary/80 transition-all"
                                            >
                                                <Download className="w-3.5 h-3.5" /> View Paper
                                            </a>
                                        )}
                                    </div>

                                    {/* Progress Note Popover (Subtle) */}
                                    {exam.progressNote && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[11px] font-bold text-gray-500 italic leading-relaxed">
                                                "{exam.progressNote}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
