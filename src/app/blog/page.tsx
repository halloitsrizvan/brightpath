'use client';
import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const posts = [
    {
        title: "The Power of 1:1 Mentorship in Early Education",
        excerpt: "Why personalized attention is the cornerstone of cognitive foundation building for KG-5 students.",
        author: "Dr. Vinod Kumar",
        date: "April 10, 2026",
        id: 1
    },
    {
        title: "Navigating Board Exams: A Strategic Roadmap",
        excerpt: "Essential preparation tactics for SSLC and CBSE students to manage stress and maximize output.",
        author: "Academy Staff",
        date: "April 5, 2026",
        id: 2
    },
    {
        title: "Digital Learning Ecosystems: Beyond Video Calls",
        excerpt: "How real-time analytics and transparent reporting enhance the parent-tutor synchronization.",
        author: "Abraham John",
        date: "March 28, 2026",
        id: 3
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            
            <header className="pt-40 pb-32 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4">Academic Insight</p>
                    <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
                        The Brightpath <br /><span className="text-primary">Journal.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-bold italic max-w-2xl mx-auto italic leading-relaxed">
                        Thought leadership, study guides, and institutional updates from Kerala's premier online academy.
                    </p>
                </div>
            </header>

            <section className="py-32">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map((post) => (
                        <article key={post.id} className="group cursor-pointer">
                            <div className="bg-gray-100 rounded-[3rem] aspect-[4/3] mb-8 overflow-hidden relative border border-gray-100 shadow-xl shadow-gray-200/20">
                                <Image src={`https://api.dicebear.com/7.x/identicon/svg?seed=${post.id + 200}`} alt={post.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                            </div>
                            <div className="space-y-4 px-4">
                                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-primary" /> {post.author}</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 font-bold text-sm leading-relaxed italic">{post.excerpt}</p>
                                <div className="pt-4 flex items-center gap-2 group/btn">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Read Narrative</span>
                                    <ArrowRight className="w-4 h-4 text-primary group-hover/btn:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
