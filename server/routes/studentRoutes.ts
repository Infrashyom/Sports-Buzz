import express from 'express';
import * as studentController from '../controllers/studentController';
import * as authMiddleware from '../middleware/auth';

const router = express.Router({ mergeParams: true }); // Allow access to :schoolId

router.get('/', studentController.getAllStudents);

router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('SCHOOL', 'ADMIN'));

router.post('/', studentController.createStudent);
router.patch('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

export default router;
