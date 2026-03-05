import Escalation from '../models/Escalation.js';

export const getEscalations = async (req, res) => {
    try {
        const escalations = await Escalation.find({}).sort({ createdAt: -1 });
        res.json(escalations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addEscalation = async (req, res) => {
    const escalation = new Escalation({
        ...req.body,
        id: Date.now(),
        timestamp: 'Just now'
    });

    try {
        const createdEscalation = await escalation.save();
        res.status(201).json(createdEscalation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markEscalationReviewed = async (req, res) => {
    const { id } = req.params;
    try {
        const escalation = await Escalation.findOneAndUpdate({ id }, { status: 'Reviewed' }, { new: true });
        if (escalation) {
            res.json(escalation);
        } else {
            res.status(404).json({ message: 'Escalation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
