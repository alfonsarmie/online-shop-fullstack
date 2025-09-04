const { request, response } = require("express");
const bcrypt = require('bcryptjs');


const user = require("../models/user");



const createUser = async(req = request, res = response) => {
  

  try {
    console.log(req.body);
    
    const { 
      dni, 
      email, 
      name, 
      surname, 
      password,
      imgProfile } = req.body;
    
    

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
        registrationDate: new Date(), // Current date as registration date,
        status: 'pending' // Default status (email confirmation should be implemented later)
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


const deleteUser = async(req = request, res = response) => {
  const { id } = req.params;
  try {

    //Logic to delete user (soft delete by changing status to 'deleted')
    const userToDelete = await user.findByPk(id);
    userToDelete.status = 'deleted';
    await userToDelete.save();
    

    return res.status(200).json({
      message: 'User deleted successfully'
    });
  
  } catch (error) {
    
      return res.status(500).json({
        message: 'Error deleting user',
        error: error.message
      });
  
  }
}


const updateUser = async(req = request, res = response) => {
  const { id } = req.params;
  const { name, surname, email, imgProfile } = req.body;
  try {

    //Logic to update user
    const userToUpdate = await user.findByPk(id);
    if (!userToUpdate) {
      return res.status(404).json({
        message: 'User not found'
      });
    }


    if (name !== null) {
      userToUpdate.name = name;
    }

    if (surname !== null) {
      userToUpdate.surname = surname;
    }

    if (email !== null) {
      userToUpdate.email = email;
    }

    if (imgProfile !== null) {
      userToUpdate.imgProfile = imgProfile;
    }

    // Save the updated user
    await userToUpdate.save();
    return res.status(200).json({
      message: 'User updated successfully',
      userToUpdate
    });

    
  } catch (error) {
    return res.status(500).json({
      message: 'Error updating user',
      error: error.message
    });
  }
};



module.exports = {  
    createUser,
    deleteUser,
    updateUser
};

