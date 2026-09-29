'use client';

export function ReportsSkeleton() {
    return (
        <div className="flex-1 lg:ml-64 p-4 md:p-12 min-h-screen bg-[#fafafa]">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4 animate-pulse">
                <div>
                    <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                    <div className="h-10 w-72 bg-gray-200 rounded-2xl mb-2"></div>
                    <div className="h-4 w-96 bg-gray-100 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-11 w-44 bg-gray-200 rounded-2xl"></div>
                    <div className="h-11 w-32 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>

            {/* Prescriptive Action Center Skeleton */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-white shadow-xl shadow-slate-200/50 mb-8 animate-pulse">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gray-200"></div>
                        <div>
                            <div className="h-5 w-64 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 w-48 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    <div className="h-6 w-28 bg-gray-100 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                            <div className="flex justify-between">
                                <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-5 w-40 bg-gray-200 rounded"></div>
                            <div className="h-3 w-full bg-gray-100 rounded"></div>
                            <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Scorecard Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 animate-pulse">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
                            <div className="w-16 h-5 bg-gray-100 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-gray-100 rounded"></div>
                            <div className="h-7 w-32 bg-gray-200 rounded-lg"></div>
                            <div className="h-3 w-28 bg-gray-100 rounded"></div>
                        </div>
                        <div className="mt-4 pt-3.5 border-t border-gray-100 flex justify-between">
                            <div className="h-3 w-20 bg-gray-100 rounded"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visuals Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-6 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 h-[360px] animate-pulse">
                        <div className="h-5 w-56 bg-gray-200 rounded mb-4"></div>
                        <div className="h-[260px] bg-gray-50 rounded-2xl"></div>
                    </div>
                </div>
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-6 rounded-3xl border-2 border-white shadow-xl shadow-slate-200/50 h-[360px] animate-pulse">
                        <div className="h-5 w-44 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(j => (
                                <div key={j} className="h-12 bg-gray-50 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
