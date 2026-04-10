'use client';
import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';
import { Layout, Type, FileText, Send, User, Search, Globe } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import { sanitizeHTML } from '@/lib/utils/sanitizer';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function BlogPostModal({ isOpen, onClose, onSuccess, editData }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, editData?: any }) {
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: 'Academic',
        status: 'published',
        image: '',
        metaTitle: '',
        metaDescription: ''
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('content'); // 'content' or 'seo'

    useEffect(() => {
        if (isOpen && editData) {
            setFormData({
                title: editData.title || '',
                excerpt: editData.excerpt || '',
                content: editData.content || '',
                author: editData.author || '',
                category: editData.category || 'Academic',
                status: editData.status || 'published',
                image: editData.image || '',
                metaTitle: editData.metaTitle || '',
                metaDescription: editData.metaDescription || ''
            });
        } else if (isOpen) {
            setFormData({ title: '', excerpt: '', content: '', author: '', category: 'Academic', status: 'published', image: '', metaTitle: '', metaDescription: '' });
        }
    }, [isOpen, editData]);

    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    }), []);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const sanitizedData = {
            ...formData,
            content: sanitizeHTML(formData.content),
            excerpt: sanitizeHTML(formData.excerpt)
        };

        try {
            if (editData) {
                await api.put(`/admin/blog/${editData._id}`, sanitizedData);
                toast.success('Narrative Updated & Secured');
            } else {
                await api.post('/admin/blog', sanitizedData);
                toast.success('Narrative Published & Secured');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl p-10 max-h-[90vh] overflow-y-auto border border-gray-100">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">
                            {editData ? 'Edit' : 'Draft New'} <span className="text-primary italic-glow">Narrative.</span>
                        </h2>
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setActiveTab('content')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Content Design</button>
                            <button onClick={() => setActiveTab('seo')} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'seo' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}>Institutional SEO</button>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {activeTab === 'content' ? (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput label="Article Title" icon={<Type className="w-4 h-4" />} placeholder="e.g. The Future of Pedagogy" value={formData.title} onChange={(val) => setFormData({ ...formData, title: val })} />
                                <FormInput label="Author Identity" icon={<User className="w-4 h-4" />} placeholder="Full Name or Role" value={formData.author} onChange={(val) => setFormData({ ...formData, author: val })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 font-black"><Layout className="w-3 h-3 text-primary" /> Category</label>
                                    <select className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm italic" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="Academic">Academic</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Pedagogy">Pedagogy</option>
                                        <option value="Announcement">Announcement</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 font-black"><Send className="w-3 h-3 text-primary" /> Status</label>
                                    <select className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm italic" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="published">Published (Live)</option>
                                        <option value="draft">Internal Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 font-black"><FileText className="w-3 h-3 text-primary" /> Academic Excerpt (SEO Summary)</label>
                                <textarea className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm italic min-h-[80px]" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} required placeholder="Brief summary for the public grid..."></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 font-black"><FileText className="w-3 h-3 text-primary" /> Full Narrative Content</label>
                                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={formData.content} 
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        modules={quillModules}
                                        className="h-[400px] mb-12"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                                <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-4">
                                    <Globe className="w-4 h-4" /> Google Search Preview
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-[#1a0dab] text-xl font-medium mb-1 line-clamp-1">{formData.metaTitle || formData.title || 'Institutional Narrative | Brightpath'}</p>
                                    <p className="text-[#006621] text-sm mb-1">brightpath-kerala.com › blog › ...</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{formData.metaDescription || formData.excerpt || 'Read the full article on Brightpath Kerala section of Eduvora...'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                <FormInput label="SEO Meta Title" icon={<Search className="w-4 h-4" />} placeholder="Keep it under 60 characters" value={formData.metaTitle} onChange={(val) => setFormData({ ...formData, metaTitle: val })} />
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 font-black"><Search className="w-3 h-3 text-primary" /> SEO Meta Description</label>
                                    <textarea className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm italic min-h-[100px]" value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} placeholder="Optimal length is around 155 characters..."></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 mt-10 border-t border-gray-100 pt-10">
                        <button type="button" onClick={onClose} className="px-8 py-4 text-gray-400 text-xs font-black uppercase tracking-widest hover:text-gray-600 transition">Discard</button>
                        <button type="submit" disabled={loading} className="px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                            {loading ? 'Transmitting...' : editData ? 'Sync Changes' : 'Publish Narrative'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FormInput({ label, icon, placeholder, value, onChange }: { label: string, icon: any, placeholder: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2 font-black">{icon} {label}</label>
            <input
                type="text"
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-sm italic"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
