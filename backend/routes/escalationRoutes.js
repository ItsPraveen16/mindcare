import express from 'express';
import {
    getEscalations,
    addEscalation,
    markEscalationReviewed
} from '../controllers/escalationController.js';

const router = express.Router();

router.route('/').get(getEscalations).post(addEscalation);
router.route('/:id/review').put(markEscalationReviewed);

export default router;
