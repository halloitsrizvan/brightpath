'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
    TrendingUp, 
    Search, 
    CheckCircle, 
    Clock, 
    XCircle, 
    Phone, 
    Mail, 
    User, 
    Calendar, 
    Menu, 
    ChevronDown, 
    MessageCircle, 
    Shield,
    Users,
    Sparkles
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

interface Lead {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    whatsappNumber?: string;
    country?: string;
    studentClass?: string;
    userType: string;
    leadType: 'demo' | 'enquiry';
    status: 'pending' | 'contacted' | 'resolved' | 'junk';
    notes?: string;
    createdAt: string;
}

export default function LeadsDashboard() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const viewOnly = isViewOnly('leads');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/leads');
            const data = await response.json();
            if (Array.isArray(data)) {
                setLeads(data);
            }
        } catch (error) {
            console.error("Failed to fetch leads", error);
            toast.error("Failed to fetch leads");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        if (viewOnly) return;
        try {
            const response = await fetch('/api/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (response.ok) {
                toast.success(`Lead marked as ${status}`);
                fetchLeads();
            }
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesStatus = filter === 'all' || lead.status === filter;
        const matchesType = typeFilter === 'all' || lead.leadType === typeFilter;
        const matchesSearch = lead.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             lead.phoneNumber?.includes(searchQuery) ||
                             lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
    });

    const stats = {
        total: leads.length,
        pending: leads.filter(l => l.status === 'pending').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        demoRequests: leads.filter(l => l.leadType === 'demo').length
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900">
            <Toaster position="top-right" />
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Leads CRM</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('leads') ? (
                        <AccessDenied roleName={roleName} pageName="Leads & Enquiries" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Growth Pipeline
                                        </span>
                                        {viewOnly && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Leads & Inquiries
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Inbound demo booking & prospective student communication hub</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search name, phone, email..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-10 pl-9 pr-3.5 bg-white border border-gray-200 focus:border-[#45308D] focus:ring-1 focus:ring-[#45308D]/20 rounded-xl outline-none text-xs font-semibold text-gray-900 transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stat Highlights */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Inbound</p>
                                        <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.total}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center border border-[#45308D]/10">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Awaiting Call</p>
                                        <p className="text-2xl font-black text-amber-700 mt-0.5">{stats.pending}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Demo Requests</p>
                                        <p className="text-2xl font-black text-indigo-700 mt-0.5">{stats.demoRequests}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Contacted</p>
                                        <p className="text-2xl font-black text-emerald-700 mt-0.5">{stats.contacted}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Filters Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1">Filters:</span>
                                    <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl">
                                        <button
                                            onClick={() => setFilter('all')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                filter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            All Status
                                        </button>
                                        <button
                                            onClick={() => setFilter('pending')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                filter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            Pending
                                        </button>
                                        <button
                                            onClick={() => setFilter('contacted')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                filter === 'contacted' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            Contacted
                                        </button>
                                        <button
                                            onClick={() => setFilter('resolved')}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                filter === 'resolved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                        >
                                            Resolved
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl">
                                    <button
                                        onClick={() => setTypeFilter('all')}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                            typeFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        All Types
                                    </button>
                                    <button
                                        onClick={() => setTypeFilter('demo')}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                            typeFilter === 'demo' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        Free Demo
                                    </button>
                                    <button
                                        onClick={() => setTypeFilter('enquiry')}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                            typeFilter === 'enquiry' ? 'bg-white text-teal-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        Enquiries
                                    </button>
                                </div>
                            </div>

                            {/* Table & List Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                                {loading ? (
                                    <div className="py-16 text-center text-[#45308D] font-bold text-xs animate-pulse">
                                        Loading leads pipeline...
                                    </div>
                                ) : filteredLeads.length === 0 ? (
                                    <div className="py-16 text-center text-gray-400 font-medium text-xs">
                                        No leads found matching your criteria.
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-5 py-3.5">Prospect Name</th>
                                                        <th className="px-5 py-3.5">Category</th>
                                                        <th className="px-5 py-3.5">Date Inbound</th>
                                                        <th className="px-5 py-3.5">Contact Details</th>
                                                        <th className="px-5 py-3.5">Status</th>
                                                        {!viewOnly && <th className="px-5 py-3.5 text-right">Actions</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {filteredLeads.map((lead) => (
                                                        <tr key={lead._id} className="hover:bg-gray-50/60 transition-colors">
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs border border-[#45308D]/10 shrink-0">
                                                                        {lead.fullName?.charAt(0) || <User className="w-4 h-4" />}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-xs font-bold text-gray-900">{lead.fullName}</h4>
                                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                                            Class {lead.studentClass || 'N/A'} • {lead.country || 'Global'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                                                    lead.leadType === 'demo' 
                                                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60' 
                                                                        : 'bg-teal-50 text-teal-700 border-teal-200/60'
                                                                }`}>
                                                                    {lead.leadType === 'demo' ? 'Free Demo' : 'General Enquiry'}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 text-xs text-gray-600 font-medium">
                                                                {formatDate(lead.createdAt)}
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <div className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                                    <span>{lead.phoneNumber}</span>
                                                                </div>
                                                                {lead.email && (
                                                                    <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                                                                        <Mail className="w-3 h-3 text-gray-300" />
                                                                        <span>{lead.email}</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                                                                    lead.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                                                                    lead.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                                                                    lead.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                                }`}>
                                                                    {lead.status}
                                                                </span>
                                                            </td>
                                                            {!viewOnly && (
                                                                <td className="px-5 py-3.5 text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <button 
                                                                            onClick={() => updateStatus(lead._id, 'contacted')}
                                                                            title="Mark as Contacted"
                                                                            className={`p-1.5 rounded-lg transition ${
                                                                                lead.status === 'pending' ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 pointer-events-none'
                                                                            }`}
                                                                        >
                                                                            <Phone className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => updateStatus(lead._id, 'resolved')}
                                                                            title="Mark as Resolved"
                                                                            className={`p-1.5 rounded-lg transition ${
                                                                                lead.status !== 'resolved' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-300 pointer-events-none'
                                                                            }`}
                                                                        >
                                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => updateStatus(lead._id, 'junk')}
                                                                            title="Mark as Junk"
                                                                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                                        >
                                                                            <XCircle className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="block md:hidden p-3 space-y-2.5">
                                            {filteredLeads.map((lead) => (
                                                <div 
                                                    key={lead._id}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-3 shadow-xs"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="w-8 h-8 rounded-xl bg-[#45308D]/5 text-[#45308D] flex items-center justify-center font-black text-xs shrink-0">
                                                                {lead.fullName?.charAt(0) || 'L'}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="text-xs font-bold text-gray-900 truncate">{lead.fullName}</h4>
                                                                <p className="text-[10px] text-gray-400 font-medium">Class {lead.studentClass || 'N/A'} • {formatDate(lead.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 border ${
                                                            lead.leadType === 'demo' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60' : 'bg-teal-50 text-teal-700 border-teal-200/60'
                                                        }`}>
                                                            {lead.leadType === 'demo' ? 'Demo' : 'Enquiry'}
                                                        </span>
                                                    </div>

                                                    <div className="text-xs text-gray-600 space-y-0.5">
                                                        <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                                                            <Phone className="w-3 h-3 text-gray-400" />
                                                            <span>{lead.phoneNumber}</span>
                                                        </div>
                                                        {lead.email && <div className="text-[11px] text-gray-400 truncate">{lead.email}</div>}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${
                                                            lead.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                                                            lead.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                                                            lead.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                                                            'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}>
                                                            {lead.status}
                                                        </span>

                                                        {!viewOnly && (
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => updateStatus(lead._id, 'contacted')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                                    <Phone className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button onClick={() => updateStatus(lead._id, 'resolved')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button onClick={() => updateStatus(lead._id, 'junk')} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition">
                                                                    <XCircle className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
