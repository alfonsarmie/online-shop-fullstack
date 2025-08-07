
//For environment variables ask for the .env file
//NOTE: Dont forget to install the dependencies with `npm install`!!!
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la tienda online!');
});

// Initialize the server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
