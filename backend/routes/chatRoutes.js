import express from 'express';
import {
    getChats,
    startChat
} from '../controllers/chatController.js';

const router = express.Router();

router.route('/').get(getChats);
router.route('/start').post(startChat);

export default router;
