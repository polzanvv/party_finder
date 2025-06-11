import express from 'express';
import cors from 'cors';
import connectDB from './config.js';
import authRoutes from './routes/authRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
connectDB();

app.use(cors());
  
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);

export default app;