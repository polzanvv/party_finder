import axios from "axios";

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
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });
  
      const googlePlaces = googleResponse.data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        location: place.vicinity,
        rating: place.rating,
        types: place.types,
        fromGoogle: true
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
    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const reviews = await Review.find({ venueId: id })
      .populate("userId", "name") // подтягиваем имя пользователя
      .sort({ createdAt: -1 }); // сортируем: свежие — выше

    res.json({ venue, reviews }); // возвращаем оба
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// создание новой локации
export const createVenue = async (req, res) => {
  try {
    const venueData = req.body;

    const newVenue = new Venue({
      ...venueData,
      owner: req.user._id, // присваиваем владельца из токена
    });

    await newVenue.save();

    res.status(201).json(newVenue);
  } catch (error) {
    console.error("Ошибка при создании локации:", error);
    res.status(500).json({ message: "Не удалось создать локацию" });
  }
};
