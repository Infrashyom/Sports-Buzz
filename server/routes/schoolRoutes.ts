import express from 'express';
import * as schoolController from '../controllers/schoolController';
import * as authMiddleware from '../middleware/auth';
import studentRouter from './studentRoutes';
import teamRouter from './teamRoutes';

const router = express.Router();

router.use('/:schoolId/students', studentRouter);
router.use('/:schoolId/teams', teamRouter);

router.get('/', schoolController.getAllSchools);
router.get('/:id', schoolController.getSchool);

router.use(authMiddleware.protect);
router.patch('/:id', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), schoolController.updateSchool);
router.post('/:id/facilities', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), schoolController.addFacility);

export default router;
