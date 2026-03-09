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

export default function IncentiveProgressCard() {
    const [data, setData] = useState<IncentiveData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchIncentive();
    }, []);

    const fetchIncentive = async () => {
        try {
            const res = await api.get('/teacher/incentive-progress');
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
        <div className="flex flex-col gap-6">
            <div className={`relative overflow-hidden transition-all duration-500 rounded-[2.5rem] p-8 border-2 ${isUnlocked
                ? 'bg-gradient-to-br from-[#45308D] to-[#2a1d5a] border-[#45308D]/20 shadow-xl shadow-[#45308D]/20'
                : 'bg-white border-gray-100 shadow-sm hover:shadow-xl shadow-[#45308D]/5'}`}>

                {/* Background Ornaments */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FDC70B]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#45308D]/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isUnlocked ? 'bg-[#FDC70B]/20 text-[#FDC70B]' : 'bg-[#45308D]/10 text-[#45308D]'}`}>
                                {isUnlocked ? <Trophy className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className={`text-xl font-black tracking-tight ${isUnlocked ? 'text-white' : 'text-gray-800'}`}>
                                    Next Intelligence Milestone
                                </h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${isUnlocked ? 'text-white/60' : 'text-gray-400'}`}>
                                    Current Tier Progress
                                </p>
                            </div>
                        </div>
                        {isUnlocked && <Sparkles className="w-6 h-6 text-[#FDC70B] animate-bounce" />}
                    </div>

                    {/* Progress Stats */}
                    <div className="space-y-4">
                        <div className="flex items-baseline justify-between mb-1">
                            <div className="flex items-baseline gap-2">
                                <span className={`text-5xl font-black italic tracking-tighter ${isUnlocked ? 'text-white' : 'text-[#45308D]'}`}>
                                    {data.totalHours}
                                </span>
                                <span className={`text-lg font-bold italic ${isUnlocked ? 'text-white/40' : 'text-gray-400'}`}>
                                    / {data.targetHours} hours
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-2xl font-black italic ${isUnlocked ? 'text-[#FDC70B]' : 'text-[#45308D]'}`}>
                                    {data.progress}%
                                </span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-white/40' : 'text-gray-400'}`}>Accuracy Rate</span>
                            </div>
                        </div>

                        {/* Modern Progress Bar */}
                        <div className={`h-5 w-full rounded-full overflow-hidden p-1 ${isUnlocked ? 'bg-white/10' : 'bg-gray-100 border border-gray-200 shadow-inner'}`}>
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
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                        <div className={`px-5 py-3 rounded-2xl flex items-center gap-3 ${isUnlocked ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-700'}`}>
                            <TrendingUp className={`w-5 h-5 ${isUnlocked ? 'text-[#FDC70B]' : 'text-[#45308D]'}`} />
                            <span className="text-sm font-black">{getMotivationMessage(data.progress)}</span>
                        </div>

                        <div className={`px-6 py-3 rounded-[1.5rem] flex flex-col items-center border-2 transition-transform hover:scale-105 ${isUnlocked
                            ? 'bg-white text-[#45308D] border-[#FDC70B]'
                            : 'bg-[#45308D] text-white border-white/10'}`}>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Tier Reward</span>
                            <span className="text-xl font-black italic">₹{data.incentiveAmount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Milestones List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.milestones.map((m, idx) => (
                    <div key={idx} className={`p-6 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${m.isReached
                        ? 'bg-white border-green-100 shadow-md'
                        : 'bg-gray-50 border-transparent opacity-70 hover:opacity-100 hover:bg-white hover:border-[#45308D]/10'}`}>

                        {m.isReached && (
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-2 mr-2" />
                            </div>
                        )}

                        <div className="flex flex-col gap-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.isReached ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-400 group-hover:bg-[#45308D]/10 group-hover:text-[#45308D]'}`}>
                                    <Star className="w-5 h-5" fill={m.isReached ? "currentColor" : "none"} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${m.isReached ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {m.isReached ? 'Achieved' : 'Locked'}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-lg font-black text-gray-800 leading-tight">{m.targetHours} Hours</h4>
                                <p className="text-sm font-bold text-[#45308D]">Reward: ₹{m.incentiveAmount}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
