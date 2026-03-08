import { NextRequest } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Exam from '@/models/Exam';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';
import PDFDocument from 'pdfkit';

export async function GET(req: NextRequest, { params }: { params: { studentId: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'student', 'teacher']);

        const student = await Student.findById(params.studentId);
        if (!student) return new Response(JSON.stringify({ message: 'Student not found' }), { status: 404 });

        const searchParams = req.nextUrl.searchParams;
        const month = searchParams.get('month') || new Date().toLocaleString('default', { month: 'long' });

        const exams = await Exam.find({ studentId: student._id });
        const totalMarks = exams.reduce((acc, curr) => acc + curr.marks, 0);
        const maxMarks = exams.reduce((acc, curr) => acc + curr.maxMarks, 0);
        const avgMarks = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : 0;

        const attendance = await Attendance.find({ studentId: student._id });
        const totalAttended = attendance.length;
        const attendancePercentage = ((totalAttended / 20) * 100).toFixed(2);

        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));

        doc.fontSize(20).text(`BrightPath Tuition Center`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Monthly Progress Report - ${month}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Student Name: ${student.fullName}`);
        doc.text(`Class: ${student.class}`);
        doc.moveDown();
        doc.text(`Attendance Percentage: ${attendancePercentage}%`);
        doc.text(`Average Marks: ${avgMarks}%`);
        doc.moveDown();
        doc.text(`Teacher Feedback:`);
        exams.forEach(exam => {
            if (exam.progressNote) {
                doc.fontSize(12).text(`- ${exam.subject}: ${exam.progressNote}`);
            }
        });

        doc.end();

        const pdfBuffer = await new Promise<Buffer>((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
        });

        return new Response(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=progress_${student.fullName}_${month}.pdf`
            }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message }), { status: 500 });
    }
}
