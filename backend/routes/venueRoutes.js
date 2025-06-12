import express from "express";
import {
  getVenues,
  saveVenueIfNotExists,
  getVenueById,
} from "../controllers/venueController.js";

import { protectOptional, protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', protectOptional, getVenues);

router.post("/", saveVenueIfNotExists);

router.get("/:id", getVenueById);

export default router;
