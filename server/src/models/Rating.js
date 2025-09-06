import mongoose from 'mongoose';
const { Schema } = mongoose;

const ratingSchema = new Schema({
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: String
}, { timestamps: true });

ratingSchema.index({ folder: 1, user: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
