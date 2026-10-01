'use client';
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { 
    X, 
    TrendingUp, 
    TrendingDown, 
    SlidersHorizontal, 
    IndianRupee, 
    Percent, 
    CheckCircle2, 
    AlertCircle, 
    Calendar,
    Briefcase,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StaffSalaryControlModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    staff: any;
    allStaffList?: any[];
    salaryAdjustments?: any[];
    defaultMonth?: string;
}

export default function StaffSalaryControlModal({
    isOpen,
    onClose,
    onSuccess,
    staff,
    allStaffList = [],
    salaryAdjustments = [],
    defaultMonth
}: StaffSalaryControlModalProps) {
    const getCurrentMonthYear = () => {
        const date = new Date();
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    };

    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [controlType, setControlType] = useState<'increment' | 'cut'>('increment');
    const [inputMode, setInputMode] = useState<'flat' | 'percent'>('flat');
    const [amountValue, setAmountValue] = useState<number>(0);
    const [reason, setReason] = useState<string>('');
    const [effectiveMonth, setEffectiveMonth] = useState<string>(defaultMonth || getCurrentMonthYear());
    const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState<boolean>(false);

    // Generate recent and upcoming 12 months for selector
    const getMonthOptions = () => {
        const options: string[] = [];
        const date = new Date();
        // 6 months in past to 6 months in future
        for (let i = -6; i <= 6; i++) {
            const d = new Date(date.getFullYear(), date.getMonth() + i, 1);
            options.push(d.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
        }
        return options;
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (staff?._id) {
                setSelectedStaffId(staff._id);
            } else if (allStaffList.length > 0) {
                setSelectedStaffId(allStaffList[0]._id);
            }
            setControlType('increment');
            setInputMode('flat');
            setAmountValue(0);
            setReason('');
            const initialMonth = defaultMonth || getCurrentMonthYear();
            setEffectiveMonth(initialMonth);
            
            // Set effective date to 1st of effective month
            try {
                const parts = initialMonth.trim().split(/\s+/);
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const mIndex = monthNames.findIndex(m => m.toLowerCase() === parts[0].toLowerCase());
                const yr = parseInt(parts[1], 10);
                if (mIndex !== -1 && !isNaN(yr)) {
                    const d = new Date(yr, mIndex, 1);
                    setEffectiveDate(d.toISOString().split('T')[0]);
                } else {
                    setEffectiveDate(new Date().toISOString().split('T')[0]);
                }
            } catch {
                setEffectiveDate(new Date().toISOString().split('T')[0]);
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, staff, allStaffList, defaultMonth]);

    if (!isOpen) return null;

    const currentStaff = (allStaffList.find(s => s._id === selectedStaffId)) || staff;

    const getSalaryBeforeMonth = (staffObj: any, monthStr: string): number => {
        if (!staffObj) return 0;
        if (!salaryAdjustments || salaryAdjustments.length === 0) {
            return Number(staffObj.effectiveBaseSalary !== undefined ? staffObj.effectiveBaseSalary : staffObj.baseSalary) || 0;
        }

        const sId = staffObj._id;
        const staffAdjs = salaryAdjustments
            .filter(a => {
                const aStaffId = typeof a.staffId === 'object' ? a.staffId?._id : a.staffId;
                return aStaffId === sId;
            })
            .sort((a, b) => new Date(a.effectiveDate || a.createdAt).getTime() - new Date(b.effectiveDate || b.createdAt).getTime());

        if (staffAdjs.length === 0) {
            return Number(staffObj.baseSalary) || 0;
        }

        try {
            const parts = monthStr.trim().split(/\s+/);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const mIndex = monthNames.findIndex(m => m.toLowerCase() === parts[0].toLowerCase());
            const yr = parseInt(parts[1], 10);
            if (mIndex !== -1 && !isNaN(yr)) {
                const monthStart = new Date(yr, mIndex, 1, 0, 0, 0, 0);
                const priorAdjustments = staffAdjs.filter(a => {
                    const effDate = new Date(a.effectiveDate || a.createdAt);
                    return effDate.getTime() < monthStart.getTime();
                });

                if (priorAdjustments.length > 0) {
                    return priorAdjustments[priorAdjustments.length - 1].newSalary;
                } else {
                    return staffAdjs[0].previousSalary;
                }
            }
        } catch {}

        return Number(staffObj.baseSalary) || 0;
    };

    const currentSalary = getSalaryBeforeMonth(currentStaff, effectiveMonth);

    // Calculate actual adjustment delta in ₹
    const calculatedDelta = inputMode === 'flat' 
        ? amountValue 
        : Math.round((currentSalary * (amountValue || 0)) / 100);

    const calculatedNewSalary = controlType === 'increment'
        ? currentSalary + calculatedDelta
        : Math.max(0, currentSalary - calculatedDelta);

    const percentageChange = currentSalary > 0 
        ? ((calculatedDelta / currentSalary) * 100).toFixed(1) 
        : '0';

    const handleMonthChange = (newMonth: string) => {
        setEffectiveMonth(newMonth);
        try {
            const parts = newMonth.trim().split(/\s+/);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const mIndex = monthNames.findIndex(m => m.toLowerCase() === parts[0].toLowerCase());
            const yr = parseInt(parts[1], 10);
            if (mIndex !== -1 && !isNaN(yr)) {
                const d = new Date(yr, mIndex, 1);
                setEffectiveDate(d.toISOString().split('T')[0]);
            }
        } catch {}
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentStaff) {
            toast.error('Please select a staff member');
            return;
        }

        if (amountValue <= 0 || calculatedDelta <= 0) {
            toast.error('Adjustment amount must be greater than 0');
            return;
        }

        if (controlType === 'cut' && calculatedNewSalary < 0) {
            toast.error('Salary cut cannot reduce base salary below ₹0');
            return;
        }

        setLoading(true);
        try {
            await api.post('/admin/staffs/adjust-salary', {
                staffId: currentStaff._id,
                type: controlType,
                changeAmount: calculatedDelta,
                reason: reason || (controlType === 'increment' ? 'Performance increment' : 'Salary deduction'),
                effectiveMonth,
                effectiveDate
            });

            toast.success(
                controlType === 'increment' 
                    ? `Increment of +₹${calculatedDelta.toLocaleString()} applied from ${effectiveMonth}!`
                    : `Salary cut of -₹${calculatedDelta.toLocaleString()} applied from ${effectiveMonth}!`
            );
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to adjust salary');
        } finally {
            setLoading(false);
        }
    };

    const isIncrement = controlType === 'increment';

    const incrementReasons = ['Annual Appraisal', 'Performance Bonus', 'Role Promotion', 'Experience Hike'];
    const cutReasons = ['Attendance Deduction', 'Disciplinary Cut', 'Work Hours Reduced', 'Policy Adjustment'];

    return (
        <div className="fixed inset-0 w-full h-full min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 my-auto animate-in fade-in zoom-in-95 duration-150">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            isIncrement 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' 
                                : 'bg-rose-50 text-rose-600 border-rose-200/60'
                        }`}>
                            <SlidersHorizontal className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-none">
                                Salary Control
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Manage monthly salary increment or salary cut
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

                {/* Staff Details / Selector */}
                <div className="px-6 pt-5">
                    {allStaffList.length > 1 && !staff ? (
                        <div className="space-y-1 mb-4">
                            <label className="text-xs font-bold text-gray-700 block">
                                Select Staff Member
                            </label>
                            <select
                                value={selectedStaffId}
                                onChange={(e) => setSelectedStaffId(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none cursor-pointer"
                            >
                                {allStaffList.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {s.name} ({s.adminRole || s.role})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : currentStaff ? (
                        <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#45308D]/10 text-[#45308D] flex items-center justify-center font-bold text-xs">
                                    {currentStaff.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">{currentStaff.name}</h4>
                                    <span className="text-[10px] font-semibold text-gray-400">{currentStaff.email}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-[10px] font-bold text-[#45308D] bg-[#45308D]/5 px-2 py-0.5 rounded border border-[#45308D]/10">
                                    {currentStaff.adminRole || currentStaff.role}
                                </span>
                                <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                                    Base: ₹{currentSalary.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Control Type Selector (Increment vs Cut) */}
                <div className="px-6 pt-4">
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setControlType('increment')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                isIncrement 
                                    ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100' 
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span>Salary Increment (+)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setControlType('cut')}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                !isIncrement 
                                    ? 'bg-white text-rose-700 shadow-sm border border-rose-100' 
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <TrendingDown className="w-4 h-4 text-rose-600" />
                            <span>Salary Cut / Deduction (-)</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Effective Month */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 block">
                            Effective Month <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                required
                                value={effectiveMonth}
                                onChange={(e) => handleMonthChange(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none cursor-pointer"
                            >
                                {getMonthOptions().map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">
                            This {isIncrement ? 'increment' : 'salary cut'} will take effect starting from <span className="font-bold text-gray-700">{effectiveMonth}</span> and will not alter previous months.
                        </p>
                    </div>

                    {/* Amount Input Mode */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-700 block">
                                {isIncrement ? 'Increment Amount' : 'Salary Cut Amount'} <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
                                <button
                                    type="button"
                                    onClick={() => setInputMode('flat')}
                                    className={`px-2 py-0.5 rounded ${inputMode === 'flat' ? 'bg-white text-[#45308D] shadow-xs' : 'text-gray-500'}`}
                                >
                                    ₹ Flat
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setInputMode('percent')}
                                    className={`px-2 py-0.5 rounded ${inputMode === 'percent' ? 'bg-white text-[#45308D] shadow-xs' : 'text-gray-500'}`}
                                >
                                    % Percentage
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            {inputMode === 'flat' ? (
                                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            ) : (
                                <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            )}
                            <input
                                required
                                type="number"
                                min="1"
                                step={inputMode === 'percent' ? "0.1" : "1"}
                                value={amountValue || ''}
                                onChange={(e) => setAmountValue(parseFloat(e.target.value) || 0)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-bold text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                                placeholder={inputMode === 'flat' ? "Enter amount in ₹ (e.g. 2000)" : "Enter percentage % (e.g. 10)"}
                            />
                        </div>
                    </div>

                    {/* Live Calculation Preview Banner */}
                    <div className={`p-4 rounded-2xl border ${
                        isIncrement ? 'bg-emerald-50/50 border-emerald-200/60' : 'bg-rose-50/50 border-rose-200/60'
                    }`}>
                        <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1.5">
                            <span>Salary before {effectiveMonth}</span>
                            <span>Adjustment</span>
                            <span>Salary from {effectiveMonth}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-gray-700">
                                ₹{currentSalary.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1">
                                <span className={`text-xs font-black ${isIncrement ? 'text-emerald-700' : 'text-rose-700'}`}>
                                    {isIncrement ? '+' : '-'}₹{calculatedDelta.toLocaleString()}
                                </span>
                                {calculatedDelta > 0 && (
                                    <span className="text-[10px] font-bold text-gray-400">
                                        ({percentageChange}%)
                                    </span>
                                )}
                                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <span className={`text-base font-black ${isIncrement ? 'text-emerald-700' : 'text-rose-700'}`}>
                                ₹{calculatedNewSalary.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Reason / Justification */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">
                            Reason / Justification
                        </label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={isIncrement ? "e.g. Annual appraisal increment" : "e.g. Attendance deduction"}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition outline-none"
                        />

                        {/* Quick reason badges */}
                        <div className="flex flex-wrap gap-1 pt-1">
                            {(isIncrement ? incrementReasons : cutReasons).map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setReason(r)}
                                    className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[10px] font-medium transition"
                                >
                                    {r}
                                </button>
                            ))}
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
                            disabled={loading || calculatedDelta <= 0}
                            className={`px-6 py-2.5 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition flex items-center gap-1.5 ${
                                isIncrement 
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                            }`}
                        >
                            {isIncrement ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span>
                                {loading 
                                    ? 'Applying...' 
                                    : isIncrement 
                                        ? `Apply +₹${calculatedDelta.toLocaleString()} from ${effectiveMonth}` 
                                        : `Apply -₹${calculatedDelta.toLocaleString()} from ${effectiveMonth}`}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
