import BlogPost from '@/models/BlogPost';
import dbConnect from '@/lib/db/mongodb';

export class BlogService {
    static async getAllPosts() {
        await dbConnect();
        return await BlogPost.find().sort({ publishedAt: -1 }).lean();
    }

    static async createPost(data: any) {
        await dbConnect();
        // Generate slug from title if not provided
        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        return await BlogPost.create(data);
    }

    static async updatePost(id: string, data: any) {
        await dbConnect();
        return await BlogPost.findByIdAndUpdate(id, data, { new: true });
    }

    static async deletePost(id: string) {
        await dbConnect();
        return await BlogPost.findByIdAndDelete(id);
    }
}
