export interface AdminPageDefinition {
    id: string;
    name: string;
    href: string;
    description: string;
    category: 'Core' | 'Academic' | 'Operations' | 'Finance' | 'Reporting';
    supportsViewOnly?: boolean;
    supportsIncomeToggle?: boolean;
}

export const ADMIN_PAGES: AdminPageDefinition[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/admin-dashboard',
        description: 'Main operational overview and performance analytics',
        category: 'Core',
        supportsViewOnly: true,
        supportsIncomeToggle: true
    },
    {
        id: 'students',
        name: 'Students',
        href: '/admin-dashboard/students',
        description: 'Student profiles, registrations, and batch details',
        category: 'Academic',
        supportsViewOnly: true
    },
    {
        id: 'teachers',
        name: 'Teachers',
        href: '/admin-dashboard/teachers',
        description: 'Teacher staff roster, assignments, and credentials',
        category: 'Academic',
        supportsViewOnly: true
    },
    {
        id: 'subjects',
        name: 'Subjects',
        href: '/admin-dashboard/subjects',
        description: 'Curriculum, grade configurations, and subject lists',
        category: 'Academic',
        supportsViewOnly: true
    },
    {
        id: 'attendance',
        name: 'Attendance',
        href: '/admin-dashboard/attendance',
        description: 'Daily classroom attendance logging and history',
        category: 'Academic',
        supportsViewOnly: true
    },
    {
        id: 'exams',
        name: 'Exams',
        href: '/admin-dashboard/exams',
        description: 'Test schedules, marksheets, and grading',
        category: 'Academic',
        supportsViewOnly: true
    },
    {
        id: 'tasks',
        name: 'Tasks & Targets',
        href: '/admin-dashboard/tasks',
        description: 'Staff work assignments and milestone tracking',
        category: 'Operations',
        supportsViewOnly: true
    },
    {
        id: 'leads',
        name: 'Leads & Enquiries',
        href: '/admin-dashboard/leads',
        description: 'CRM pipeline, follow-ups, and student admissions',
        category: 'Operations',
        supportsViewOnly: true
    },
    {
        id: 'finance',
        name: 'Finance & Tuition',
        href: '/admin-dashboard/finance',
        description: 'Revenue collections, fee invoices, and accounting',
        category: 'Finance',
        supportsViewOnly: true
    },
    {
        id: 'expenses',
        name: 'Expenses',
        href: '/admin-dashboard/expenses',
        description: 'Operational expenditures and vendor payouts',
        category: 'Finance',
        supportsViewOnly: true
    },
    {
        id: 'founders',
        name: 'Founders & Roles',
        href: '/admin-dashboard/founders',
        description: 'Executive committee, debt registry, and role access',
        category: 'Core',
        supportsViewOnly: false
    },
    {
        id: 'incentives',
        name: 'Incentives',
        href: '/admin-dashboard/incentives',
        description: 'Teacher bonuses and incentive calculations',
        category: 'Finance',
        supportsViewOnly: true
    },
    {
        id: 'blog',
        name: 'Blog Management',
        href: '/admin-dashboard/blog',
        description: 'Website news, articles, and public announcements',
        category: 'Operations',
        supportsViewOnly: true
    },
    {
        id: 'reports',
        name: 'Monthly Report',
        href: '/admin-dashboard/reports',
        description: 'Comprehensive financial audit and growth trends',
        category: 'Reporting',
        supportsViewOnly: true
    }
];

export interface PagePermission {
    pageId: string;
    access: 'full' | 'view_only' | 'none';
    excludeIncome?: boolean;
}

export interface RoleDefinition {
    _id?: string;
    name: string;
    description: string;
    isSystem: boolean;
    permissions: PagePermission[];
}

export const DEFAULT_ROLES: RoleDefinition[] = [
    {
        name: 'Super Admin',
        description: 'Unrestricted master access to all financial, academic, and administrative modules.',
        isSystem: true,
        permissions: ADMIN_PAGES.map(p => ({
            pageId: p.id,
            access: 'full',
            excludeIncome: false
        }))
    },
    {
        name: 'Academic Coordinator',
        description: 'Manages students, teachers, subjects, attendance, exams, tasks, and leads. Excludes financial and income data.',
        isSystem: true,
        permissions: [
            { pageId: 'dashboard', access: 'full', excludeIncome: true },
            { pageId: 'students', access: 'full' },
            { pageId: 'teachers', access: 'full' },
            { pageId: 'subjects', access: 'full' },
            { pageId: 'attendance', access: 'full' },
            { pageId: 'exams', access: 'full' },
            { pageId: 'tasks', access: 'full' },
            { pageId: 'leads', access: 'full' },
            { pageId: 'finance', access: 'none' },
            { pageId: 'expenses', access: 'none' },
            { pageId: 'founders', access: 'none' },
            { pageId: 'incentives', access: 'none' },
            { pageId: 'blog', access: 'none' },
            { pageId: 'reports', access: 'none' }
        ]
    },
    {
        name: 'Sales',
        description: 'Manages leads and enquiries with read-only access to tasks, subjects, students, and operational dashboard.',
        isSystem: true,
        permissions: [
            { pageId: 'leads', access: 'full' },
            { pageId: 'tasks', access: 'view_only' },
            { pageId: 'subjects', access: 'view_only' },
            { pageId: 'students', access: 'view_only' },
            { pageId: 'dashboard', access: 'view_only', excludeIncome: true },
            { pageId: 'teachers', access: 'none' },
            { pageId: 'attendance', access: 'none' },
            { pageId: 'exams', access: 'none' },
            { pageId: 'finance', access: 'none' },
            { pageId: 'expenses', access: 'none' },
            { pageId: 'founders', access: 'none' },
            { pageId: 'incentives', access: 'none' },
            { pageId: 'blog', access: 'none' },
            { pageId: 'reports', access: 'none' }
        ]
    }
];

export function getRolePermissionsMap(role: RoleDefinition | null | undefined): Record<string, PagePermission> {
    const map: Record<string, PagePermission> = {};
    if (!role || !role.permissions) {
        // Default to super admin permissions if not defined
        ADMIN_PAGES.forEach(p => {
            map[p.id] = { pageId: p.id, access: 'full', excludeIncome: false };
        });
        return map;
    }

    role.permissions.forEach(p => {
        map[p.pageId] = p;
    });

    return map;
}
