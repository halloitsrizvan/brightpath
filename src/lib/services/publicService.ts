import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import BlogPost from '@/models/BlogPost';
import dbConnect from '@/lib/db/mongodb';

export class PublicService {
    static async getEliteTutors() {
        await dbConnect();
        return await Teacher.find({ status: 'active' })
            .select('name image bio qualifications subjects experience')
            .limit(10)
            .populate('subjects', 'subjectName')
            .lean();
    }

    static async getBlogPosts() {
        await dbConnect();
        return await BlogPost.find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(9)
            .lean();
    }

    static async getBlogPostBySlug(slug: string) {
        await dbConnect();
        return await BlogPost.findOne({ slug, status: 'published' }).lean();
    }

    static async getAllSubjects() {
        await dbConnect();
        return await Subject.find().lean();
    }
}
