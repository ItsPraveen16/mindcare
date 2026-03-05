import express from 'express';
import { submitJournal } from '../controllers/journalController.js';

const router = express.Router();

router.post('/', submitJournal);

export default router;
