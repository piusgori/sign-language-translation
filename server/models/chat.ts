import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userOne: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userTwo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: {
        id: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, required: true },
    },
    messages: [{
        id: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, required: true },
    }],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;