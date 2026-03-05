import express from 'express';
import {
    getAppointments,
    addAppointment,
    startSession
} from '../controllers/appointmentController.js';

const router = express.Router();

router.route('/').get(getAppointments).post(addAppointment);
router.route('/:id/start').put(startSession);

export default router;
