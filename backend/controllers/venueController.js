import axios from "axios";
import Venue from '../models/venue.js';
import Review from '../models/review.js';

// Конфигурация Google Places
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

export const getVenues = async (req, res) => {
  try {
    const { source, lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    // Получаем Google Places всегда (независимо от токена)
    const googleResponse = await axios.get(GOOGLE_PLACES_URL, {
      params: {
        location: `${lat},${lng}`,
        radius: radius || 5000,
        keyword: 'kids birthday party',
        key: GOOGLE_API_KEY
      }
    });

    const googlePlaces = googleResponse.data.results.map(place => ({
      id: place.place_id,
      place_id: place.place_id,
      name: place.name,
      location: place.vicinity,
      rating: place.rating,
      types: place.types,
      fromGoogle: true,
    }));

    // Если есть авторизация — добавляем локальные локации из БД
    if (req.user) {
      const savedVenues = await Venue.find({ owner: req.user._id });
      return res.json({ googlePlaces, savedVenues });
    }

    // Иначе возвращаем только Google Places (для публичных)
    res.json({ googlePlaces });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Получение конкретной локации и отзывов по ID
export const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;

    // Пробуем найти в своей базе
    const venue = await Venue.findById(id);
    if (venue) {
      const reviews = await Review.find({ venueId: id })
        .populate("userId", "name")
        .sort({ createdAt: -1 });

      return res.json({ venue, reviews });
    }

    // Если не нашли — пробуем запросить из Google Places
    const googleDetailsRes = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: id,
          key: GOOGLE_API_KEY,
          fields: "name,rating,formatted_address,reviews"
        }
      }
    );

    const googleData = googleDetailsRes.data.result;

    if (!googleData) {
      return res.status(404).json({ message: "Google venue not found" });
    }

    const venueFromGoogle = {
      place_id: id,
      name: googleData.name,
      address: googleData.formatted_address,
      rating: googleData.rating,
      fromGoogle: true
    };

    const reviews = googleData.reviews?.map(r => ({
      author: r.author_name,
      comment: r.text
    })) || [];

    res.json({ venue: venueFromGoogle, reviews });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};