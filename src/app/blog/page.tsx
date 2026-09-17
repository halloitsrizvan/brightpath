import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicService } from '@/lib/services/publicService';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Blog | BrightPath Eduvora",
    description: "Study guides, academic insights, and updates from Kerala's premier 1:1 online tuition academy.",
    alternates: {
        canonical: '/blog',
    },
};

export const revalidate = 3600;

export default async function BlogPage() {
    const rawPosts = await PublicService.getBlogPosts();
    const posts = JSON.parse(JSON.stringify(rawPosts));

    const displayPosts = posts.length > 0 ? posts : [
        {
            title: "Welcome to the BrightPath Blog",
            excerpt: "Stay tuned for study guides, academic insights, and updates from our team.",
            author: "BrightPath Team",
            publishedAt: new Date().toISOString(),
            _id: "init-1"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />
            
            <header className="pt-32 pb-16 bg-surface">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Blog</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-display leading-tight mb-4">
                        BrightPath Blog
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Study guides, academic insights, and updates from our team.
                    </p>
                </div>
            </header>

            <section className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <h2 className="sr-only">Latest Articles & Educational Insights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayPosts.map((post: any) => (
                        <Link href={`/blog/${post.slug || post._id}`} key={post._id}>
                            <article className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100/80 hover:shadow-lg hover:shadow-gray-100/60 transition-all duration-300 bg-white">
                                <div className="bg-gray-100 aspect-[4/3] overflow-hidden relative">
                                    <Image 
                                        src={post.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${post._id}`} 
                                        alt={post.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read more <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                    </div>
                </div>
            </section>

            <FloatingContact />
            <PublicFooter />
        </div>
    );
}
