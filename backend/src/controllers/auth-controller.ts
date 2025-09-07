import { Request, Response } from "express";
import bcrypt from "bcryptjs";


import User from "../models/user-model";
import { generateJWT } from "../helpers/generate-jwt-helper";



export const loginUser = async (req: Request, res: Response): Promise<Response> => {

  const { email, password } = req.body;

  try {
    // Check if the user exists
    const userFound = await User.findOne({ where: { email } });
    if (!userFound) {
      return res.status(400).json({
        msg: 'Invalid email or password - email'
      });
    }

    // Check if user is active
    if (userFound.status !== 'active') {
      return res.status(400).json({
        msg: 'User is not active. Please contact the administrator.'
      });
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, userFound.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Invalid email or password - password'
      });
    }

    // Generate JWT (solucionar el tipo de dato del idUser)
    const token = await generateJWT(userFound.idUser.toString());

    return res.json({
      msg: 'Login successful - User authenticated',
      userFound,
      token
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Auth server error. Please contact the administrator.'
    });
  }
};