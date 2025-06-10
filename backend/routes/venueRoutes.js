import express from "express";
import {
  getVenues,
  getVenueById,
  createVenue,
} from "../controllers/venueController.js";

import { protectOptional, protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get('/', protectOptional, getVenues);

// Protected routes
router.post("/", protect, restrictTo("owner"), createVenue);
router.get("/:id", getVenueById);

export default router;
