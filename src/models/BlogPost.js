import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    excerpt: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published',
    },
    category: {
        type: String,
        default: 'Academic',
        index: true
    },
    metaTitle: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
