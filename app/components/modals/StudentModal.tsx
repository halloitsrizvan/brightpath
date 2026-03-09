'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function StudentModal({ isOpen, onClose, onSuccess, editData }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, editData?: any }) {
    const [formData, setFormData] = useState({
        fullName: '', dateOfBirth: '', class: '', syllabus: '', district: '', residentialLocation: 'India',
        parentName: '', contactNumber: '', whatsappNumber: '', email: '', password: '',
        status: 'active', subjects: [] as string[], preferredTrainers: [] as string[]
    });

    const [subjectsList, setSubjectsList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [loading, setLoading] = useState(false);

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
                    preferredTrainers: editData.preferredTrainers ? editData.preferredTrainers.map((t: any) => t._id || t) : []
                });
            } else {
                setFormData({ fullName: '', dateOfBirth: '', class: '', syllabus: '', district: '', residentialLocation: 'India', parentName: '', contactNumber: '', whatsappNumber: '', email: '', password: '', status: 'active', subjects: [], preferredTrainers: [] });
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
            setFormData({ fullName: '', dateOfBirth: '', class: '', syllabus: '', district: '', residentialLocation: 'India', parentName: '', contactNumber: '', whatsappNumber: '', email: '', password: '', status: 'active', subjects: [], preferredTrainers: [] });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSubject = (subjectId: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subjectId) ? prev.subjects.filter(id => id !== subjectId) : [...prev.subjects, subjectId]
        }));
    };

    const toggleTeacher = (teacherId: string) => {
        setFormData(prev => ({
            ...prev,
            preferredTrainers: prev.preferredTrainers.includes(teacherId) ? prev.preferredTrainers.filter(id => id !== teacherId) : [...prev.preferredTrainers, teacherId]
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Subjects Pursuing</label>
                            {subjectsList.length === 0 ? (
                                <p className="text-sm text-gray-500">No subjects found.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                    {subjectsList.map((sub: any) => (
                                        <label key={sub._id} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                                            <input type="checkbox" className="rounded text-primary focus:ring-primary" checked={formData.subjects.includes(sub._id)} onChange={() => toggleSubject(sub._id)} />
                                            {sub.subjectName} ({sub.classLevel})
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Preferred Trainers</label>
                            {teachersList.length === 0 ? (
                                <p className="text-sm text-gray-500">No teachers found.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                    {teachersList.map((tea: any) => (
                                        <label key={tea._id} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                                            <input type="checkbox" className="rounded text-primary focus:ring-primary" checked={formData.preferredTrainers.includes(tea._id)} onChange={() => toggleTeacher(tea._id)} />
                                            {tea.name}
                                        </label>
                                    ))}
                                </div>
                            )}
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
