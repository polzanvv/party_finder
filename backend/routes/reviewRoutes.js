import express from 'express';
import { addReview, getReviewsForVenue } from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('parent'), addReview);

router.get('/:venueId', getReviewsForVenue);

export default router;  