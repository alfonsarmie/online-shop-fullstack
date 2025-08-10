const { request, response } = require("express");
const bcrypt = require('bcryptjs');
const client = require("../models/user");


//TODO: VALIDATE THE FIELDS
const createUser = async(req = request, res = response) => {
  

  try {
    
    const { 
      dni, 
      email, 
      name, 
      surname, 
      password,
      imgProfile } = req.body;
    
      // Validate required fields
  
      // Encrypt the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
  
  
      //Create a new user
      const newUser = {
        dni, 
        email,
        name,
        surname,
        password: hashedPassword,
        imgProfile,
        role: 'client', // Default role
        isMember: false, // Default membership status
        registrationDate: new Date() // Current date as registration date
      };
    
      const user = await client.create(newUser);
    
      return res.status(201).json({
        message: 'User created successfully',
        user
      });
  
    } catch (error) {

      return res.status(500).json({
        message: 'Error creating user',
        error: error.message
      });
    
  }






}





module.exports = {  
    createUser
};

