import express from 'express';
import { getVenues, getVenueById, createVenue } from '../controllers/venueController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getVenues); // Public
router.post('/', protect, restrictTo('owner'), createVenue); // Private

export default router;