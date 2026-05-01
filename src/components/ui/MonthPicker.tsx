'use client';
import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { format, addYears, subYears, setYear, setMonth, isSameMonth } from 'date-fns';

interface MonthPickerProps {
    selected: string; // "Month Year" or "All Time"
    onChange: (value: string) => void;
    allowAll?: boolean;
    allLabel?: string;
    variant?: 'light' | 'dark';
}

export default function MonthPicker({ 
    selected, 
    onChange, 
    allowAll = true, 
    allLabel = 'All Time',
    variant = 'light'
}: MonthPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (selected === allLabel || !selected) return new Date();
        try {
            return new Date(selected);
        } catch {
            return new Date();
        }
    });
    const containerRef = useRef<HTMLDivElement>(null);

    const isDark = variant === 'dark';

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMonthClick = (monthIndex: number) => {
        const newDate = setMonth(viewDate, monthIndex);
        onChange(format(newDate, 'MMMM yyyy'));
        setIsOpen(false);
    };

    const handleYearChange = (delta: number) => {
        setViewDate(addYears(viewDate, delta));
    };

    const handleAllClick = () => {
        onChange(allLabel);
        setIsOpen(false);
    };

    const isCurrentSelected = (monthIndex: number) => {
        if (selected === allLabel) return false;
        try {
            const selectedDate = new Date(selected);
            return selectedDate.getFullYear() === viewDate.getFullYear() && selectedDate.getMonth() === monthIndex;
        } catch {
            return false;
        }
    };

    return (
        <div className="relative inline-block w-full md:min-w-[200px]" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full pl-11 pr-10 py-3.5 border-2 rounded-2xl font-black text-[10px] uppercase tracking-widest focus:border-primary outline-none transition-all cursor-pointer shadow-sm flex items-center justify-between
                    ${isDark 
                        ? 'bg-[#161618] border-gray-800 text-white hover:border-gray-700' 
                        : 'bg-white border-gray-100 text-gray-900'
                    }`}
            >
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <span className="truncate">{selected || allLabel}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-2 border rounded-[2rem] shadow-2xl z-[100] p-4 min-w-[280px] animate-in fade-in zoom-in-95 duration-200
                    ${isDark 
                        ? 'bg-[#161618] border-gray-800 text-white' 
                        : 'bg-white border-gray-100 text-gray-900'
                    }`}>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <button
                            onClick={() => handleYearChange(-1)}
                            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className={`font-black italic uppercase text-[12px] tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {viewDate.getFullYear()}
                        </span>
                        <button
                            onClick={() => handleYearChange(1)}
                            className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                        {months.map((month, index) => {
                            const selectedStatus = isCurrentSelected(index);
                            return (
                                <button
                                    key={month}
                                    onClick={() => handleMonthClick(index)}
                                    className={`py-3 px-1 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-1
                                        ${selectedStatus 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                            : isDark 
                                                ? 'hover:bg-white/5 text-gray-500 hover:text-primary'
                                                : 'hover:bg-primary/5 text-gray-500 hover:text-primary'
                                        }`}
                                >
                                    {month.substring(0, 3)}
                                    {selectedStatus && <Check className="w-3 h-3" />}
                                </button>
                            );
                        })}
                    </div>

                    {allowAll && (
                        <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-50'}`}>
                            <button
                                onClick={handleAllClick}
                                className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                                    ${selected === allLabel 
                                        ? isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
                                        : isDark ? 'bg-white/5 text-gray-500 hover:bg-white/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                    }`}
                            >
                                {allLabel}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
