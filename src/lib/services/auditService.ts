import AuditLog from '@/models/AuditLog';
import dbConnect from '@/lib/db/mongodb';

export class AuditService {
    static async log(action: string, user: any, details: any = {}, req?: Request) {
        try {
            await dbConnect();
            
            const ip = req ? (req.headers.get('x-forwarded-for') || 'hidden').split(',')[0] : 'system';
            
            await AuditLog.create({
                action,
                actor: user.name || user.email || user.id,
                actorRole: user.role,
                details,
                ip,
                timestamp: new Date()
            });
            
            console.log(`[AUDIT] ${action} by ${user.role}:${user.email || user.id}`);
        } catch (error) {
            console.error('[AUDIT ERROR] Failed to record institutional action:', error);
        }
    }
}
