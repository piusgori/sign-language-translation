import mongoose from "mongoose";

const Schema = mongoose.Schema;

const lessonSchema = new Schema({ 
    topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
    title: { type: String, required: true },
    content: { type: String, content: Schema.Types.Mixed },
    url: { type: String, content: Schema.Types.Mixed },
    users: [String]
 }, { timestamps: true });

 const Lesson = mongoose.model('Lesson', lessonSchema);

 export default Lesson;