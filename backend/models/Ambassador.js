import mongoose from 'mongoose';

const ambassadorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    assignedStudents: [{ type: String }] // Array of student IDs
}, {
    timestamps: true,
});

const Ambassador = mongoose.model('Ambassador', ambassadorSchema);
export default Ambassador;
