import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createTopic, listTopics, updateTopicStatus, removeTopic } from '../controllers/topicController.js';

const router = Router();
router.use(auth);
router.post('/', createTopic);
router.get('/', listTopics);
router.patch('/:id/status', updateTopicStatus);
router.delete('/:id', removeTopic);

export default router;
