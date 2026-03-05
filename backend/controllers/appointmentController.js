import Appointment from '../models/Appointment.js';

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addAppointment = async (req, res) => {
    const appointment = new Appointment({
        ...req.body,
        id: Date.now(), // Generate a simple unique ID for now
    });

    try {
        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const startSession = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findOneAndUpdate({ id }, { status: 'Active' }, { new: true });
        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
