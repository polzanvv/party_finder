import Review from '../models/review.js';

// Добавление отзыва
export const addReview = async (req, res) => {
  try {
    const { venueId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!venueId || !rating) {
      return res
        .status(400)
        .json({ message: 'Venue ID and rating are required' });
    }

    const existingReview = await Review.findOne({ venueId, userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this venue' });
    }

    const newReview = new Review({
      venueId,
      userId,
      rating,
      comment
    });

    await newReview.save();

    // Update average rating
    const reviews = await Review.find({ venueId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Venue.findByIdAndUpdate(venueId, { averageRating: avgRating });

    res.status(201).json({
      message: 'Review added successfully',
      review: newReview,
      averageRating: avgRating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Получение всех отзывов для локации
export const getReviewsForVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    if (!venueId) return res.status(400).json({ message: 'Venue ID is required' });

    const reviews = await Review.find({ venueId }).populate('userId', 'name');

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
