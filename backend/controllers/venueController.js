import Venue from '../models/Venue.js';

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
    console.error('Ошибка при создании локации:', error);
    res.status(500).json({ message: 'Не удалось создать локацию' });
  }
};

// Получение списка локаций с фильтрацией
export const getVenues = async (req, res) => {
  try {
    // Извлекаем фильтры из query-параметров
    const { location, minPrice, maxPrice, minCapacity, maxCapacity, themes, ageGroups } = req.query;

    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // регистронезависимый поиск по локации
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minCapacity || maxCapacity) {
      filter.capacity = {};
      if (minCapacity) filter.capacity.$gte = Number(minCapacity);
      if (maxCapacity) filter.capacity.$lte = Number(maxCapacity);
    }

    if (themes) {
      // themes - строка с темами, разделёнными запятыми
      const themesArray = themes.split(',').map(t => t.trim());
      filter.themes = { $in: themesArray };
    }

    if (ageGroups) {
      const ageGroupsArray = ageGroups.split(',').map(a => a.trim());
      filter.ageGroups = { $in: ageGroupsArray };
    }

    const venues = await Venue.find(filter);

    res.json(venues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Получение конкретной локации и отзывов по ID
export const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const reviews = await Review.find({ venueId: id })
      .populate('userId', 'name') // подтягиваем имя пользователя
      .sort({ createdAt: -1 });   // сортируем: свежие — выше

    res.json({ venue, reviews }); // возвращаем оба
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
