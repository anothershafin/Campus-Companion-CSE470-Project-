import Rating from '../models/Rating.js';
import Folder from '../models/Folder.js';

export const rateFolder = async (req, res) => {
  const { folderId, stars, comment } = req.body;
  let rating = await Rating.findOneAndUpdate(
    { folder: folderId, user: req.user._id },
    { stars, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  // recompute folder avg
  const stats = await Rating.aggregate([
    { $match: { folder: rating.folder } },
    { $group: { _id: '$folder', avg: { $avg: '$stars' }, count: { $sum: 1 } } }
  ]);
  if (stats.length) {
    await Folder.findByIdAndUpdate(folderId, { avgRating: stats[0].avg, ratingCount: stats[0].count });
  }
  res.json(rating);
};
