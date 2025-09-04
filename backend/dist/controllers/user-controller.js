"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user-model"));
const createUser = async (req, res) => {
    try {
        const { dni, email, name, surname, password, imgProfile } = req.body;
        // Encrypt the password
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        // Create a new user
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
        const userCreated = await user_model_1.default.create(newUser);
        return res.status(201).json({
            message: 'User created successfully',
            userCreated
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};
exports.createUser = createUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Logic to delete user (soft delete by changing status to 'deleted')
        const userToDelete = await user_model_1.default.findByPk(id);
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
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, surname, email, imgProfile } = req.body;
    try {
        // Logic to update user
        const userToUpdate = await user_model_1.default.findByPk(id);
        if (!userToUpdate) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        if (name !== undefined)
            userToUpdate.name = name;
        if (surname !== undefined)
            userToUpdate.surname = surname;
        if (email !== undefined)
            userToUpdate.email = email;
        if (imgProfile !== undefined)
            userToUpdate.imgProfile = imgProfile;
        // Save the updated user
        await userToUpdate.save();
        return res.status(200).json({
            message: 'User updated successfully',
            userToUpdate
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error updating user',
            error: error.message
        });
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=user-controller.js.map