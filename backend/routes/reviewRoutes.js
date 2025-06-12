import express from 'express';
import { addReview, getReviewsForVenue, deleteReview } from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('parent'), addReview);
router.delete("/:id", protect, restrictTo('parent'), deleteReview);

router.get('/:venueId', getReviewsForVenue);

export default router;  