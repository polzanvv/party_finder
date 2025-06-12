import Review from "../models/review.js";
import Venue from "../models/venue.js";
import mongoose from "mongoose";

export const addReview = async (req, res) => {
  try {
    const { venueId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!venueId || !rating || !comment) {
      return res.status(400).json({ message: "Required data is missing" });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const newReview = new Review({
      venueId,
      userId,
      rating,
      comment,
    });

    await newReview.save();

    const allReviews = await Review.find({ venueId });
    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    venue.averageRating = averageRating;
    await venue.save();

    const populatedReview = await Review.findById(newReview._id).populate(
      "userId",
      "name"
    );

    res.status(201).json({
      review: populatedReview,
      averageRating,
    });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsForVenue = async (req, res) => {
  try {
    const { venueId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      return res.status(400).json({ message: "Invalid venue ID" });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    const reviews = await Review.find({
      venueId: new mongoose.Types.ObjectId(venueId),
    }).populate("userId", "name");

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};
