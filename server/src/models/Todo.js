import mongoose from 'mongoose';
const { Schema } = mongoose;

const todoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  text: { type: String, required: true },
  done: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);
