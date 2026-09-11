import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicService } from '@/lib/services/publicService';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await PublicService.getBlogPostBySlug(slug);
    if (!post) return { title: 'Not Found | BrightPath' };

    return {
        title: post.metaTitle || `${post.title} | BrightPath`,
        description: post.metaDescription || post.excerpt,
        alternates: {
            canonical: `/blog/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt?.toString(),
            authors: [post.author],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const rawPost = await PublicService.getBlogPostBySlug(slug);
    if (!rawPost) notFound();

    const post = JSON.parse(JSON.stringify(rawPost));

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <article className="pt-32 pb-20">
                <header className="container mx-auto px-6 max-w-3xl mb-10">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary font-medium mb-8 hover:gap-3 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10 flex items-center gap-1.5">
                           <Tag className="w-3 h-3" /> {post.category || 'Academic'}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1.5">
                           <Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display leading-tight mb-6">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-3 py-4 border-y border-gray-100">
                        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                            {post.author[0]}
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Written by</p>
                            <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-6 max-w-3xl">
                    <div 
                        className="prose prose-gray max-w-none 
                        prose-headings:font-bold prose-headings:font-display
                        prose-p:text-gray-600 prose-p:leading-relaxed
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-a:text-primary"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
