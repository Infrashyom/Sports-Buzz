import express from 'express';
import * as authController from '../controllers/authController';
import * as authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(authMiddleware.protect);
router.get('/me', authController.getMe);

export default router;
