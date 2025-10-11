import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user-model";

// Basic auth: verifies JWT and attaches userId to request. Accepts 'x-token' or 'Authorization: Bearer ...'
export const requireAuth = (req: Request,res: Response,next: NextFunction): void => {
  try {
    const token = req.header("x-token"); 
    
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as { userId: number };
    
    (req as any).userId = decoded.userId;
    next();
  
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }

};

// Admin/self delete validator previously used for delete operations
export const validateJWT = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  const token = req.header("x-token"); //This is the name of the header frontend will send the token

  if (!token) {
    res.status(401).json({
      message: "No token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as { userId: number };
    const { userId } = decoded;
    const idToDelete = req.params.id;

    const userToValidate = await User.findByPk(userId);
    if (!userToValidate) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // Verify if user is admin
    if (userToValidate.role !== "admin") {
      res.status(403).json({
        message: "You do not have permission to perform this action",
      });
      
      return;
    }

    // Verify if user is not already deleted or exists
    if (userToValidate.status === "deleted") {
      res.status(404).json({
        message: "User not found or already deleted",
      });
      
      return;

    }

    // Only admin can delete any user, non-admin can only delete themselves
    if (userId !== parseInt(idToDelete, 10) && userToValidate.role !== "admin") {
      res.status(403).json({
        message: "You do not have permission to perform this action",
      });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Invalid token",
    });

    return;

  }
};
