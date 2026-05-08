import express from 'express';
import * as sportController from '../controllers/sportController';
import * as authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', sportController.getAllSports);

// Protect all routes below this middleware
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('ADMIN'));

router.post('/', sportController.createSport);
router.patch('/:id', sportController.updateSport);
router.delete('/:id', sportController.deleteSport);

export default router;
