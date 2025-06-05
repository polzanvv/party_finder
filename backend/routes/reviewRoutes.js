import express from 'express';
import { addReview, getReviewsForVenue } from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔒 Protected route: only logged-in "parent" users can add reviews
router.post('/', protect, restrictTo('parent'), addReview);

// 🌍 Public route: anyone can view reviews for a venue
router.get('/:venueId', getReviewsForVenue);

export default router;