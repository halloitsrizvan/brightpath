'use client';
import { useState } from 'react';
import api from '@/utils/api';

export default function SubjectModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({ subjectName: '', description: '', classLevel: '', syllabus: '' });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/subjects', formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Add New Subject</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                        <input
                            required
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                            value={formData.subjectName}
                            onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
                        <input
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                            value={formData.classLevel}
                            onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
                        <select 
                            className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none bg-white font-bold text-sm" 
                            value={formData.syllabus} 
                            onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                        >
                            <option value="">Select Syllabus Type</option>
                            <option value="CBSE">CBSE</option>
                            <option value="STATE">STATE</option>
                            <option value="ICSE/ISC">ICSE/ISC</option>
                            <option value="NIOS">NIOS</option>
                            <option value="IGCSE">IGCSE</option>
                            <option value="IB">IB</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Subject'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
