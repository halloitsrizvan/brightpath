const mongoose = require('mongoose');
require('dotenv').config();

// Standardize connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
}

// Define Schema for script (to avoid import issues)
const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    status: { type: String, default: 'published' },
    category: { type: String, default: 'Academic' },
    publishedAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

const seedPosts = [
    {
        title: "The Power of 1:1 Mentorship in Early Education",
        slug: "mentorship-early-education",
        excerpt: "Why personalized attention is the cornerstone of cognitive foundation building for KG-5 students.",
        content: "In the critical years of early childhood development, the classroom environment can sometimes be overwhelming. Personalized 1:1 mentorship allows academic advisors to identify unique learning triggers...",
        author: "Dr. Vinod Kumar",
        category: "Pedagogy"
    },
    {
        title: "Navigating Board Exams: A Strategic Roadmap",
        slug: "board-exams-roadmap",
        excerpt: "Essential preparation tactics for SSLC and CBSE students to manage stress and maximize output.",
        content: "Board exams are often seen as a high-pressure hurdle. However, with the right structural approach—breaking down syllabi into manageable sprints—any student can achieve elite results...",
        author: "Academy Staff",
        category: "Study Guides"
    },
    {
        title: "Digital Learning Ecosystems: Beyond Video Calls",
        slug: "digital-learning-ecosystems",
        excerpt: "How real-time analytics and transparent reporting enhance the parent-tutor synchronization.",
        content: "Digital learning is not just about video conferencing. It’s about the underlying data—tracking progress in real-time and ensuring full transparency between the tutor, student, and parent...",
        author: "Abraham John",
        category: "Technology"
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('CONNECTED TO DATABASE');

        // Clear existing
        await BlogPost.deleteMany({});
        console.log('CLEARED PREVIOUS POSTS');

        // Insert
        await BlogPost.insertMany(seedPosts);
        console.log('SUCCESSFULLY SEEDED 3 BLOG POSTS');

        process.exit(0);
    } catch (err) {
        console.error('SEEDING FAILED:', err);
        process.exit(1);
    }
}

seed();
