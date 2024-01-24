import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

const User = mongoose.model('User', userSchema);

export default User;