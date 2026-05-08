import express from 'express';
import * as studentController from '../controllers/studentController';
import * as authMiddleware from '../middleware/auth';

const router = express.Router({ mergeParams: true }); // Allow access to :schoolId

router.use(authMiddleware.protect);

router.get('/', studentController.getAllStudents);

// Allow students to update only their own status, but for simplicity we can just add a specific route
router.patch('/:id/status', studentController.updateStudentStatus);

router.use(authMiddleware.restrictTo('SCHOOL', 'ADMIN'));

router.post('/', studentController.createStudent);
router.patch('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

export default router;
