'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Book, User, CheckCircle2 } from 'lucide-react';

export default function StudentModal({ isOpen, onClose, onSuccess, editData }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, editData?: any }) {
    const [formData, setFormData] = useState({
        fullName: '', dateOfBirth: '', class: '', syllabus: '', district: '', residentialLocation: 'India',
        parentName: '', contactNumber: '', whatsappNumber: '', email: '', password: '',
        status: 'active', subjects: [] as string[], preferredTrainers: [] as string[],
        subjectAssignments: [] as { subjectId: string, teacherId: string, billPerHour: number }[]
    });

    const [subjectsList, setSubjectsList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');
    const [teacherSearch, setTeacherSearch] = useState('');

    useEffect(() => {
        if (isOpen) {
            api.get('/subjects').then(res => setSubjectsList(res.data)).catch(console.error);
            api.get('/teachers').then(res => setTeachersList(res.data)).catch(console.error);

            if (editData) {
                setFormData({
                    fullName: editData.fullName || '',
                    dateOfBirth: editData.dateOfBirth ? editData.dateOfBirth.split('T')[0] : '',
                    class: editData.class || '',
                    syllabus: editData.syllabus || '',
                    district: editData.district || '',
                    residentialLocation: editData.residentialLocation || 'India',
                    parentName: editData.parentName || '',
                    contactNumber: editData.contactNumber || '',
                    whatsappNumber: editData.whatsappNumber || '',
                    email: editData.email || '',
                    password: '', // Leave empty to not update password unless user types new one
                    status: editData.status || 'active',
                    subjects: editData.subjects ? editData.subjects.map((s: any) => s._id || s) : [],
                    preferredTrainers: editData.preferredTrainers ? editData.preferredTrainers.map((t: any) => t._id || t) : [],
                    subjectAssignments: editData.subjectAssignments ? editData.subjectAssignments.map((a: any) => ({
                        subjectId: a.subjectId?._id || a.subjectId,
                        teacherId: a.teacherId?._id || a.teacherId,
                        billPerHour: a.billPerHour
                    })) : []
                });
                
                // If preferredTrainers doesn't include teachers from subjectAssignments, sync them
                if (editData.subjectAssignments) {
                    setFormData(prev => {
                        const assignmentTutors = editData.subjectAssignments.map((a: any) => a.teacherId?._id || a.teacherId);
                        const allTutors = Array.from(new Set([...prev.preferredTrainers, ...assignmentTutors]));
                        return { ...prev, preferredTrainers: allTutors };
                    });
                }
            } else {
                setFormData({ fullName: '', dateOfBirth: '', class: '', syllabus: '', district: '', residentialLocation: 'India', parentName: '', contactNumber: '', whatsappNumber: '', email: '', password: '', status: 'active', subjects: [], preferredTrainers: [], subjectAssignments: [] });
            }
        }
    }, [isOpen, editData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editData) {
                // Do not send blank password if not changed
                const payload: any = { ...formData };
                if (!payload.password) delete payload.password;
                await api.put(`/students/${editData._id}`, payload);
            } else {
                await api.post('/students', formData);
            }
            // Reset state
            setFormData({ fullName: '', dateOfBirth: '', class: '', syllabus: '', district: '', residentialLocation: 'India', parentName: '', contactNumber: '', whatsappNumber: '', email: '', password: '', status: 'active', subjects: [], preferredTrainers: [], subjectAssignments: [] });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSubject = (subjectId: string) => {
        setFormData(prev => {
            const isSelected = prev.subjects.includes(subjectId);
            const newSubjects = isSelected ? prev.subjects.filter(id => id !== subjectId) : [...prev.subjects, subjectId];
            
            // If unselecting, remove assignments for this subject
            const newAssignments = isSelected 
                ? prev.subjectAssignments.filter(a => a.subjectId !== subjectId)
                : prev.subjectAssignments;

            return {
                ...prev,
                subjects: newSubjects,
                subjectAssignments: newAssignments
            };
        });
    };

    const toggleTeacher = (teacherId: string) => {
        setFormData(prev => {
            const isSelected = prev.preferredTrainers.includes(teacherId);
            const newTeachers = isSelected ? prev.preferredTrainers.filter(id => id !== teacherId) : [...prev.preferredTrainers, teacherId];
            
            // If unselecting, remove assignments for this teacher
            const newAssignments = isSelected 
                ? prev.subjectAssignments.filter(a => a.teacherId !== teacherId)
                : prev.subjectAssignments;

            return {
                ...prev,
                preferredTrainers: newTeachers,
                subjectAssignments: newAssignments
            };
        });
    };

    const toggleAssignment = (subjectId: string, teacherId: string) => {
        setFormData(prev => {
            const exists = prev.subjectAssignments.find(a => a.subjectId === subjectId && a.teacherId === teacherId);
            if (exists) {
                return {
                    ...prev,
                    subjectAssignments: prev.subjectAssignments.filter(a => !(a.subjectId === subjectId && a.teacherId === teacherId))
                };
            } else {
                return {
                    ...prev,
                    subjectAssignments: [...prev.subjectAssignments, { subjectId, teacherId, billPerHour: 0 }]
                };
            }
        });
    };

    const updateAssignmentRate = (subjectId: string, teacherId: string, rate: number) => {
        setFormData(prev => ({
            ...prev,
            subjectAssignments: prev.subjectAssignments.map(a => 
                (a.subjectId === subjectId && a.teacherId === teacherId) ? { ...a, billPerHour: rate } : a
            )
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">{editData ? 'Edit Student Profile' : 'Add New Student Profile'}</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information */}
                    <div>
                        <h3 className="text-md font-bold text-primary mb-3 border-b pb-1">General Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input required type="email" className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{editData ? 'New Password (Optional)' : 'Password'}</label>
                                <input required={!editData} type="password" className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input type="date" className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none bg-white" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                        <h3 className="text-md font-bold text-primary mb-3 border-b pb-1">Academic Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
                                <input className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
                                <input className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.syllabus} onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Location */}
                    <div>
                        <h3 className="text-md font-bold text-primary mb-3 border-b pb-1">Contact & Guardian</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent's Name</label>
                                <input className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                <input className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.whatsappNumber} onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                <input className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Residential Location</label>
                                <select className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none bg-white" value={formData.residentialLocation} onChange={(e) => setFormData({ ...formData, residentialLocation: e.target.value })}>
                                    <option value="India">India</option>
                                    <option value="GCC">GCC</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes (Subjects & Preferred Trainers) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Subjects Selection */}
                        <div className="flex flex-col h-[450px]">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                    <Book className="w-4 h-4 text-primary" /> Subjects Pursuing
                                </label>
                                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full">{formData.subjects.length} Selected</span>
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search modules..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-black focus:bg-white focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                    value={subjectSearch}
                                    onChange={(e) => setSubjectSearch(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {subjectsList
                                    .filter((s: any) => s.subjectName.toLowerCase().includes(subjectSearch.toLowerCase()))
                                    .map((sub: any) => {
                                        const isSelected = formData.subjects.includes(sub._id);
                                        return (
                                            <div
                                                key={sub._id}
                                                onClick={() => toggleSubject(sub._id)}
                                                className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer border-2 transition-all ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-gray-50 hover:border-gray-200'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl border transition-all ${isSelected ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                                        <Book className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-black tracking-tight ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{sub.subjectName}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{sub.classLevel}</p>
                                                    </div>
                                                </div>
                                                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in duration-200" />}
                                            </div>
                                        );
                                    })}
                                {subjectsList.length > 0 && subjectsList.filter((s: any) => s.subjectName.toLowerCase().includes(subjectSearch.toLowerCase())).length === 0 && (
                                    <p className="text-center text-gray-400 text-xs italic py-10">No modules match your search.</p>
                                )}
                            </div>
                        </div>

                        {/* Teachers Selection */}
                        <div className="flex flex-col h-[450px]">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4 text-secondary" /> Preferred Trainers
                                </label>
                                <span className="bg-secondary/10 text-secondary text-[10px] font-black px-2 py-1 rounded-full">{formData.preferredTrainers.length} Assigned</span>
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search trainers..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-black focus:bg-white focus:ring-1 focus:ring-secondary/20 outline-none transition-all"
                                    value={teacherSearch}
                                    onChange={(e) => setTeacherSearch(e.target.value)}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {teachersList
                                    .filter((t: any) => t.name.toLowerCase().includes(teacherSearch.toLowerCase()))
                                    .map((tea: any) => {
                                        const isSelected = formData.preferredTrainers.includes(tea._id);
                                        return (
                                            <div
                                                key={tea._id}
                                                className={`group flex flex-col p-3 rounded-2xl border-2 transition-all ${isSelected ? 'bg-secondary/5 border-secondary shadow-sm' : 'bg-white border-gray-50 hover:border-gray-200'}`}
                                            >
                                                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleTeacher(tea._id)}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-xl border transition-all ${isSelected ? 'bg-secondary text-white border-secondary' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-black tracking-tight ${isSelected ? 'text-secondary' : 'text-gray-700'}`}>{tea.name}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-gray-400 font-bold">Base: ₹{tea.salaryPerHour}/hr</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isSelected && <CheckCircle2 className="w-5 h-5 text-secondary animate-in zoom-in duration-200" />}
                                                </div>

                                                {isSelected && formData.subjects.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-secondary/10 space-y-3">
                                                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Assign Subjects & Rates</p>
                                                        {formData.subjects
                                                            .filter(subId => tea.subjects?.some((s: any) => (s._id || s) === subId))
                                                            .map(subId => {
                                                                const subject = subjectsList.find((s: any) => s._id === subId) as any;
                                                                if (!subject) return null;
                                                                const assignment = formData.subjectAssignments.find(a => a.subjectId === subId && a.teacherId === tea._id);
                                                                const isAssigned = !!assignment;

                                                                return (
                                                                    <div key={subId} className="flex flex-col gap-2 bg-white/50 p-2 rounded-lg border border-gray-100">
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleAssignment(subId, tea._id)}>
                                                                                <div className={`w-3 h-3 rounded border flex items-center justify-center ${isAssigned ? 'bg-secondary border-secondary text-white' : 'border-gray-300'}`}>
                                                                                    {isAssigned && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                                                </div>
                                                                                <span className="text-xs font-bold text-gray-700">{subject.subjectName}</span>
                                                                            </div>
                                                                            {isAssigned && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[10px] text-gray-400 font-bold">Bill:</span>
                                                                                    <input 
                                                                                        type="number" 
                                                                                        placeholder="0"
                                                                                        className="w-16 px-2 py-0.5 border border-gray-200 rounded text-xs text-black focus:ring-1 focus:ring-secondary/20 outline-none"
                                                                                        value={assignment.billPerHour}
                                                                                        onChange={(e) => updateAssignmentRate(subId, tea._id, parseFloat(e.target.value) || 0)}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        {formData.subjects.filter(subId => tea.subjects?.some((s: any) => (s._id || s) === subId)).length === 0 && (
                                                            <p className="text-[10px] text-gray-400 italic">No matching subjects for this trainer.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                {teachersList.length > 0 && teachersList.filter((t: any) => t.name.toLowerCase().includes(teacherSearch.toLowerCase())).length === 0 && (
                                    <p className="text-center text-gray-400 text-xs italic py-10">No trainers match your search.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100 pt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition disabled:opacity-50">
                            {loading ? 'Saving...' : editData ? 'Update Profile' : 'Complete Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
