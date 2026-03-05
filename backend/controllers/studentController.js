import Student from '../models/Student.js';
import MoodLog from '../models/MoodLog.js';
import EmergencyEvent from '../models/EmergencyEvent.js';
import AIInsight from '../models/AIInsight.js';
import { syncStudentRiskScore } from '../services/riskScoringService.js';
import { generateWellnessTips } from '../services/wellnessService.js';

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStudentRisk = async (req, res) => {
    const { id } = req.params;
    const { riskLevel } = req.body;
    try {
        const student = await Student.findOneAndUpdate({ id }, { riskLevel }, { new: true });
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addMood = async (req, res) => {
    const { id } = req.params;
    const { mood, score } = req.body;

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = dayLabels[new Date().getDay()];
    const todayStr = new Date().toISOString().split('T')[0];

    try {
        const existingLog = await MoodLog.findOne({ userId: id, date: todayStr });
        if (existingLog) {
            return res.json({ success: false, message: "Mood already logged today" });
        }

        const student = await Student.findOne({ id });
        if (student) {
            await MoodLog.create({ userId: id, date: todayStr, mood, score });

            const newMoodHistory = [...student.moodHistory, { day: currentDay, score }];
            if (newMoodHistory.length > 7) newMoodHistory.shift();

            const last5 = newMoodHistory.slice(-5);
            const avgScore = last5.reduce((sum, item) => sum + item.score, 0) / last5.length;

            let newRisk = student.riskLevel;
            if (avgScore < 4) newRisk = "Urgent";
            else if (avgScore < 6) newRisk = "Warning";
            else newRisk = "Stable";

            student.moodHistory = newMoodHistory;
            student.riskLevel = newRisk;
            student.lastInteraction = 'Just now';

            const updatedStudent = await student.save();

            // Re-calculate risk system
            await syncStudentRiskScore(id);

            // Fetch the freshly updated document to return actual new risk
            const finalStudent = await Student.findOne({ id });

            res.json(finalStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addTestResult = async (req, res) => {
    const { id } = req.params;
    const { score } = req.body;

    try {
        const student = await Student.findOne({ id });
        if (student) {
            let newRisk = student.riskLevel;
            if (score >= 70) newRisk = "Urgent";
            else if (score >= 40) newRisk = "Warning";

            student.testHistory.push({ score });
            student.riskLevel = newRisk;
            student.lastInteraction = 'Just now';

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLastInteraction = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findOneAndUpdate({ id }, { lastInteraction: 'Just now' }, { new: true });
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const triggerEmergency = async (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
        return res.status(400).json({ message: "studentId is required" });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { id: studentId },
            { riskLevel: 'Crisis' },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // 1. Create entry in EmergencyEvents
        const emergencyEvent = new EmergencyEvent({
            studentId: student.id,
            ambassadorId: student.assignedAmbassadorId,
            status: 'Active'
        });
        await emergencyEvent.save();

        // 3. Notify assigned ambassador
        // 4. Notify counsellor
        console.log(`\n\x1b[41m\x1b[37m[CRISIS NOTIFICATION]\x1b[0m`);
        console.log(`-> Notifying Ambassador [${student.assignedAmbassadorId}] about student ${student.name} (${student.id})`);
        console.log(`-> Notifying Global Counsellor about CRITICAL emergency for ${student.name} (${student.id})\n`);

        res.status(201).json({
            success: true,
            message: "Emergency triggered. Ambassador and Counsellor notified.",
            emergencyEvent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWellnessTips = async (req, res) => {
    try {
        const { studentId, mood, emotion, sentiment, riskLevel, riskScore } = req.query;

        let finalMoodScore = mood ? parseInt(mood) : 5;
        let finalEmotion = emotion || sentiment || 'neutral';
        let finalRisk = riskLevel || riskScore || 'Stable';

        if (studentId) {
            const student = await Student.findOne({ id: studentId });
            if (student) {
                finalRisk = student.riskLevel;
                if (student.moodHistory && student.moodHistory.length > 0) {
                    finalMoodScore = student.moodHistory[student.moodHistory.length - 1].score;
                }
            }

            const latestInsight = await AIInsight.findOne({ studentId }).sort({ createdAt: -1 });
            if (latestInsight) {
                finalEmotion = latestInsight.emotion;
            }
        }

        const tips = generateWellnessTips(finalMoodScore, finalEmotion, finalRisk);
        res.json({ suggestions: tips });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
