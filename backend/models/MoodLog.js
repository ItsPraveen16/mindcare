import mongoose from 'mongoose';

const moodLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: String, required: true },
    mood: { type: String },
    score: { type: Number, required: true }
}, {
    timestamps: true,
});

moodLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const MoodLog = mongoose.model('MoodLog', moodLogSchema);
export default MoodLog;
