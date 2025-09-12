//For environment variables ask for the .env file
//NOTE: Dont forget to install the dependencies with `npm install`!!!
//NOTE: Check package.json for scripts to run the server in dev mode

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

// Import routes
import userRoutes from './routes/user-routes';
import authRoutes from './routes/auth-routes';
import productRoutes from './routes/product-routes';
import priceRoutes from './routes/price-routes';
import imageRoutes from './routes/image-routes';
import sizeRoutes from './routes/size-routes';
import uploadRoutes from './routes/upload-routes';
import { defineAssociations } from './models/associations';
import { connectDB } from './db/connection';


const app = express();

// Middlewares
app.use(express.json()); //To parse JSON data 
app.use(cors()); //To enable CORS

// Connect to the database
connectDB().catch(error => console.error('Database connection failed:', error));

// Define all model associations
defineAssociations();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/sizes", sizeRoutes);
app.use('/api', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT || 3000}`);
});