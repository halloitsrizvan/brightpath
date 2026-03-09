import 'dotenv/config';
import mongoose from 'mongoose';
import Teacher from './models/Teacher.js';
import Student from './models/Student.js';
import Subject from './models/Subject.js';

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        const ts = await Teacher.find().populate('students', 'fullName');
        console.log("SUCCESS length:", ts.length);
    } catch (err) {
        console.log("ERROR:", err.message);
    }
    process.exit(0);
}
test();
