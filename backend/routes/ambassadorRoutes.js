import express from 'express';
import Student from '../models/Student.js';
import Ambassador from '../models/Ambassador.js';

const router = express.Router();

router.get('/:ambassadorId/students', async (req, res) => {
    try {
        const { ambassadorId } = req.params;

        // Optionally, check if the ambassador exists
        const ambassador = await Ambassador.findOne({ id: ambassadorId });
        if (!ambassador) {
            return res.status(404).json({ message: "Ambassador not found" });
        }

        // Find all students assigned to this ambassador
        const assignedStudents = await Student.find({ assignedAmbassadorId: ambassadorId });

        // Map the results to return specific required fields
        const formattedStudents = assignedStudents.map(student => {
            // Get latest mood log from the history
            const latestMood = student.moodHistory.length > 0
                ? student.moodHistory[student.moodHistory.length - 1]
                : null;

            return {
                id: student.id,
                name: student.name,
                email: student.email,
                riskLevel: student.riskLevel,
                lastInteraction: student.lastInteraction,
                latestMood: latestMood
            };
        });

        res.json(formattedStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
