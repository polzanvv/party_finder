import express from 'express';
import { addReview, getReviewsForVenue } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', addReview);
router.get('/:venueId', getReviewsForVenue);

export default router;
