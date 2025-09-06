import Deadline from '../models/Deadline.js';

export const createDeadline = async (req, res) => {
  const { title, course, dueDate } = req.body;
  const item = await Deadline.create({ user: req.user._id, title, course, dueDate });
  res.json(item);
};

export const listDeadlines = async (req, res) => {
  const items = await Deadline.find({ user: req.user._id }).sort({ dueDate: 1 });
  res.json(items);
};

export const removeDeadline = async (req, res) => {
  const { id } = req.params;
  const deleted = await Deadline.findOneAndDelete({ _id: id, user: req.user._id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
};
