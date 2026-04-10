'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api';
import BlogPostModal from '@/features/blog/components/BlogPostModal';
import { Menu, Plus, Trash2, Edit3, BookOpen, Clock, Tag } from 'lucide-react';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/admin/blog');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Archive this narrative permanently?')) return;
        try {
            await api.delete(`/admin/blog/${id}`);
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            <Sidebar role="admin" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 lg:ml-64 p-4 md:p-8">
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm"><Menu /></button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter leading-none">Journal <span className="text-primary italic-glow">Central.</span></h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Manage Academic Publications</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => { setEditData(null); setIsModalOpen(true); }}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" /> Compose Narrative
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <div key={post._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden relative flex flex-col">
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <button onClick={() => { setEditData(post); setIsModalOpen(true); }} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 hover:text-primary shadow-sm border border-gray-100 transition-all"><Edit3 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(post._id)} className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-gray-600 hover:text-red-500 shadow-sm border border-gray-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            <div className="aspect-video bg-gray-100 relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                {post.image ? (
                                    <img src={post.image} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <BookOpen className="w-12 h-12" />
                                    </div>
                                )}
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${post.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {post.status}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest font-black"><Tag className="w-3 h-3" /> {post.category}</span>
                                </div>

                                <h3 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                                <p className="text-xs text-gray-500 font-bold leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>

                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                                            {post.author[0]}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{post.author}</span>
                                    </div>
                                    <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Clock className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {posts.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <BookOpen className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter">The Library is Empty</h3>
                            <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">Begin by composing your first institutional narrative.</p>
                        </div>
                    )}
                </div>

                <BlogPostModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={fetchPosts}
                    editData={editData}
                />
            </main>
        </div>
    );
}
