import Booking from '../models/booking.js';

export const createBooking = async (req, res) => {
  try {
    const { venueId, venueName, name, email, date, notes } = req.body;

    const newBooking = new Booking({
      venueId,
      venueName,
      name,
      email,
      date,
      notes,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
};