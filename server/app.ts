import express from 'express';
import cors from 'cors';
import { errorHandler, AppError } from './utils/errorHandler';
import authRouter from './routes/authRoutes';
import schoolRouter from './routes/schoolRoutes';
import userRouter from './routes/userRoutes';
import studentRouter from './routes/studentRoutes';
import teamRouter from './routes/teamRoutes';
import tournamentRouter from './routes/tournamentRoutes';
import matchRouter from './routes/matchRoutes';
import contactQueryRouter from './routes/contactQueryRoutes';
import galleryRouter from './routes/galleryRoutes';
import adminRouter from './routes/adminRoutes';
import sportRouter from './routes/sportRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/schools', schoolRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/teams', teamRouter);
app.use('/api/v1/tournaments', tournamentRouter);
app.use('/api/v1/matches', matchRouter);
app.use('/api/v1/contact-queries', contactQueryRouter);
app.use('/api/v1/gallery', galleryRouter);
app.use('/api/v1/sports', sportRouter);

// Handle undefined API routes
app.all(/\/api\/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

export default app;
