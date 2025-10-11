// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import servicesRouter from './server/routes/services.js';
// import coursesRouter from './server/routes/courses.js';
// import channelsRouter from './server/routes/channels.js';
// import playlistsRouter from './server/routes/playlists.js';
// import quizzesRouter from './server/routes/quizzes.js';
// import videosRouter from './server/routes/videos.js'; // ✅ Import videos route
// import categoryRoutes from "./server/routes/categories.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/services', servicesRouter);
// app.use('/api/courses', coursesRouter);
// app.use('/api/channels', channelsRouter);
// app.use('/api/playlists', playlistsRouter);
// app.use('/api/quizzes', quizzesRouter);
// app.use('/api/videos', videosRouter);
// app.use("/api/categories", categoryRoutes);

// // Start the server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
// import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import * as Sentry from '@sentry/node';
// import { clerkMiddleware } from '@clerk/express';
import session from "express-session";

import authRoutes from './server/auth-routes/auth.routes.js'

// Config imports
import './server/config/instrument.js';
import connectDB from './server/config/db.js';
// import connectCloudinary from './server/config/cloudinary.js';

// Old backend routes
import servicesRouter from './server/routes/services.js';
import coursesRouter from './server/routes/courses.js';
import channelsRouter from './server/routes/channels.js';
import playlistsRouter from './server/routes/playlists.js';
import quizzesRouter from './server/routes/quizzes.js';
import videosRouter from './server/routes/videos.js';
import categoryRoutes from './server/routes/categories.js';

// New backend routes
// import companyRoutes from '../Backend/server/job-routes/companyRoutes.js';
// import jobRoutes from './server/job-routes/jobRoutes.js';
// import userRoutes from './server/job-routes/userRoutes.js';
// import { clerkWebhooks } from './server/job-controllers/webhooks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------
// Middleware
// ------------------------------

app.use(
  session({
    secret: "12345",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // only true on HTTPS
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
// app.use(clerkMiddleware());

// ------------------------------
// Database Connections
// ------------------------------
await connectDB();          // Your MongoDB connection
// await connectCloudinary();  // Cloudinary connection

// ------------------------------
// Routes
// ------------------------------
app.get('/', (req, res) => res.send('✅ API is running successfully'));

app.use(authRoutes)

// Old backend routes
app.use('/api/services', servicesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/videos', videosRouter);
app.use('/api/categories', categoryRoutes);

// New backend routes
// app.post('/webhooks', clerkWebhooks);
// app.use('/api/company', companyRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/users', userRoutes);

// Debug route for Sentry
// app.get('/debug-sentry', (req, res) => {
//   throw new Error('My first Sentry error!');
// });

// ------------------------------
// Sentry Setup
// ------------------------------
// Sentry.setupExpressErrorHandler(app);

// ------------------------------
// Start Server
// ------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
