import { Router } from "express";
import { check } from "express-validator";
import { changePassword, createUser, deleteUser, updateUser } from "../controllers/user-controller";
import { existsEmail, existsDni, existsUserById } from "../helpers/db-validator-helper";
import { validateFields } from "../middlewares/validate-fields";
import { validateJWT, requireAuth } from "../middlewares/validate-jwt";
import { validateProfileUpdate } from "../middlewares/validate-profile-update";

const router = Router();

router.post(
  "/create",
  [
    check("email", "Email must be valid").isEmail(),
    check("email", "Email is required").notEmpty(),
    check("email", "Email must be at most 200 characters").isLength({ max: 200 }),
    check("email").custom(existsEmail),
    check("name", "Name is required").notEmpty(),
    check("name", "Name must be at most 200 characters").isLength({ max: 200 }),
    check("surname", "Surname is required").notEmpty(),
    check("surname", "Surname must be at most 200 characters").isLength({ max: 200 }),
    check("password", "Password is required and must be at least 6 characters").isLength({ min: 6 }),
    check("password", "Password must be at most 200 characters").isLength({ max: 200 }),
    check("password", "Password must contain at least one uppercase letter and one number").matches(/^(?=.*[A-Z])(?=.*\d).+$/),
    check("dni", "DNI must be a number").optional().isNumeric(),
    check("dni", "DNI must be at most 200 characters").optional().isLength({ max: 200 }),
    check("dni").custom(existsDni),
    check("role", "Role is invalid").optional().isIn(["client", "admin", "receptionist"]),
    validateFields,
  ],
  createUser
);

router.delete(
  "/delete/:id",
  [
    validateJWT,
    check("id", "ID must be a number").isNumeric(),
    check("id").custom(existsUserById),

    validateFields,
  ],
  deleteUser
);

router.put(
  "/update/:id",
  [
    validateProfileUpdate,
    check("id", "ID must be a number").isNumeric(),
    check("id").custom(existsUserById),
    validateFields,
  ],
  updateUser
);
 // Custom validator to check if user exists by ID

// Change password for authenticated user
router.put(
  "/change-password",
  [
    requireAuth,
    check("currentPassword", "Current password is required").notEmpty(),
    check("newPassword", "New password must be at least 6 characters").isLength({ min: 6 }),
    validateFields,
  ],
  changePassword
);

export default router;
