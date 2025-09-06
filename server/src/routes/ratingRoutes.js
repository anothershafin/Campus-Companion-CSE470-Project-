import { Router } from 'express';
import auth from '../middleware/auth.js';
import { rateFolder } from '../controllers/ratingController.js';

const router = Router();
router.use(auth);
router.post('/', rateFolder);

export default router;
