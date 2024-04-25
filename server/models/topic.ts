import mongoose from "mongoose";

const Schema = mongoose.Schema;

const topicSchema = new Schema({ 
    title: { type: String, required: true },
    description: { type: String, content: Schema.Types.Mixed },
    objectives: [String],
    users: [String]
 }, { timestamps: true });

 const Topic = mongoose.model('Topic', topicSchema);

 export default Topic;