import BlogPost from '@/models/BlogPost';
import dbConnect from '@/lib/db/mongodb';
import { sanitizeHTML } from '@/lib/utils/sanitizer';

export class BlogService {
    static async getAllPosts() {
        await dbConnect();
        return await BlogPost.find().sort({ publishedAt: -1 }).lean();
    }

    /** Rich-text fields are rendered as raw HTML on the public blog, so clean them server-side too. */
    private static sanitize(data: any) {
        const { _id, ...clean } = data || {};
        if (typeof clean.content === 'string') clean.content = sanitizeHTML(clean.content);
        if (typeof clean.excerpt === 'string') clean.excerpt = sanitizeHTML(clean.excerpt);
        return clean;
    }

    static async createPost(data: any) {
        await dbConnect();
        data = BlogService.sanitize(data);
        // Generate slug from title if not provided
        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        return await BlogPost.create(data);
    }

    static async updatePost(id: string, data: any) {
        await dbConnect();
        return await BlogPost.findByIdAndUpdate(id, BlogService.sanitize(data), { new: true });
    }

    static async deletePost(id: string) {
        await dbConnect();
        return await BlogPost.findByIdAndDelete(id);
    }
}
