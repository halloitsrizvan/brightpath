import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { AdminService } from '@/lib/services/adminService';
import CacheService from '@/lib/services/cacheService';

export async function GET(req: NextRequest) {
    try {
        const user = await checkAuth(req, ['admin']);
        // Roles marked "exclude income" must not receive revenue figures, not just have them hidden in the UI
        const hideIncome = !user.isSuperAdmin && user.permissions?.dashboard?.excludeIncome;
        const respond = (data: any) => {
            if (!hideIncome) return NextResponse.json(data);
            const { monthlyRevenue, ...rest } = data;
            return NextResponse.json(rest);
        };

        const CACHE_KEY = 'admin_dashboard_stats';
        const cachedData = await CacheService.get(CACHE_KEY);
        
        if (cachedData) {
            return respond(cachedData);
        }

        const stats = await AdminService.getDashboardStats();
        
        // Cache for 5 minutes
        await CacheService.set(CACHE_KEY, stats, 300);
        
        return respond(stats);
    } catch (err: any) {
        return errorResponse(err);
    }
}
