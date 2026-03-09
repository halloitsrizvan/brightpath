'use client';
import { useEffect, useState } from 'react';
import { Target, Trophy, TrendingUp, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import api from '../utils/api';

interface IncentiveData {
    totalHours: number;
    targetHours: number;
    progress: number;
    incentiveAmount: number;
    incentiveUnlocked: boolean;
    hoursRemaining: number;
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

    if (!data) return null;

    const getMotivationMessage = (progress: number) => {
        if (progress >= 100) return "Incentive unlocked!";
        if (progress >= 70) return "Almost there!";
        if (progress >= 40) return "Great progress!";
        return "Let's get started!";
    };

    const isUnlocked = data.incentiveUnlocked;

    return (
        <div className={`relative overflow-hidden transition-all duration-500 rounded-[2.5rem] p-8 border-2 ${isUnlocked
            ? 'bg-gradient-to-br from-[#198754] to-[#146c43] border-[#198754]/20 shadow-xl shadow-green-500/20'
            : 'bg-white border-gray-100 shadow-sm hover:shadow-xl shadow-[#45308D]/5'}`}>

            {/* Background Ornaments */}
            {isUnlocked ? (
                <>
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                </>
            ) : (
                <>
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#45308D]/5 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#FDC70B]/5 rounded-full blur-3xl"></div>
                </>
            )}

            <div className="relative z-10 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isUnlocked ? 'bg-white/20 text-white' : 'bg-[#45308D]/10 text-[#45308D]'}`}>
                            {isUnlocked ? <Trophy className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className={`text-xl font-black tracking-tight ${isUnlocked ? 'text-white' : 'text-gray-800'}`}>
                                Monthly Incentive Progress
                            </h3>
                            <p className={`text-xs font-bold uppercase tracking-widest ${isUnlocked ? 'text-white/60' : 'text-gray-400'}`}>
                                Target based rewards
                            </p>
                        </div>
                    </div>
                    {isUnlocked && <Sparkles className="w-6 h-6 text-[#FDC70B] animate-bounce" />}
                </div>

                {/* Progress Stats */}
                <div className="space-y-2">
                    <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black italic ${isUnlocked ? 'text-white' : 'text-[#45308D]'}`}>
                                {data.totalHours}
                            </span>
                            <span className={`text-lg font-bold italic ${isUnlocked ? 'text-white/40' : 'text-gray-400'}`}>
                                / {data.targetHours} hours completed
                            </span>
                        </div>
                        <span className={`text-2xl font-black italic ${isUnlocked ? 'text-[#FDC70B]' : 'text-gray-800'}`}>
                            {data.progress}%
                        </span>
                    </div>

                    {/* Modern Progress Bar */}
                    <div className={`h-4 w-full rounded-full overflow-hidden p-1 ${isUnlocked ? 'bg-white/10' : 'bg-gray-100 border border-gray-200 shadow-inner'}`}>
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isUnlocked
                                ? 'bg-gradient-to-r from-[#FDC70B] to-white'
                                : 'bg-gradient-to-r from-[#45308D] to-[#FDC70B]'}`}
                            style={{ width: `${data.progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                        </div>
                    </div>
                </div>

                {/* Footer Message & Reward */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-2">
                        {isUnlocked ? (
                            <div className="flex flex-col">
                                <span className="text-white font-black text-lg flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" /> 🎉 Incentive Unlocked!
                                </span>
                                <p className="text-white/70 text-sm font-medium">You earned ₹{data.incentiveAmount} incentive this month!</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#45308D]" />
                                <span className="text-sm font-black text-gray-700">{getMotivationMessage(data.progress)}</span>
                            </div>
                        )}
                    </div>

                    <div className={`px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[140px] border-2 shadow-lg transition-transform hover:scale-105 ${isUnlocked
                        ? 'bg-white text-[#198754] border-white/50'
                        : 'bg-[#45308D] text-white border-[#45308D]/20 shadow-[#45308D]/20'}`}>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isUnlocked ? 'text-[#198754]/60' : 'text-white/60'}`}>Reward Amount</span>
                        <span className="text-2xl font-black italic">₹{data.incentiveAmount}</span>
                    </div>
                </div>
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
