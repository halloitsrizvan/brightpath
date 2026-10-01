'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import BlogPostModal from '@/features/blog/components/BlogPostModal';
import { Menu, Plus, Trash2, Edit3, BookOpen, Clock, Tag, Shield } from 'lucide-react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import AccessDenied from '@/components/admin/AccessDenied';

export default function AdminBlogPage() {
    const { canAccess, isViewOnly, roleName, loading: permissionsLoading } = useAdminPermissions();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const viewOnly = isViewOnly('blog');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/blog');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (viewOnly) return;
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        try {
            await api.delete(`/admin/blog/${id}`);
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex bg-[#fafafa] min-h-screen font-sans text-gray-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                {/* Mobile Header Bar */}
                <header className="fixed top-0 left-0 right-0 lg:left-64 z-30 bg-white/80 backdrop-blur-md shadow-xs p-3.5 flex items-center justify-between lg:hidden border-b border-gray-100">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-[#45308D] shadow-xs active:scale-95 transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="text-right">
                        <h2 className="text-base font-extrabold text-[#45308D] tracking-tight leading-none">Journal</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{roleName || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-4 md:p-8 flex-1 space-y-6 lg:mt-0 mt-14">
                    {!permissionsLoading && !canAccess('blog') ? (
                        <AccessDenied roleName={roleName} pageName="Journal & Publications" />
                    ) : (
                        <>
                            {/* Header Card */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#45308D] bg-[#45308D]/5 px-2.5 py-0.5 rounded-md border border-[#45308D]/10">
                                            Publications
                                        </span>
                                        {viewOnly && (
                                            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> View Only
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mt-1.5 leading-tight">
                                        Journal & Blog Central
                                    </h1>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Manage academic articles, study tips & announcements</p>
                                </div>

                                {!viewOnly && (
                                    <button 
                                        onClick={() => { setEditData(null); setIsModalOpen(true); }}
                                        className="w-full sm:w-auto px-4 py-2 bg-[#45308D] hover:bg-[#45308D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Compose Article</span>
                                    </button>
                                )}
                            </div>

                            {/* Posts Grid */}
                            {loading ? (
                                <div className="bg-white rounded-2xl p-16 text-center text-[#45308D] font-bold text-xs animate-pulse border border-gray-100 shadow-xs">
                                    Loading publications...
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-xs">
                                    <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <h2 className="text-base font-bold text-gray-900">The Library is Empty</h2>
                                    <p className="text-gray-400 text-xs mt-1">Begin by composing your first institutional article.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {posts.map((post: any) => (
                                        <div 
                                            key={post._id} 
                                            className="group bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#45308D]/20 transition-all"
                                        >
                                            <div>
                                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                                    {post.image ? (
                                                        <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={post.title} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <BookOpen className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                                                            post.status === 'published' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                                                        }`}>
                                                            {post.status}
                                                        </span>
                                                    </div>
                                                    {!viewOnly && (
                                                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                                                            <button 
                                                                onClick={() => { setEditData(post); setIsModalOpen(true); }} 
                                                                className="p-1.5 bg-white/90 backdrop-blur-md rounded-lg text-gray-700 hover:text-[#45308D] shadow-xs transition"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(post._id)} 
                                                                className="p-1.5 bg-white/90 backdrop-blur-md rounded-lg text-gray-700 hover:text-rose-600 shadow-xs transition"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-4 space-y-2">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#45308D]">
                                                        <Tag className="w-3 h-3" /> {post.category || 'General'}
                                                    </div>
                                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#45308D] transition-colors line-clamp-2 leading-snug">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                        {post.excerpt}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-5 h-5 rounded-full bg-[#45308D]/10 flex items-center justify-center text-[#45308D] text-[9px] font-bold">
                                                        {post.author?.[0] || 'A'}
                                                    </div>
                                                    <span className="font-medium text-gray-600">{post.author || 'Admin'}</span>
                                                </div>
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Clock className="w-3 h-3" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <BlogPostModal 
                                isOpen={isModalOpen} 
                                onClose={() => setIsModalOpen(false)} 
                                onSuccess={fetchPosts}
                                editData={editData}
                            />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
