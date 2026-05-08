import { Router } from 'express';
import { getDashboardStats, getAnalytics, impersonateSchool } from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.post('/impersonate/:schoolId', impersonateSchool);

export default router;
