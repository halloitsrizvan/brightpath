
import dbConnect from './lib/mongodb';
import Student from './models/Student';

async function checkStudents() {
    await dbConnect();
    const count = await Student.countDocuments();
    const all = await Student.find();
    console.log('Student count:', count);
    console.log('Students:', all.map(s => ({ email: s.email, role: s.role })));
    process.exit();
}
checkStudents();
