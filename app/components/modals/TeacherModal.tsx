'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function TeacherModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', salaryPerHour: 0, status: 'active', subjects: [] as string[] });
    const [subjectsList, setSubjectsList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            api.get('/subjects').then(res => setSubjectsList(res.data)).catch(console.error);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/teachers', formData);
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Add New Teacher</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                required
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
                                value={formData.salaryPerHour}
                                onChange={(e) => setFormData({ ...formData, salaryPerHour: parseFloat(e.target.value) })}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Subjects Assigned</label>
                        {subjectsList.length === 0 ? (
                            <p className="text-sm text-gray-500">No subjects found. Please add subjects first.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {subjectsList.map((sub: any) => (
                                    <label key={sub._id} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded text-primary focus:ring-primary"
                                            checked={formData.subjects.includes(sub._id)}
                                            onChange={() => toggleSubject(sub._id)}
                                        />
                                        {sub.subjectName} ({sub.classLevel})
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100 pt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Teacher Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
