import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String },
    dateStr: { type: String },
    time: { type: String },
    type: { type: String },
    status: { type: String, default: 'Scheduled' },
    doctor: { type: String },
    initial: { type: String }
}, {
    timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
