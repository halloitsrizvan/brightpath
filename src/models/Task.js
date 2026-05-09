import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date },
    allocatedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

// Handle model compilation error in Next.js HMR
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export default Task;
