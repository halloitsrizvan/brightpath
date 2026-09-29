'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import MonthPicker from '@/components/ui/MonthPicker';
import { 
    IndianRupee, 
    Wallet, 
    Calendar, 
    CheckCircle2, 
    AlertCircle, 
    ArrowUpRight, 
    TrendingUp, 
    Download, 
    ChevronDown, 
    ChevronRight, 
    FileText,
    Menu,
    Search,
    BookOpen,
    Clock,
    X,
    Layers
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { FinanceSkeleton } from './Skeleton';

export default function FinanceHub() {
    const [financeData, setFinanceData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'payroll'>('pending');
    const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
    const getCurrentMonthString = () => {
        const date = new Date();
        const m = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
        const y = date.getFullYear();
        return `${m} ${y}`;
    };

    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString);
    const [selectedFees, setSelectedFees] = useState<string[]>([]);
    const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);

    const getTodayDateString = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const [billingCutoffDate, setBillingCutoffDate] = useState<string>(getTodayDateString());
    const [settlementAmount, setSettlementAmount] = useState<number>(0);
    const [feeBreakdown, setFeeBreakdown] = useState<{ [id: string]: number }>({});
    const [cutoffActivities, setCutoffActivities] = useState<any[]>([]);
    const [cutoffSummary, setCutoffSummary] = useState<{ gross: number; paid: number; net: number } | null>(null);
    const [isCalculatingAmount, setIsCalculatingAmount] = useState<boolean>(false);
    const [calculationNote, setCalculationNote] = useState<string>('');
    const [activeFeeIds, setActiveFeeIds] = useState<string[]>([]);
    const [modalMobileTab, setModalMobileTab] = useState<'summary' | 'activities'>('summary');
    const [paidSearchQuery, setPaidSearchQuery] = useState<string>('');
    const [paidFilterType, setPaidFilterType] = useState<'all' | 'multi' | 'single'>('all');

    // Refs to always read the latest settlement values inside callbacks (avoids stale closures)
    const settlementAmountRef = useRef<number>(0);
    const feeBreakdownRef = useRef<{ [id: string]: number }>({});

    useEffect(() => {
        settlementAmountRef.current = settlementAmount;
    }, [settlementAmount]);

    useEffect(() => {
        feeBreakdownRef.current = feeBreakdown;
    }, [feeBreakdown]);

    const calculateCutoffAmount = async (ids: string[], cutoff: string) => {
        if (!ids || ids.length === 0 || !cutoff) return;
        try {
            setIsCalculatingAmount(true);
            const { data } = await api.post('/finance/calculate-cutoff', {
                feeIds: ids,
                cutoffDate: cutoff
            });
            if (data && typeof data.amount === 'number') {
                setSettlementAmount(data.amount);
                if (data.breakdown) {
                    setFeeBreakdown(data.breakdown);
                }
                if (Array.isArray(data.activities)) {
                    setCutoffActivities(data.activities);
                } else {
                    setCutoffActivities([]);
                }
                if (data.grossAmount !== undefined && data.paidAmount !== undefined) {
                    setCutoffSummary({ gross: data.grossAmount, paid: data.paidAmount, net: data.amount });
                } else {
                    setCutoffSummary(null);
                }
                const cutoffParts = String(cutoff).split('-');
                const formattedCutoff = cutoffParts.length === 3 
                    ? new Date(parseInt(cutoffParts[0]), parseInt(cutoffParts[1]) - 1, parseInt(cutoffParts[2])).toLocaleDateString()
                    : new Date(cutoff).toLocaleDateString();

                if (data.isAttendanceBased) {
                    setCalculationNote(`${data.classesCount} class(es) (${data.hours} hrs) logged up to ${formattedCutoff}`);
                } else {
                    const day = cutoffParts.length === 3 ? parseInt(cutoffParts[2]) : new Date(cutoff).getDate();
                    setCalculationNote(`Prorated up to day ${day} of billing cycle (${formattedCutoff})`);
                }
            }
        } catch (err) {
            console.error("Failed to calculate cutoff amount:", err);
        } finally {
            setIsCalculatingAmount(false);
        }
    };

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: (cutoffDate?: string) => void;
        loading: boolean;
        isFee?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        loading: false,
        isFee: false
    });

    const monthsOptions = useMemo(() => {
        const arr = ['All Records'];
        const date = new Date();
        date.setDate(1);
        for (let i = 0; i < 6; i++) {
            const m = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
            const y = date.getFullYear();
            arr.push(`${m} ${y}`);
            date.setMonth(date.getMonth() - 1);
        }
        return arr;
    }, []);

    const fetchFinance = async () => {
        try {
            setLoading(true);
            const query = selectedMonth === 'All Records' ? '' : `?month=${selectedMonth}`;
            const { data } = await api.get(`/finance/overview${query}`);
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
    }, [selectedMonth]);

    const markFeePaid = (feeIds: string | string[], studentName: string, amount: number) => {
        const idArray = Array.isArray(feeIds) ? feeIds : [feeIds];
        const todayStr = getTodayDateString();
        setBillingCutoffDate(todayStr);
        setActiveFeeIds(idArray);
        setSettlementAmount(amount);
        settlementAmountRef.current = amount;
        setFeeBreakdown({});
        feeBreakdownRef.current = {};
        setCutoffActivities([]);
        setCutoffSummary(null);
        setCalculationNote('Calculating activity up to cutoff...');
        setModalMobileTab('summary');

        // Calculate dynamic amount based on today's cutoff
        calculateCutoffAmount(idArray, todayStr);
        
        setConfirmModal({
            isOpen: true,
            title: idArray.length > 1 ? "Batch Settle" : "Confirm Receipt",
            message: `Settling receivable for ${studentName}. The invoice will reflect learning activity logged up to the selected cutoff date.`,
            loading: false,
            isFee: true,
            onConfirm: async (selectedCutoff?: string) => {
                const cutoff = selectedCutoff || todayStr;
                let cutoffDateObj: Date | null = null;
                if (cutoff) {
                    const parsed = new Date(cutoff);
                    if (isNaN(parsed.getTime())) {
                        toast.error("Invalid billing cutoff date selected");
                        return;
                    }
                    const day = parsed.getDate();
                    if (day < 1 || day > 31) {
                        toast.error("Billing cutoff day must be between 1 and 31");
                        return;
                    }
                    cutoffDateObj = new Date(`${cutoff}T23:59:59.999Z`);
                }

                setConfirmModal(prev => ({ ...prev, loading: true }));
                try {
                    const settlementId = `SETTLE-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

                    // Read latest values from refs to avoid stale closure issues
                    const latestBreakdown = feeBreakdownRef.current;
                    const latestSettlementAmount = settlementAmountRef.current;

                    // Settle all IDs with cutoff date, individual amounts, and common settlementId
                    await Promise.all(idArray.map(id => {
                        const calculatedFeeAmount = (latestBreakdown && latestBreakdown[id] !== undefined)
                            ? latestBreakdown[id]
                            : (idArray.length === 1 ? (latestSettlementAmount > 0 ? latestSettlementAmount : amount) : (unpaidFees.find((f: any) => f._id === id)?.amount || Math.round(amount / idArray.length)));

                        return api.put(`/finance/fees/${id}`, { 
                            paymentStatus: 'paid', 
                            paymentDate: new Date(),
                            billingCutoffDate: cutoffDateObj || new Date(),
                            amount: calculatedFeeAmount,
                            settlementId
                        });
                    }));
                    
                    toast.success(idArray.length > 1 ? `${idArray.length} months settled` : "Payment Received Successfully");
                    fetchFinance();
                    setSelectedFees([]);
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    
                    // Automatically trigger PDF invoice download
                    downloadInvoice(idArray, cutoff);
                } catch (err) {
                    toast.error("Process failed");
                    setConfirmModal(prev => ({ ...prev, loading: false }));
                }
            }
        });
    };

    const markSalaryPaid = (salaryIds: string | string[], tutorName: string, amount: number) => {
        const idArray = Array.isArray(salaryIds) ? salaryIds : [salaryIds];
        const idString = idArray.join(',');
        setActiveFeeIds([]);
        setSettlementAmount(amount);
        setCalculationNote('');

        setConfirmModal({
            isOpen: true,
            title: idArray.length > 1 ? "Batch Disbursement" : "Disburse Payroll",
            message: idArray.length > 1 
                ? `Initiate batch disbursement of ₹${amount.toLocaleString()} to ${tutorName} for ${idArray.length} records? This will generate payslips for all.`
                : `Initiate salary disbursement of ₹${amount.toLocaleString()} to ${tutorName}? A payslip will be generated and logged.`,
            loading: false,
            isFee: false,
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, loading: true }));
                try {
                    await Promise.all(idArray.map(id => 
                        api.put(`/finance/salary/${id}`, { paidStatus: 'paid' })
                    ));
                    
                    toast.success(idArray.length > 1 ? `${idArray.length} records disbursed` : "Salary disbursed");
                    fetchFinance();
                    setSelectedSalaries([]);
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    
                    // Automatically trigger PDF payslip download
                    downloadPayslip(idArray);
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

    const downloadInvoice = async (feeIds: string | string[], cutoffDate?: string) => {
        try {
            const idArray = Array.isArray(feeIds) ? feeIds : [feeIds];
            const idString = idArray.join(',');
            const queryCutoff = cutoffDate ? `?cutoffDate=${cutoffDate}` : '';

            const response = await api.get(`/finance/invoice/${idString}${queryCutoff}`, {
                responseType: 'blob'
            });

            let filename = `Invoice_${idString.slice(-6)}.pdf`;
            const disposition = response.headers?.['content-disposition'] || response.headers?.['Content-Disposition'];
            if (disposition) {
                const match = disposition.match(/filename="?([^";]+)"?/i);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download invoice:", error);
            toast.error("Failed to download invoice PDF");
        }
    };

    const downloadPayslip = async (salaryIds: string | string[]) => {
        try {
            const idArray = Array.isArray(salaryIds) ? salaryIds : [salaryIds];
            const idString = idArray.join(',');
            const response = await api.get(`/finance/payslip/${idString}`, {
                responseType: 'blob'
            });

            let filename = `Payslip_${idString.slice(-6)}.pdf`;
            const disposition = response.headers?.['content-disposition'] || response.headers?.['Content-Disposition'];
            if (disposition) {
                const match = disposition.match(/filename="?([^";]+)"?/i);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download payslip:", error);
            toast.error("Failed to download payslip PDF");
        }
    };

    const { summary, unpaidFees, paidFees, unpaidSalaries, paidSalaries } = financeData || { summary: {}, unpaidFees: [], paidFees: [], unpaidSalaries: [], paidSalaries: [] };

    // Grouping Fees by Month
    const groupedPendingFees = unpaidFees.reduce((acc: any, fee: any) => {
        if (!acc[fee.month]) acc[fee.month] = [];
        acc[fee.month].push(fee);
        return acc;
    }, {});

    const months = Object.keys(groupedPendingFees).sort((a, b) => {
        const m1 = new Date(a).getTime();
        const n2 = new Date(b).getTime();
        return n2 - m1;
    });

    // Grouping Salaries by Month
    const allSalaries = [...unpaidSalaries, ...paidSalaries];
    const groupedSalaries = allSalaries.reduce((acc: any, salary: any) => {
        if (!acc[salary.month]) acc[salary.month] = [];
        acc[salary.month].push(salary);
        return acc;
    }, {});

    const salaryMonths = Object.keys(groupedSalaries).sort((a, b) => {
        const m1 = new Date(a).getTime();
        const n2 = new Date(b).getTime();
        return n2 - m1;
    });

    // Grouping Paid Fees into Settled Transactions (supporting Multi-Month settlements as they settled)
    const settledTransactions = useMemo(() => {
        if (!paidFees || paidFees.length === 0) return [];

        const groupMap: { [key: string]: any[] } = {};

        paidFees.forEach((fee: any) => {
            let key = '';
            if (fee.settlementId) {
                key = `settle_${fee.settlementId}`;
            } else {
                key = `fee_${fee._id}`;
            }

            if (!groupMap[key]) {
                groupMap[key] = [];
            }
            groupMap[key].push(fee);
        });

        return Object.entries(groupMap).map(([key, feesList]) => {
            const firstFee = feesList[0];
            const months = Array.from(new Set(feesList.map((f: any) => f.month).filter(Boolean))) as string[];
            const totalAmount = feesList.reduce((sum: number, f: any) => sum + (f.amount || 0), 0);
            const feeIds = feesList.map((f: any) => f._id);
            const paymentDate = firstFee.paymentDate || firstFee.createdAt;
            const cutoffDate = feesList.find((f: any) => f.billingCutoffDate)?.billingCutoffDate;

            return {
                id: key,
                feeIds,
                fees: feesList,
                student: firstFee.studentId,
                transactionDate: paymentDate,
                billingCutoffDate: cutoffDate,
                months,
                totalAmount,
                isMultiMonth: months.length > 1,
            };
        }).sort((a, b) => new Date(b.transactionDate || 0).getTime() - new Date(a.transactionDate || 0).getTime());
    }, [paidFees]);

    const filteredSettledTransactions = useMemo(() => {
        return settledTransactions.filter(tx => {
            if (paidFilterType === 'multi' && !tx.isMultiMonth) return false;
            if (paidFilterType === 'single' && tx.isMultiMonth) return false;

            if (paidSearchQuery.trim()) {
                const query = paidSearchQuery.toLowerCase().trim();
                const studentName = tx.student?.fullName?.toLowerCase() || '';
                const location = tx.student?.residentialLocation?.toLowerCase() || '';
                const monthsStr = tx.months.join(' ').toLowerCase();
                const matches = studentName.includes(query) || location.includes(query) || monthsStr.includes(query);
                if (!matches) return false;
            }
            return true;
        });
    }, [settledTransactions, paidFilterType, paidSearchQuery]);

    if (loading) return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <FinanceSkeleton />
        </div>
    );

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900 overflow-x-hidden">
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
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Finance</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Control</p>
                    </div>
                </header>

                <div className="p-4 md:p-12 mt-20 lg:mt-0">
                    {/* Header Section */}
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10 mt-4 px-2">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">Finance Management</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2 ml-1">Automated Billing & Revenue Control</p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <MonthPicker 
                                selected={selectedMonth} 
                                onChange={setSelectedMonth} 
                                allLabel="All Records"
                            />

                            <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner w-full md:w-auto">
                                <button onClick={() => setActiveTab('pending')} className={`flex-1 md:flex-none px-3 md:px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'pending' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Pending AR</button>
                                <button onClick={() => setActiveTab('paid')} className={`flex-1 md:flex-none px-3 md:px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'paid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Paid Bills</button>
                                <button onClick={() => setActiveTab('payroll')} className={`flex-1 md:flex-none px-3 md:px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'payroll' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Tutor Payrolls</button>
                            </div>
                        </div>
                    </div>

                    {/* Economic Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12 px-2">
                        <div className="bg-primary p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Operational Expenses</p>
                                {/* <span className="text-[8px] md:text-[9px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {selectedMonth === 'All Records' ? 'All Time' : selectedMonth}
                                </span> */}
                            </div>
                            <h3 className="text-xl md:text-3xl font-black italic tracking-tighter mb-4 leading-none">₹{(summary.totalExpenses || 0).toLocaleString()}</h3>
                            <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold text-white/80">
                                <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                                <span className="truncate">Monthly overheads & costs</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Received Amount</p>
                                {/* <span className="text-[8px] md:text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {selectedMonth === 'All Records' ? 'All Time' : selectedMonth}
                                </span> */}
                            </div>
                            <h3 className="text-xl md:text-3xl font-black italic tracking-tighter text-teal-600 mb-3 leading-none">
                                ₹{(summary.totalReceived || 0).toLocaleString()}
                            </h3>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[8px] md:text-[9px] font-bold">
                                    <span className="text-gray-400">
                                        Receivable: <span className="text-rose-500 font-black">₹{(summary.totalReceivable || 0).toLocaleString()}</span>
                                    </span>
                                    <span className="text-teal-600 font-black">
                                        {(((summary.totalReceived || 0) / (((summary.totalReceivable || 0) + (summary.totalReceived || 0)) || 1)) * 100).toFixed(0)}% Collected
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-teal-500 h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(100, ((summary.totalReceived || 0) / (((summary.totalReceivable || 0) + (summary.totalReceived || 0)) || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F8F9FA] p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-primary border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total Salary Paid</p>
                                {/* <span className="text-[8px] md:text-[9px] font-black text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {selectedMonth === 'All Records' ? 'All Time' : selectedMonth}
                                </span> */}
                            </div>
                            <h3 className="text-xl md:text-3xl font-black italic tracking-tighter mb-3 text-gray-800 leading-none">₹{(summary.totalDisbursed || 0).toLocaleString()}</h3>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[8px] md:text-[9px] font-bold">
                                    <span className="text-gray-400">
                                        Payable: <span className="text-orange-500 font-black">₹{(summary.totalPayable || 0).toLocaleString()}</span>
                                    </span>
                                    <span className="text-primary font-black">
                                        {(((summary.totalDisbursed || 0) / (((summary.totalPayable || 0) + (summary.totalDisbursed || 0)) || 1)) * 100).toFixed(0)}% Disbursed
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200/60 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-primary h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(100, ((summary.totalDisbursed || 0) / (((summary.totalPayable || 0) + (summary.totalDisbursed || 0)) || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl relative overflow-hidden group ${summary.profit >= 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-rose-600 text-white shadow-rose-200'}`}>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Realized Profit</p>
                                {/* <span className="text-[8px] md:text-[9px] font-bold text-white/80 bg-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {selectedMonth === 'All Records' ? 'All Time' : selectedMonth}
                                </span> */}
                            </div>
                            <h3 className="text-xl md:text-3xl font-black italic tracking-tighter mb-4 leading-none">₹{(summary.profit || 0).toLocaleString()}</h3>
                            <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold text-white/80">
                                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                                <span className="truncate">Margin: {((summary.profit / (summary.totalReceived || 1)) * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="space-y-8 px-2">
                        {/* Desktop Top Action Bar - Pending Fees */}
                        {selectedFees.length > 0 && activeTab === 'pending' && (
                            <div className="hidden md:block mb-6 animate-in slide-in-from-top-4 duration-300">
                                <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">
                                            {selectedFees.length}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-primary tracking-widest">Multiple Selection Active</p>
                                            <h4 className="text-lg font-black text-gray-800 italic">
                                                Settling ₹{unpaidFees.filter((f: any) => selectedFees.includes(f._id)).reduce((sum: any, f: any) => sum + f.amount, 0).toLocaleString()} 
                                            </h4>  
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <button 
                                            onClick={() => setSelectedFees([])}
                                            className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-400 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-50 transition border border-gray-100"
                                        >
                                            Clear Selection
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const selectedData = unpaidFees.filter((f: any) => selectedFees.includes(f._id));
                                                const studentNames = Array.from(new Set(selectedData.map((f: any) => f.studentId?.fullName))).join(', ');
                                                const total = selectedData.reduce((sum: any, f: any) => sum + f.amount, 0);
                                                markFeePaid(selectedFees, studentNames, total);
                                            }}
                                            className="flex-[2] md:flex-none px-8 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 italic"
                                        >
                                            Batch Settle Selected <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Fixed Bottom Action Bar - Pending Fees */}
                        {selectedFees.length > 0 && activeTab === 'pending' && (() => {
                            const selectedFeeData = unpaidFees.filter((f: any) => selectedFees.includes(f._id));
                            const selectedStudentId = selectedFeeData[0]?.studentId?._id;
                            const selectedStudentName = selectedFeeData[0]?.studentId?.fullName;
                            const totalStudentUnpaidCount = selectedStudentId ? unpaidFees.filter((f: any) => f.studentId?._id === selectedStudentId).length : 0;
                            const restOfMonthsCount = Math.max(0, totalStudentUnpaidCount - selectedFees.length);
                            return (
                                <div className="block md:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-6 duration-300">
                                    <div className="bg-gray-900/95 backdrop-blur-md border border-white/10 text-white p-4 rounded-2xl shadow-2xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-xs font-black text-white">
                                                        {selectedFees.length}
                                                    </span>
                                                    <p className="text-xs font-black italic tracking-tight">{selectedStudentName || 'Student Selected'}</p>
                                                </div>
                                                {restOfMonthsCount > 0 ? (
                                                    <p className="text-[10px] font-bold text-amber-400 mt-1 uppercase tracking-wider">
                                                        ⚡ {restOfMonthsCount} rest of month(s) to pay
                                                    </p>
                                                ) : (
                                                    <p className="text-[10px] font-bold text-teal-400 mt-1 uppercase tracking-wider">
                                                        ✓ All pending months selected
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedFees([])}
                                                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white px-2.5 py-1 bg-white/10 rounded-lg"
                                            >
                                                Clear
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                const studentNames = Array.from(new Set(selectedFeeData.map((f: any) => f.studentId?.fullName))).join(', ');
                                                const total = selectedFeeData.reduce((sum: any, f: any) => sum + f.amount, 0);
                                                markFeePaid(selectedFees, studentNames, total);
                                            }}
                                            className="w-full py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition flex items-center justify-center gap-2 italic"
                                        >
                                            Batch Settle ₹{selectedFeeData.reduce((sum: any, f: any) => sum + f.amount, 0).toLocaleString()} <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Desktop Top Action Bar - Payroll */}
                        {selectedSalaries.length > 0 && activeTab === 'payroll' && (
                            <div className="hidden md:block mb-6 animate-in slide-in-from-top-4 duration-300">
                                <div className="bg-orange-500/5 border-2 border-orange-500/20 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-orange-500/20">
                                            {selectedSalaries.length}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Batch Payroll Active</p>
                                            <h4 className="text-lg font-black text-gray-800 italic">Disbursing ₹{allSalaries.filter((s: any) => selectedSalaries.includes(s._id)).reduce((sum: any, s: any) => sum + (s.totalSalary || 0), 0).toLocaleString()} </h4>  
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <button 
                                            onClick={() => setSelectedSalaries([])}
                                            className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-400 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-50 transition border border-gray-100"
                                        >
                                            Clear Selection
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const selectedData = allSalaries.filter((s: any) => selectedSalaries.includes(s._id));
                                                const tutorName = selectedData[0]?.teacherId?.name || 'Tutor';
                                                const total = selectedData.reduce((sum: any, s: any) => sum + (s.totalSalary || 0), 0);
                                                markSalaryPaid(selectedSalaries, tutorName, total);
                                            }}
                                            className="flex-[2] md:flex-none px-8 py-3 bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 italic"
                                        >
                                            Batch Disburse <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Fixed Bottom Action Bar - Payroll */}
                        {selectedSalaries.length > 0 && activeTab === 'payroll' && (
                            <div className="block md:hidden fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-6 duration-300">
                                <div className="bg-gray-900/95 backdrop-blur-md border border-white/10 text-white p-4 rounded-2xl shadow-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-xs font-black text-white">
                                                    {selectedSalaries.length}
                                                </span>
                                                <p className="text-xs font-black italic tracking-tight">
                                                    {allSalaries.find((s: any) => selectedSalaries.includes(s._id))?.teacherId?.name || 'Tutor Selected'}
                                                </p>
                                            </div>
                                            <p className="text-[10px] font-bold text-orange-400 mt-1 uppercase tracking-wider">
                                                Batch Payroll Disbursement
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedSalaries([])}
                                            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white px-2.5 py-1 bg-white/10 rounded-lg"
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            const selectedData = allSalaries.filter((s: any) => selectedSalaries.includes(s._id));
                                            const tutorName = selectedData[0]?.teacherId?.name || 'Tutor';
                                            const total = selectedData.reduce((sum: any, s: any) => sum + (s.totalSalary || 0), 0);
                                            markSalaryPaid(selectedSalaries, tutorName, total);
                                        }}
                                        className="w-full py-3 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/30 active:scale-95 transition flex items-center justify-center gap-2 italic"
                                    >
                                        Batch Disburse ₹{allSalaries.filter((s: any) => selectedSalaries.includes(s._id)).reduce((sum: any, s: any) => sum + (s.totalSalary || 0), 0).toLocaleString()} <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'pending' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {months.length === 0 ? (
                                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
                                        <CheckCircle2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">No pending receivables found.</p>
                                    </div>
                                ) : months.map(month => (
                                    <div key={month} className="bg-white rounded-[1.5rem] md:rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
                                        <button
                                            onClick={() => toggleMonth(month)}
                                            className="w-full px-6 md:px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Calendar className="w-5 h-5 text-primary hidden sm:block" />
                                                <h3 className="text-sm md:text-lg font-black text-gray-800 italic uppercase">{month} Earnings</h3>
                                                <span className="bg-primary/10 text-primary text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                                    {groupedPendingFees[month].length} Students
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <p className="text-sm md:text-lg font-black text-primary italic">₹{groupedPendingFees[month].reduce((sum: any, f: any) => sum + f.amount, 0).toLocaleString()}</p>
                                                {expandedMonths.includes(month) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                            </div>
                                        </button>

                                        {expandedMonths.includes(month) && (
                                            <div className="px-4 md:px-8 pb-6 pt-2">
                                                {/* Desktop View: Table */}
                                                <div className="hidden md:block overflow-x-auto">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="text-[9px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                                                <th className="pb-3 px-4 w-12">Select</th>
                                                                <th className="pb-3">Student Profile</th>
                                                                <th className="pb-3 text-center">Cycle Status</th>
                                                                <th className="pb-3 text-center">Bill Amount</th>
                                                                <th className="pb-3 text-right pr-4">Settlement</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50">
                                                            {groupedPendingFees[month].map((fee: any) => (
                                                                <tr key={fee._id} className={`${selectedFees.includes(fee._id) ? 'bg-primary/5' : ''} hover:bg-gray-50/50 transition-colors`}>
                                                                    <td className="py-4 px-4 text-center">
                                                                        <button 
                                                                            onClick={() => {
                                                                                const isSelected = selectedFees.includes(fee._id);
                                                                                if (!isSelected) {
                                                                                    const currentlySelectedData = unpaidFees.filter((f: any) => selectedFees.includes(f._id));
                                                                                    if (currentlySelectedData.length > 0) {
                                                                                        const firstStudentId = currentlySelectedData[0].studentId?._id;
                                                                                        if (fee.studentId?._id !== firstStudentId) {
                                                                                            toast.error("Please select fees for a single student at a time.");
                                                                                            return;
                                                                                        }
                                                                                    }
                                                                                    setSelectedFees(prev => [...prev, fee._id]);
                                                                                } else {
                                                                                    setSelectedFees(prev => prev.filter(id => id !== fee._id));
                                                                                }
                                                                            }}
                                                                            className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedFees.includes(fee._id) ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white border-gray-200 hover:border-primary/40'}`}
                                                                        >
                                                                            {selectedFees.includes(fee._id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                                        </button>
                                                                    </td>
                                                                    <td className="py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 text-[10px] font-black italic">{fee.studentId?.fullName?.charAt(0)}</div>
                                                                            <div>
                                                                                <p className="text-xs md:text-sm font-black text-gray-800">{fee.studentId?.fullName}</p>
                                                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{fee.studentId?.residentialLocation || 'Active Portfolio'}</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 text-center">
                                                                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 italic">Unsettled</span>
                                                                    </td>
                                                                    <td className="py-4 text-center">
                                                                        <span className="text-xs md:text-sm font-black text-gray-800 italic tracking-tight">₹{fee.amount.toLocaleString()}</span>
                                                                    </td>
                                                                    <td className="py-4 text-right pr-4">
                                                                        <button
                                                                            onClick={() => markFeePaid(fee._id, fee.studentId?.fullName, fee.amount)}
                                                                            className="px-4 md:px-6 py-2 bg-primary hover:bg-primary/90 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition shadow-lg shadow-primary/10 flex items-center gap-2 ml-auto italic"
                                                                        >
                                                                            Bill Now <ArrowUpRight className="w-3 h-3" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Mobile View: Div Cards */}
                                                <div className="block md:hidden space-y-2.5">
                                                    {groupedPendingFees[month].map((fee: any) => (
                                                        <div 
                                                            key={fee._id}
                                                            onClick={() => {
                                                                const isSelected = selectedFees.includes(fee._id);
                                                                if (!isSelected) {
                                                                    const currentlySelectedData = unpaidFees.filter((f: any) => selectedFees.includes(f._id));
                                                                    if (currentlySelectedData.length > 0) {
                                                                        const firstStudentId = currentlySelectedData[0].studentId?._id;
                                                                        if (fee.studentId?._id !== firstStudentId) {
                                                                            toast.error("Please select fees for a single student at a time.");
                                                                            return;
                                                                        }
                                                                    }
                                                                    setSelectedFees(prev => [...prev, fee._id]);
                                                                } else {
                                                                    setSelectedFees(prev => prev.filter(id => id !== fee._id));
                                                                }
                                                            }}
                                                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                                                selectedFees.includes(fee._id) 
                                                                    ? 'bg-primary/10 border-primary shadow-sm' 
                                                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                                            }`}
                                                        >
                                                            {/* Student Profile Info */}
                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black italic shrink-0 transition-all ${
                                                                    selectedFees.includes(fee._id) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                    {selectedFees.includes(fee._id) ? <CheckCircle2 className="w-4 h-4 text-white" /> : fee.studentId?.fullName?.charAt(0)}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-black text-gray-900 truncate">{fee.studentId?.fullName}</p>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">
                                                                        {fee.studentId?.residentialLocation || 'Active Student'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Right: Bill Amount & Quick Settle */}
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-xs md:text-sm font-black text-primary italic tracking-tight">₹{fee.amount.toLocaleString()}</span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        markFeePaid(fee._id, fee.studentId?.fullName, fee.amount);
                                                                    }}
                                                                    className="p-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-md active:scale-95"
                                                                    title="Bill Now"
                                                                >
                                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'paid' && (
                            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-200 shrink-0">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-800 italic uppercase leading-none">
                                                Settled Transactions
                                            </h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                {settledTransactions.length} Settlements • {paidFees.length} Module Cycles Verified
                                            </p>
                                        </div>
                                    </div>

                                    {/* Search & Filter Controls */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <div className="relative w-full sm:w-60">
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="text"
                                                value={paidSearchQuery}
                                                onChange={(e) => setPaidSearchQuery(e.target.value)}
                                                placeholder="Search student, month..."
                                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 transition"
                                            />
                                        </div>

                                        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-[9px] font-black uppercase tracking-wider shrink-0">
                                            <button
                                                onClick={() => setPaidFilterType('all')}
                                                className={`px-3 py-1.5 rounded-lg transition-all ${paidFilterType === 'all' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                                            >
                                                All ({settledTransactions.length})
                                            </button>
                                            <button
                                                onClick={() => setPaidFilterType('multi')}
                                                className={`px-3 py-1.5 rounded-lg transition-all ${paidFilterType === 'multi' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                                            >
                                                Multi ({settledTransactions.filter(t => t.isMultiMonth).length})
                                            </button>
                                            <button
                                                onClick={() => setPaidFilterType('single')}
                                                className={`px-3 py-1.5 rounded-lg transition-all ${paidFilterType === 'single' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                                            >
                                                Single ({settledTransactions.filter(t => !t.isMultiMonth).length})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Desktop View: Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[750px] md:min-w-0">
                                        <thead>
                                            <tr className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-8 py-6">Transaction Date</th>
                                                <th className="px-4 py-6">Student Profile</th>
                                                <th className="px-4 py-6">Settlement Type & Months</th>
                                                <th className="px-4 py-6 text-center">Settled Amount</th>
                                                <th className="px-8 py-6 text-right">Receipt / Invoice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredSettledTransactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="py-20 text-center text-gray-300 font-bold italic uppercase tracking-widest text-xs">
                                                        No settled transactions matching criteria.
                                                    </td>
                                                </tr>
                                            ) : filteredSettledTransactions.map((tx: any) => (
                                                <tr key={tx.id} className="group hover:bg-gray-50/50 transition">
                                                    <td className="px-8 py-5">
                                                        <p className="text-xs font-bold text-gray-800 italic">
                                                            {tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                        {tx.billingCutoffDate && (
                                                            <p className="text-[10px] font-semibold text-primary mt-0.5 italic">
                                                                Cutoff: {new Date(tx.billingCutoffDate).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 font-black flex items-center justify-center text-xs italic">
                                                                {tx.student?.fullName?.charAt(0) || 'S'}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-gray-800">{tx.student?.fullName || 'Student'}</p>
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                                                    {tx.student?.class ? `Class ${tx.student.class}` : 'Active Portfolio'} {tx.student?.residentialLocation ? `• ${tx.student.residentialLocation}` : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5">
                                                        {tx.isMultiMonth ? (
                                                            <div className="space-y-1.5">
                                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-primary/10 to-teal-500/10 text-primary border border-primary/20 rounded-lg text-[9px] font-black uppercase tracking-wider italic">
                                                                    <span>⚡ Multi-Month Settlement</span>
                                                                    <span className="w-4 h-4 rounded-full bg-primary text-white text-[8px] flex items-center justify-center font-bold">
                                                                        {tx.months.length}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {tx.months.map((m: string) => (
                                                                        <span key={m} className="text-[9px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md italic">
                                                                            {m}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-3 py-1.5 rounded-lg italic border border-primary/10">
                                                                {tx.months[0] || 'Single Month'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        <span className="text-sm md:text-base font-black text-teal-600 italic tracking-tight">
                                                            ₹{tx.totalAmount.toLocaleString()}
                                                        </span>
                                                        {tx.isMultiMonth && (
                                                            <p className="text-[9px] font-bold text-gray-400 mt-0.5">
                                                                {tx.fees.length} cycles settled
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button
                                                            onClick={() => downloadInvoice(tx.feeIds)}
                                                            className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition border border-gray-200 hover:border-primary/20 font-bold text-xs shadow-sm ml-auto"
                                                            title={tx.isMultiMonth ? "Download Consolidated Multi-Month Invoice" : "Download Invoice"}
                                                        >
                                                            <Download className="w-4 h-4 text-teal-600" />
                                                            <span className="text-[10px] font-black uppercase tracking-wider">
                                                                {tx.isMultiMonth ? 'Batch Invoice' : 'Invoice'}
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View: Div Cards */}
                                <div className="block md:hidden p-3 space-y-3">
                                    {filteredSettledTransactions.length === 0 ? (
                                        <div className="py-12 text-center text-gray-400 font-bold italic uppercase tracking-widest text-xs">
                                            No settled transactions matching criteria.
                                        </div>
                                    ) : filteredSettledTransactions.map((tx: any) => (
                                        <div key={tx.id} className="p-4 rounded-2xl border border-gray-100 bg-white space-y-3 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 font-black flex items-center justify-center text-xs italic shrink-0">
                                                        {tx.student?.fullName?.charAt(0) || 'S'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-black text-gray-900 truncate">{tx.student?.fullName || 'Student'}</p>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5 truncate">
                                                            {tx.student?.residentialLocation || 'Active Student'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {tx.isMultiMonth ? (
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[8px] font-black uppercase tracking-wider italic shrink-0">
                                                        ⚡ {tx.months.length} Months
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-md text-[8px] font-black uppercase tracking-wider italic shrink-0">
                                                        {tx.months[0]}
                                                    </span>
                                                )}
                                            </div>

                                            {tx.isMultiMonth && (
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {tx.months.map((m: string) => (
                                                        <span key={m} className="text-[8px] font-bold text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded italic">
                                                            {m}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs">
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 italic block">
                                                        Paid: {tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString() : 'N/A'}
                                                        {tx.billingCutoffDate && ` • Cutoff: ${new Date(tx.billingCutoffDate).toLocaleDateString()}`}
                                                    </span>
                                                    <span className="text-sm font-black text-teal-600 italic tracking-tight">
                                                        ₹{tx.totalAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => downloadInvoice(tx.feeIds)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl transition border border-teal-100 text-[9px] font-black uppercase tracking-wider"
                                                    title="Download Invoice"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>{tx.isMultiMonth ? 'Batch Receipt' : 'Receipt'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'payroll' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {salaryMonths.length === 0 ? (
                                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
                                        <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold italic uppercase tracking-widest text-[10px]">No payroll records detected.</p>
                                    </div>
                                ) : salaryMonths.map(month => (
                                    <div key={month} className="bg-white rounded-[1.5rem] md:rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
                                        <button
                                            onClick={() => toggleMonth(`salary_${month}`)}
                                            className="w-full px-6 md:px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <IndianRupee className="w-5 h-5 text-orange-500 hidden sm:block" />
                                                <h3 className="text-sm md:text-lg font-black text-gray-800 italic uppercase">{month} Payroll</h3>
                                                <span className="bg-orange-50 text-orange-600 text-[8px] md:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                                    {groupedSalaries[month].length} Tutors
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <p className="text-sm md:text-lg font-black text-orange-600 italic">₹{groupedSalaries[month].reduce((sum: any, s: any) => sum + (s.totalSalary || 0), 0).toLocaleString()}</p>
                                                {expandedMonths.includes(`salary_${month}`) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                            </div>
                                        </button>

                                        {expandedMonths.includes(`salary_${month}`) && (
                                            <div className="px-4 md:px-8 pb-6 pt-2">
                                                {/* Desktop View: Table */}
                                                <div className="hidden md:block overflow-x-auto">
                                                    <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                                                        <thead>
                                                            <tr className="text-[9px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">
                                                                <th className="pb-3 px-4">Tutor Profile</th>
                                                                <th className="pb-3 text-center">Class Hours</th>
                                                                <th className="pb-3 text-center">Net Salary</th>
                                                                <th className="pb-3 text-right pr-4">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-50">
                                                            {groupedSalaries[month].map((salary: any) => (
                                                                <tr key={salary._id} className={`${selectedSalaries.includes(salary._id) ? 'bg-orange-50/50' : ''} hover:bg-gray-50/50 transition-colors`}>
                                                                    <td className="py-4 px-4">
                                                                        <div className="flex items-center gap-3">
                                                                            {salary.paidStatus !== 'paid' && (
                                                                                <button 
                                                                                    onClick={() => {
                                                                                        const isSelected = selectedSalaries.includes(salary._id);
                                                                                        if (!isSelected) {
                                                                                            const currentlySelectedData = allSalaries.filter((s: any) => selectedSalaries.includes(s._id));
                                                                                            if (currentlySelectedData.length > 0) {
                                                                                                const firstTeacherId = currentlySelectedData[0].teacherId?._id;
                                                                                                if (salary.teacherId?._id !== firstTeacherId) {
                                                                                                    toast.error("Please select payrolls for a single tutor at a time.");
                                                                                                    return;
                                                                                                }
                                                                                            }
                                                                                            setSelectedSalaries(prev => [...prev, salary._id]);
                                                                                        } else {
                                                                                            setSelectedSalaries(prev => prev.filter(id => id !== salary._id));
                                                                                        }
                                                                                    }}
                                                                                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedSalaries.includes(salary._id) ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white border-gray-200 hover:border-orange-500/40'}`}
                                                                                >
                                                                                    {selectedSalaries.includes(salary._id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                                                </button>
                                                                            )}
                                                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 text-[10px] font-black italic">{salary.teacherId?.name?.charAt(0)}</div>
                                                                            <div>
                                                                                <p className="text-xs md:text-sm font-black text-gray-800">{salary.teacherId?.name}</p>
                                                                                <p className="text-[8px] font-bold text-gray-400 italic font-mono uppercase tracking-tighter">Rate: ₹{salary.salaryPerHour}/hr</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-4 text-center">
                                                                        <span className="text-xs md:text-sm font-black text-gray-600 tracking-tighter italic">{salary.totalHours} hrs</span>
                                                                    </td>
                                                                    <td className="py-4 text-center">
                                                                        <span className="text-xs md:text-sm font-black text-gray-900 italic tracking-tight">₹{(salary.totalSalary || 0).toLocaleString()}</span>
                                                                    </td>
                                                                    <td className="py-4 text-right pr-4">
                                                                        {salary.paidStatus === 'paid' ? (
                                                                            <div className="flex items-center justify-end gap-3">
                                                                                <button
                                                                                    onClick={() => downloadPayslip(salary._id)}
                                                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition border border-transparent hover:border-primary/20"
                                                                                >
                                                                                    <Download className="w-4 h-4" />
                                                                                </button>
                                                                                <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-lg border border-teal-100 italic">Disbursed</span>
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => markSalaryPaid(salary._id, salary.teacherId?.name, salary.totalSalary)}
                                                                                className="px-4 md:px-6 py-2 bg-primary hover:bg-primary/90 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition shadow-lg shadow-primary/10 italic"
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

                                                {/* Mobile View: Div Cards */}
                                                <div className="block md:hidden space-y-2.5">
                                                    {groupedSalaries[month].map((salary: any) => (
                                                        <div 
                                                            key={salary._id}
                                                            onClick={() => {
                                                                if (salary.paidStatus === 'paid') return;
                                                                const isSelected = selectedSalaries.includes(salary._id);
                                                                if (!isSelected) {
                                                                    const currentlySelectedData = allSalaries.filter((s: any) => selectedSalaries.includes(s._id));
                                                                    if (currentlySelectedData.length > 0) {
                                                                        const firstTeacherId = currentlySelectedData[0].teacherId?._id;
                                                                        if (salary.teacherId?._id !== firstTeacherId) {
                                                                            toast.error("Please select payrolls for a single tutor at a time.");
                                                                            return;
                                                                        }
                                                                    }
                                                                    setSelectedSalaries(prev => [...prev, salary._id]);
                                                                } else {
                                                                    setSelectedSalaries(prev => prev.filter(id => id !== salary._id));
                                                                }
                                                            }}
                                                            className={`p-3.5 rounded-xl border transition-all ${
                                                                salary.paidStatus === 'paid'
                                                                    ? 'bg-gray-50/70 border-gray-100'
                                                                    : selectedSalaries.includes(salary._id)
                                                                    ? 'bg-orange-500/10 border-orange-500 shadow-sm cursor-pointer'
                                                                    : 'bg-white border-gray-100 hover:border-gray-200 cursor-pointer'
                                                            } flex items-center justify-between gap-3`}
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black italic shrink-0 transition-all ${
                                                                    salary.paidStatus === 'paid'
                                                                        ? 'bg-teal-50 text-teal-600 border border-teal-100'
                                                                        : selectedSalaries.includes(salary._id)
                                                                        ? 'bg-orange-500 text-white'
                                                                        : 'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                    {selectedSalaries.includes(salary._id) ? <CheckCircle2 className="w-4 h-4 text-white" /> : salary.teacherId?.name?.charAt(0)}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-black text-gray-900 truncate">{salary.teacherId?.name}</p>
                                                                    <p className="text-[9px] font-bold text-gray-400 italic">
                                                                        {salary.totalHours} hrs • Rate: ₹{salary.salaryPerHour}/hr
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <span className="text-xs font-black text-gray-900 italic tracking-tight">₹{(salary.totalSalary || 0).toLocaleString()}</span>
                                                                {salary.paidStatus === 'paid' ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                downloadPayslip(salary._id);
                                                                            }}
                                                                            className="p-1.5 text-gray-400 hover:text-primary rounded-lg"
                                                                            title="Download Payslip"
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                        </button>
                                                                        <span className="text-[8px] font-black text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-100 italic">Disbursed</span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            markSalaryPaid(salary._id, salary.teacherId?.name, salary.totalSalary);
                                                                        }}
                                                                        className="px-3 py-1.5 bg-primary text-white font-black text-[9px] uppercase tracking-wider rounded-lg shadow-sm italic"
                                                                    >
                                                                        Disburse
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Insight */}
                    <div className="mt-12 flex items-center gap-4 p-8 bg-indigo-50/50 rounded-[2rem] md:rounded-[2.5rem] border border-indigo-100 text-indigo-700 mx-2">
                        <AlertCircle className="w-6 h-6 flex-shrink-0 opacity-40" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">Institutional Intelligence</p>
                            <p className="text-xs font-bold italic opacity-80 leading-relaxed text-indigo-900/60">Billing triggers automatically as tutors mark attendance. No manual invoice creation required. All dues are calculated in real-time with automated reconciliation.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-300">
                    <div 
                        className="absolute inset-0 bg-primary/20 backdrop-blur-md" 
                        onClick={() => !confirmModal.loading && setConfirmModal(prev => ({...prev, isOpen: false}))}
                    ></div>
                    
                    <div className={`bg-white rounded-[1.75rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border-2 sm:border-4 border-white max-h-[92vh] flex flex-col ${confirmModal.isFee ? 'max-w-4xl lg:max-w-5xl w-full' : 'max-w-md w-full'}`}>
                        
                        {/* Close Button at Top-Right */}
                        <button
                            onClick={() => !confirmModal.loading && setConfirmModal(prev => ({...prev, isOpen: false}))}
                            disabled={confirmModal.loading}
                            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition z-20 cursor-pointer"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {confirmModal.isFee ? (
                            <div className="flex flex-col h-full overflow-hidden">
                                {/* Header (Always Visible) */}
                                <div className="flex items-center gap-3 mb-3 pr-8 flex-shrink-0">
                                    <div className="w-10 h-10 md:w-11 md:h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                                        <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 italic uppercase tracking-tighter leading-tight">
                                                {confirmModal.title}
                                            </h3>
                                            <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                Billing Reconciliation
                                            </span>
                                        </div>
                                        <p className="text-gray-400 font-bold text-[11px] md:text-xs leading-snug mt-0.5 line-clamp-1 sm:line-clamp-none">
                                            {confirmModal.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Mobile Tab Switcher (Visible on Mobile only) */}
                                <div className="flex lg:hidden bg-slate-100/90 p-1 rounded-xl mb-3 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setModalMobileTab('summary')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${modalMobileTab === 'summary' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        <Wallet className="w-3.5 h-3.5" />
                                        <span>Settlement</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalMobileTab('activities')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${modalMobileTab === 'activities' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>Classes ({cutoffActivities.length})</span>
                                    </button>
                                </div>

                                {/* Content Area: Desktop View */}
                                <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start overflow-y-auto pr-1">
                                    {/* Left Column: Settlement Controls & Calculations */}
                                    <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                                        <div>
                                            {/* Settlement Amount Card */}
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-teal-500/10 border border-primary/20 shadow-sm mb-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                                                            Calculated Settlement Due
                                                        </p>
                                                        <div className="flex items-baseline gap-2 mt-0.5">
                                                            <span className="text-3xl font-black text-gray-900 italic tracking-tight">
                                                                ₹{settlementAmount.toLocaleString()}
                                                            </span>
                                                            {isCalculatingAmount && (
                                                                <span className="text-[8px] font-black text-primary animate-pulse uppercase tracking-wider bg-primary/15 px-2 py-0.5 rounded-full">
                                                                    Updating...
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 font-black text-lg italic flex-shrink-0">
                                                        <IndianRupee className="w-5 h-5" />
                                                    </div>
                                                </div>
                                                {calculationNote && (
                                                    <p className="text-[10px] font-bold text-gray-500 mt-2 italic border-t border-primary/10 pt-2">
                                                        {calculationNote}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Cutoff Date Picker */}
                                            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 mb-2">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/80">
                                                        Bill Activity Until (Cutoff Date)
                                                    </label>
                                                    <span className="text-[8px] font-black text-primary bg-white border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                                                        Configurable
                                                    </span>
                                                </div>
                                                <input 
                                                    type="date"
                                                    value={billingCutoffDate}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setBillingCutoffDate(val);
                                                        if (val && activeFeeIds.length > 0) {
                                                            calculateCutoffAmount(activeFeeIds, val);
                                                        }
                                                    }}
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200/80 bg-white font-bold text-xs text-gray-800 focus:outline-none focus:border-primary shadow-sm transition"
                                                />
                                                <p className="text-[9px] text-indigo-950/60 font-medium mt-2 italic leading-tight">
                                                    Classes & hours on the right update automatically as you adjust this cutoff date.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Desktop Modal Action Buttons */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                                disabled={confirmModal.loading}
                                                className="flex-1 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => confirmModal.onConfirm(billingCutoffDate)}
                                                disabled={confirmModal.loading || isCalculatingAmount}
                                                className="flex-[2] py-3.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/25 hover:scale-102 active:scale-98 transition disabled:opacity-50 italic cursor-pointer"
                                            >
                                                {confirmModal.loading ? 'Processing...' : `Confirm (₹${settlementAmount.toLocaleString()})`}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Column: Attendance Activity Table */}
                                    <div className="lg:col-span-7 bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 flex flex-col justify-between min-h-[380px]">
                                        <div>
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-slate-200">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold">
                                                        <BookOpen className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-gray-900 uppercase italic tracking-tight">
                                                            Included Activity Records
                                                        </h4>
                                                        <p className="text-[9px] font-bold text-gray-400">
                                                            Class sessions logged up to selected cutoff date
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="px-2.5 py-1 bg-white text-teal-700 font-black text-[10px] rounded-lg border border-teal-200 shadow-2xs italic">
                                                        {cutoffActivities.length} Class{cutoffActivities.length !== 1 ? 'es' : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Table Container */}
                                            {isCalculatingAmount ? (
                                                <div className="py-14 flex flex-col items-center justify-center space-y-3">
                                                    <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-xs font-bold text-gray-400 italic">Recalculating learning activities...</p>
                                                </div>
                                            ) : cutoffActivities.length === 0 ? (
                                                <div className="py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/60 my-2">
                                                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
                                                    <p className="text-xs font-black text-gray-700 uppercase tracking-tight">No Attendance Logs Found</p>
                                                    <p className="text-[10px] text-gray-400 font-medium mt-1 max-w-xs mx-auto">
                                                        No active class sessions were logged before or on this cutoff date.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs">
                                                    <div className="max-h-[260px] overflow-y-auto">
                                                        <table className="w-full text-left border-collapse text-xs">
                                                            <thead className="bg-gray-50/90 text-[9px] font-black text-gray-400 uppercase tracking-widest sticky top-0 z-10 border-b border-gray-100 backdrop-blur-xs">
                                                                <tr>
                                                                    <th className="px-3 py-2.5">Date</th>
                                                                    <th className="px-3 py-2.5">Subject & Tutor</th>
                                                                    <th className="px-3 py-2.5 text-center">Duration</th>
                                                                    <th className="px-3 py-2.5 text-right">Rate</th>
                                                                    <th className="px-3 py-2.5 text-right">Amount</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {cutoffActivities.map((act: any, idx: number) => {
                                                                    const dateStr = act.date ? new Date(act.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-';
                                                                    return (
                                                                        <tr key={act._id || idx} className="hover:bg-teal-50/30 transition">
                                                                            <td className="px-3 py-2.5 font-bold text-gray-800 whitespace-nowrap">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                                                                    <span>{dateStr}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-3 py-2.5">
                                                                                <p className="font-bold text-gray-900 leading-tight">{act.subjectName}</p>
                                                                                <p className="text-[9px] font-medium text-gray-400 leading-tight">{act.teacherName}</p>
                                                                            </td>
                                                                            <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                                                <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                                                                                    {act.hours.toFixed(1)} hr
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-3 py-2.5 text-right font-medium text-gray-500 whitespace-nowrap">
                                                                                ₹{act.billRate}/hr
                                                                            </td>
                                                                            <td className="px-3 py-2.5 text-right font-black text-gray-900 whitespace-nowrap">
                                                                                ₹{act.amount.toLocaleString()}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Summary Footer Pill */}
                                        {cutoffActivities.length > 0 && !isCalculatingAmount && (
                                            <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold text-gray-500 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                                    <span>Total Logged: <strong className="text-gray-900">{cutoffActivities.reduce((s: number, a: any) => s + (a.hours || 0), 0).toFixed(1)} hrs</strong></span>
                                                </div>
                                                <div className="text-right">
                                                    <span>Gross: <strong className="text-gray-900">₹{cutoffActivities.reduce((s: number, a: any) => s + (a.amount || 0), 0).toLocaleString()}</strong></span>
                                                    {cutoffSummary && cutoffSummary.paid > 0 && (
                                                        <span className="text-emerald-600 ml-2 font-bold">(-₹{cutoffSummary.paid.toLocaleString()} paid)</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Area: Mobile Responsive View */}
                                <div className="block lg:hidden flex-1 overflow-y-auto pr-0.5 space-y-3">
                                    {modalMobileTab === 'summary' ? (
                                        <div className="space-y-3 animate-in fade-in duration-150">
                                            {/* Settlement Amount Card */}
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-teal-500/10 border border-primary/20 shadow-xs">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                                                            Calculated Settlement Due
                                                        </p>
                                                        <div className="flex items-baseline gap-2 mt-0.5">
                                                            <span className="text-2xl sm:text-3xl font-black text-gray-900 italic tracking-tight">
                                                                ₹{settlementAmount.toLocaleString()}
                                                            </span>
                                                            {isCalculatingAmount && (
                                                                <span className="text-[8px] font-black text-primary animate-pulse uppercase tracking-wider bg-primary/15 px-2 py-0.5 rounded-full">
                                                                    Updating...
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 font-black text-lg italic flex-shrink-0">
                                                        <IndianRupee className="w-5 h-5" />
                                                    </div>
                                                </div>
                                                {calculationNote && (
                                                    <p className="text-[10px] font-bold text-gray-500 mt-2 italic border-t border-primary/10 pt-2 leading-relaxed">
                                                        {calculationNote}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Cutoff Date Picker */}
                                            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-900/80">
                                                        Cutoff Date
                                                    </label>
                                                    <span className="text-[8px] font-black text-primary bg-white border border-primary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                                                        Configurable
                                                    </span>
                                                </div>
                                                <input 
                                                    type="date"
                                                    value={billingCutoffDate}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setBillingCutoffDate(val);
                                                        if (val && activeFeeIds.length > 0) {
                                                            calculateCutoffAmount(activeFeeIds, val);
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 rounded-xl border border-indigo-200/80 bg-white font-bold text-xs text-gray-800 focus:outline-none focus:border-primary shadow-xs transition"
                                                />
                                                <p className="text-[9px] text-indigo-950/60 font-medium mt-1.5 italic leading-tight">
                                                    Activity & amount update automatically based on cutoff date.
                                                </p>
                                            </div>

                                            {/* Activity Quick Link Card */}
                                            <button
                                                type="button"
                                                onClick={() => setModalMobileTab('activities')}
                                                className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-left transition flex items-center justify-between group cursor-pointer"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold flex-shrink-0">
                                                        <BookOpen className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 uppercase italic">
                                                            {cutoffActivities.length} Classes Included
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-bold">
                                                            {cutoffActivities.reduce((s: number, a: any) => s + (a.hours || 0), 0).toFixed(1)} hrs logged
                                                            {cutoffSummary && cutoffSummary.paid > 0 && ` • ₹${cutoffSummary.paid.toLocaleString()} prev. paid`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-primary font-bold text-xs group-hover:translate-x-0.5 transition">
                                                    <span>View</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </button>
                                        </div>
                                    ) : (
                                        /* Activities List on Mobile */
                                        <div className="space-y-2.5 animate-in fade-in duration-150">
                                            {isCalculatingAmount ? (
                                                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-xs font-bold text-gray-400 italic">Updating classes...</p>
                                                </div>
                                            ) : cutoffActivities.length === 0 ? (
                                                <div className="py-10 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/60">
                                                    <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-xs font-black text-gray-700 uppercase">No Classes Logged</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">No attendance logs before cutoff date.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                                    {cutoffActivities.map((act: any, idx: number) => {
                                                        const dateStr = act.date ? new Date(act.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-';
                                                        return (
                                                            <div key={act._id || idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col gap-1.5 shadow-2xs">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                                                        <span className="text-xs font-black text-gray-800">{dateStr}</span>
                                                                        <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                                            {act.subjectName}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs font-black text-gray-900">
                                                                        ₹{act.amount.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-[10px] text-gray-500">
                                                                    <span className="truncate max-w-[170px] font-medium text-gray-600">{act.teacherName || 'Tutor'}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[9px] font-bold text-gray-700">
                                                                            {act.hours.toFixed(1)} hr
                                                                        </span>
                                                                        <span className="text-gray-400 font-medium">₹{act.billRate}/hr</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Mobile Activities Summary */}
                                            {cutoffActivities.length > 0 && !isCalculatingAmount && (
                                                <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200 flex items-center justify-between text-[10px] font-bold text-gray-600">
                                                    <span>Total: <strong>{cutoffActivities.reduce((s: number, a: any) => s + (a.hours || 0), 0).toFixed(1)} hrs</strong></span>
                                                    <span>Gross: <strong>₹{cutoffActivities.reduce((s: number, a: any) => s + (a.amount || 0), 0).toLocaleString()}</strong></span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Sticky / Bottom Action Bar (Visible on Mobile only) */}
                                <div className="flex lg:hidden gap-2.5 pt-3 mt-3 border-t border-slate-100 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                        disabled={confirmModal.loading}
                                        className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => confirmModal.onConfirm(billingCutoffDate)}
                                        disabled={confirmModal.loading || isCalculatingAmount}
                                        className="flex-[2] py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/25 active:scale-98 transition disabled:opacity-50 italic cursor-pointer truncate px-2"
                                    >
                                        {confirmModal.loading ? 'Processing...' : `Confirm (₹${settlementAmount.toLocaleString()})`}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Compact Single-Column Layout for Disbursement / Non-Fee Modals */
                            <div>
                                <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-4 md:mb-6 animate-bounce">
                                    <Wallet className="w-7 h-7 md:w-10 md:h-10" />
                                </div>
                                <h3 className="text-lg md:text-2xl font-black text-gray-900 italic uppercase tracking-tighter mb-2 md:mb-3 leading-none">
                                    {confirmModal.title}
                                </h3>
                                <p className="text-gray-400 font-bold text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                                    {confirmModal.message}
                                </p>

                                <div className="mb-4 md:mb-6 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-teal-500/10 border-2 border-primary/20 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                                                Disbursement Amount
                                            </p>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-2xl md:text-3xl font-black text-gray-900 italic tracking-tight">
                                                    ₹{settlementAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25 font-black text-xl italic flex-shrink-0">
                                            <IndianRupee className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 md:gap-4">
                                    <button
                                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                        disabled={confirmModal.loading}
                                        className="flex-1 py-3 md:py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => confirmModal.onConfirm(billingCutoffDate)}
                                        disabled={confirmModal.loading || isCalculatingAmount}
                                        className="flex-[2] py-3 md:py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition disabled:opacity-50 italic cursor-pointer"
                                    >
                                        {confirmModal.loading ? 'Processing...' : `Confirm Disbursement (₹${settlementAmount.toLocaleString()})`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
