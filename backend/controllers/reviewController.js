import Review from '../models/Review.js';

// Добавление отзыва
export const addReview = async (req, res) => {
  try {
    const { venueId, userId, rating, comment } = req.body;

    if (!venueId || !userId || !rating) {
      return res.status(400).json({ message: 'Venue ID, User ID, and rating are required' });
    }

    // Можно добавить проверку: один пользователь — один отзыв на локацию (по желанию)
    const existingReview = await Review.findOne({ venueId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this venue' });
    }

    const newReview = new Review({
      venueId,
      userId,
      rating,
      comment
    });

    await newReview.save();

    res.status(201).json(newReview);
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
