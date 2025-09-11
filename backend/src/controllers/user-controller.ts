import { Request, Response } from "express";
import bcrypt from 'bcryptjs';


import User from "../models/user-model";



export const createUser = async (req: Request, res: Response): Promise<Response> => {


  try {
    const { 
      dni, 
      email, 
      name, 
      surname, 
      password 
    } = req.body;

    // Encrypt the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const newUser = {
      dni, 
      email,
      name,
      surname,
      password: hashedPassword,
      role: 'client', // Default role
      isMember: false, // Default membership status
      registrationDate: new Date(), // Current date as registration date,
      status: 'pending' // Default status (email confirmation should be implemented later)
    };

    const userCreated = await User.create(newUser);

    return res.status(201).json({
      message: 'User created successfully',
      userCreated
    });

  } catch (error: any) {
    return res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {

    // Logic to delete user (soft delete by changing status to 'deleted')
    const userToDelete = await User.findByPk(id);
    if (!userToDelete) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    
    userToDelete.status = 'deleted';
    await userToDelete.save();

    return res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (error: any) {
    return res.status(500).json({
      message: 'Error deleting user',
      error: error.message
    });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, surname, email, dni } = req.body;
  
  try {
    const userToUpdate = await User.findByPk(id);
    if (!userToUpdate) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Actualizar todos los campos disponibles
    if (name !== undefined) userToUpdate.name = name;
    if (surname !== undefined) userToUpdate.surname = surname;
    if (email !== undefined) userToUpdate.email = email;
    
    // Manejar DNI vacío o undefined
    if (dni !== undefined) {
      if (dni === '' || dni === null) {
        userToUpdate.dni = undefined; // ✅ Ahora esto es válido
      } else {
        // Convertir a número si no está vacío
        const dniNumber = parseInt(dni, 10);
        if (!isNaN(dniNumber)) {
          userToUpdate.dni = dniNumber;
        } else {
          // Manejar caso donde dni no es un número válido
          userToUpdate.dni = undefined;
        }
      }
    }

    await userToUpdate.save();
    
    return res.status(200).json({
      message: 'User updated successfully',
      userToUpdate
    });

  } catch (error: any) {
    return res.status(500).json({
      message: 'Error updating user',
      error: error.message
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).userId as number | string | undefined;
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(newPassword, salt);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};
