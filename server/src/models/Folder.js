import mongoose from 'mongoose';
const { Schema } = mongoose;

const folderSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  tags: [{ type: String, index: true }],
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  avgRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
}, { timestamps: true });

folderSchema.index({ name: 'text', tags: 'text' });

export default mongoose.model('Folder', folderSchema);
