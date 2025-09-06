import Folder from '../models/Folder.js';
import Note from '../models/Note.js';

export const createNote = async (req, res) => {
  const { folderId, title, content, tags = [] } = req.body;
  const folder = await Folder.findById(folderId);
  if (!folder) return res.status(404).json({ error: 'Folder not found' });
  const canEdit = String(folder.owner) === String(req.user._id) || folder.collaborators.some(id => String(id) === String(req.user._id));
  if (!canEdit) return res.status(403).json({ error: 'Forbidden' });

  let fileUrl;
  if (req.file) fileUrl = `/uploads/${req.file.filename}`;

  const note = await Note.create({ folder: folderId, title, content, fileUrl, tags, createdBy: req.user._id });
  res.json(note);
};
