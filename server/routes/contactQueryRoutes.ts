import express from 'express';
import { createQuery, getAllQueries, updateQueryStatus } from '../controllers/contactQueryController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.post('/', createQuery);

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/', getAllQueries);
router.patch('/:id', updateQueryStatus);

export default router;
