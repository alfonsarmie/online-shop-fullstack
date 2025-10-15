//For environment variables ask for the .env file
//NOTE: Dont forget to install the dependencies with `npm install`!!!
//NOTE: Check package.json for scripts to run the server in dev mode

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import userRoutes from './routes/user-routes';
import authRoutes from './routes/auth-routes';
import productRoutes from './routes/product-routes';
import priceRoutes from './routes/price-routes';
import imageRoutes from './routes/image-routes';
import sizeRoutes from './routes/size-routes';
import categoryRoutes from './routes/category-routes';
import uploadRoutes from './routes/upload-routes';
import paymentRoutes from './routes/payment-routes';
import orderRoutes from './routes/order-routes';
import webhookRoutes from './routes/webhook-routes';
import { defineAssociations } from './models/associations';
import { connectDB } from './db/connection';


const app = express();

// Allow configuring multiple frontends (local tunnels, production, etc.) via env vars
const rawAllowedOrigins = process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:3000';
const allowedOrigins = rawAllowedOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middlewares
// Dynamically validate the request origin so Mercado Pago redirects from tunnels still work
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
})); // To enable CORS with explicit origins
app.use(express.json()); //To parse JSON data 
app.use(express.urlencoded({ extended: true })); //To parse URL-encoded data

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
app.use("/api/categories", categoryRoutes);
app.use('/api', uploadRoutes);
// Checkout Pro preference creation endpoints
app.use('/api/payments', paymentRoutes);
// Order management endpoints
app.use('/api/orders', orderRoutes);
// Mercado Pago webhook listener
app.use('/webhooks', webhookRoutes);
app.use('/uploads', express.static('uploads'));

// Initialize the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT || 3000}`);
});

export default app;
