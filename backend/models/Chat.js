import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    studentId: { type: String, required: true },
    ambassadorId: { type: String, required: true },
    status: { type: String, default: 'Open' },
    messages: [{
        text: { type: String },
        sender: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
