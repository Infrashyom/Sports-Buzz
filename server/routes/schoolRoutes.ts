import express from 'express';
import * as schoolController from '../controllers/schoolController';
import * as authMiddleware from '../middleware/auth';
import studentRouter from './studentRoutes';
import teamRouter from './teamRoutes';

const router = express.Router();

router.get('/', schoolController.getAllSchools);
router.get('/:id', schoolController.getSchool);

router.use(authMiddleware.protect);
router.use('/:schoolId', authMiddleware.checkSchoolAccess); // Protect all nested routes with :schoolId
router.use('/:schoolId/students', studentRouter);
router.use('/:schoolId/teams', teamRouter);

router.get('/:id/dashboard', authMiddleware.checkSchoolAccess, schoolController.getDashboardData);
router.patch('/:id', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), authMiddleware.checkSchoolAccess, schoolController.updateSchool);
router.post('/:id/facilities', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), authMiddleware.checkSchoolAccess, schoolController.addFacility);
router.patch('/:id/facilities/:facilityId', authMiddleware.restrictTo('ADMIN', 'SCHOOL'), authMiddleware.checkSchoolAccess, schoolController.updateFacility);

export default router;
