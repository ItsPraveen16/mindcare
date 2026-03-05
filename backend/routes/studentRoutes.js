import express from 'express';
import {
    getStudents,
    updateStudentRisk,
    addMood,
    addTestResult,
    updateLastInteraction,
    triggerEmergency,
    getWellnessTips
} from '../controllers/studentController.js';

const router = express.Router();

router.route('/emergency').post(triggerEmergency);
router.route('/wellness-tips').get(getWellnessTips);

router.route('/').get(getStudents);
router.route('/:id/risk').put(updateStudentRisk);
router.route('/:id/mood').post(addMood);
router.route('/:id/test').post(addTestResult);
router.route('/:id/interaction').put(updateLastInteraction);

export default router;
