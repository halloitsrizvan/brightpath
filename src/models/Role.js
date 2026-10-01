import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
    pageId: { type: String, required: true },
    access: { type: String, enum: ['full', 'view_only', 'none'], default: 'full' },
    excludeIncome: { type: Boolean, default: false }
}, { _id: false });

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false },
    permissions: [PermissionSchema]
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);
