import express from 'express';
import { forgotPassword,verifyCode,resetPassword } from '../controllers/passwordController.js';

const router = express.Router();

router.post('/request-password-reset', forgotPassword);
router.post('/confirm-otp', verifyCode);
router.post('/reset-password', resetPassword);

export default router;
