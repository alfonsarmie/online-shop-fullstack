
//For environment variables ask for the .env file
//NOTE: Dont forget to install the dependencies with `npm install`!!!
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();



const userRoutes = require('./routes/userRoutes');
const { connectDB } = require('./db/connection');


// Middleware to parse JSON
app.use(express.json());

// Middleware to enable cors
app.use(cors());


// Connect to the database
connectDB().catch(error => console.error('Database connection failed:', error));

// Routes
app.use("/api/users", userRoutes);





// Initialize the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor escuchando en http://localhost:${process.env.PORT || 3000}`);
});
