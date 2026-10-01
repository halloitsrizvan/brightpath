'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { X, Shield, Sparkles, Check, Layers, CheckSquare, Square } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ADMIN_PAGES, DEFAULT_ROLES, PagePermission, RoleDefinition } from '@/lib/constants/roles';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editRole?: RoleDefinition | null;
}

export default function RoleModal({ isOpen, onClose, onSuccess, editRole }: RoleModalProps) {
    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState<Record<string, PagePermission>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (editRole) {
                setName(editRole.name);
                const permMap: Record<string, PagePermission> = {};
                ADMIN_PAGES.forEach(page => {
                    const existing = editRole.permissions?.find(p => p.pageId === page.id);
                    permMap[page.id] = existing ? { ...existing } : { pageId: page.id, access: 'none', excludeIncome: false };
                });
                setPermissions(permMap);
            } else {
                setName('');
                const permMap: Record<string, PagePermission> = {};
                ADMIN_PAGES.forEach(page => {
                    permMap[page.id] = { pageId: page.id, access: 'none', excludeIncome: false };
                });
                setPermissions(permMap);
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, editRole]);

    if (!isOpen) return null;

    const handleApplyPreset = (presetName: string) => {
        const preset = DEFAULT_ROLES.find(r => r.name === presetName);
        if (!preset) return;

        const newPerms: Record<string, PagePermission> = {};
        ADMIN_PAGES.forEach(page => {
            const found = preset.permissions.find(p => p.pageId === page.id);
            newPerms[page.id] = found ? { ...found } : { pageId: page.id, access: 'none', excludeIncome: false };
        });

        setPermissions(newPerms);
        if (!editRole && !name) {
            setName(`${preset.name}`);
        }
        toast.success(`Loaded ${preset.name} permissions`);
    };

    const handleSelectAll = (select: boolean) => {
        const newPerms: Record<string, PagePermission> = {};
        ADMIN_PAGES.forEach(page => {
            newPerms[page.id] = {
                pageId: page.id,
                access: select ? 'full' : 'none',
                excludeIncome: false
            };
        });
        setPermissions(newPerms);
    };

    const handleTogglePage = (pageId: string, enabled: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [pageId]: {
                ...prev[pageId],
                pageId,
                access: enabled ? 'full' : 'none'
            }
        }));
    };

    const handleSetAccess = (pageId: string, access: 'full' | 'view_only') => {
        setPermissions(prev => ({
            ...prev,
            [pageId]: {
                ...prev[pageId],
                pageId,
                access
            }
        }));
    };

    const handleToggleIncome = (pageId: string, exclude: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [pageId]: {
                ...prev[pageId],
                pageId,
                excludeIncome: exclude
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Please enter a role name');
            return;
        }

        setLoading(true);
        try {
            const formattedPermissions = Object.values(permissions);
            if (editRole && editRole._id) {
                await api.put(`/admin/roles/${editRole._id}`, {
                    name: name.trim(),
                    permissions: formattedPermissions
                });
                toast.success('Role updated successfully');
            } else {
                await api.post('/admin/roles', {
                    name: name.trim(),
                    permissions: formattedPermissions
                });
                toast.success('New role created successfully');
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save role');
        } finally {
            setLoading(false);
        }
    };

    const enabledCount = Object.values(permissions).filter(p => p.access !== 'none').length;

    return (
        <div className="fixed inset-0 w-full h-full min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-none">
                                {editRole ? 'Edit Role & Permissions' : 'Create New Role'}
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Choose which admin panel pages this role can access
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

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                        
                        {/* Role Name & Presets */}
                        <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 block">
                                    Role Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    disabled={editRole?.isSystem}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none disabled:opacity-60 disabled:bg-gray-100"
                                    placeholder="e.g. Academic Coordinator, Sales, Lead Counselor"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {/* Quick Presets */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-xs font-semibold text-gray-400 mr-1 flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Templates:
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleApplyPreset('Academic Coordinator')}
                                    className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition"
                                >
                                    Academic Coordinator
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleApplyPreset('Sales')}
                                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold transition"
                                >
                                    Sales
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleApplyPreset('Super Admin')}
                                    className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold transition"
                                >
                                    Full Access
                                </button>
                            </div>
                        </div>

                        {/* Pages Access Matrix */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-gray-800">
                                        Page Access Selection
                                    </h3>
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                        {enabledCount} of {ADMIN_PAGES.length} selected
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectAll(true)}
                                        className="text-xs text-primary font-semibold hover:underline"
                                    >
                                        Select All
                                    </button>
                                    <span className="text-gray-300">•</span>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectAll(false)}
                                        className="text-xs text-gray-400 font-semibold hover:text-gray-600"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Page List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {ADMIN_PAGES.map(page => {
                                    const perm = permissions[page.id] || { pageId: page.id, access: 'none', excludeIncome: false };
                                    const isEnabled = perm.access !== 'none';

                                    return (
                                        <div
                                            key={page.id}
                                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                                                isEnabled
                                                    ? 'bg-white border-primary/30 shadow-sm'
                                                    : 'bg-gray-50/60 border-gray-100 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            {/* Top: Toggle and Name */}
                                            <div className="flex items-center justify-between gap-2">
                                                <label 
                                                    htmlFor={`page-${page.id}`}
                                                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`page-${page.id}`}
                                                        checked={isEnabled}
                                                        onChange={(e) => handleTogglePage(page.id, e.target.checked)}
                                                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                                                    />
                                                    <span className={`text-xs font-bold truncate ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {page.name}
                                                    </span>
                                                </label>

                                                {/* Access Level Selector */}
                                                {isEnabled && page.supportsViewOnly && (
                                                    <div className="flex bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetAccess(page.id, 'full')}
                                                            className={`px-2 py-0.5 rounded-md transition ${
                                                                perm.access === 'full'
                                                                    ? 'bg-primary text-white shadow-xs'
                                                                    : 'text-gray-500 hover:text-gray-800'
                                                            }`}
                                                        >
                                                            Full
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetAccess(page.id, 'view_only')}
                                                            className={`px-2 py-0.5 rounded-md transition ${
                                                                perm.access === 'view_only'
                                                                    ? 'bg-amber-500 text-white shadow-xs'
                                                                    : 'text-gray-500 hover:text-gray-800'
                                                            }`}
                                                        >
                                                            View Only
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom option for Dashboard */}
                                            {isEnabled && page.supportsIncomeToggle && (
                                                <label className="flex items-center gap-2 bg-rose-50/70 border border-rose-100 text-rose-700 px-2.5 py-1 rounded-xl cursor-pointer text-[11px] font-semibold w-fit">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!perm.excludeIncome}
                                                        onChange={(e) => handleToggleIncome(page.id, e.target.checked)}
                                                        className="w-3.5 h-3.5 text-rose-600 rounded accent-rose-600 cursor-pointer"
                                                    />
                                                    <span>Exclude Income Section</span>
                                                </label>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-end gap-3 flex-shrink-0">
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
                            {loading ? 'Saving...' : editRole ? 'Update Role' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
