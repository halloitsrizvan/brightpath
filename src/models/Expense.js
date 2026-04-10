import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: true,
        enum: ['Internet', 'Software Subscription', 'Marketing', 'Payment Gateway Charges', 'Equipment', 'Miscellaneous']
    },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    month: { type: String, required: true }, // "March 2026"
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
