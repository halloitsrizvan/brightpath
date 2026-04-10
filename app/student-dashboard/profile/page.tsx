'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import Cookies from 'js-cookie';
import { Menu, User, Phone, Mail, MapPin, Calendar, Book, ShieldAlert, IndianRupee, Clock, CheckCircle, Loader2, FileText, Receipt } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function StudentProfile() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [fees, setFees] = useState<any[]>([]);
    const [loadingFees, setLoadingFees] = useState(false);
    const [selectedFees, setSelectedFees] = useState<string[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            api.get(`/students/${user.id}`)
                .then(res => {
                    setStudent(res.data);
                    setLoading(false);
                    fetchFees(user.id);
                })
                .catch(err => {
                    console.error("API Error in Profile:", err);
                    toast.error("Failed to load profile");
                    setLoading(false);
                });
        }
    }, []);

    const fetchFees = async (studentId: string) => {
        try {
            setLoadingFees(true);
            const { data } = await api.get(`/finance/fees?studentId=${studentId}`);
            setFees(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error('Failed to fetch fees', error);
        } finally {
            setLoadingFees(false);
        }
    };

    const handleDownloadInvoice = async (feeId: string, month: string) => {
        try {
            const response = await api.get(`/finance/invoice/${feeId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Receipt_${month.replace(' ', '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download receipt');
        }
    };

    const handleBatchPay = async () => {
        if (selectedFees.length === 0) return;
        
        try {
            setIsSaving(true);
            await Promise.all(selectedFees.map(id => 
                api.put(`/finance/fees/${id}`, { paymentStatus: 'paid', paymentDate: new Date() })
            ));

            toast.success(`Successfully settled ${selectedFees.length} months`);
            const idsString = selectedFees.join(',');
            
            if (student?._id) await fetchFees(student._id);
            setSelectedFees([]);
            
            const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || '/api'}/finance/invoice/${idsString}`;
            window.open(downloadUrl, '_blank');
        } catch (error) {
            console.error(error);
            toast.error("Payment synchronization failed");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#fafafa]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans overflow-x-hidden">
            <Toaster position="top-right" />
            <Sidebar role="student" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Fixed Header for Mobile */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm z-30 lg:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-primary shadow-sm active:scale-95 transition-all"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="text-right">
                        <h2 className="text-xl font-black text-primary italic uppercase tracking-tighter leading-none">Profile Suite</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{student?.fullName}</p>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-12 mt-20 lg:mt-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 overflow-hidden border border-gray-100 relative">
                            {/* Banner Background */}
                            <div className="h-48 bg-gradient-to-r from-primary via-primary/95 to-indigo-600 opacity-90 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            </div>

                            {/* Profile Info Overlay */}
                            <div className="px-6 md:px-8 pb-8">
                                <div className="relative -mt-20 flex flex-col md:flex-row md:items-end gap-6 mb-10">
                                    <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[2.5rem] p-2 shadow-2xl relative self-center md:self-auto">
                                        <div className="w-full h-full bg-gray-100 rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white">
                                            <User className="w-16 h-16 md:w-24 md:h-24 text-gray-300" />
                                        </div>
                                        <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                                    </div>
                                    <div className="flex-1 pb-2 text-center md:text-left">
                                        <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">{student?.fullName}</h1>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                                            <span className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                                {student?.class} Academic Level
                                            </span>
                                            <span className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-violet-500/10 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-500/10">
                                                {student?.syllabus} Curriculum
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Details Section */}
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ProfileField label="Parent / Guardian" value={student?.parentName} />
                                            <ProfileField label="Contact Identifier" value={student?.contactNumber} />
                                            <ProfileField label="WhatsApp Pipeline" value={student?.whatsappNumber} />
                                            <ProfileField label="Administrative District" value={student?.district} />
                                        </div>

                                        {/* Subjects & Tutors */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50/50 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-110 transition-transform"></div>
                                                <div className="flex items-center gap-2 mb-6 relative z-10">
                                                    <Book className="w-5 h-5 text-primary" />
                                                    <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest leading-none">Active Modules</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2 relative z-10">
                                                    {student?.subjects?.map((sub: any) => (
                                                        <span key={sub._id} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm">
                                                            {sub.subjectName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50/50 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-110 transition-transform"></div>
                                                <div className="flex items-center gap-2 mb-6 relative z-10">
                                                    <ShieldAlert className="w-5 h-5 text-indigo-600" />
                                                    <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest leading-none">Academic Staff</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2 relative z-10">
                                                    {student?.preferredTrainers?.map((tea: any) => (
                                                        <span key={tea._id || tea} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
                                                            {tea.name || tea}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Stats Box */}
                                    <div className="space-y-6">
                                        <div className="bg-primary/5 p-8 rounded-[2.5rem] space-y-6 border border-primary/10">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-primary uppercase tracking-[0.3em] opacity-60">System Registry Email</label>
                                                <p className="text-gray-800 font-bold text-sm break-all flex items-center gap-2 italic uppercase tracking-tighter">
                                                    {student?.email}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-primary uppercase tracking-[0.3em] opacity-60">Birth Certification</label>
                                                <p className="text-gray-800 font-bold text-sm flex items-center gap-2 italic uppercase tracking-tighter">
                                                    {student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-primary uppercase tracking-[0.3em] opacity-60">Current Status</label>
                                                <p className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${student?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    <span className="text-gray-800 font-black uppercase text-[10px] tracking-widest">{student?.status} Registered</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-[#fdc70b]/5 p-8 rounded-[2.5rem] border border-[#fdc70b]/10 flex flex-col items-center justify-center text-center">
                                            <h4 className="text-[9px] font-black text-[#b48d08] uppercase tracking-[0.3em] mb-3">Residential Node</h4>
                                            <div className="flex items-center gap-2 text-gray-800">
                                                <MapPin className="w-5 h-5 text-[#fdc70b]" />
                                                <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">{student?.residentialLocation || 'Global'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Billing & Payment History Section */}
                        <div className="mt-12 mb-20 scroll-mt-24" id="billing">
                            <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-xl shadow-primary/5 border border-gray-100 flex flex-col gap-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm">
                                            <IndianRupee className="text-green-600 w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-gray-800 tracking-tighter italic uppercase leading-none">Billing Ledger</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Financial history & digital receipts</p>
                                        </div>
                                    </div>
                                    {selectedFees.length > 0 ? (
                                        <button 
                                            onClick={handleBatchPay}
                                            disabled={isSaving}
                                            className="px-8 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Settle {selectedFees.length} Months (₹{fees.filter(f => selectedFees.includes(f._id)).reduce((s, f) => s + f.amount, 0).toLocaleString()})
                                        </button>
                                    ) : (
                                        <div className="px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-black">Digital Statement Portfolio</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {loadingFees ? (
                                        <div className="py-20 text-center text-gray-400 font-black italic uppercase tracking-widest text-[10px] animate-pulse">Syncing institutional ledger...</div>
                                    ) : fees.length === 0 ? (
                                        <div className="py-24 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">No financial certifications recorded in registry.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {fees.map((fee) => (
                                                <div 
                                                    key={fee._id} 
                                                    className={`group p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                                                        selectedFees.includes(fee._id) 
                                                        ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' 
                                                        : 'bg-[#fafafa] border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        {fee.paymentStatus !== 'paid' ? (
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedFees(prev => 
                                                                        prev.includes(fee._id) ? prev.filter(id => id !== fee._id) : [...prev, fee._id]
                                                                    );
                                                                }}
                                                                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedFees.includes(fee._id) ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white border-gray-200 hover:border-primary/40'}`}
                                                            >
                                                                {selectedFees.includes(fee._id) && <CheckCircle className="w-4 h-4 text-white" />}
                                                            </button>
                                                        ) : (
                                                            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                                                <CheckCircle className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Certification Period</p>
                                                            <h4 className="text-xl font-black text-gray-800 italic uppercase leading-none tracking-tighter">{fee.month} Cycle</h4>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-1 md:text-right gap-8 md:gap-1">
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest md:hidden mb-1">Fee Amount</p>
                                                            <p className="text-2xl font-black text-gray-800 italic tracking-tighter">₹{(fee.amount || 0).toLocaleString()}</p>
                                                        </div>
                                                        <div className="text-right md:text-left">
                                                            {fee.paymentStatus === 'paid' ? (
                                                                <span className="inline-flex px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-100">Settled Account</span>
                                                            ) : (
                                                                <span className="inline-flex px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100 animate-pulse">Awaiting Settle</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 flex justify-end">
                                                        {fee.paymentStatus === 'paid' ? (
                                                            <button 
                                                                onClick={() => handleDownloadInvoice(fee._id, fee.month)}
                                                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-primary font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                                                            >
                                                                <Receipt className="w-4 h-4" /> Digital Receipt
                                                            </button>
                                                        ) : (
                                                            <span className="text-[9px] font-black text-gray-300 italic uppercase tracking-widest">Digital Audit Pending</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileField({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1.5 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100/50 group hover:border-primary/20 transition-colors">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{label}</label>
            <p className="px-1 text-base font-black text-gray-800 italic uppercase tracking-tighter">{value || 'N/A'}</p>
        </div>
    );
}
