import mongoose from 'mongoose';

const studentSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    moodHistory: [{
        day: { type: String },
        score: { type: Number }
    }],
    testHistory: [{
        score: { type: Number }
    }],
    riskLevel: { type: String, default: 'Stable' },
    lastInteraction: { type: String },
    assignedAmbassadorId: { type: String }
}, {
    timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
