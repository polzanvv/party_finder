import express from 'express';
import cors from 'cors';
import connectDB from './config';
import authRoutes from './routes/authRoutes';
import venueRoutes from './routes/venueRoutes';
import reviewRoutes from './routes/reviewRoutes';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/reviews', reviewRoutes);

export default app;