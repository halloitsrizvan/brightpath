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
        <div className="flex flex-col gap-10 pb-10">
            {/* Top Main Progress Card */}
            <div className={`relative overflow-hidden transition-all duration-500 rounded-[2.5rem] p-8 sm:p-10 border-2 ${isUnlocked
                ? 'bg-gradient-to-br from-[#45308D] to-[#2a1d5a] border-[#45308D]/20 shadow-xl shadow-[#45308D]/20'
                : 'bg-white border-gray-100 shadow-sm hover:shadow-xl shadow-[#45308D]/5'}`}>

                {/* Background Ornaments */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FDC70B]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#45308D]/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isUnlocked ? 'bg-[#FDC70B]/20 text-[#FDC70B]' : 'bg-[#45308D]/10 text-[#45308D]'}`}>
                                {isUnlocked ? <Trophy className="w-7 h-7" /> : <Target className="w-7 h-7" />}
                            </div>
                            <div>
                                <h3 className={`text-2xl font-black tracking-tight ${isUnlocked ? 'text-white' : 'text-gray-800'}`}>
                                    Next Intelligence Milestone
                                </h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${isUnlocked ? 'text-white/60' : 'text-gray-400'}`}>
                                    Monthly Goal Tracker
                                </p>
                            </div>
                        </div>
                        {isUnlocked && <Sparkles className="w-8 h-8 text-[#FDC70B] animate-bounce" />}
                    </div>

                    {/* Progress Stats */}
                    <div className="space-y-5">
                        <div className="flex items-baseline justify-between mb-1">
                            <div className="flex items-baseline gap-3">
                                <span className={`text-6xl font-black italic tracking-tighter ${isUnlocked ? 'text-white' : 'text-[#45308D]'}`}>
                                    {data.totalHours}
                                </span>
                                <span className={`text-xl font-bold italic ${isUnlocked ? 'text-white/40' : 'text-gray-400'}`}>
                                    / {data.targetHours} hours
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-3xl font-black italic ${isUnlocked ? 'text-[#FDC70B]' : 'text-[#45308D]'}`}>
                                    {data.progress}%
                                </span>
                                <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>Completion Accuracy</span>
                            </div>
                        </div>

                        {/* Modern Progress Bar */}
                        <div className={`h-6 w-full rounded-full overflow-hidden p-1 ${isUnlocked ? 'bg-white/10' : 'bg-gray-100 border border-gray-200 shadow-inner'}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isUnlocked
                                    ? 'bg-gradient-to-r from-[#FDC70B] to-yellow-200'
                                    : 'bg-gradient-to-r from-[#45308D] to-[#FDC70B]'}`}
                                style={{ width: `${data.progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Milestone Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                        <div className={`px-6 py-4 rounded-2xl flex items-center gap-4 border ${isUnlocked ? 'bg-white/10 text-white border-white/10' : 'bg-gray-50 text-gray-700 border-gray-100'}`}>
                            <TrendingUp className={`w-6 h-6 ${isUnlocked ? 'text-[#FDC70B]' : 'text-[#45308D]'}`} />
                            <span className="text-base font-black italic">{getMotivationMessage(data.progress)}</span>
                        </div>

                        <div className={`px-8 py-4 rounded-[1.8rem] flex flex-col items-center border-2 shadow-xl transition-all hover:scale-105 active:scale-95 ${isUnlocked
                            ? 'bg-white text-[#45308D] border-[#FDC70B]'
                            : 'bg-[#45308D] text-white border-white/10'}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Tier Bonus</span>
                            <span className="text-3xl font-black italic tracking-tighter">₹{data.incentiveAmount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Milestones Roadmap UI */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 px-4">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Monthly Intelligence Roadmap</span>
                    <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm overflow-x-auto custom-scrollbar group/roadmap relative">
                    <div className="min-w-[800px] relative py-16">
                        {/* Background Path Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-100/50 -translate-y-1/2 rounded-full overflow-hidden">
                            {/* Filled Path Line based on actual hours progress */}
                            <div
                                className="h-full bg-gradient-to-r from-[#45308D] via-[#45308D] to-[#FDC70B] transition-all duration-1000 ease-in-out relative rounded-full"
                                style={{
                                    width: `${Math.min(100, (data.totalHours / (data.milestones[data.milestones.length - 1]?.targetHours || 1)) * 100)}%`
                                }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                {/* Glow tip */}
                                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-sm"></div>
                            </div>
                        </div>

                        {/* Nodes Container */}
                        <div className="relative flex justify-between items-center px-10">
                            {data.milestones.map((m, idx) => {
                                const isCurrentTarget = !m.isReached && (idx === 0 || data.milestones[idx - 1].isReached);

                                return (
                                    <div key={idx} className="flex flex-col items-center relative z-10 group/node">
                                        {/* Milestone Connection Circle */}
                                        <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700 shadow-lg relative ${m.isReached
                                            ? 'bg-white border-[#45308D] scale-110 shadow-[#45308D]/20 z-20'
                                            : isCurrentTarget
                                                ? 'bg-white border-[#FDC70B] scale-105 shadow-[#FDC70B]/20 z-20'
                                                : 'bg-white border-gray-100 group-hover/node:border-[#45308D]/30 group-hover/node:scale-105'}`}>

                                            <div className={`flex items-baseline gap-0.5 ${m.isReached ? 'text-[#45308D]' : isCurrentTarget ? 'text-[#FDC70B]' : 'text-gray-300 transition-colors group-hover/node:text-[#45308D]/60'}`}>
                                                <span className="text-3xl font-black italic tracking-tighter leading-none">{m.targetHours}</span>
                                                <span className="text-[10px] font-black uppercase tracking-tight">Hr</span>
                                            </div>

                                            {m.isReached ? (
                                                <div className="bg-green-500 rounded-full p-1.5 mt-2 animate-in zoom-in spin-in duration-700">
                                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                                </div>
                                            ) : isCurrentTarget ? (
                                                <div className="bg-[#FDC70B]/20 rounded-full p-1.5 mt-2 animate-pulse">
                                                    <Star className="w-5 h-5 text-[#FDC70B] fill-[#FDC70B]" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-1 bg-gray-100 rounded-full mt-3 group-hover/node:bg-[#45308D]/10 transition-colors"></div>
                                            )}

                                            {/* Pulse effect for current target */}
                                            {isCurrentTarget && (
                                                <div className="absolute inset-0 rounded-full border-4 border-[#FDC70B] animate-ping opacity-20"></div>
                                            )}
                                        </div>

                                        {/* Reward Detail Label */}
                                        <div className="absolute top-full mt-10 flex flex-col items-center gap-3 w-40">
                                            <div className="flex flex-col items-center text-center">
                                                <span className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 ${m.isReached ? 'text-[#45308D]/40' : isCurrentTarget ? 'text-[#FDC70B]/60' : 'text-gray-300'}`}>
                                                    TIER REWARD
                                                </span>
                                                <span className={`text-3xl font-black italic tracking-tighter transition-all duration-500 ${m.isReached ? 'text-[#45308D]' : isCurrentTarget ? 'text-gray-800' : 'text-gray-300'}`}>
                                                    ₹{m.incentiveAmount}
                                                </span>
                                            </div>

                                            {m.isReached ? (
                                                <div className="px-5 py-2 bg-green-500 text-white rounded-full text-[10px] font-black uppercase shadow-lg shadow-green-200 border border-green-400/20 animate-in fade-in slide-in-from-top-4 duration-1000">
                                                    Achieved
                                                </div>
                                            ) : isCurrentTarget ? (
                                                <div className="px-5 py-2 bg-[#FDC70B] text-[#45308D] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#FDC70B]/20 shadow-lg shadow-[#FDC70B]/20 animate-bounce">
                                                    Current Goal
                                                </div>
                                            ) : (
                                                <div className="px-5 py-2 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 group-hover/node:border-[#45308D]/10 transition-all">
                                                    Locked
                                                </div>
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
