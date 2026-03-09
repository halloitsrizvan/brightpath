
const dbConnect = require('./lib/mongodb');
const Student = require('./models/Student');
const bcrypt = require('bcryptjs');

async function testLogin(email, password) {
    try {
        // Since I can't easily use the ESM modules in a simple script without setup, 
        // I'll use a direct mongo connection if I had the URI.
        // But I have the URI from the earlier command status!
        const mongoose = require('mongoose');
        const URI = "mongodb+srv://clgrizvan_dk9avfuz.mongodb.net/brightpath?retryWrites=true&w=majority";

        await mongoose.connect(URI);
        console.log("Connected to DB");

        const user = await mongoose.connection.collection('students').findOne({ email });

        if (!user) {
            console.log("User not found");
            return;
        }

        console.log("User found:", user.email);
        console.log("Stored Password (length):", user.password?.length);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Get email/pass from args or use defaults
const email = process.argv[2] || 'student@example.com';
const pass = process.argv[3] || 'student123';

testLogin(email, pass);
