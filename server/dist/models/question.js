"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const questionSchema = new Schema({
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    text: { type: String, required: true },
    options: [String],
    correctAnswer: { type: Number, required: true },
    answers: [{
            user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            answer: { type: Number, required: true },
        }]
}, { timestamps: true });
const Question = mongoose_1.default.model('Question', questionSchema);
exports.default = Question;
