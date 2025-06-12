import axios from "axios";
import Venue from '../models/venue.js';
import Review from '../models/review.js';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

export const getVenues = async (req, res) => {
  try {
    const { source, lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

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

    if (req.user) {
      const savedVenues = await Venue.find({ owner: req.user._id });
      return res.json({ googlePlaces, savedVenues });
    }

    res.json({ googlePlaces });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const saveVenueIfNotExists = async (req, res) => {
  try {
    const { googlePlaceId, name, location, imageUrl } = req.body;

    if (!googlePlaceId || !name || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let venue = await Venue.findOne({ googlePlaceId });

    if (venue) {
      return res.status(200).json({ venue });
    }

    venue = await Venue.create({
      googlePlaceId,
      name,
      location,
      imageUrl: imageUrl || "",
    });

    res.status(201).json({ venue });
  } catch (error) {
    console.error("Failed to create/find venue:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const reviews = await Review.find({ venueId: id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ venue, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};