import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import { AdminService } from '@/lib/services/adminService';
import CacheService from '@/lib/services/cacheService';

export async function GET(req: NextRequest) {
    try {
        await checkAuth(req, ['admin']);
        
        const CACHE_KEY = 'admin_dashboard_stats';
        const cachedData = await CacheService.get(CACHE_KEY);
        
        if (cachedData) {
            return NextResponse.json(cachedData);
        }

        const stats = await AdminService.getDashboardStats();
        
        // Cache for 5 minutes
        await CacheService.set(CACHE_KEY, stats, 300);
        
        return NextResponse.json(stats);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
