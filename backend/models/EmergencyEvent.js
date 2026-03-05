import mongoose from 'mongoose';

const emergencyEventSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    ambassadorId: { type: String },
    status: { type: String, default: 'Active' },
    resolved: { type: Boolean, default: false }
}, {
    timestamps: true,
});

const EmergencyEvent = mongoose.model('EmergencyEvent', emergencyEventSchema);
export default EmergencyEvent;
