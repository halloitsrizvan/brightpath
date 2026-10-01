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
    Edit2, 
    Trash2, 
    Search,
    CheckCircle2,
    Clock,
    CreditCard,
    Calendar,
    Briefcase,
    Shield,
    SlidersHorizontal,
    TrendingUp,
    TrendingDown,
    Download
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import AdminModal from '@/features/founders/components/AdminModal';
import StaffSalaryModal from '@/features/staffs/components/StaffSalaryModal';
import StaffSalaryControlModal from '@/features/staffs/components/StaffSalaryControlModal';
import MonthPicker from '@/components/ui/MonthPicker';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

interface StaffMember {
    _id: string;
    name: string;
    email: string;
    role: string;
    adminRole?: string;
    baseSalary: number;
    debtRemaining?: number;
    createdAt?: string;
}

interface SalaryDisbursement {
    _id: string;
    staffId: {
        _id: string;
        name: string;
        email: string;
        adminRole?: string;
        role?: string;
        baseSalary?: number;
    };
    amount: number;
    month: string;
    status: string;
    paymentDate: string;
    paymentMethod: string;
    notes?: string;
    createdAt: string;
}

interface StaffAdjustment {
    _id: string;
    staffId: any;
    type: 'increment' | 'cut';
    changeAmount: number;
    previousSalary: number;
    newSalary: number;
    reason: string;
    effectiveMonth?: string;
    effectiveDate: string;
    createdAt: string;
}

export default function StaffsManagement() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [salaryLogs, setSalaryLogs] = useState<SalaryDisbursement[]>([]);
    const [salaryAdjustments, setSalaryAdjustments] = useState<StaffAdjustment[]>([]);
    const [loading, setLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getCurrentMonthYear = () => {
        const date = new Date();
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    };

    const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthYear());

    // Staff Edit / Add Modal
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [editStaffData, setEditStaffData] = useState<any>(null);

    // Salary Payout Modal
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    const [targetStaff, setTargetStaff] = useState<any>(null);

    // Salary Control Modal (Increment & Cut)
    const [isSalaryControlOpen, setIsSalaryControlOpen] = useState(false);
    const [salaryControlTargetStaff, setSalaryControlTargetStaff] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [allAdminsRes, salariesRes, adjustmentsRes] = await Promise.all([
                api.get('/admin/founders'),
                api.get('/admin/staffs/salary'),
                api.get('/admin/staffs/adjust-salary')
            ]);

            // Filter out Super Admin: Staffs page ONLY shows non-Super Admin employees
            const nonSuperAdmins = (allAdminsRes.data || []).filter((f: StaffMember) => {
                const role = (f.adminRole || '').toLowerCase();
                const defaultRole = (f.role || '').toLowerCase();
                return role !== 'super admin' && !(defaultRole === 'admin' && !f.adminRole);
            });

            setStaffList(nonSuperAdmins);
            setSalaryLogs(salariesRes.data || []);
            setSalaryAdjustments(adjustmentsRes.data || []);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error("Failed to load staff roster");
        } finally {
            setLoading(false);
        }
    };

    const fetchSalaries = async () => {
        try {
            setLogsLoading(true);
            const res = await api.get('/admin/staffs/salary');
            setSalaryLogs(res.data || []);
        } catch (err) {
            console.error("Failed to fetch salary logs", err);
        } finally {
            setLogsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteStaff = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to remove staff member "${name}"? This action is permanent.`)) {
            try {
                await api.delete(`/admin/founders/${id}`);
                toast.success('Staff member removed');
                fetchData();
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Deletion failed');
            }
        }
    };

    const handleDeleteSalaryLog = async (id: string) => {
        if (window.confirm('Are you sure you want to cancel this salary disbursement record?')) {
            try {
                await api.delete(`/admin/staffs/salary/${id}`);
                toast.success('Salary record cancelled');
                fetchSalaries();
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Failed to delete record');
            }
        }
    };

    const handleOpenSalaryModal = (staff: StaffMember) => {
        const effectiveBaseSalary = getEffectiveBaseSalary(staff, selectedMonth);
        setTargetStaff({
            ...staff,
            baseSalary: effectiveBaseSalary
        });
        setIsSalaryModalOpen(true);
    };

    // Helper to get the cutoff date (end of the selected month)
    const getMonthEndDate = (monthStr: string): Date => {
        try {
            const parts = monthStr.trim().split(/\s+/);
            if (parts.length >= 2) {
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const mIndex = monthNames.findIndex(m => m.toLowerCase() === parts[0].toLowerCase());
                const year = parseInt(parts[1], 10);
                if (mIndex !== -1 && !isNaN(year)) {
                    // Last day of that month at 23:59:59.999
                    return new Date(year, mIndex + 1, 0, 23, 59, 59, 999);
                }
            }
            return new Date();
        } catch {
            return new Date();
        }
    };

    const selectedMonthEndDate = getMonthEndDate(selectedMonth);

    // Compute effective base salary for a staff member for a specific month
    const getEffectiveBaseSalary = (staff: StaffMember, targetMonth: string): number => {
        const staffAdjustments = salaryAdjustments
            .filter(a => {
                const aStaffId = typeof a.staffId === 'object' ? a.staffId?._id : a.staffId;
                return aStaffId === staff._id;
            })
            .sort((a, b) => new Date(a.effectiveDate || a.createdAt).getTime() - new Date(b.effectiveDate || b.createdAt).getTime());

        if (staffAdjustments.length === 0) {
            return staff.baseSalary || 0;
        }

        const monthEnd = getMonthEndDate(targetMonth);
        const applicableAdjustments = staffAdjustments.filter(a => {
            const effDate = new Date(a.effectiveDate || a.createdAt);
            return effDate.getTime() <= monthEnd.getTime();
        });

        if (applicableAdjustments.length > 0) {
            // The latest adjustment that took effect on or before this month
            return applicableAdjustments[applicableAdjustments.length - 1].newSalary;
        } else {
            // All adjustments take effect in future months, so base salary was the previousSalary of earliest adjustment
            return staffAdjustments[0].previousSalary;
        }
    };

    // Filter out staff members who were created AFTER the selected month
    const eligibleStaffList = staffList.filter(s => {
        if (!s.createdAt) return true;
        const createdTime = new Date(s.createdAt).getTime();
        return createdTime <= selectedMonthEndDate.getTime();
    });

    // Filter staff list by search query
    const filteredStaff = eligibleStaffList.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.adminRole || s.role || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate metrics for eligible staff of the selected month
    const totalPayroll = eligibleStaffList.reduce((sum, s) => sum + getEffectiveBaseSalary(s, selectedMonth), 0);
    
    // Salaries disbursed for the selected month
    const currentMonthSalaries = salaryLogs.filter(l => l.month === selectedMonth && l.status === 'paid');
    const disbursedThisMonth = currentMonthSalaries.reduce((sum, l) => sum + (l.amount || 0), 0);

    const paidStaffIds = new Set(currentMonthSalaries.map(l => l.staffId?._id));
    const paidStaffCount = eligibleStaffList.filter(s => paidStaffIds.has(s._id)).length;
    const pendingStaffCount = eligibleStaffList.length - paidStaffCount;
    const pendingAmount = eligibleStaffList
        .filter(s => !paidStaffIds.has(s._id))
        .reduce((sum, s) => sum + getEffectiveBaseSalary(s, selectedMonth), 0);

    const getRoleBadgeStyle = (roleName?: string) => {
        const name = (roleName || '').toLowerCase();
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

            {/* Staff Add / Edit Modal - Super Admin is excluded */}
            <AdminModal 
                isOpen={isStaffModalOpen}
                onClose={() => setIsStaffModalOpen(false)}
                onSuccess={fetchData}
                editData={editStaffData}
                hideSuperAdmin={true}
                mode="staff"
            />

            {/* Salary Payment Modal */}
            <StaffSalaryModal 
                isOpen={isSalaryModalOpen}
                onClose={() => setIsSalaryModalOpen(false)}
                onSuccess={() => {
                    fetchData();
                    fetchSalaries();
                }}
                staff={targetStaff}
                defaultMonth={selectedMonth}
            />

            {/* Salary Control Modal (Increment & Cut) */}
            <StaffSalaryControlModal
                isOpen={isSalaryControlOpen}
                onClose={() => setIsSalaryControlOpen(false)}
                onSuccess={fetchData}
                staff={salaryControlTargetStaff}
                allStaffList={eligibleStaffList.map(s => ({
                    ...s,
                    effectiveBaseSalary: getEffectiveBaseSalary(s, selectedMonth)
                }))}
                salaryAdjustments={salaryAdjustments}
                defaultMonth={selectedMonth}
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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Staffs & Payroll</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('staffs') ? (
                        <AccessDenied roleName={roleName} pageName="Staffs & Payroll Governance" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Staff Directory & Payroll
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">
                                        Operational staff roster, role assignments, and monthly salary disbursement
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Month Calendar Picker */}
                                    <div className="w-full sm:w-auto min-w-[180px]">
                                        <MonthPicker
                                            selected={selectedMonth}
                                            onChange={setSelectedMonth}
                                            allowAll={false}
                                        />
                                    </div>

                                    {!isViewOnly('staffs') && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSalaryControlTargetStaff(null);
                                                    setIsSalaryControlOpen(true);
                                                }}
                                                className="px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                                            >
                                                <SlidersHorizontal className="w-4 h-4 text-[#45308D]" />
                                                <span>Salary Control</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditStaffData(null);
                                                    setIsStaffModalOpen(true);
                                                }}
                                                className="px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add Staff Member</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stat Highlights */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Staff</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{eligibleStaffList.length}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Monthly Base Payroll</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">₹{totalPayroll.toLocaleString()}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center border border-gray-100">
                                        <IndianRupee className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Disbursed ({selectedMonth})</p>
                                        <p className="text-2xl font-black text-emerald-600 mt-0.5">₹{disbursedThisMonth.toLocaleString()}</p>
                                        <span className="text-[10px] font-semibold text-gray-400">{paidStaffCount}/{eligibleStaffList.length} staff paid</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending ({selectedMonth})</p>
                                        <p className="text-2xl font-black text-amber-600 mt-0.5">₹{pendingAmount.toLocaleString()}</p>
                                        <span className="text-[10px] font-semibold text-gray-400">{pendingStaffCount} staff pending</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Staff Roster Table */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Staff Roster & Compensation</h3>
                                        <p className="text-[11px] text-gray-400">Manage employee accounts and process monthly salary payouts</p>
                                    </div>

                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter staff by name or role..."
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
                                                <th className="px-5 py-3.5">Staff Member</th>
                                                <th className="px-5 py-3.5">Assigned Role</th>
                                                <th className="px-5 py-3.5">Monthly Base Salary</th>
                                                <th className="px-5 py-3.5">Status ({selectedMonth})</th>
                                                <th className="px-5 py-3.5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-[#45308D] text-xs font-bold animate-pulse">Loading staff records...</td>
                                                </tr>
                                            ) : filteredStaff.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-gray-400 text-xs font-medium">
                                                        {searchQuery ? 'No matching staff members found.' : 'No staff members registered yet. Click "Add Staff Member" to add one.'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredStaff.map((staff: StaffMember) => {
                                                    const isPaidThisMonth = paidStaffIds.has(staff._id);
                                                    const payoutRecord = salaryLogs.find(l => l.staffId?._id === staff._id && l.month === selectedMonth && l.status === 'paid');

                                                    return (
                                                        <tr key={staff._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-xl bg-[#45308D]/10 text-[#45308D] font-bold text-xs flex items-center justify-center">
                                                                        {staff.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-900">{staff.name}</p>
                                                                        <span className="text-[10px] text-gray-400 font-medium">{staff.email}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(staff.adminRole || staff.role)}`}>
                                                                    <Briefcase className="w-3 h-3" />
                                                                    {staff.adminRole || staff.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs font-bold text-gray-900">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span>₹{getEffectiveBaseSalary(staff, selectedMonth).toLocaleString()}</span>
                                                                    {(() => {
                                                                        const monthAdjustments = salaryAdjustments.filter(a => {
                                                                            const aStaffId = typeof a.staffId === 'object' ? a.staffId?._id : a.staffId;
                                                                            return aStaffId === staff._id && (a.effectiveMonth === selectedMonth);
                                                                        });
                                                                        if (monthAdjustments.length > 0) {
                                                                            const lastAdj = monthAdjustments[0];
                                                                            return (
                                                                                <span 
                                                                                    title={`Salary ${lastAdj.type} of ₹${lastAdj.changeAmount.toLocaleString()} effective ${selectedMonth}: ${lastAdj.reason}`}
                                                                                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                                                        lastAdj.type === 'increment' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                                                                    }`}
                                                                                >
                                                                                    {lastAdj.type === 'increment' ? `+₹${lastAdj.changeAmount.toLocaleString()}` : `-₹${lastAdj.changeAmount.toLocaleString()}`}
                                                                                </span>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })()}
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                {isPaidThisMonth ? (
                                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                                        <span>Paid (₹{payoutRecord?.amount?.toLocaleString()})</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                                                                        <Clock className="w-3 h-3 text-amber-600" />
                                                                        <span>Unpaid</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-right">
                                                                <div className="flex items-center justify-end gap-1.5">
                                                                    {isPaidThisMonth && payoutRecord && (
                                                                        <a
                                                                            href={`/api/admin/staffs/salary/${payoutRecord._id}/invoice`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            title="Download Month Invoice PDF"
                                                                            className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                                                        >
                                                                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                                                                            <span>Invoice</span>
                                                                        </a>
                                                                    )}

                                                                    {!isViewOnly('staffs') && !isPaidThisMonth && (
                                                                        <button 
                                                                            onClick={() => handleOpenSalaryModal(staff)}
                                                                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95"
                                                                        >
                                                                            <IndianRupee className="w-3.5 h-3.5" />
                                                                            <span>Pay Salary</span>
                                                                        </button>
                                                                    )}

                                                                    {!isViewOnly('staffs')  && (
                                                                        <>
                                                                         { !isPaidThisMonth &&
                                                                           <button 
                                                                                onClick={() => {
                                                                                    setSalaryControlTargetStaff(staff);
                                                                                    setIsSalaryControlOpen(true);
                                                                                }}
                                                                                title="Salary Control (Increment / Cut)"
                                                                                className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#45308D] border border-purple-200/60 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                                                                            >
                                                                                <SlidersHorizontal className="w-3.5 h-3.5 text-[#45308D]" />
                                                                                <span>Salary Control</span>
                                                                            </button>}

                                                                            <button 
                                                                                onClick={() => { setEditStaffData(staff); setIsStaffModalOpen(true); }}
                                                                                title="Edit Staff Member"
                                                                                className="p-1.5 text-gray-400 hover:text-[#45308D] hover:bg-[#45308D]/5 rounded-lg transition"
                                                                            >
                                                                                <Edit2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleDeleteStaff(staff._id, staff.name)}
                                                                                title="Remove Staff"
                                                                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Salary Disbursement Audit Trail */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Salary Disbursement Audit Trail</h3>
                                        <p className="text-[10px] text-gray-400">Complete record of staff payroll transfers and payment vouchers</p>
                                    </div>
                                    <FileText className="w-4 h-4 text-gray-400" />
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                                                <th className="px-5 py-3.5">Payment Date</th>
                                                <th className="px-5 py-3.5">Staff Name</th>
                                                {/* <th className="px-5 py-3.5">Role</th> */}
                                                <th className="px-5 py-3.5">Payroll Month</th>
                                                <th className="px-5 py-3.5">Amount (₹)</th>
                                                <th className="px-5 py-3.5">Method</th>
                                                <th className="px-5 py-3.5">Notes</th>
                                                <th className="px-5 py-3.5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {logsLoading ? (
                                                <tr>
                                                    <td colSpan={8} className="py-8 text-center text-[#45308D] text-xs font-bold animate-pulse">Loading payroll history...</td>
                                                </tr>
                                            ) : salaryLogs.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="py-8 text-center text-gray-400 text-xs font-medium">No salary disbursements recorded yet.</td>
                                                </tr>
                                            ) : (
                                                salaryLogs.map((log: SalaryDisbursement) => (
                                                    <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                                                        <td className="px-5 py-3.5 text-xs text-gray-500 font-medium">
                                                            {new Date(log.paymentDate || log.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <p className="text-xs font-bold text-gray-900">{log.staffId?.name || 'Staff'}</p>
                                                            <span className="text-[10px] text-gray-400 font-medium">{log.staffId?.email}</span>
                                                        </td>
                                                        {/* <td className="px-5 py-3.5">
                                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(log.staffId?.adminRole || log.staffId?.role)}`}>
                                                                {log.staffId?.adminRole || log.staffId?.role || 'Staff'}
                                                            </span>
                                                        </td> */}
                                                        <td className="px-5 py-3.5 text-xs font-bold text-gray-800">
                                                            {log.month}
                                                        </td>
                                                        <td className="px-5 py-3.5 text-xs font-black text-emerald-700">
                                                            ₹{log.amount?.toLocaleString()}
                                                        </td>
                                                        <td className="px-5 py-3.5 text-xs font-semibold text-gray-600">
                                                            {log.paymentMethod || 'Bank Transfer'}
                                                        </td>
                                                        <td className="px-5 py-3.5 text-xs text-gray-500 font-medium max-w-xs truncate">
                                                            {log.notes || 'Monthly salary'}
                                                        </td>
                                                        <td className="px-5 py-3.5 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <a
                                                                    href={`/api/admin/staffs/salary/${log._id}/invoice`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title="Download Salary Invoice PDF"
                                                                    className="px-2.5 py-1 bg-white hover:bg-gray-100 text-[#45308D] border border-gray-200 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-xs"
                                                                >
                                                                    <Download className="w-3 h-3 text-[#45308D]" />
                                                                    <span>Invoice PDF</span>
                                                                </a>

                                                                {!isViewOnly('staffs') && (
                                                                    <button
                                                                        onClick={() => handleDeleteSalaryLog(log._id)}
                                                                        title="Cancel Payment Record"
                                                                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
