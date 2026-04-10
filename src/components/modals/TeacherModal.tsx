'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Book, CheckCircle2 } from 'lucide-react';

export default function TeacherModal({ isOpen, onClose, onSuccess, editData }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, editData?: any }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', salaryPerHour: 0, status: 'active', subjects: [] as string[] });
    const [subjectsList, setSubjectsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [subjectSearch, setSubjectSearch] = useState('');

    useEffect(() => {
        if (isOpen) {
            api.get('/subjects').then(res => setSubjectsList(res.data)).catch(console.error);
            if (editData) {
                setFormData({
                    name: editData.name || '',
                    email: editData.email || '',
                    password: '', // Blank
                    phone: editData.phone || '',
                    salaryPerHour: editData.salaryPerHour || 0,
                    status: editData.status || 'active',
                    subjects: editData.subjects ? editData.subjects.map((s: any) => s._id || s) : []
                });
            } else {
                setFormData({ name: '', email: '', password: '', phone: '', salaryPerHour: 0, status: 'active', subjects: [] });
            }
        }
    }, [isOpen, editData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editData) {
                const payload: any = { ...formData };
                if (!payload.password) delete payload.password;
                await api.put(`/teachers/${editData._id}`, payload);
            } else {
                await api.post('/teachers', formData);
            }
            setFormData({ name: '', email: '', password: '', phone: '', salaryPerHour: 0, status: 'active', subjects: [] });
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
            subjects: prev.subjects.includes(subjectId)
                ? prev.subjects.filter(id => id !== subjectId)
                : [...prev.subjects, subjectId]
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">{editData ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                required
                                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                required
                                type="email"
                                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{editData ? 'New Password (Optional)' : 'Password'}</label>
                            <input
                                required={!editData}
                                type="password"
                                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Per Hour (₹)</label>
                            <input
                                type="number"
                                required
                                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                                value={formData.salaryPerHour || ''}
                                onChange={(e) => setFormData({ ...formData, salaryPerHour: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none bg-white"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col h-[400px] mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                <Book className="w-4 h-4 text-primary" /> Subjects Assigned
                            </label>
                            <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full">{formData.subjects.length} Assigned</span>
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
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{sub.classLevel} - {sub.syllabus}</p>
                                                </div>
                                            </div>
                                            {isSelected && <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in duration-200" />}
                                        </div>
                                    );
                                })}
                            {subjectsList.length === 0 ? (
                                <p className="text-center text-gray-400 text-xs italic py-10">No modules found in database.</p>
                            ) : subjectsList.filter((s: any) => s.subjectName.toLowerCase().includes(subjectSearch.toLowerCase())).length === 0 && (
                                <p className="text-center text-gray-400 text-xs italic py-10">No modules match your search.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100 pt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition disabled:opacity-50">
                            {loading ? 'Saving...' : editData ? 'Update Teacher' : 'Save Teacher Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
