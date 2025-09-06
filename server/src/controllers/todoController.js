import Todo from '../models/Todo.js';

export const createTodo = async (req, res) => {
  const { text } = req.body;
  const item = await Todo.create({ user: req.user._id, text });
  res.json(item);
};

export const listTodos = async (req, res) => {
  const items = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
};

export const toggleTodo = async (req, res) => {
  const { id } = req.params;
  const item = await Todo.findOne({ _id: id, user: req.user._id });
  if (!item) return res.status(404).json({ error: 'Not found' });
  item.done = !item.done;
  await item.save();
  res.json(item);
};

export const removeTodo = async (req, res) => {
  const { id } = req.params;
  const item = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
};
