import mongoose from 'mongoose';
const { Schema } = mongoose;

const deadlineSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  course: String,
  dueDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Deadline', deadlineSchema);
