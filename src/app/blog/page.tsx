import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicService } from '@/lib/services/publicService';

export const revalidate = 3600; // Refresh every hour

export default async function BlogPage() {
    const rawPosts = await PublicService.getBlogPosts();
    const posts = JSON.parse(JSON.stringify(rawPosts));

    // Fallback posts if database is empty for initial run
    const displayPosts = posts.length > 0 ? posts : [
        {
            title: "Welcome to the Brightpath Journal",
            excerpt: "We are initializing our digital narratives. Check back soon for expert academic insights.",
            author: "Academy Staff",
            publishedAt: new Date().toISOString(),
            _id: "init-1"
        }
    ];

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
                    {displayPosts.map((post: any) => (
                        <Link href={`/blog/${post.slug || post._id}`} key={post._id}>
                            <article className="group cursor-pointer">
                                <div className="bg-gray-100 rounded-[3rem] aspect-[4/3] mb-8 overflow-hidden relative border border-gray-100 shadow-xl shadow-gray-200/20">
                                    <Image src={post.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${post._id}`} alt={post.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                                </div>
                                <div className="space-y-4 px-4">
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-primary" /> {post.author}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 italic uppercase tracking-tighter group-hover:text-primary transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-bold italic line-clamp-2 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="pt-4 flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                        Read Full Narrative <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
