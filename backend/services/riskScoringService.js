import Student from '../models/Student.js';
import AIInsight from '../models/AIInsight.js';

/**
 * Calculates and updates risk level for a student based on:
 * 1. Number of consecutive negative moods
 * 2. Recent journal sentiment
 * 
 * Rules:
 * 5 negative moods -> Warning
 * 7 negative moods -> Urgent
 * Emergency button -> Crisis
 * 
 * Note: Lower mood score mapping: Assume score < 4 is "negative" mood.
 */
export const syncStudentRiskScore = async (studentId) => {
    try {
        const student = await Student.findOne({ id: studentId });
        if (!student) return;

        // Skip calculations if already in Crisis, crisis requires manual downgrade
        if (student.riskLevel === 'Crisis') return;

        // 1. Analyze consecutive negative moods in the recent history
        let consecutiveNegativeMoods = 0;

        // Loop backwards from newest to oldest in mood history
        // Assuming moodHistory is appended, the last item is the latest
        for (let i = student.moodHistory.length - 1; i >= 0; i--) {
            if (student.moodHistory[i].score < 5) {
                consecutiveNegativeMoods++;
            } else {
                break; // Break on first non-negative mood
            }
        }

        // 2. Look up the latest journal sentiment
        const latestInsight = await AIInsight.findOne({ studentId }).sort({ createdAt: -1 });

        // Calculate mapped level
        let newRisk = 'Stable';

        // Rule checks (Highest priority overriding lower ones)
        if (consecutiveNegativeMoods >= 5) {
            newRisk = 'Warning';
        }

        if (consecutiveNegativeMoods >= 7) {
            newRisk = 'Urgent';
        }

        // Incorporate AI Sentiment into risk
        if (latestInsight && latestInsight.sentiment === 'negative' && latestInsight.score > 0.7) {
            // A highly confident negative journal acts as an amplifier
            if (newRisk === 'Stable') newRisk = 'Warning';
            else if (newRisk === 'Warning') newRisk = 'Urgent';
        }

        // Save if changed
        if (student.riskLevel !== newRisk) {
            student.riskLevel = newRisk;
            await student.save();
        }

        return newRisk;

    } catch (error) {
        console.error("Error syncing student risk score:", error);
    }
};

export const triggerEmergencyCrisis = async (studentId) => {
    try {
        await Student.findOneAndUpdate({ id: studentId }, { riskLevel: 'Crisis' });
    } catch (error) {
        console.error("Error triggering crisis:", error);
    }
};
