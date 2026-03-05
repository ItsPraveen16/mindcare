import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: true,
});

const DirectMessage = mongoose.model('DirectMessage', messageSchema);
export default DirectMessage;
