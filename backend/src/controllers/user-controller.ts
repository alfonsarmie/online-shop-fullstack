import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

import User from "../models/user-model";

const STAFF_ROLES = ["admin", "receptionist"];

export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { dni, email, name, surname, password, role } = req.body;
    
    let assignedRole = "client";
    let accountStatus = "pending";
    let activationToken: string | null = null;
    let activationTokenExpires: Date | null = null;



    const normalizedRole = typeof role === "string" ? role.toLowerCase().trim() : undefined;
    const normalizedDni =
      dni === undefined || dni === null || dni === ""
        ? undefined
        : Number(dni);

    if (normalizedDni !== undefined && Number.isNaN(normalizedDni)) {
      return res.status(400).json({ message: "Invalid DNI value" });
    }


    if (normalizedRole && normalizedRole !== "client") {
      if (!STAFF_ROLES.includes(normalizedRole)) {
        return res.status(400).json({ message: "Invalid role provided" });
      }

      const token = req.header("x-token");
      if (!token) {
        return res.status(403).json({ message: "Admin token required to assign staff roles" });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { userId: number };
        const requestingUser = await User.findByPk(decoded.userId);

        if (!requestingUser || requestingUser.role !== "admin") {
          return res.status(403).json({ message: "Only admin users can assign staff roles" });
        }
      } catch (error: any) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
      }

      assignedRole = normalizedRole;
      accountStatus = "active";
    }

    // Encrypt the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user


    if (accountStatus === "pending") {
      activationToken = uuidv4(); //Creates uuid token
      activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas desde ahora
    }


    const newUser = {
      dni: normalizedDni,
      email,
      name,
      surname,
      password: hashedPassword,
      role: assignedRole,
      isMember: false,
      registrationDate: new Date(),
      status: accountStatus,
      activationToken,       
      activationTokenExpires,  
    };

    const userCreated = await User.create(newUser);


    /*
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const activationUrl = `http://localhost:3000/api/users/activate/${userCreated.activationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userCreated.email,
      subject: "Activa tu cuenta",
      html: `<p>Haz click <a href="${activationUrl}">aquí</a> para activar tu cuenta.</p>`,
    });
    */

    


    return res.status(201).json({
      message: "User created successfully",
      userCreated,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating user",
      error: error.message,
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
        message: "User not found",
      });
    }

    userToDelete.status = "deleted";
    await userToDelete.save();

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting user",
      error: error.message,
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
        message: "User not found",
      });
    }

    if (name !== undefined) userToUpdate.name = name;
    if (surname !== undefined) userToUpdate.surname = surname;
    if (email !== undefined) userToUpdate.email = email;

    if (dni !== undefined) {
      if (dni === "" || dni === null) {
        userToUpdate.dni = undefined;
      } else {
        const dniNumber = Number(dni);
        if (!Number.isNaN(dniNumber)) {
          userToUpdate.dni = dniNumber;
        } else {
          userToUpdate.dni = undefined;
        }
      }
    }

    await userToUpdate.save();

    return res.status(200).json({
      message: "User updated successfully",
      userToUpdate,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).userId as number | string | undefined;
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different than current password" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(newPassword, salt);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Error updating password", error: error.message });
  }
};
