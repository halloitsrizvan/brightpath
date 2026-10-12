'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/utils/api';
import { DEFAULT_ROLES, ADMIN_PAGES, RoleDefinition, PagePermission, getRolePermissionsMap } from '@/lib/constants/roles';

export function useAdminPermissions() {
    const [user, setUser] = useState<any>(null);
    const [roleData, setRoleData] = useState<RoleDefinition | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const userCookie = Cookies.get('user');
        let parsedUser: any = null;
        if (userCookie) {
            try {
                parsedUser = JSON.parse(userCookie);
                setUser(parsedUser);
            } catch (e) {
                console.error('Failed to parse user cookie', e);
            }
        }

        // Only proceed with admin roles if this is an admin user
        if (!parsedUser || parsedUser.role !== 'admin') {
            setLoading(false);
            return;
        }

        const roleTitle = parsedUser?.adminRole || 'Super Admin';

        // Check if matching default role first for instant rendering
        const localDefault = DEFAULT_ROLES.find(r => r.name.toLowerCase() === (roleTitle || '').toLowerCase());
        if (localDefault) {
            setRoleData(localDefault);
        }

        // Fetch latest role definitions from API
        api.get('/admin/roles')
            .then(res => {
                const allRoles: RoleDefinition[] = res.data;
                const matched = allRoles.find(r => r.name.toLowerCase() === (roleTitle || '').toLowerCase());
                if (matched) {
                    setRoleData(matched);
                } else if (!localDefault) {
                    if (parsedUser?.role === 'admin') {
                        const fallback = allRoles.find(r => r.name === 'Super Admin') || DEFAULT_ROLES[0];
                        setRoleData(fallback);
                    }
                }
            })
            .catch(err => {
                console.error('Failed to fetch role permissions', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const effectiveRoleName = roleData?.name || user?.adminRole || (user?.role === 'admin' ? 'Super Admin' : 'Super Admin');
    const isSuperAdmin = effectiveRoleName?.toLowerCase() === 'super admin';

    const permissionsMap = getRolePermissionsMap(roleData || (isSuperAdmin ? DEFAULT_ROLES[0] : null));

    const canAccess = (pageId: string): boolean => {
        if (isSuperAdmin) return true;
        const perm = permissionsMap[pageId];
        return perm ? perm.access !== 'none' : false;
    };

    const isViewOnly = (pageId: string): boolean => {
        if (isSuperAdmin) return false;
        const perm = permissionsMap[pageId];
        return perm ? perm.access === 'view_only' : false;
    };

    const canViewIncome = (): boolean => {
        if (isSuperAdmin) return true;
        const dashPerm = permissionsMap['dashboard'];
        if (!dashPerm) return false;
        if (dashPerm.excludeIncome) return false;
        return true;
    };

    return {
        user,
        roleName: effectiveRoleName,
        roleData,
        permissionsMap,
        canAccess,
        isViewOnly,
        canViewIncome,
        isSuperAdmin,
        loading,
        mounted
    };
}
