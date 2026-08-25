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
    MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

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
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
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
        const matchesSearch = lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             lead.phoneNumber.includes(searchQuery) ||
                             lead.email.toLowerCase().includes(searchQuery.toLowerCase());
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
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Leads</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">CRM Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-12 mt-20 lg:mt-0 flex-1">
                    {/* Header Section */}
                    <div className="flex flex-col gap-6 mb-10 mt-4 px-2">
                        <div>
                            <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-1">CRM Management</p>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                                Leads & <span className="text-primary">Enquiries</span>
                            </h1>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            <StatCard label="Total Inbound" value={stats.total} icon={<TrendingUp />} color="bg-primary" />
                            <StatCard label="Awaiting Contact" value={stats.pending} icon={<Clock />} color="bg-secondary" textColor="text-gray-900" />
                            <StatCard label="Demos Requested" value={stats.demoRequests} icon={<Calendar />} color="bg-indigo-600" />
                            <StatCard label="Successfully Contacted" value={stats.contacted} icon={<CheckCircle />} color="bg-teal-600" />
                        </div>
                    </div>

                    <main className="flex-1 pb-8">
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
                            {/* Table Header / Filters */}
                            <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 items-center justify-between">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-80">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search by name, phone or email..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-12 pl-12 pr-6 bg-gray-50 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-2xl outline-none text-xs font-bold text-gray-900 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                    <FilterSelect 
                                        label="Lead Type" 
                                        value={typeFilter} 
                                        onChange={setTypeFilter} 
                                        options={[
                                            { label: 'All Types', value: 'all' },
                                            { label: 'Demo Requests', value: 'demo' },
                                            { label: 'Enquiries', value: 'enquiry' }
                                        ]}
                                    />
                                    <FilterSelect 
                                        label="Status" 
                                        value={filter} 
                                        onChange={setFilter} 
                                        options={[
                                            { label: 'All Status', value: 'all' },
                                            { label: 'Pending', value: 'pending' },
                                            { label: 'Contacted', value: 'contacted' },
                                            { label: 'Resolved', value: 'resolved' },
                                            { label: 'Junk', value: 'junk' }
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Desktop View: Leads Table */}
                            <div className="hidden md:block flex-1 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inbound Lead</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Enquiry</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr><td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-bold italic">Deep indexing lead registry...</td></tr>
                                        ) : filteredLeads.length === 0 ? (
                                            <tr><td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-bold italic">No institutional leads found matching criteria.</td></tr>
                                        ) : (
                                            filteredLeads.map((lead) => (
                                                <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                                                <User className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-black text-gray-800 tracking-tight leading-none mb-1">{lead.fullName}</h4>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                                    Class {lead.studentClass || 'N/A'} <span className="w-1 h-1 bg-gray-200 rounded-full" /> {lead.country || 'Global'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                            lead.leadType === 'demo' ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'
                                                        }`}>
                                                            {lead.leadType === 'demo' ? 'Free Demo' : 'Enquiry'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                            <span>{formatDate(lead.createdAt)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                                                <Phone className="w-3 h-3 opacity-40" /> {lead.phoneNumber}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                                                                <MessageCircle className="w-3 h-3 opacity-40" /> {lead.whatsappNumber || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${
                                                                lead.status === 'pending' ? 'bg-orange-400 animate-pulse' :
                                                                lead.status === 'contacted' ? 'bg-blue-400' : 'bg-teal-500'
                                                            }`} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                                                                {lead.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => updateStatus(lead._id, 'contacted')}
                                                                title="Mark as Contacted"
                                                                className={`p-2 rounded-lg transition-all ${lead.status === 'pending' ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' : 'bg-gray-50 text-gray-300 pointer-events-none'}`}
                                                            >
                                                                <Phone className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => updateStatus(lead._id, 'resolved')}
                                                                title="Mark as Resolved"
                                                                className={`p-2 rounded-lg transition-all ${lead.status !== 'resolved' ? 'bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white' : 'bg-gray-100 text-teal-600 pointer-events-none'}`}
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => updateStatus(lead._id, 'junk')}
                                                                title="Mark as Junk"
                                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View: Div Cards */}
                            <div className="block md:hidden p-3 space-y-2.5">
                                {loading ? (
                                    <div className="py-12 text-center text-gray-400 font-medium text-xs italic">
                                        Loading lead registry...
                                    </div>
                                ) : filteredLeads.length === 0 ? (
                                    <div className="py-12 text-center text-gray-400 font-medium text-xs italic">
                                        No leads found matching current filters.
                                    </div>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <div 
                                            key={lead._id} 
                                            className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/60 transition-all flex flex-col justify-between gap-3 shadow-sm"
                                        >
                                            {/* Header info */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shrink-0">
                                                        {lead.fullName ? lead.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs font-black text-gray-900 tracking-tight leading-none truncate">{lead.fullName}</h4>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                            Class {lead.studentClass || 'N/A'} • {lead.country || 'Global'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                                                    lead.leadType === 'demo' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-teal-50 text-teal-600 border border-teal-100'
                                                }`}>
                                                    {lead.leadType === 'demo' ? 'Demo' : 'Enquiry'}
                                                </span>
                                            </div>

                                            {/* Contact & Date Info */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-gray-600 pt-1">
                                                <div className="flex flex-col gap-1">
                                                    <a href={`tel:${lead.phoneNumber}`} className="flex items-center gap-1.5 hover:text-primary transition-colors text-[11px]">
                                                        <Phone className="w-3 h-3 text-gray-400" />
                                                        <span>{lead.phoneNumber}</span>
                                                    </a>
                                                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors text-[11px] text-gray-500">
                                                        <Mail className="w-3 h-3 text-gray-400" />
                                                        <span className="max-w-[160px] truncate">{lead.email}</span>
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <span>{formatDate(lead.createdAt)}</span>
                                                </div>
                                            </div>

                                            {/* Footer Status & Actions */}
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        lead.status === 'pending' ? 'bg-amber-400 animate-pulse' :
                                                        lead.status === 'contacted' ? 'bg-blue-500' :
                                                        lead.status === 'resolved' ? 'bg-emerald-500' : 'bg-rose-400'
                                                    }`} />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-700">
                                                        {lead.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={() => updateStatus(lead._id, 'contacted')}
                                                        title="Mark as Contacted"
                                                        disabled={lead.status === 'contacted'}
                                                        className={`p-1.5 rounded-lg transition-all ${
                                                            lead.status === 'pending' 
                                                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' 
                                                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <Phone className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(lead._id, 'resolved')}
                                                        title="Mark as Resolved"
                                                        disabled={lead.status === 'resolved'}
                                                        className={`p-1.5 rounded-lg transition-all ${
                                                            lead.status !== 'resolved' 
                                                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' 
                                                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(lead._id, 'junk')}
                                                        title="Mark as Junk"
                                                        disabled={lead.status === 'junk'}
                                                        className={`p-1.5 rounded-lg transition-all ${
                                                            lead.status !== 'junk'
                                                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                                                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color, textColor = "text-white" }: any) {
    return (
        <div className={`${color} ${textColor} p-6 rounded-[2rem] shadow-xl relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-3">
                <div className="p-2 bg-white/10 rounded-xl w-fit backdrop-blur-md">
                    {icon}
                </div>
                <div>
                    <h3 className="text-3xl font-black italic tracking-tighter leading-none">{value}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">{label}</p>
                </div>
            </div>
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }: any) {
    return (
        <div className="flex flex-col gap-1.5 min-w-[140px]">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
            <div className="relative">
                <select 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 px-4 bg-gray-100 border-2 border-transparent focus:border-primary/10 focus:bg-white rounded-xl outline-none text-[10px] font-black text-gray-700 uppercase tracking-widest transition-all appearance-none cursor-pointer"
                >
                    {options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}
