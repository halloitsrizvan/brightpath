import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import dbConnect from '@/lib/db/mongodb';

export class PublicService {
    static async getEliteTutors() {
        await dbConnect();
        // Fetch only active teachers with necessary public fields
        return await Teacher.find({ status: 'active' })
            .select('name image bio qualifications subjects experience')
            .limit(10)
            .lean();
    }

    static async getAllSubjects() {
        await dbConnect();
        return await Subject.find().lean();
    }
}
