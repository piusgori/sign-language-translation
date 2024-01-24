"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    googleId: { type: String, content: Schema.Types.Mixed },
    photoURL: { type: String, content: Schema.Types.Mixed },
    password: { type: String, required: true },
    disabled: { type: Boolean, default: false }
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
