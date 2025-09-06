import { Router } from 'express';
import { register, verify, resendOTP, login, me } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();
router.post('/register', register);
router.post('/verify', verify);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/me', auth, me);

export default router;
