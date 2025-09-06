import Topic from '../models/Topic.js';

export const createTopic = async (req, res) => {
  const { title, course, status = 'to-read' } = req.body;
  const item = await Topic.create({ user: req.user._id, title, course, status });
  res.json(item);
};

export const listTopics = async (req, res) => {
  const items = await Topic.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(items);
};

export const updateTopicStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ok = ['to-read', 'reading', 'read'].includes(status);
  if (!ok) return res.status(400).json({ error: 'Invalid status' });
  const item = await Topic.findOneAndUpdate({ _id: id, user: req.user._id }, { status }, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

export const removeTopic = async (req, res) => {
  const { id } = req.params;
  const item = await Topic.findOneAndDelete({ _id: id, user: req.user._id });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
};
