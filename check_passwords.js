
import dbConnect from './lib/mongodb';
import Student from './models/Student';

async function verifyPasswords() {
    await dbConnect();
    const students = await Student.find();
    students.forEach(s => {
        const isHashed = s.password && s.password.startsWith('$2');
        console.log(`Student: ${s.email}, Password length: ${s.password?.length}, Is Hashed: ${isHashed}`);
    });
    process.exit();
}
verifyPasswords();
