'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import { 
    Users, 
    IndianRupee, 
    Menu, 
    Plus, 
    FileText, 
    ShieldCheck, 
    TrendingDown, 
    Edit2, 
    Trash2, 
    ArrowUpRight, 
    ArrowDownRight,
    Shield,
    Layers,
    Search,
    SlidersHorizontal,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import DebtTransactionModal from '@/features/founders/components/DebtTransactionModal';
import AdminModal from '@/features/founders/components/AdminModal';
import RoleModal from '@/features/founders/components/RoleModal';
import { RoleDefinition, DEFAULT_ROLES, ADMIN_PAGES } from '@/lib/constants/roles';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

interface Founder {
    _id: string;
    name: string;
    email: string;
    role: string;
    adminRole?: string;
    baseSalary: number;
    debtRemaining: number;
    lastDebtReason?: string;
}

export default function FoundersManagement() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [activeTab, setActiveTab] = useState<'founders' | 'roles'>('founders');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [founders, setFounders] = useState<Founder[]>([]);
    const [roles, setRoles] = useState<RoleDefinition[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<Founder | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Admin / Founder Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);

    // Role Modal
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editRole, setEditRole] = useState<RoleDefinition | null>(null);

    // Debt states
    const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
    const [debtModalType, setDebtModalType] = useState<'debt' | 'return'>('debt');
    const [targetFounder, setTargetFounder] = useState<any>(null);
    const [debtLogs, setDebtLogs] = useState<any[]>([]);
    const [logsLoading, setLogsLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const userCookie = Cookies.get('user');
            const loggedInUser = userCookie ? JSON.parse(userCookie) : null;

            const [foundersRes, rolesRes] = await Promise.all([
                api.get('/admin/founders'),
                api.get('/admin/roles')
            ]);

            setFounders(foundersRes.data);
            setRoles(rolesRes.data);

            if (loggedInUser) {
                const profile = foundersRes.data.find((f: Founder) => f.email === loggedInUser.email);
                if (profile) {
                    setCurrentUser(profile);
                    const dbRole = profile.adminRole || (profile.role === 'admin' ? 'Super Admin' : profile.role);
                    if (dbRole && dbRole !== loggedInUser.adminRole) {
                        Cookies.set('user', JSON.stringify({
                            ...loggedInUser,
                            adminRole: dbRole
                        }));
                    }
                }
            }
            fetchLogs();
        } catch (err) {
            toast.error("Synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            setLogsLoading(true);
            const res = await api.get('/admin/founders/debt');
            setDebtLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setLogsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteFounder = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this administrator? This action is irreversible.')) {
            try {
                await api.delete(`/admin/founders/${id}`);
                toast.success('Admin removed from core');
                fetchData();
            } catch (err) {
                toast.error('Deletion failed');
            }
        }
    };

    const handleDeleteRole = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the role "${name}"?`)) {
            try {
                await api.delete(`/admin/roles/${id}`);
                toast.success(`Role "${name}" deleted`);
                fetchData();
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Failed to delete role');
            }
        }
    };

    const handleDebtAction = (founder: any, type: 'debt' | 'return') => {
        setTargetFounder(founder);
        setDebtModalType(type);
        setIsDebtModalOpen(true);
    };

    const totalBaseTier = founders.reduce((sum, f) => sum + (f.baseSalary || 0), 0);
    const totalDebtCount = founders.reduce((sum, f) => sum + (f.debtRemaining || 0), 0);

    const filteredFounders = founders.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.adminRole || f.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadgeStyle = (roleName?: string) => {
        const name = (roleName || '').toLowerCase();
        if (name.includes('super admin')) {
            return 'bg-purple-50 text-[#45308D] border-purple-200/60';
        }
        if (name.includes('academic')) {
            return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
        }
        if (name.includes('sales')) {
            return 'bg-amber-50 text-amber-700 border-amber-200/60';
        }
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
    };

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900">
            <Toaster position="top-right" />
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <AdminModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                editData={editData}
                onOpenRoleModal={() => {
                    setIsModalOpen(false);
                    setEditRole(null);
                    setIsRoleModalOpen(true);
                }}
            />

            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                onSuccess={fetchData}
                editRole={editRole}
            />

            <DebtTransactionModal 
                isOpen={isDebtModalOpen}
                onClose={() => setIsDebtModalOpen(false)}
                onSuccess={fetchData}
                founder={targetFounder}
                type={debtModalType}
            />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                {/* Mobile Header Bar */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 bg-white/80 backdrop-blur-md shadow-xs p-3.5 flex items-center justify-between lg:hidden border-b border-gray-100">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-[#45308D] shadow-xs active:scale-95 transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Founders & Roles</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('founders') ? (
                        <AccessDenied roleName={roleName} pageName="Founders & Roles Governance" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Governance Suite
                                        </span>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Founders & Role Access
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Administrator directory, capital exposure ledger & role permissions</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <button
                                        onClick={() => {
                                            setEditRole(null);
                                            setIsRoleModalOpen(true);
                                        }}
                                        className="px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                                    >
                                        <Layers className="w-4 h-4 text-[#45308D]" />
                                        <span>Create Role</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditData(null);
                                            setIsModalOpen(true);
                                        }}
                                        className="px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Administrator</span>
                                    </button>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl w-fit">
                                <button
                                    onClick={() => setActiveTab('founders')}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === 'founders'
                                            ? 'bg-white text-[#45308D] shadow-xs'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Founders & Admins ({founders.length})</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('roles')}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        activeTab === 'roles'
                                            ? 'bg-white text-[#45308D] shadow-xs'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                    <span>Role Governance ({roles.length})</span>
                                </button>
                            </div>

                            {/* TAB 1: FOUNDERS & ADMINS */}
                            {activeTab === 'founders' && (
                                <div className="space-y-6">
                                    {/* Stat Highlights */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">My Base Tier</p>
                                                <p className="text-2xl font-black text-gray-900 mt-0.5">₹{currentUser?.baseSalary?.toLocaleString() || '0'}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Core Base</p>
                                                <p className="text-2xl font-black text-gray-900 mt-0.5">₹{totalBaseTier.toLocaleString()}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center border border-gray-100">
                                                <Users className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                            <div>
                                                <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">My Debt Balance</p>
                                                <p className="text-2xl font-black text-rose-600 mt-0.5">₹{currentUser?.debtRemaining?.toLocaleString() || '0'}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                                                <TrendingDown className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">System Debt</p>
                                                <p className="text-2xl font-black text-gray-900 mt-0.5">₹{totalDebtCount.toLocaleString()}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center border border-gray-100">
                                                <IndianRupee className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Member Matrix */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Administrator Registry</h3>
                                                <p className="text-[11px] text-gray-400">Executive directory and debt balance ledger</p>
                                            </div>

                                            <div className="relative w-full sm:w-64">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Filter administrators..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full h-9 pl-9 pr-3 bg-white border border-gray-200 focus:border-[#45308D] rounded-xl outline-none text-xs font-semibold text-gray-900 placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-5 py-3.5">Admin Profile</th>
                                                        <th className="px-5 py-3.5">Assigned Role</th>
                                                        <th className="px-5 py-3.5">Base Tier (₹)</th>
                                                        <th className="px-5 py-3.5">Debt Balance</th>
                                                        <th className="px-5 py-3.5 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {filteredFounders.map((f: any) => (
                                                        <tr key={f._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <p className="text-xs font-bold text-gray-900">{f.name}</p>
                                                                <span className="text-[10px] text-gray-400 font-medium">{f.email}</span>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(f.adminRole || f.role)}`}>
                                                                    <Shield className="w-3 h-3" />
                                                                    {f.adminRole || (f.role === 'admin' ? 'Super Admin' : f.role)}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                                                                ₹{f.baseSalary?.toLocaleString() || '0'}
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-rose-600">
                                                                        ₹{(f.debtRemaining || 0).toLocaleString()}
                                                                    </span>
                                                                    {f.lastDebtReason && (
                                                                        <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                                            {f.lastDebtReason}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    {currentUser?._id === f._id && (
                                                                        <div className="flex bg-gray-100 p-0.5 rounded-lg gap-0.5 mr-1.5">
                                                                            <button 
                                                                                onClick={() => handleDebtAction(f, 'debt')}
                                                                                className="px-2 py-1 bg-white text-rose-600 rounded text-[9px] font-bold uppercase tracking-wider hover:bg-rose-50 transition shadow-xs flex items-center gap-0.5"
                                                                            >
                                                                                <ArrowUpRight className="w-2.5 h-2.5" /> Debt
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleDebtAction(f, 'return')}
                                                                                className="px-2 py-1 bg-white text-emerald-600 rounded text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-50 transition shadow-xs flex items-center gap-0.5"
                                                                            >
                                                                                <ArrowDownRight className="w-2.5 h-2.5" /> Return
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    <button 
                                                                        onClick={() => { setEditData(f); setIsModalOpen(true); }}
                                                                        title="Edit Administrator"
                                                                        className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition"
                                                                    >
                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteFounder(f._id)}
                                                                        title="Remove Administrator"
                                                                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Debt History Logs */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                        <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Debt & Return Audit Trail</h3>
                                                <p className="text-[10px] text-gray-400">History of all capital withdrawals and repayments</p>
                                            </div>
                                            <FileText className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-white text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                                                        <th className="px-5 py-3.5">Date</th>
                                                        <th className="px-5 py-3.5">Administrator</th>
                                                        <th className="px-5 py-3.5">Type</th>
                                                        <th className="px-5 py-3.5">Amount (₹)</th>
                                                        <th className="px-5 py-3.5">Reason / Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {logsLoading ? (
                                                        <tr>
                                                            <td colSpan={5} className="py-8 text-center text-[#45308D] text-xs font-bold animate-pulse">Loading audit trail...</td>
                                                        </tr>
                                                    ) : debtLogs.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="py-8 text-center text-gray-400 text-xs font-medium">No debt or return logs recorded yet.</td>
                                                        </tr>
                                                    ) : (
                                                        debtLogs.map((log: any) => (
                                                            <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                                                                <td className="px-5 py-3.5 text-xs text-gray-500 font-medium">
                                                                    {new Date(log.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                </td>
                                                                <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                                                                    {log.founderId?.name || 'Admin'}
                                                                </td>
                                                                <td className="px-5 py-3.5">
                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                                                                        log.type === 'debt' 
                                                                            ? 'bg-rose-50 text-rose-700 border-rose-200/60' 
                                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                                                    }`}>
                                                                        {log.type === 'debt' ? '+ Debt' : '- Return'}
                                                                    </span>
                                                                </td>
                                                                <td className={`px-5 py-3.5 text-xs font-black ${log.type === 'debt' ? 'text-rose-600' : 'text-emerald-700'}`}>
                                                                    {log.type === 'debt' ? '+' : '-'}₹{log.amount.toLocaleString()}
                                                                </td>
                                                                <td className="px-5 py-3.5 text-xs text-gray-500 font-medium">
                                                                    {log.reason || 'Capital allocation'}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: ROLE GOVERNANCE & ACCESS MATRIX */}
                            {activeTab === 'roles' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {roles.map(role => {
                                        const assignedCount = founders.filter(f => (f.adminRole || 'Super Admin') === role.name).length;
                                        const accessiblePages = ADMIN_PAGES.filter(page => {
                                            const perm = role.permissions?.find(p => p.pageId === page.id);
                                            return perm ? perm.access !== 'none' : false;
                                        });
                                        const dashPerm = role.permissions?.find(p => p.pageId === 'dashboard');

                                        return (
                                            <div 
                                                key={role._id || role.name}
                                                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between hover:border-[#45308D]/20 transition-all space-y-4"
                                            >
                                                <div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <h3 className="text-base font-black text-gray-900 tracking-tight">
                                                                {role.name}
                                                            </h3>
                                                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                                                                {role.isSystem ? 'System Default Role' : 'Custom Defined Role'}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-700">
                                                            <Users className="w-3 h-3 text-[#45308D]" />
                                                            <span>{assignedCount} Assigned</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mt-4 pt-3 border-t border-gray-100">
                                                        <div className="flex items-center justify-between text-[11px] font-bold">
                                                            <span className="text-gray-400 uppercase tracking-wider">
                                                                Accessible Pages ({accessiblePages.length}/{ADMIN_PAGES.length})
                                                            </span>
                                                            {dashPerm && dashPerm.excludeIncome && (
                                                                <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                                                                    Income Excluded
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
                                                            {accessiblePages.length === 0 ? (
                                                                <span className="text-xs text-gray-400 italic p-1">No pages enabled</span>
                                                            ) : (
                                                                accessiblePages.map(page => {
                                                                    const perm = role.permissions?.find(p => p.pageId === page.id);
                                                                    const isViewOnly = perm?.access === 'view_only';

                                                                    return (
                                                                        <span
                                                                            key={page.id}
                                                                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                                                                                isViewOnly
                                                                                    ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                                                                                    : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
                                                                            }`}
                                                                        >
                                                                            {page.name} <span className="opacity-70">({isViewOnly ? 'View' : 'Manage'})</span>
                                                                        </span>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditRole(role);
                                                            setIsRoleModalOpen(true);
                                                        }}
                                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                        <span>Edit Permissions</span>
                                                    </button>

                                                    {!role.isSystem && (
                                                        <button
                                                            onClick={() => role._id && handleDeleteRole(role._id, role.name)}
                                                            className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            <span>Delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
