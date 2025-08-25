import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Import the database connection function
import connectDB from './config/db.js';

// Import routes using the .js extension for ESM
import servicesRouter from './routes/services.route.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Enable JSON body parsing

// Use routes
app.use('/api/services', servicesRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
