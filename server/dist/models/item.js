"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const itemSchema = new Schema({
    image: { type: String, required: true },
    meaning: { type: String, required: true },
    approved: { type: Boolean, default: true },
    requestUser: { type: String, content: Schema.Types.Mixed },
    views: [String]
}, { timestamps: true });
const Item = mongoose_1.default.model('Item', itemSchema);
exports.default = Item;
