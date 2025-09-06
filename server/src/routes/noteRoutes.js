import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import auth from '../middleware/auth.js';
import { createNote } from '../controllers/noteController.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/../uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, crypto.randomBytes(12).toString('hex') + ext);
  }
});
const upload = multer({ storage });

const router = Router();
router.use(auth);
router.post('/', upload.single('file'), createNote);

export default router;
