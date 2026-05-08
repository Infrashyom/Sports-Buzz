import express from 'express';
import * as userController from '../controllers/userController';
import * as authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/referees', userController.getReferees);

router.use(authMiddleware.protect);

router.get('/', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), userController.getAllUsers);
router.post('/', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), userController.createUser);
router.patch('/:id', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), userController.updateUser);
router.patch('/:id/status', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), userController.updateUserStatus);

export default router;
