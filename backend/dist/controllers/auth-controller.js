"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user-model"));
const generate_jwt_helper_1 = require("../helpers/generate-jwt-helper");
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const userFound = await user_model_1.default.findOne({ where: { email } });
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
        const validPassword = bcryptjs_1.default.compareSync(password, userFound.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Invalid email or password - password'
            });
        }
        // Generate JWT (solucionar el tipo de dato del idUser)
        const token = await (0, generate_jwt_helper_1.generateJWT)(userFound.idUser.toString());
        return res.json({
            msg: 'Login successful - User authenticated',
            userFound,
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Auth server error. Please contact the administrator.'
        });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth-controller.js.map