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
import { connectDB } from './db/connection';


const app = express();

// Middlewares
app.use(express.json()); //To parse JSON data 
app.use(cors()); //To enable CORS

// Connect to the database
connectDB().catch(error => console.error('Database connection failed:', error));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Initialize the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT || 3000}`);
});