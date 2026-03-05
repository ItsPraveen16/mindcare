import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    journalText: { type: String, required: true },
    sentiment: { type: String, required: true },
    emotion: { type: String, required: true },
    score: { type: Number, required: true }
}, {
    timestamps: true,
});

aiInsightSchema.index({ studentId: 1 });

const AIInsight = mongoose.model('AIInsight', aiInsightSchema);
export default AIInsight;
