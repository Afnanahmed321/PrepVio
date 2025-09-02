import 'dotenv/config'; // loads .env automatically
import express from 'express';
import connectDB from './config/db.js'
import cors from 'cors';
import path from 'path';

import servicesRouter from './routes/services.route.js';
import coursesRouter from './routes/courses.route.js';
import channelsRouter from './routes/channels.route.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Enable JSON body parsing

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Use routes
app.use('/api/services', servicesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/channels', channelsRouter);

// Start the server
app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running on port ${PORT}`);
});
