import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Exam from '@/models/Exam';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'student', 'teacher']);
        const { searchParams } = new URL(req.url);
        
        let studentId = searchParams.get('studentId');
        let teacherIdFilter = searchParams.get('teacherId');
        let subjectFilter = searchParams.get('subject');

        // Enforcement: Students can only see their own data
        if (user.role === 'student') {
            studentId = user.id;
        }

        if (!studentId) {
            return NextResponse.json({ message: "Student ID required" }, { status: 400 });
        }

        const query: any = { studentId };
        if (teacherIdFilter) query.teacherId = teacherIdFilter;
        if (subjectFilter) query.subject = subjectFilter;

        const exams = await Exam.find(query)
            .sort({ examDate: 1 })
            .populate('teacherId', 'name');

        // Group by subject
        const analysis: { [key: string]: any[] } = {};
        
        exams.forEach(exam => {
            if (!analysis[exam.subject]) analysis[exam.subject] = [];
            
            const percentage = Math.round((exam.marks / exam.maxMarks) * 100);
            
            analysis[exam.subject].push({
                _id: exam._id,
                date: exam.examDate,
                formattedDate: new Date(exam.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                marks: exam.marks,
                maxMarks: exam.maxMarks,
                percentage: percentage,
                progressNote: exam.progressNote,
                tutor: exam.teacherId?.name || 'Unknown'
            });
        });

        return NextResponse.json({
            studentId,
            subjects: Object.keys(analysis),
            data: analysis
        });

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
