
//For environment variables ask for the .env file
//NOTE: Dont forget to install the dependencies with `npm install`!!!
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');



const { connectDB } = require('./db/connection');


// Middlewares
app.use(express.json()); //To parse JSON data 
app.use(cors()); //To enable CORS



// Connect to the database
connectDB().catch(error => console.error('Database connection failed:', error));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);




// Initialize the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor escuchando en http://localhost:${process.env.PORT || 3000}`);
});
