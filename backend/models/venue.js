import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String },
  capacity: Number,
  themes: [String],
  ageGroups: [String],
  description: String,
  imageUrl: String,
  averageRating: { type: Number, default: 0 },
  googlePlaceId: { type: String, required: true, unique: true },
});

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;