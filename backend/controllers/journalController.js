import AIInsight from '../models/AIInsight.js';
import { analyzeJournal } from '../services/sentimentService.js';
import { syncStudentRiskScore } from '../services/riskScoringService.js';

export const submitJournal = async (req, res) => {
    const { studentId, journalText } = req.body;

    if (!studentId || !journalText) {
        return res.status(400).json({ message: "studentId and journalText are required" });
    }

    try {
        // 1. Analyze journal text
        const analysisResult = analyzeJournal(journalText); // returns { sentiment, emotion, score }

        // 2. Store result inside AIInsights collection
        const aiInsight = new AIInsight({
            studentId,
            journalText,
            sentiment: analysisResult.sentiment,
            emotion: analysisResult.emotion,
            score: analysisResult.score
        });

        await aiInsight.save();

        // 3. Re-calculate the student's risk based on this newly added insight
        await syncStudentRiskScore(studentId);

        // 4. Return the analysis exactly as required
        res.status(201).json(analysisResult);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
