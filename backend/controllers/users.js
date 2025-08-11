const { request, response } = require("express");
const bcrypt = require('bcryptjs');


const user = require("../models/user");


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
    
      // Validate uniqueness of email
      const existingUser = await user.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          message: 'Email already exists'
        });
      }


      // Validate uniqueness of DNI
      if (dni) {
        const existingDniUser = await user.findOne({ where: { dni } }); 
        if (existingDniUser) {
          return res.status(400).json({
            message: 'DNI already exists'
          });
        }
      }
  
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
    
      const userCreated = await user.create(newUser);
    
      return res.status(201).json({
        message: 'User created successfully',
        userCreated
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

