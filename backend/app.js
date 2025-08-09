
//For environment variables ask for the .env file
//NOTE: Dont forget to install the dependencies with `npm install`!!!
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


const PORT = process.env.PORT || 3000;


const userRoutes = require('./routes/userRoutes');




// Middleware to parse JSON
app.use(express.json());

// Middleware to enable cors
app.use(cors());


// Routes
app.use("/api/users", userRoutes);





// Initialize the server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
