import Chat from '../models/Chat.js';
import Student from '../models/Student.js';

export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({});
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const startChat = async (req, res) => {
    const { studentId, ambassadorId } = req.body;

    try {
        // Update student's last interaction
        await Student.findOneAndUpdate({ id: studentId }, { lastInteraction: 'Just now' });

        let chat = await Chat.findOne({ studentId, ambassadorId, status: 'Open' });

        if (!chat) {
            chat = new Chat({
                id: Date.now(),
                studentId,
                ambassadorId,
                messages: [],
                status: 'Open'
            });
            await chat.save();
        }

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
