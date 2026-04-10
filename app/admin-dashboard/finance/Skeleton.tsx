'use client';

export function FinanceSkeleton() {
    return (
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-[#fafafa]">
            {/* Mobile Header Placeholder */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm h-[72px]">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl animate-pulse"></div>
                <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>

            <div className="p-4 md:p-12 mt-4">
                {/* Header Section Skeleton */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10 px-2 animate-pulse">
                    <div>
                        <div className="h-12 w-80 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-3 w-64 bg-gray-100 rounded-lg"></div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="h-12 w-full md:w-48 bg-gray-200 rounded-2xl"></div>
                        <div className="h-12 w-full md:w-80 bg-gray-100 rounded-2xl"></div>
                    </div>
                </div>

                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12 px-2 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 md:h-48 bg-white border border-gray-100 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm p-6 flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className="h-2 w-20 bg-gray-100 rounded"></div>
                                <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="h-3 w-40 bg-gray-100 rounded mt-auto"></div>
                        </div>
                    ))}
                </div>

                {/* Main Content Skeleton */}
                <div className="space-y-6 px-2 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm h-[72px] flex items-center justify-between px-8">
                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 bg-gray-100 rounded hidden sm:block"></div>
                                <div className="h-5 w-48 bg-gray-200 rounded-lg"></div>
                                <div className="w-20 h-5 bg-gray-100 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                                <div className="w-5 h-5 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Insight Skeleton */}
                <div className="mt-12 flex items-center gap-4 p-8 bg-gray-100/50 rounded-[2.5rem] border border-gray-100 mx-2 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-40 bg-gray-200 rounded"></div>
                        <div className="h-2 w-full bg-gray-200/50 rounded"></div>
                        <div className="h-2 w-3/4 bg-gray-200/50 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
