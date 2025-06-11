import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  venueId: {
    type: String,
    required: true,
  },
  venueName: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: String, // либо Date, если хочешь
    required: true,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;