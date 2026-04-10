'use client';

export function ReportsSkeleton() {
    return (
        <div className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen bg-[#0A0A0B]">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-pulse">
                <div>
                    <div className="h-8 w-64 bg-gray-800 rounded-lg mb-2"></div>
                    <div className="h-4 w-48 bg-gray-800/50 rounded-lg"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-[200px] bg-gray-800 rounded-xl"></div>
                    <div className="h-10 w-10 bg-gray-800 rounded-xl"></div>
                </div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#161618] border border-gray-800 p-6 rounded-2xl animate-pulse">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 w-12 h-12 bg-gray-800 rounded-xl"></div>
                            <div className="w-16 h-5 bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-7 w-24 bg-gray-800 rounded-lg"></div>
                            <div className="h-4 w-32 bg-gray-800/50 rounded-lg"></div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                            <div className="h-3 w-20 bg-gray-800/50 rounded"></div>
                            <div className="h-3 w-12 bg-gray-800/50 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analysis Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Visuals */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Chart Skeleton */}
                    <div className="bg-[#161618] border border-gray-800 rounded-2xl p-6 animate-pulse">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="h-5 w-40 bg-gray-800 rounded-lg mb-2"></div>
                                <div className="h-3 w-56 bg-gray-800/50 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="h-[250px] w-full bg-gray-800/30 rounded-xl"></div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-[#161618] border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                        <div className="border-b border-gray-800 flex gap-4 px-6">
                            <div className="h-12 w-20 border-b-2 border-gray-800"></div>
                            <div className="h-12 w-20 bg-transparent"></div>
                            <div className="h-12 w-20 bg-transparent"></div>
                        </div>
                        <div className="p-6 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex justify-between items-center py-2">
                                    <div className="flex gap-4">
                                        <div className="h-4 w-24 bg-gray-800/50 rounded"></div>
                                        <div className="h-4 w-32 bg-gray-800 rounded"></div>
                                    </div>
                                    <div className="h-4 w-16 bg-gray-800/50 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Breakdown */}
                <div className="space-y-8">
                    <div className="bg-[#161618] border border-gray-800 rounded-2xl p-6 animate-pulse">
                        <div className="h-4 w-32 bg-gray-800 rounded mb-6"></div>
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-800"></div>
                                        <div className="space-y-1">
                                            <div className="h-3 w-20 bg-gray-800 rounded"></div>
                                            <div className="h-2 w-16 bg-gray-800/50 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-4 w-12 bg-gray-800 rounded"></div>
                                </div>
                            ))}
                            <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between">
                                <div className="h-5 w-20 bg-gray-800 rounded"></div>
                                <div className="h-5 w-24 bg-gray-800 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-800 rounded-2xl p-6 h-48 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
