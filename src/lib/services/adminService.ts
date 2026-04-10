import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Attendance from '@/models/Attendance';
import Fee from '@/models/Fee';
import dbConnect from '@/lib/db/mongodb';

export class AdminService {
    static async getDashboardStats() {
        await dbConnect();

        const totalStudents = await Student.countDocuments({ status: "active" });
        const totalTeachers = await Teacher.countDocuments({ status: "active" });

        const now = new Date();
        const startOfCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPrev = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const classesThisMonth = await Attendance.countDocuments({ date: { $gte: startOfCurrent } });

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonthStr = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
        
        const paidFees = await Fee.find({ month: currentMonthStr, paymentStatus: 'paid' });
        const monthlyRevenue = paidFees.reduce((acc, f) => acc + (f.amount || 0), 0);

        const getHoursByDay = async (start: Date, end: Date) => {
            return await Attendance.aggregate([
                {
                    $match: {
                        date: { $gte: start, $lte: end },
                        status: 'Present'
                    }
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$date" },
                        totalMinutes: { $sum: "$durationMinutes" }
                    }
                },
                {
                    $project: {
                        day: "$_id",
                        hours: { $round: [{ $divide: ["$totalMinutes", 60] }, 1] }
                    }
                }
            ]);
        };

        const [currentHours, prevHours] = await Promise.all([
            getHoursByDay(startOfCurrent, now),
            getHoursByDay(startOfPrev, endOfPrev)
        ]);

        const todayNum = now.getDate();
        const velocityData = Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1;
            const cData = currentHours.find(d => d.day === dayNum);
            const pData = prevHours.find(d => d.day === dayNum);
            
            return {
                day: dayNum,
                current: dayNum <= todayNum ? (cData ? cData.hours : 0) : null,
                previous: pData ? pData.hours : 0
            };
        });

        const latestLogs = await Attendance.find()
            .populate('studentId', 'fullName')
            .populate('teacherId', 'name')
            .populate('subjectId', 'subjectName')
            .sort({ date: -1 })
            .limit(3);

        return {
            totalStudents,
            totalTeachers,
            classesThisMonth,
            monthlyRevenue,
            velocityData,
            latestLogs,
            hoursPerDay: velocityData.map(d => ({ day: d.day, hours: d.current || 0 }))
        };
    }
}
