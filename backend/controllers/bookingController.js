import mongoose from 'mongoose';
import Booking from "../models/booking.js";
import Venue from "../models/venue.js";

  export const createBooking = async (req, res) => {
    try {
      const { venueId, name, email, date, time, notes } = req.body;
      const userId = req.user._id;

      if (!venueId || !name || !email || !date || !time) {
        return res.status(400).json({ message: "Missing required booking fields" });
      }
      if (!mongoose.Types.ObjectId.isValid(venueId)) {
        return res.status(400).json({ message: "Invalid venue ID format" });
      }

      const bookingDateTime = new Date(`${date}T${time}`);

      if (isNaN(bookingDateTime.getTime())) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }

      const venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }

      const newBooking = new Booking({
        userId,
        venueId,
        name,
        email,
        venueName: venue.name,
        bookingDateTime,
        notes: notes || "",
      });

      await newBooking.save();

    res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error while creating booking", error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ bookingDateTime: 1 });
    res.json(bookings);
  } catch (error) {
    console.error("getMyBookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};