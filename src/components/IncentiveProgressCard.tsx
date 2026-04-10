'use client';
import { useEffect, useState } from 'react';
import { Target, Trophy, TrendingUp, CheckCircle2, Loader2, Sparkles, ChevronRight, Star } from 'lucide-react';
import api from '../utils/api';

interface Milestone {
    targetHours: number;
    incentiveAmount: number;
    isReached: boolean;
}

interface IncentiveData {
    totalHours: number;
    targetHours: number;
    progress: number;
    incentiveAmount: number;
    incentiveUnlocked: boolean;
    hoursRemaining: number;
    totalEarnedIncentive: number;
    milestones: Milestone[];
    notEligible?: boolean;
}

export default function IncentiveProgressCard({ teacherId }: { teacherId?: string }) {
    const [data, setData] = useState<IncentiveData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchIncentive();
    }, [teacherId]);

    const fetchIncentive = async () => {
        try {
            const url = teacherId ? `/teacher/incentive-progress?teacherId=${teacherId}` : '/teacher/incentive-progress';
            const res = await api.get(url);
            setData(res.data);
        } catch (error) {
            console.error('Failed to fetch incentive progress', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex items-center justify-center min-h-[250px]">
                <Loader2 className="w-8 h-8 text-[#45308D] animate-spin" />
            </div>
        );
    }

    if (!data || data.notEligible) return null;

    const getMotivationMessage = (progress: number) => {
        if (progress >= 100) return "Milestone achieved!";
        if (progress >= 70) return "Almost there!";
        if (progress >= 40) return "Great progress!";
        return "Keep teaching to unlock rewards!";
    };

    const isUnlocked = data.incentiveUnlocked;

    return (
        <div className="flex flex-col gap-6 sm:gap-10 pb-10">
            {/* Simple Mobile-First Milestone Header */}
            <div className={`relative overflow-hidden transition-all duration-500 rounded-[2.5rem] p-6 sm:p-10 border-2 ${isUnlocked
                ? 'bg-[#45308D] border-[#45308D]/20 shadow-xl shadow-[#45308D]/20'
                : 'bg-white border-gray-100 shadow-sm'}`}>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all ${isUnlocked ? 'bg-[#FDC70B] text-[#45308D]' : 'bg-[#45308D]/10 text-[#45308D]'}`}>
                            {isUnlocked ? <Trophy className="w-6 h-6 sm:w-8 sm:h-8" /> : <Target className="w-6 h-6 sm:w-8 sm:h-8" />}
                        </div>
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${isUnlocked ? 'text-white/60' : 'text-gray-400'}`}>
                                {isUnlocked ? 'Excellent Work!' : 'Next Incentive Milestone'}
                            </p>
                            <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isUnlocked ? 'text-white' : 'text-gray-800'} mb-3`}>
                                {getMotivationMessage(data.progress)}
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className={`flex items-baseline gap-1.5 px-4 py-2 rounded-2xl border-2 transition-all ${isUnlocked
                                    ? 'bg-white/10 border-[#FDC70B] text-white shadow-lg shadow-[#FDC70B]/10'
                                    : 'bg-[#45308D]/5 border-[#45308D]/10 text-[#45308D]'}`}>
                                    <span className="text-3xl font-black italic leading-none">{data.totalHours}</span>
                                    <span className="text-[10px] font-black uppercase opacity-60">Hrs</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-white/60' : 'text-gray-400'}`}>
                                        Target: {data.targetHours}h
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-[#FDC70B]' : 'text-[#45308D]'}`}>
                                        {data.progress}% Accuracy
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                        <div className="flex flex-col">
                            <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isUnlocked ? 'text-white/60' : 'text-gray-400'}`}>Bonus</span>
                            <span className={`text-3xl sm:text-4xl font-black italic tracking-tighter ${isUnlocked ? 'text-[#FDC70B]' : 'text-[#45308D]'}`}>
                                ₹{data.incentiveAmount}
                            </span>
                        </div>

                        <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 flex items-center justify-center group-hover:scale-110 transition-transform ${isUnlocked ? 'border-[#FDC70B] bg-[#FDC70B]/10' : 'border-gray-100 bg-gray-50'}`}>
                            {isUnlocked ? (
                                <Sparkles className="w-6 h-6 text-[#FDC70B] animate-pulse" />
                            ) : (
                                <TrendingUp className="w-6 h-6 text-[#45308D]" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Slim Integrated Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-out ${isUnlocked ? 'bg-[#FDC70B]' : 'bg-[#45308D]'}`}
                        style={{ width: `${data.progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>

            {/* All Milestones Roadmap UI */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 px-4">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Monthly Incentive Roadmap</span>
                    <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                <div className="bg-white rounded-[3rem] p-6 md:p-10 border border-gray-100 shadow-sm group/roadmap relative">
                    <div className="relative py-8">
                        {/* Background Path Line - Larger and clearer */}
                        <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-100/80 -translate-y-1/2 rounded-full overflow-hidden">
                            {/* Filled Path Line based on progress */}
                            <div
                                className="h-full bg-gradient-to-r from-[#45308D] to-[#FDC70B] transition-all duration-1000 ease-in-out relative rounded-full"
                                style={{
                                    width: `${Math.min(100, (data.totalHours / (data.milestones[data.milestones.length - 1]?.targetHours || 1)) * 100)}%`
                                }}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>

                        {/* Nodes Container - Space evenly without fixed width */}
                        <div className="relative flex justify-between items-center px-4">
                            {data.milestones.map((m, idx) => {
                                const isCurrentTarget = !m.isReached && (idx === 0 || data.milestones[idx - 1].isReached);

                                return (
                                    <div key={idx} className="flex flex-col items-center relative z-10">
                                        {/* Milestone Dot */}
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 shadow-md ${m.isReached
                                            ? 'bg-[#45308D] border-[#45308D] scale-110'
                                            : isCurrentTarget
                                                ? 'bg-white border-[#FDC70B] scale-125 shadow-[#FDC70B]/30'
                                                : 'bg-white border-gray-200'}`}>

                                            <div className={`flex flex-col items-center leading-none ${m.isReached ? 'text-white' : isCurrentTarget ? 'text-[#FDC70B]' : 'text-gray-300'}`}>
                                                <span className="text-xl sm:text-2xl font-black italic">{m.targetHours}</span>
                                                <span className="text-[8px] font-black uppercase">Hr</span>
                                            </div>

                                            {m.isReached && (
                                                <CheckCircle2 className="w-4 h-4 text-[#FDC70B] mt-0.5" />
                                            )}
                                        </div>

                                        {/* Simplified Reward Labels */}
                                        <div className="absolute top-full mt-6 flex flex-col items-center">
                                            <span className={`text-lg sm:text-xl font-black italic tracking-tighter transition-all duration-500 ${m.isReached ? 'text-[#45308D]' : isCurrentTarget ? 'text-gray-800' : 'text-gray-300'}`}>
                                                ₹{m.incentiveAmount}
                                            </span>
                                            {isCurrentTarget && (
                                                <span className="text-[8px] font-black text-[#FDC70B] uppercase tracking-tighter animate-pulse">Next Goal</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}</style>
        </div>
    );
}
