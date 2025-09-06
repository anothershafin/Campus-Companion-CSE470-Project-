import mongoose from 'mongoose';
const { Schema } = mongoose;

const noteSchema = new Schema({
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true, index: true },
  title: { type: String, required: true },
  content: String,
  fileUrl: String,
  tags: [String],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
