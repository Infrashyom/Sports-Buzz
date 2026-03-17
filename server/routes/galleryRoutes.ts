import express from 'express';
import { getAllGalleryItems, createGalleryItem, deleteGalleryItem } from '../controllers/galleryController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllGalleryItems);

router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/', createGalleryItem);
router.delete('/:id', deleteGalleryItem);

export default router;
