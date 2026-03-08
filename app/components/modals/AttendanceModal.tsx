'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AttendanceModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [formData, setFormData] = useState({ studentId: '', teacherId: '', subjectId: '', sessionId: '', date: '', durationMinutes: 60, status: 'Present', notes: '' });
    const [studentsList, setStudentsList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            Promise.all([
                api.get('/students'),
                api.get('/teachers'),
                api.get('/subjects')
            ]).then(([sRes, tRes, subRes]) => {
                setStudentsList(sRes.data);
                setTeachersList(tRes.data);
                setSubjectsList(subRes.data);
            }).catch(console.error);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/attendance', formData);
            setFormData({ studentId: '', teacherId: '', subjectId: '', sessionId: '', date: '', durationMinutes: 60, status: 'Present', notes: '' });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Record Attendance</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                            <select required className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none bg-white" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}>
                                <option value="" disabled>Select a student</option>
                                {studentsList.map((s: any) => <option key={s._id} value={s._id}>{s.fullName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                            <select required className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none bg-white" value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}>
                                <option value="" disabled>Select a teacher</option>
                                {teachersList.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select required className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none bg-white" value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}>
                                <option value="" disabled>Select a subject</option>
                                {subjectsList.map((sub: any) => <option key={sub._id} value={sub._id}>{sub.subjectName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input required type="date" className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                            <input required type="number" className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" value={formData.durationMinutes} onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none bg-white" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary outline-none" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100 pt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
