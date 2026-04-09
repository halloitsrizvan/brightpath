
'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../utils/api';
import Cookies from 'js-cookie';
import { User, Phone, Mail, MapPin, Calendar, Book, ShieldAlert, IndianRupee, Clock, CheckCircle, Loader2, FileText, Receipt } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function StudentProfile() {
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [fees, setFees] = useState<any[]>([]);
    const [loadingFees, setLoadingFees] = useState(false);
    const [selectedFees, setSelectedFees] = useState<string[]>([]);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            console.log("Fetching student profile for ID:", user.id);
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

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!student) return;

        setIsSaving(true);
        try {
            const { data } = await api.put(`/students/${student._id}`, {
                fullName: student.fullName,
                parentName: student.parentName,
                contactNumber: student.contactNumber,
                whatsappNumber: student.whatsappNumber,
                district: student.district
            });
            setStudent(data);
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

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
            // Settle all selected fees
            await Promise.all(selectedFees.map(id => 
                api.put(`/finance/fees/${id}`, { paymentStatus: 'paid', paymentDate: new Date() })
            ));

            toast.success(`Successfully settled ${selectedFees.length} months`);
            const idsString = selectedFees.join(',');
            
            // Re-fetch to update UI
            if (student?._id) await fetchFees(student._id);
            setSelectedFees([]);
            
            // Open consolidated invoice
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
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <Toaster position="top-right" />
            <div className="fixed z-50 h-full">
                <Sidebar role="student" />
            </div>
            <div className="flex-1 lg:ml-64 p-4 md:p-8">
                <div className="max-w-4xl mx-auto mt-4">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 overflow-hidden border border-gray-100 relative">
                        {/* Banner Background */}
                        <div className="h-48 bg-gradient-to-r from-primary via-primary/95 to-secondary opacity-90 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        </div>

                        {/* Profile Info Overlay */}
                        <div className="px-8 pb-8">
                            <div className="relative -mt-20 flex flex-col md:flex-row md:items-end gap-6 mb-8">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] p-2 shadow-2xl relative">
                                    <div className="w-full h-full bg-gray-100 rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white">
                                        <User className="w-16 h-16 md:w-20 md:h-20 text-gray-300" />
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                                </div>
                                <div className="flex-1 pb-2">
                                    <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight italic">{student?.fullName}</h1>
                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                            {student?.class} Student
                                        </span>
                                        <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-500/10">
                                            {student?.syllabus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Details Section */}
                                <div className="lg:col-span-2 space-y-6">
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent's Name</label>
                                                <input
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 text-[15px] font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                                    value={student?.parentName}
                                                    onChange={(e) => setStudent({ ...student, parentName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                                <input
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 text-[15px] font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                                    value={student?.contactNumber}
                                                    onChange={(e) => setStudent({ ...student, contactNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                                                <input
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 text-[15px] font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                                    value={student?.whatsappNumber}
                                                    onChange={(e) => setStudent({ ...student, whatsappNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                                                <input
                                                    className="w-full bg-gray-50 border-2 border-transparent p-4 text-[15px] font-bold text-gray-700 rounded-2xl focus:bg-white focus:border-primary/20 outline-none transition-all hover:bg-gray-100"
                                                    value={student?.district}
                                                    onChange={(e) => setStudent({ ...student, district: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="px-8 py-4 bg-primary text-white font-black text-[12px] uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
                                            >
                                                {isSaving ? "Synchronizing..." : "Update Identity Fields"}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Subjects & Tutors */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Book className="w-5 h-5 text-primary" />
                                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Active Modules</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {student?.subjects?.map((sub: any) => (
                                                    <span key={sub._id} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                                                        {sub.subjectName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <ShieldAlert className="w-5 h-5 text-secondary" />
                                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Assigned Tutors</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {student?.preferredTrainers?.map((tea: any) => (
                                                    <span key={tea._id || tea} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
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
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">System Email</label>
                                            <p className="text-gray-800 font-bold break-all flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary opacity-30" />
                                                {student?.email}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">DOB</label>
                                            <p className="text-gray-800 font-bold flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary opacity-30" />
                                                {student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">Status</label>
                                            <p className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${student?.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className="text-gray-800 font-bold uppercase text-[10px] tracking-widest">{student?.status}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-secondary/5 p-8 rounded-[2.5rem] border border-secondary/10 flex flex-col items-center justify-center text-center">
                                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2 font-black">Region</h4>
                                        <div className="flex items-center gap-1.5 text-secondary">
                                            <MapPin className="w-5 h-5 fill-secondary/10" />
                                            <span className="text-2xl font-black italic tracking-tight uppercase leading-none">{student?.residentialLocation}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing & Payment History Section */}
                <div className="max-w-4xl mx-auto mt-10 mb-20">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-primary/5 border border-gray-100 flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                                    <IndianRupee className="text-green-600 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 tracking-tight italic">Billing & Fees</h3>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Financial ledger & receipts</p>
                                </div>
                            </div>
                            {selectedFees.length > 0 ? (
                                <button 
                                    onClick={handleBatchPay}
                                    disabled={isSaving}
                                    className="px-6 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition flex items-center gap-2"
                                >
                                    Settle {selectedFees.length} Months (₹{fees.filter(f => selectedFees.includes(f._id)).reduce((s, f) => s + f.amount, 0).toLocaleString()})
                                </button>
                            ) : (
                                <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Statement</span>
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <th className="px-6 py-2 text-left w-10">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-100"></div>
                                        </th>
                                        <th className="px-6 py-2 text-left">Period</th>
                                        <th className="px-6 py-2 text-left">Amount Due</th>
                                        <th className="px-6 py-2 text-left">Payment Status</th>
                                        <th className="px-6 py-2 text-right">Documents</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingFees ? (
                                        <tr><td colSpan={4} className="py-12 text-center text-gray-400 font-bold animate-pulse text-xs uppercase tracking-widest">Syncing ledger records...</td></tr>
                                    ) : fees.length === 0 ? (
                                        <tr><td colSpan={4} className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 text-gray-400 font-bold uppercase tracking-widest text-xs italic">No billing history found in registry.</td></tr>
                                    ) : (
                                        fees.map((fee) => (
                                            <tr key={fee._id} className={`group hover:bg-gray-50/50 transition-colors ${selectedFees.includes(fee._id) ? 'bg-primary/5' : ''}`}>
                                                <td className="px-6 py-5 bg-gray-50 rounded-l-2xl border-y border-l border-gray-100">
                                                    {fee.paymentStatus !== 'paid' && (
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedFees(prev => 
                                                                    prev.includes(fee._id) ? prev.filter(id => id !== fee._id) : [...prev, fee._id]
                                                                );
                                                            }}
                                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedFees.includes(fee._id) ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white border-gray-200 hover:border-primary/40'}`}
                                                        >
                                                            {selectedFees.includes(fee._id) && <CheckCircle className="w-4 h-4 text-white" />}
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 bg-gray-50 border-y border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="w-4 h-4 text-primary/40" />
                                                        <span className="font-black text-gray-800">{fee.month}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 bg-gray-50 border-y border-gray-100">
                                                    <span className="font-black text-gray-800 text-lg">₹{(fee.amount || 0).toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-5 bg-gray-50 border-y border-gray-100">
                                                    {fee.paymentStatus === 'paid' ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                            <CheckCircle className="w-3 h-3" /> Successfully Paid
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-black uppercase tracking-tighter animate-pulse">
                                                            <Loader2 className="w-3 h-3 animate-spin" /> Payment Pending
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 bg-gray-50 rounded-r-2xl border-y border-r border-gray-100 text-right">
                                                    {fee.paymentStatus === 'paid' ? (
                                                        <button 
                                                            onClick={() => handleDownloadInvoice(fee._id, fee.month)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                                                        >
                                                            <Receipt className="w-3.5 h-3.5" /> Download Receipt
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-gray-300 italic uppercase">Awaiting Settlement</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
