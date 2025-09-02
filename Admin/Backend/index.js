import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import servicesRouter from './server/routes/services.js';
import coursesRouter from './server/routes/courses.js';
import channelsRouter from './server/routes/channels.js'
import playlistsRouter from './server/routes/playlists.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/services', servicesRouter);
app.use('/api/courses', coursesRouter)
app.use('/api/channels', channelsRouter)
app.use('/api/playlists',playlistsRouter)

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
