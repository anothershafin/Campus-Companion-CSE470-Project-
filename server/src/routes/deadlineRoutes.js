import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createDeadline, listDeadlines, removeDeadline } from '../controllers/deadlineController.js';

const router = Router();
router.use(auth);
router.post('/', createDeadline);
router.get('/', listDeadlines);
router.delete('/:id', removeDeadline);

export default router;
