"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
const Chat = mongoose_1.default.model('Chat', chatSchema);
exports.default = Chat;
