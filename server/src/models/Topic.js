import mongoose from 'mongoose';
const { Schema } = mongoose;

const topicSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  course: String,
  status: { type: String, enum: ['to-read', 'reading', 'read'], default: 'to-read', index: true }
}, { timestamps: true });

export default mongoose.model('Topic', topicSchema);
