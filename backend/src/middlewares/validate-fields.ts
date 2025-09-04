import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateFields = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  
  // If there are no validation errors, proceed to the next middleware or controller
  next();
};