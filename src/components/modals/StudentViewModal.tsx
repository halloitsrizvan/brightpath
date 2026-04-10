'use client';
import { Mail, Phone, MapPin, Book, User, Calendar, Shield, Globe, HardDrive } from 'lucide-react';

export default function StudentViewModal({ isOpen, onClose, student }: { isOpen: boolean, onClose: () => void, student: any }) {
    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto border border-white/20 relative animate-in zoom-in duration-300">
                
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary"></div>

                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary font-black text-3xl shadow-inner">
                            {student.fullName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">{student.fullName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {student.status || 'Active'}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Student ID: {student._id?.slice(-6)}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition hover:rotate-90">✕</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Personal & Contact */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Identity & Security
                            </h3>
                            <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 border border-gray-100">
                                <DetailItem icon={<Mail />} label="Official Email" value={student.email} />
                                <DetailItem icon={<Calendar />} label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Not Specified'} />
                                <DetailItem icon={<HardDrive />} label="Login Access" value="Secured (Password Encrypted)" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Location & Origin
                            </h3>
                            <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 border border-gray-100">
                                <DetailItem icon={<MapPin />} label="District" value={student.district || 'Not Specified'} />
                                <DetailItem icon={<Globe />} label="Residential" value={student.residentialLocation || 'India'} />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-gray-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Contact & Guardian
                            </h3>
                            <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 border border-gray-100">
                                <DetailItem icon={<User />} label="Parent/Guardian" value={student.parentName || 'Not Specified'} />
                                <DetailItem icon={<Phone />} label="Primary Phone" value={student.contactNumber || 'N/A'} />
                                <DetailItem icon={<Phone className="text-green-500" />} label="WhatsApp" value={student.whatsappNumber || 'N/A'} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Academic & Assignments */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Book className="w-4 h-4" /> Academic Profile
                            </h3>
                            <div className="bg-indigo-50/50 rounded-[2rem] p-6 space-y-4 border border-indigo-100">
                                <DetailItem icon={<Book />} label="Class Level" value={student.class || 'N/A'} colorClass="text-indigo-600" />
                                <DetailItem icon={<Book />} label="Syllabus/Board" value={student.syllabus || 'N/A'} colorClass="text-indigo-600" />
                                
                                <div className="pt-4 border-t border-indigo-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Enrolled Subjects</p>
                                    <div className="flex flex-wrap gap-2">
                                        {student.subjects?.map((sub: any, idx: number) => (
                                            <span key={idx} className="bg-white border border-indigo-100 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 shadow-sm">
                                                {sub.subjectName || sub}
                                            </span>
                                        ))}
                                        {(!student.subjects || student.subjects.length === 0) && <p className="text-xs italic text-gray-400">No subjects currently selected.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-green-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> Trainer Assignments
                            </h3>
                            <div className="space-y-3">
                                {student.subjectAssignments?.map((a: any, idx: number) => (
                                    <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-bold group-hover:bg-green-600 group-hover:text-white transition">
                                                    {a.teacherId?.name?.charAt(0) || <User className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-800">{a.teacherId?.name || "Tutor"}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{a.subjectId?.subjectName || "Subject"}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase">Financials</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-gray-500 uppercase italic">Bill Rate</span>
                                                        <span className="text-xs font-black text-secondary tracking-tighter">₹{a.billPerHour}/hr</span>
                                                    </div>
                                                    <div className="w-px h-6 bg-gray-100"></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-gray-500 uppercase italic">Salary Rate</span>
                                                        <span className="text-xs font-black text-green-600 tracking-tighter">₹{a.salaryPerHour}/hr</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!student.subjectAssignments || student.subjectAssignments.length === 0) && (
                                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                                        <p className="text-xs italic text-gray-400 font-medium">No tutorial assignments active.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-gray-800 transition transform hover:-translate-y-1">
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value, colorClass = "text-gray-900" }: { icon: any, label: string, value: string, colorClass?: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 text-gray-400">
                {cloneIcon(icon, "w-5 h-5")}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className={`text-sm font-black tracking-tight mt-0.5 ${colorClass}`}>{value}</p>
            </div>
        </div>
    );
}

function cloneIcon(icon: any, className: string) {
    const IconComponent = icon.type;
    return <IconComponent {...icon.props} className={className} />;
}
