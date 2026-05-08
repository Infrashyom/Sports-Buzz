import express from 'express';
import * as tournamentController from '../controllers/tournamentController';
import * as authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', tournamentController.getAllTournaments);

router.use(authMiddleware.protect);

router.post('/', authMiddleware.restrictTo('ADMIN'), tournamentController.createTournament);
router.patch('/:id', authMiddleware.restrictTo('ADMIN'), tournamentController.updateTournament);
router.delete('/:id', authMiddleware.restrictTo('ADMIN'), tournamentController.deleteTournament);
router.post('/:id/register', authMiddleware.restrictTo('SCHOOL', 'ADMIN'), tournamentController.registerTeam);
router.patch('/:id/points', authMiddleware.restrictTo('ADMIN', 'REFEREE'), tournamentController.updatePointsTable);

export default router;
