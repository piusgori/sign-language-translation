import mongoose from "mongoose";

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    image: { type: String, required: true },
    meaning: { type: String, required: true },
    approved: { type: Boolean, default: true },
    requestUser: { type: String, content: Schema.Types.Mixed },
    views: [String]
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

export default Item;