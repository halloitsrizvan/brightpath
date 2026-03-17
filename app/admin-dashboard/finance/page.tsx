
'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import { IndianRupee, User, Wallet, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminFinance() {
    const [financeData, setFinanceData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchFinance = async () => {
        try {
            const { data } = await api.get('/finance/overview');
            setFinanceData(data);
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

    const markFeePaid = async (feeId: string) => {
        try {
            await api.put(`/finance/fees/${feeId}`, { paymentStatus: 'paid', paymentDate: new Date() });
            toast.success("Fee marked as paid");
            fetchFinance();
        } catch (err) {
            toast.error("Process failed");
        }
    };

    const markSalaryPaid = async (salaryId: string) => {
        try {
            await api.put(`/finance/salary/${salaryId}`, { paidStatus: 'paid' });
            toast.success("Salary disbursed");
            fetchFinance();
        } catch (err) {
            toast.error("Process failed");
        }
    };

    const runPayroll = async () => {
        const month = prompt("Enter Month & Year (e.g. March 2026):", "March 2026");
        if (!month) return;

        setLoading(true);
        try {
            const { data } = await api.post('/finance/generate-payroll', { month });
            toast.success(data.message);
            fetchFinance();
        } catch (err) {
            toast.error("Payroll generation failed");
        } finally {
            setLoading(false);
        }
    };

    const addManualFee = async () => {
        const email = prompt("Enter Student Email:");
        if (!email) return;
        const month = prompt("Enter Month (e.g. March 2026):", "March 2026");
        const amount = prompt("Enter Amount (₹):");
        if (!amount || isNaN(parseFloat(amount))) return;

        setLoading(true);
        try {
            // Finding student by email first might be needed if api doesn't handle it
            // For now let's assume valid student email or we search
            const { data: students } = await api.get('/students');
            const student = students.find((s: any) => s.email === email);
            if (!student) {
                toast.error("Student not found");
                return;
            }

            await api.post('/finance/fees', {
                studentId: student._id,
                month,
                amount: parseFloat(amount),
                paymentStatus: 'unpaid'
            });
            toast.success("Fee invoice generated");
            fetchFinance();
        } catch (err) {
            toast.error("Failed to generate fee");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 italic font-black text-primary animate-pulse">
            CALCULATING RESERVES...
        </div>
    );

    const { summary, unpaidFees, unpaidSalaries } = financeData || { summary: {}, unpaidFees: [], unpaidSalaries: [] };

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
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 ml-1">Live Economic Overview & Payouts</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={runPayroll}
                            className="px-6 py-4 bg-gray-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition shadow-xl shadow-gray-200"
                        >
                            Run Payroll
                        </button>
                        <button
                            onClick={addManualFee}
                            className="px-6 py-4 bg-primary text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition shadow-xl shadow-primary/20"
                        >
                            + Add Bill
                        </button>
                        <div className="px-6 py-4 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Net Exposure</p>
                                <p className={`text-xl font-black italic tracking-tight ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{Math.abs(summary.netBalance).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Economic Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Receivables</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4">₹{summary.totalReceivable?.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Pending from {unpaidFees.length} Students</span>
                        </div>
                    </div>

                    <div className="bg-secondary p-8 rounded-[2.5rem] text-primary shadow-2xl shadow-secondary/20 relative overflow-hidden group">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Total Payables</p>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-gray-800">₹{summary.totalPayable?.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-xs font-black text-gray-500">
                            <ArrowDownRight className="w-4 h-4" />
                            <span>Owed to {unpaidSalaries.length} Tutors</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Active Invoices</h3>
                                <p className="text-[10px] font-bold text-gray-400">Monthly Payout Cycle</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Student Billing Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 ml-2">
                            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tight">Student AR Registry</h3>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                            <div className="p-6 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                            <th className="pb-4">Student Identity</th>
                                            <th className="pb-4">Module Month</th>
                                            <th className="pb-4">Owed Amount</th>
                                            <th className="pb-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {unpaidFees.length === 0 ? (
                                            <tr><td colSpan={4} className="py-10 text-center text-gray-300 font-bold italic">Clean Sheet. All dues cleared.</td></tr>
                                        ) : unpaidFees.map((fee: any) => (
                                            <tr key={fee._id} className="group hover:bg-gray-50/50 transition-all">
                                                <td className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-black">
                                                            {fee.studentId?.fullName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-800">{fee.studentId?.fullName}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{fee.studentId?.residentialLocation}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-xs font-bold text-gray-600 italic">{fee.month}</span>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-sm font-black text-primary italic tracking-tight">₹{fee.amount}</span>
                                                </td>
                                                <td className="py-5 text-right">
                                                    <button
                                                        onClick={() => markFeePaid(fee._id)}
                                                        className="px-4 py-2 bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-xl transition-all border border-transparent hover:border-green-100"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Tutor Payroll Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 ml-2">
                            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                                <IndianRupee className="w-4 h-4" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tight">Tutor Payroll Ledger</h3>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                            <div className="p-6 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                            <th className="pb-4">Tutor Details</th>
                                            <th className="pb-4">Hours</th>
                                            <th className="pb-4">Net Salary</th>
                                            <th className="pb-4 text-right">Payout</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {unpaidSalaries.length === 0 ? (
                                            <tr><td colSpan={4} className="py-10 text-center text-gray-300 font-bold italic">Payroll executed for all active tutors.</td></tr>
                                        ) : unpaidSalaries.map((salary: any) => (
                                            <tr key={salary._id} className="group hover:bg-gray-50/50 transition-all">
                                                <td className="py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-black italic">
                                                            {salary.teacherId?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-800">{salary.teacherId?.name}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 italic">₹{salary.salaryPerHour}/hr</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {salary.totalHours} hrs
                                                    </div>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-sm font-black text-gray-900 italic tracking-tight">₹{salary.totalSalary}</span>
                                                </td>
                                                <td className="py-5 text-right">
                                                    <button
                                                        onClick={() => markSalaryPaid(salary._id)}
                                                        className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-secondary/10"
                                                    >
                                                        Disburse
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-12 flex items-center gap-3 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 text-amber-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-bold italic">Financial ledger automatically refreshes on payout execution. Ensure all attendance logs are verified before disbursement.</p>
                </div>
            </div>
        </div>
    );
}
