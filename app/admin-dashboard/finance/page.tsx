'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { IndianRupee, User, Wallet, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, TrendingUp, Download, Eye, Filter, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminFinance() {
    const [financeData, setFinanceData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'payroll'>('pending');
    const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
    
    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        loading: boolean;
    }>({ 
        isOpen: false, 
        title: '', 
        message: '', 
        onConfirm: () => {}, 
        loading: false 
    });

    const fetchFinance = async () => {
        try {
            const { data } = await api.get('/finance/overview');
            setFinanceData(data);
            
            // Expand latest month by default
            if (data.unpaidFees.length > 0) {
                const months = Array.from(new Set(data.unpaidFees.map((f: any) => f.month))) as string[];
                setExpandedMonths([months[0]]);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to synchronize financial data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinance();
    }, []);

    const markFeePaid = (feeId: string, studentName: string, amount: number) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Receipt",
            message: `Are you sure you want to mark ₹${amount.toLocaleString()} as received from ${studentName}? This will generate a formal PDF invoice.`,
            loading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, loading: true }));
                try {
                    await api.put(`/finance/fees/${feeId}`, { paymentStatus: 'paid', paymentDate: new Date() });
                    toast.success("Payment Received Successfully");
                    fetchFinance();
                    window.open(`/api/finance/invoice/${feeId}`, '_blank');
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (err) {
                    toast.error("Process failed");
                    setConfirmModal(prev => ({ ...prev, loading: false }));
                }
            }
        });
    };

    const markSalaryPaid = (salaryId: string, tutorName: string, amount: number) => {
        setConfirmModal({
            isOpen: true,
            title: "Disburse Payroll",
            message: `Initiate salary disbursement of ₹${amount.toLocaleString()} to ${tutorName}? A payslip will be generated and logged.`,
            loading: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, loading: true }));
                try {
                    await api.put(`/finance/salary/${salaryId}`, { paidStatus: 'paid' });
                    toast.success("Salary disbursed");
                    fetchFinance();
                    window.open(`/api/finance/payslip/${salaryId}`, '_blank');
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (err) {
                    toast.error("Process failed");
                    setConfirmModal(prev => ({ ...prev, loading: false }));
                }
            }
        });
    };

    const toggleMonth = (month: string) => {
        setExpandedMonths(prev => 
            prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
        );
    };

    const downloadInvoice = (feeId: string) => {
        window.open(`/api/finance/invoice/${feeId}`, '_blank');
    };

    const downloadPayslip = (salaryId: string) => {
        window.open(`/api/finance/payslip/${salaryId}`, '_blank');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-vh-screen bg-gray-50 italic font-black text-primary animate-pulse h-screen">
            CALCULATING RESERVES...
        </div>
    );

    const { summary, unpaidFees, paidFees, unpaidSalaries, paidSalaries } = financeData || { summary: {}, unpaidFees: [], paidFees: [], unpaidSalaries: [], paidSalaries: [] };

    // Grouping Fees by Month
    const groupedPendingFees = unpaidFees.reduce((acc: any, fee: any) => {
        if (!acc[fee.month]) acc[fee.month] = [];
        acc[fee.month].push(fee);
        return acc;
    }, {});

    const months = Object.keys(groupedPendingFees).sort((a,b) => {
        // Simple sort logic for months
        const m1 = new Date(a).getTime();
        const m2 = new Date(b).getTime();
        return m2 - m1;
    });

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="fixed z-50 h-full">
                <Sidebar role="admin" />
            </div>

            <div className="flex-1 lg:ml-64 p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Finance Hub</h1>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">Automated Billing & Revenue Control</p>
                    </div>
                    
                    <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner">
                        <button onClick={() => setActiveTab('pending')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Pending AR</button>
                        <button onClick={() => setActiveTab('paid')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'paid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Paid Bills</button>
                        <button onClick={() => setActiveTab('payroll')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'payroll' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Payroll Ledger</button>
                    </div>
                </div>

                {/* Economic Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                    <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Receivables</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4">₹{summary.totalReceivable?.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Pending from {unpaidFees.length} Students</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Received Amount</p>
                        <h2 className="text-4xl font-black italic tracking-tighter text-teal-600 mb-4">₹{summary.totalReceived?.toLocaleString()}</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-2 bg-teal-50 rounded-full flex-1 overflow-hidden">
                                <div className="bg-teal-500 h-full rounded-full" style={{ width: `${Math.min(100, (summary.totalReceived / ((summary.totalReceivable || 0) + (summary.totalReceived || 1))) * 100)}%` }}></div>
                            </div>
                            <span className="text-[10px] font-black text-teal-600 uppercase">Recovery Rate</span>
                        </div>
                    </div>

                    <div className="bg-secondary p-8 rounded-[2.5rem] text-primary shadow-2xl shadow-secondary/20 relative overflow-hidden group">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Total Salary Paid</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-gray-800">₹{summary.totalDisbursed?.toLocaleString()}</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-2 bg-primary/10 rounded-full flex-1 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (summary.totalDisbursed / ((summary.totalPayable || 0) + (summary.totalDisbursed || 1))) * 100)}%` }}></div>
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase">₹{summary.totalPayable?.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className={`p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group ${summary.profit >= 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-rose-600 text-white shadow-rose-200'}`}>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Realized Profit</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4">₹{summary.profit?.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                            <TrendingUp className="w-4 h-4" />
                            <span>Margin: {((summary.profit / (summary.totalReceived || 1)) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'pending' && (
                        <div className="space-y-4">
                            {months.length === 0 ? (
                                <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
                                    <CheckCircle2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold italic uppercase tracking-widest">No pending receivables found.</p>
                                </div>
                            ) : months.map(month => (
                                <div key={month} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
                                    <button 
                                        onClick={() => toggleMonth(month)}
                                        className="w-full px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-black text-gray-800 italic uppercase">{month} Earnings</h3>
                                            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                                {groupedPendingFees[month].length} Students
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <p className="text-lg font-black text-primary italic">₹{groupedPendingFees[month].reduce((sum: any, f: any) => sum + f.amount, 0).toLocaleString()}</p>
                                            {expandedMonths.includes(month) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                        </div>
                                    </button>

                                    {expandedMonths.includes(month) && (
                                        <div className="px-8 pb-8 pt-2 overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="text-[9px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                                        <th className="pb-3">Student Profile</th>
                                                        <th className="pb-3 text-center">Location</th>
                                                        <th className="pb-3 text-center">Bill Amount</th>
                                                        <th className="pb-3 text-right">Settlement</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {groupedPendingFees[month].map((fee: any) => (
                                                        <tr key={fee._id}>
                                                            <td className="py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs font-black italic">{fee.studentId?.fullName?.charAt(0)}</div>
                                                                    <p className="text-sm font-black text-gray-800">{fee.studentId?.fullName}</p>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 text-center">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{fee.studentId?.residentialLocation || 'India'}</span>
                                                            </td>
                                                            <td className="py-4 text-center">
                                                                <span className="text-sm font-black text-gray-800 italic tracking-tight">₹{fee.amount}</span>
                                                            </td>
                                                            <td className="py-4 text-right">
                                                                <button 
                                                                    onClick={() => markFeePaid(fee._id, fee.studentId?.fullName, fee.amount)}
                                                                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition shadow-lg shadow-primary/10 flex items-center gap-2 ml-auto"
                                                                >
                                                                    Pay Now <ArrowUpRight className="w-3 h-3" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'paid' && (
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-8">
                                <h3 className="text-xl font-black text-gray-800 italic uppercase mb-8 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                                    Settled Transactions
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                                <th className="pb-4">Transaction Date</th>
                                                <th className="pb-4">Student</th>
                                                <th className="pb-4">Module Month</th>
                                                <th className="pb-4">Amount</th>
                                                <th className="pb-4 text-right">Receipt</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {paidFees.length === 0 ? (
                                                <tr><td colSpan={5} className="py-20 text-center text-gray-300 font-bold italic uppercase tracking-widest text-xs">No payment history available yet.</td></tr>
                                            ) : paidFees.map((fee: any) => (
                                                <tr key={fee._id} className="group hover:bg-gray-50/50 transition">
                                                    <td className="py-5">
                                                        <p className="text-xs font-bold text-gray-500 italic">{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}</p>
                                                    </td>
                                                    <td className="py-5">
                                                        <p className="text-sm font-black text-gray-800">{fee.studentId?.fullName}</p>
                                                    </td>
                                                    <td className="py-5">
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-2 py-1 rounded-md">{fee.month}</span>
                                                    </td>
                                                    <td className="py-5">
                                                        <span className="text-sm font-black text-teal-600 italic tracking-tight">₹{fee.amount}</span>
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        <button 
                                                            onClick={() => downloadInvoice(fee._id)}
                                                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition"
                                                            title="Download PDF Invoice"
                                                        >
                                                            <Download className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payroll' && (
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                             <div className="p-8">
                                <h3 className="text-xl font-black text-gray-800 italic uppercase mb-8 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center"><IndianRupee className="w-4 h-4" /></div>
                                    Tutor Payout Ledger
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                                <th className="pb-4">Tutor Profile</th>
                                                <th className="pb-4">Month</th>
                                                <th className="pb-4 text-center">Class Hours</th>
                                                <th className="pb-4 text-center">Net Salary</th>
                                                <th className="pb-4 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {[...unpaidSalaries, ...paidSalaries].map((salary: any) => (
                                                <tr key={salary._id} className="group hover:bg-gray-50/50 transition">
                                                    <td className="py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-black italic">{salary.teacherId?.name?.charAt(0)}</div>
                                                            <div>
                                                                <p className="text-sm font-black text-gray-800">{salary.teacherId?.name}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 italic">Rate: ₹{salary.salaryPerHour}/hr</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase">{salary.month}</span>
                                                    </td>
                                                    <td className="py-5 text-center">
                                                        <span className="text-xs font-bold text-gray-600 tracking-tighter">{salary.totalHours} hrs</span>
                                                    </td>
                                                    <td className="py-5 text-center">
                                                        <span className="text-sm font-black text-gray-900 italic">₹{salary.totalSalary}</span>
                                                    </td>
                                                    <td className="py-5 text-right flex items-center justify-end gap-3">
                                                        {salary.paidStatus === 'paid' ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => downloadPayslip(salary._id)}
                                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition"
                                                                    title="Download Payslip"
                                                                >
                                                                    <Download className="w-5 h-5" />
                                                                </button>
                                                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">Disbursed</span>
                                                            </>
                                                        ) : (
                                                            <button 
                                                                onClick={() => markSalaryPaid(salary._id, salary.teacherId?.name, salary.totalSalary)}
                                                                className="px-5 py-2 bg-secondary hover:bg-secondary/80 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl transition shadow-lg shadow-secondary/10"
                                                            >
                                                                Disburse
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Footer Insight */}
                <div className="mt-12 flex items-center gap-3 p-6 bg-amber-50 rounded-[2.5rem] border border-amber-100 text-amber-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">Automated Intelligence</p>
                        <p className="text-xs font-bold italic">Billing triggers automatically as tutors mark attendance. No manual invoice creation required. All dues are calculated in real-time.</p>
                    </div>
                </div>
            </div>

            {/* Premium Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter mb-3">
                            {confirmModal.title}
                        </h3>
                        <p className="text-sm font-bold text-gray-400 mb-8 leading-relaxed">
                            {confirmModal.message}
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmModal.onConfirm}
                                disabled={confirmModal.loading}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
                            >
                                {confirmModal.loading ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
