"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user-model"));
const validateJWT = async (req, res, next) => {
    const token = req.header('x-token'); //This is the name of the header frontend will send the token
    if (!token) {
        res.status(401).json({
            message: 'No token provided'
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
        const { userId } = decoded;
        const idToDelete = req.params.id;
        const userToValidate = await user_model_1.default.findByPk(userId);
        if (!userToValidate) {
            res.status(404).json({
                message: 'User not found'
            });
            return;
        }
        // Verify if user is admin
        if (userToValidate.role !== 'admin') {
            res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
            return;
        }
        // Verify if user is not already deleted or exists
        if (userToValidate.status === 'deleted') {
            res.status(404).json({
                message: 'User not found or already deleted'
            });
            return;
        }
        // Only admin can delete any user, non-admin can only delete themselves
        if (userId !== parseInt(idToDelete, 10) && userToValidate.role !== 'admin') {
            res.status(403).json({
                message: 'You do not have permission to perform this action'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Invalid token'
        });
    }
};
exports.validateJWT = validateJWT;
//# sourceMappingURL=validate-jwt.js.map