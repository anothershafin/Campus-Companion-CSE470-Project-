import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { register, verify, resendOTP, login, me, updateMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

// Store avatars in the same uploads folder you already use for notes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/../uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, crypto.randomBytes(12).toString('hex') + ext);
  }
});
const upload = multer({ storage });

router.post('/register', register);
router.post('/verify', verify);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/me', auth, me);

// NEW: update profile (+ optional avatar)
router.put('/me', auth, upload.single('avatar'), updateMe);

export default router;
