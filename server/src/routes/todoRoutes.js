import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createTodo, listTodos, toggleTodo, removeTodo } from '../controllers/todoController.js';

const router = Router();
router.use(auth);
router.post('/', createTodo);
router.get('/', listTodos);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', removeTodo);

export default router;
