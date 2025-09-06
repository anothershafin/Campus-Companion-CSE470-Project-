import Folder from '../models/Folder.js';
import Note from '../models/Note.js';

export const createFolder = async (req, res) => {
  const { name, description, visibility = 'private', tags = [] } = req.body;
  const folder = await Folder.create({ name, description, visibility, tags, owner: req.user._id });
  res.json(folder);
};

export const myFolders = async (req, res) => {
  const folders = await Folder.find({ $or: [{ owner: req.user._id }, { collaborators: req.user._id }] })
    .sort({ updatedAt: -1 });
  res.json(folders);
};

export const addCollaborator = async (req, res) => {
  const { folderId, userId } = req.body;
  const folder = await Folder.findOne({ _id: folderId, owner: req.user._id });
  if (!folder) return res.status(404).json({ error: 'Folder not found' });
  if (!folder.collaborators.includes(userId)) folder.collaborators.push(userId);
  await folder.save();
  res.json({ message: 'Collaborator added' });
};

export const getFolderDetails = async (req, res) => {
  const folder = await Folder.findById(req.params.id);
  if (!folder) return res.status(404).json({ error: 'Not found' });
  const canView = folder.visibility === 'public' || String(folder.owner) === String(req.user._id) || folder.collaborators.some(id => String(id) === String(req.user._id));
  if (!canView) return res.status(403).json({ error: 'Forbidden' });
  const notes = await Note.find({ folder: folder._id }).sort({ createdAt: -1 });
  res.json({ folder, notes });
};

export const explorePublic = async (req, res) => {
  const { q = '', tags = '' } = req.query;
  const tagList = tags ? tags.split(',').map(t => t.trim()) : [];
  const filter = { visibility: 'public' };
  if (q) filter.$text = { $search: q };
  if (tagList.length) filter.tags = { $in: tagList };
  const items = await Folder.find(filter).sort({ avgRating: -1, updatedAt: -1 }).limit(50);
  res.json(items);
};
