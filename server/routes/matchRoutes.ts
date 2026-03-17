import express from 'express';
import * as matchController from '../controllers/matchController';
import * as authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', matchController.getAllMatches);

router.use(authMiddleware.protect);

router.post('/', authMiddleware.restrictTo('ADMIN'), matchController.createMatch);
router.patch('/:id', authMiddleware.restrictTo('REFEREE', 'ADMIN'), matchController.updateMatch);

export default router;
