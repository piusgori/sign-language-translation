import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

 const Question = mongoose.model('Question', questionSchema);

 export default Question;