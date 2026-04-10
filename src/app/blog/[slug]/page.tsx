import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicService } from '@/lib/services/publicService';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await PublicService.getBlogPostBySlug(params.slug);
    if (!post) return { title: 'Not Found | Brightpath' };

    return {
        title: post.metaTitle || `${post.title} | Brightpath Kerala`,
        description: post.metaDescription || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt?.toString(),
            authors: [post.author],
        }
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const rawPost = await PublicService.getBlogPostBySlug(params.slug);
    if (!rawPost) notFound();

    const post = JSON.parse(JSON.stringify(rawPost));

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <article className="pt-40 pb-32">
                <header className="container mx-auto px-6 max-w-4xl mb-16">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-10 hover:gap-4 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Return to Journal
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/10 flex items-center gap-2">
                           <Tag className="w-3 h-3" /> {post.category || 'Academic'}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-primary" /> {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 italic uppercase tracking-tighter leading-none mb-8">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 py-6 border-y border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black italic">
                            {post.author[0]}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Written By</p>
                            <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{post.author}</p>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-6 max-w-4xl">
                    <div 
                        className="prose prose-xl prose-primary max-w-none 
                        prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter
                        prose-p:text-gray-600 prose-p:font-bold prose-p:italic prose-p:leading-relaxed
                        prose-img:rounded-[3rem] prose-img:shadow-2xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            <PublicFooter />
        </div>
    );
}
