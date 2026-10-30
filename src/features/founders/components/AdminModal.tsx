'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { X, Shield, Mail, Briefcase, IndianRupee, ChevronDown, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { DEFAULT_ROLES, RoleDefinition } from '@/lib/constants/roles';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: any;
    hideSuperAdmin?: boolean;
    fixedRole?: string;
    mode?: 'staff' | 'founder' | 'admin';
    onOpenRoleModal?: () => void;
}

export default function AdminModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    editData, 
    hideSuperAdmin = false,
    fixedRole,
    mode = 'admin',
    onOpenRoleModal 
}: AdminModalProps) {
    const defaultInitialRole = fixedRole ? fixedRole : (hideSuperAdmin ? 'Academic Coordinator' : 'Super Admin');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        adminRole: defaultInitialRole,
        baseSalary: 0,
        debtRemaining: 0
    });
    const [rolesList, setRolesList] = useState<RoleDefinition[]>(DEFAULT_ROLES);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            api.get('/admin/roles')
                .then(res => {
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        setRolesList(res.data);
                    }
                })
                .catch(err => {
                    console.error('Failed to load roles list', err);
                });

            if (editData) {
                let existingRole = (editData.adminRole && editData.adminRole !== 'admin')
                    ? editData.adminRole
                    : (editData.role && editData.role !== 'admin' ? editData.role : (fixedRole || (hideSuperAdmin ? 'Academic Coordinator' : 'Super Admin')));

                if (hideSuperAdmin && existingRole === 'Super Admin') {
                    existingRole = 'Academic Coordinator';
                }

                setFormData({
                    name: editData.name || '',
                    email: editData.email || '',
                    password: '',
                    adminRole: fixedRole || existingRole,
                    baseSalary: editData.baseSalary || 0,
                    debtRemaining: editData.debtRemaining || 0
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    adminRole: defaultInitialRole,
                    baseSalary: 0,
                    debtRemaining: 0
                });
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, editData, hideSuperAdmin, fixedRole]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const roleToAssign = fixedRole || formData.adminRole;
            const payload = {
                ...formData,
                adminRole: roleToAssign,
                role: 'admin'
            };

            if (editData) {
                await api.put(`/admin/founders/${editData._id}`, payload);
                toast.success(hideSuperAdmin ? 'Staff profile updated' : 'Administrator profile updated');

                // If updating logged in user, keep cookie in sync
                const userCookie = Cookies.get('user');
                if (userCookie) {
                    try {
                        const parsed = JSON.parse(userCookie);
                        if (parsed.email === editData.email || parsed.id === editData._id) {
                            Cookies.set('user', JSON.stringify({
                                ...parsed,
                                name: formData.name,
                                email: formData.email,
                                adminRole: roleToAssign
                            }));
                        }
                    } catch (e) {}
                }
            } else {
                await api.post('/admin/founders', payload);
                toast.success(hideSuperAdmin ? 'New staff member registered' : 'New administrator registered');
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    // Filter available roles based on hideSuperAdmin
    const standardRoles = ['Academic Coordinator', 'Sales'];
    if (!hideSuperAdmin && !fixedRole) {
        standardRoles.unshift('Super Admin');
    }

    const customRoles = rolesList.filter(r => 
        !['Super Admin', 'Academic Coordinator', 'Sales'].includes(r.name) &&
        (!hideSuperAdmin || r.name.toLowerCase() !== 'super admin')
    );

    const getTitle = () => {
        if (mode === 'staff' || hideSuperAdmin) {
            return editData ? 'Edit Staff Member' : 'Add Staff Member';
        }
        if (mode === 'founder' || fixedRole === 'Super Admin') {
            return editData ? 'Edit Founder Profile' : 'Add Founder / Trustee';
        }
        return editData ? 'Edit Administrator / Founder' : 'Add Founder / Administrator';
    };

    const getSubtitle = () => {
        if (mode === 'staff' || hideSuperAdmin) {
            return editData ? 'Update staff profile, assigned role, and base salary' : 'Enter credentials and assign access role';
        }
        if (mode === 'founder' || fixedRole === 'Super Admin') {
            return editData ? 'Update founder profile and base tier' : 'Register a new Super Admin founder';
        }
        return editData ? 'Update profile, role, and salary tier' : 'Enter credentials and assign access role';
    };

    return (
        <div className="fixed inset-0 w-full h-full min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 my-auto animate-in fade-in zoom-in-95 duration-150">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                            <UserPlus className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-none">
                                {getTitle()}
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                {getSubtitle()}
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="email"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                                placeholder={hideSuperAdmin ? "staff@brightpath.com" : "founder@brightpath.com"}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Role Selector */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-700 block">
                                    Assigned Role <span className="text-red-500">*</span>
                                </label>
                            </div>
                            <div className="relative">
                                {fixedRole ? (
                                    <input
                                        disabled
                                        type="text"
                                        value={fixedRole}
                                        className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-bold text-sm cursor-not-allowed outline-none"
                                    />
                                ) : (
                                    <>
                                        <select
                                            required
                                            value={formData.adminRole}
                                            onChange={(e) => setFormData({ ...formData, adminRole: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none appearance-none cursor-pointer pr-9"
                                        >
                                            <optgroup label="Standard Roles">
                                                {standardRoles.map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </optgroup>
                                            {customRoles.length > 0 && (
                                                <optgroup label="Custom Roles">
                                                    {customRoles.map(r => (
                                                        <option key={r._id || r.name} value={r.name}>
                                                            {r.name}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Monthly Base Tier / Salary */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 block">
                                {hideSuperAdmin ? 'Base Salary (₹ / month)' : 'Base Tier Salary (₹)'}
                            </label>
                            <input
                                type="number"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                                placeholder="0"
                                value={formData.baseSalary || ''}
                                onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) || 0 })}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-bold text-gray-700 block">
                                Password {editData ? <span className="text-gray-400 font-normal text-[11px]">(leave blank to keep current)</span> : <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="password"
                                required={!editData}
                                minLength={8}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                                placeholder={editData ? "••••••••" : "Enter password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md shadow-primary/20 hover:bg-primary/95 active:scale-95 transition flex items-center gap-1.5"
                        >
                            {loading ? 'Saving...' : editData ? 'Update Profile' : (hideSuperAdmin ? 'Add Staff Member' : 'Add Administrator')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
