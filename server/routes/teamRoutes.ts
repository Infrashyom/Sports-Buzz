import express from 'express';
import * as teamController from '../controllers/teamController';
import * as authMiddleware from '../middleware/auth';

const router = express.Router({ mergeParams: true });

router.get('/', teamController.getAllTeams);

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('SCHOOL', 'ADMIN'));

router.post('/', teamController.createTeam);
router.patch('/:id', teamController.updateTeam);

export default router;
