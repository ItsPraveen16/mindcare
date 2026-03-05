import mongoose from 'mongoose';

const escalationSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: String },
    flaggedBy: { type: String },
    status: { type: String, default: 'Pending' },
    timestamp: { type: String }
}, {
    timestamps: true,
});

const Escalation = mongoose.model('Escalation', escalationSchema);
export default Escalation;
