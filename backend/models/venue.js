import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String, required: true },
  capacity: Number,
  themes: [String],
  ageGroups: [String],
  description: String,
  imageUrl: String,
  averageRating: { type: Number, default: 0 }
});

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;