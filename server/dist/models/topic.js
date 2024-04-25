"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const topicSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, content: Schema.Types.Mixed },
    objectives: [String],
    users: [String]
}, { timestamps: true });
const Topic = mongoose_1.default.model('Topic', topicSchema);
exports.default = Topic;
