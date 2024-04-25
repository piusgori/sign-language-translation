"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const lessonSchema = new Schema({
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    title: { type: String, required: true },
    content: { type: String, content: Schema.Types.Mixed },
    url: { type: String, content: Schema.Types.Mixed },
    users: [String]
}, { timestamps: true });
const Lesson = mongoose_1.default.model('Lesson', lessonSchema);
exports.default = Lesson;
